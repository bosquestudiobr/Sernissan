import { cookies } from 'next/headers'

import { ORG_CONTEXT_COOKIE, ORG_CONTEXT_MAX_AGE } from '@/lib/constants/context'
import { enrichOrganizationalContext } from '@/lib/organizational-context/hierarchy'
import { canAccessOrganizationalContext } from '@/lib/permissions/scopes'
import type {
  ContextOption,
  OrganizationalContextOptions,
  OrganizationalContextView,
} from '@/lib/types/user'
import { OrganizationalContextSchema, type OrganizationalContextInput } from '@/lib/validations/context'
import { createClient } from '@/lib/supabase/server'

import { getUserScopes } from './scopes'

const EMPTY_LABEL = 'Nao definido'

export async function readOrganizationalContextCookie(): Promise<OrganizationalContextInput | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(ORG_CONTEXT_COOKIE)?.value
  if (!raw) return null

  try {
    const json = JSON.parse(raw) as Record<string, unknown>
    const parsed = OrganizationalContextSchema.safeParse({
      empresaId: json.empresaId ?? null,
      paisId: json.paisId ?? null,
      divisaoId: json.divisaoId ?? null,
      setorId: json.setorId ?? null,
      grupoId: json.grupoId ?? null,
      concessionariaId: json.concessionariaId ?? null,
    })
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function writeOrganizationalContextCookie(context: OrganizationalContextInput) {
  const cookieStore = await cookies()
  cookieStore.set(ORG_CONTEXT_COOKIE, JSON.stringify(context), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ORG_CONTEXT_MAX_AGE,
  })
}

async function getEntityLabel(
  table: 'empresa' | 'pais' | 'divisao' | 'setores' | 'grupo' | 'concessionaria',
  id: string | null,
) {
  if (!id) return EMPTY_LABEL

  const supabase = await createClient()
  const { data } = await supabase.from(table).select('nome').eq('id', id).maybeSingle()
  return data?.nome ?? EMPTY_LABEL
}

export async function getOrganizationalContextOptions(
  userId: string,
): Promise<OrganizationalContextOptions> {
  const scopes = await getUserScopes(userId)
  const supabase = await createClient()

  const setores: ContextOption[] = []
  if (scopes.setorIds.length > 0) {
    const { data } = await supabase
      .from('setores')
      .select('id, nome, divisao, empresa')
      .in('id', scopes.setorIds)
    data?.forEach((item) =>
      setores.push({
        id: item.id,
        label: item.nome ?? item.id,
        divisaoId: item.divisao,
        empresaId: item.empresa,
      }),
    )
  }

  const grupos: ContextOption[] = []
  if (scopes.grupoIds.length > 0) {
    const { data } = await supabase
      .from('grupo')
      .select('id, nome, setor, empresa')
      .in('id', scopes.grupoIds)

    data?.forEach((item) =>
      grupos.push({
        id: item.id,
        label: item.nome ?? item.id,
        setorId: item.setor,
        empresaId: item.empresa,
      }),
    )
  }

  const concessionarias: ContextOption[] = []
  if (scopes.concessionariaIds.length > 0) {
    const { data } = await supabase
      .from('concessionaria')
      .select('id, nome, grupo, empresa')
      .in('id', scopes.concessionariaIds)

    data?.forEach((item) =>
      concessionarias.push({
        id: item.id,
        label: item.nome ?? item.id,
        grupoId: item.grupo,
        empresaId: item.empresa,
      }),
    )
  }

  const divisaoIds = [...new Set(setores.map((s) => s.divisaoId).filter(Boolean))] as string[]
  const divisoes: ContextOption[] = []
  if (divisaoIds.length > 0) {
    const { data } = await supabase
      .from('divisao')
      .select('id, nome, pais, empresa')
      .in('id', divisaoIds)
    data?.forEach((item) =>
      divisoes.push({
        id: item.id,
        label: item.nome ?? item.id,
        paisId: item.pais,
        empresaId: item.empresa,
      }),
    )
  }

  const paisIds = [...new Set(divisoes.map((d) => d.paisId).filter(Boolean))] as string[]
  const paises: ContextOption[] = []
  if (paisIds.length > 0) {
    const { data } = await supabase.from('pais').select('id, nome, empresa').in('id', paisIds)
    data?.forEach((item) =>
      paises.push({ id: item.id, label: item.nome ?? item.id, empresaId: item.empresa }),
    )
  }

  const empresas: ContextOption[] = []
  if (scopes.empresaId) {
    const { data } = await supabase.from('empresa').select('id, nome').eq('id', scopes.empresaId)
    data?.forEach((item) => empresas.push({ id: item.id, label: item.nome ?? item.id }))
  }

  return { empresas, paises, divisoes, setores, grupos, concessionarias }
}

