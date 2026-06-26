import { cookies } from 'next/headers'

import { ORG_CONTEXT_COOKIE, ORG_CONTEXT_MAX_AGE } from '@/lib/constants/context'
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
    const parsed = OrganizationalContextSchema.safeParse(JSON.parse(raw))
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

async function getEntityLabel(table: 'setores' | 'grupo' | 'concessionaria', id: string | null) {
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
    const { data } = await supabase.from('setores').select('id, nome').in('id', scopes.setorIds)
    data?.forEach((item) => setores.push({ id: item.id, label: item.nome ?? item.id }))
  }

  const grupos: ContextOption[] = []
  if (scopes.grupoIds.length > 0) {
    const { data } = await supabase
      .from('grupo')
      .select('id, nome, setor')
      .in('id', scopes.grupoIds)

    data?.forEach((item) =>
      grupos.push({ id: item.id, label: item.nome ?? item.id, setorId: item.setor }),
    )
  }

  const concessionarias: ContextOption[] = []
  if (scopes.concessionariaIds.length > 0) {
    const { data } = await supabase
      .from('concessionaria')
      .select('id, nome, grupo')
      .in('id', scopes.concessionariaIds)

    data?.forEach((item) =>
      concessionarias.push({
        id: item.id,
        label: item.nome ?? item.id,
        grupoId: item.grupo,
      }),
    )
  }

  return { setores, grupos, concessionarias }
}

function resolveDefaultContext(
  options: OrganizationalContextOptions,
  profile: { setor: string | null; grupo: string | null; concessionaria: string | null } | null,
): OrganizationalContextInput {
  const setorId = profile?.setor && options.setores.some((s) => s.id === profile.setor)
    ? profile.setor
    : options.setores[0]?.id ?? null

  const gruposForSetor = setorId
    ? options.grupos.filter((g) => !g.setorId || g.setorId === setorId)
    : options.grupos

  const grupoId = profile?.grupo && gruposForSetor.some((g) => g.id === profile.grupo)
    ? profile.grupo
    : gruposForSetor[0]?.id ?? null

  const concsForGrupo = grupoId
    ? options.concessionarias.filter((c) => !c.grupoId || c.grupoId === grupoId)
    : options.concessionarias

  const concessionariaId =
    profile?.concessionaria && concsForGrupo.some((c) => c.id === profile.concessionaria)
      ? profile.concessionaria
      : concsForGrupo[0]?.id ?? null

  return { setorId, grupoId, concessionariaId }
}

export async function getCurrentOrganizationalContext(
  userId: string,
): Promise<OrganizationalContextView> {
  const supabase = await createClient()
  const options = await getOrganizationalContextOptions(userId)
  const scopes = await getUserScopes(userId)

  const { data: profile } = await supabase
    .from('profiles')
    .select('setor, grupo, concessionaria')
    .eq('id', userId)
    .maybeSingle()

  const cookieContext = await readOrganizationalContextCookie()
  const candidate =
    cookieContext && canAccessOrganizationalContext(scopes, cookieContext)
      ? cookieContext
      : resolveDefaultContext(options, profile)

  const [setor, grupo, concessionaria] = await Promise.all([
    getEntityLabel('setores', candidate.setorId),
    getEntityLabel('grupo', candidate.grupoId),
    getEntityLabel('concessionaria', candidate.concessionariaId),
  ])

  return {
    setorId: candidate.setorId,
    grupoId: candidate.grupoId,
    concessionariaId: candidate.concessionariaId,
    setor,
    grupo,
    concessionaria,
  }
}