function resolveDefaultContext(
  options: OrganizationalContextOptions,
  profile: {
    empresa: string | null
    pais: string | null
    divisao: string | null
    setor: string | null
    grupo: string | null
    concessionaria: string | null
  } | null,
): OrganizationalContextInput {
  const concessionariaId =
    profile?.concessionaria && options.concessionarias.some((c) => c.id === profile.concessionaria)
      ? profile.concessionaria
      : options.concessionarias[0]?.id ?? null

  if (concessionariaId) {
    return enrichOrganizationalContext({ empresaId: null, paisId: null, divisaoId: null, setorId: null, grupoId: null, concessionariaId }, options)
  }

  const grupoId =
    profile?.grupo && options.grupos.some((g) => g.id === profile.grupo)
      ? profile.grupo
      : options.grupos[0]?.id ?? null

  if (grupoId) {
    return enrichOrganizationalContext({ empresaId: null, paisId: null, divisaoId: null, setorId: null, grupoId, concessionariaId: null }, options)
  }

  const setorId =
    profile?.setor && options.setores.some((s) => s.id === profile.setor)
      ? profile.setor
      : options.setores[0]?.id ?? null

  const base = enrichOrganizationalContext(
    {
      empresaId: profile?.empresa && options.empresas.some((e) => e.id === profile.empresa) ? profile.empresa : options.empresas[0]?.id ?? null,
      paisId: profile?.pais && options.paises.some((p) => p.id === profile.pais) ? profile.pais : null,
      divisaoId: profile?.divisao && options.divisoes.some((d) => d.id === profile.divisao) ? profile.divisao : null,
      setorId,
      grupoId: null,
      concessionariaId: null,
    },
    options,
  )

  return base
}

export async function getCurrentOrganizationalContext(
  userId: string,
): Promise<OrganizationalContextView> {
  const supabase = await createClient()
  const options = await getOrganizationalContextOptions(userId)
  const scopes = await getUserScopes(userId)

  const { data: profile } = await supabase
    .from('profiles')
    .select('empresa, pais, divisao, setor, grupo, concessionaria')
    .eq('id', userId)
    .maybeSingle()

  const cookieContext = await readOrganizationalContextCookie()
  const rawCandidate =
    cookieContext && canAccessOrganizationalContext(scopes, cookieContext)
      ? cookieContext
      : resolveDefaultContext(options, profile)

  const candidate = enrichOrganizationalContext(rawCandidate, options)

  const [empresa, pais, divisao, setor, grupo, concessionaria] = await Promise.all([
    getEntityLabel('empresa', candidate.empresaId),
    getEntityLabel('pais', candidate.paisId),
    getEntityLabel('divisao', candidate.divisaoId),
    getEntityLabel('setores', candidate.setorId),
    getEntityLabel('grupo', candidate.grupoId),
    getEntityLabel('concessionaria', candidate.concessionariaId),
  ])

  return {
    empresaId: candidate.empresaId,
    paisId: candidate.paisId,
    divisaoId: candidate.divisaoId,
    setorId: candidate.setorId,
    grupoId: candidate.grupoId,
    concessionariaId: candidate.concessionariaId,
    empresa,
    pais,
    divisao,
    setor,
    grupo,
    concessionaria,
  }
}
