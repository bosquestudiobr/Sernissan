'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireAdminAccess } from '@/lib/permissions'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import {
  DeleteIndicatorSchema,
  IndicatorLibrarySchema,
  IndicatorLibraryUpdateSchema,
  IndicatorRelationshipsSchema,
  ToggleIndicatorActiveSchema,
} from '@/lib/validations/indicadores/library'
import { createClient } from '@/lib/supabase/server'
import { getUserScopes } from '@/server/queries/scopes'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'

export type IndicatorActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function guardAdmin() {
  const user = await requireAdminAccess()
  assertCan(user, 'admin:manage')
  return user
}

function normalizeOptionalText(value?: string | null) {
  if (!value || value.trim() === '') return null
  return value.trim()
}

async function assertIndicatorScope(indicatorId: string) {
  const user = await guardAdmin()
  const scopes = await getUserScopes(user.id)
  if (isHighPrivilegeScope(scopes.perfilNivel)) return user

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('empresa, concessionaria')
    .eq('id', indicatorId)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('NOT_FOUND')

  if (user.empresaId && data.empresa && data.empresa !== user.empresaId) {
    throw new Error('FORBIDDEN')
  }
  if (
    data.concessionaria &&
    scopes.concessionariaIds.length > 0 &&
    !scopes.concessionariaIds.includes(data.concessionaria)
  ) {
    throw new Error('FORBIDDEN')
  }
  return user
}

export async function createIndicatorAction(
  _: IndicatorActionState,
  formData: FormData,
): Promise<IndicatorActionState> {
  const user = await guardAdmin()
  const parsed = IndicatorLibrarySchema.safeParse({
    nome: formData.get('nome'),
    sigla: formData.get('sigla'),
    api_id: formData.get('api_id'),
    ordem: formData.get('ordem'),
    pontos: formData.get('pontos'),
    meta: formData.get('meta'),
    unidade: formData.get('unidade'),
    importancia: formData.get('importancia'),
    empresa: formData.get('empresa') || user.empresaId || null,
    ativo: formData.get('ativo')?.toString() ?? 'true',
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .insert({
      ...parsed.data,
      api_id: normalizeOptionalText(parsed.data.api_id as string | null | undefined),
      unidade: normalizeOptionalText(parsed.data.unidade as string | null | undefined),
      importancia: normalizeOptionalText(parsed.data.importancia as string | null | undefined),
      created_by: user.id,
      user_edicao: user.id,
    })
    .select('id')
    .single()

  if (error) return { ok: false, message: error.message }

  const areaIds = parseIdList(formData.get('areaIds'))
  const funcaoIds = parseIdList(formData.get('funcaoIds'))
  try {
    await Promise.all([
      syncJoinTable(supabase, 'indicadores_areas', 'indicadores_id', data.id, 'setor_concessionaria_id', areaIds),
      syncJoinTable(supabase, 'indicadores_funcoes', 'indicadores_id', data.id, 'funcao_colaborador_id', funcaoIds),
    ])
  } catch (syncError) {
    return {
      ok: false,
      message: syncError instanceof Error ? syncError.message : 'Erro ao salvar vinculos.',
    }
  }

  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}

export async function updateIndicatorAction(
  _: IndicatorActionState,
  formData: FormData,
): Promise<IndicatorActionState> {
  await guardAdmin()
  const parsed = IndicatorLibraryUpdateSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    sigla: formData.get('sigla'),
    api_id: formData.get('api_id'),
    ordem: formData.get('ordem'),
    pontos: formData.get('pontos'),
    meta: formData.get('meta'),
    unidade: formData.get('unidade'),
    importancia: formData.get('importancia'),
    empresa: formData.get('empresa') || null,
    ativo: formData.get('ativo')?.toString(),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  }

  try {
    await assertIndicatorScope(parsed.data.id)
  } catch {
    return { ok: false, message: 'Sem permissao para editar este indicador.' }
  }

  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('indicadores')
    .update({
      ...payload,
      api_id: normalizeOptionalText(payload.api_id as string | null | undefined),
      unidade: normalizeOptionalText(payload.unidade as string | null | undefined),
      importancia: normalizeOptionalText(payload.importancia as string | null | undefined),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  if (formData.has('areaIds') || formData.has('funcaoIds')) {
    try {
      await Promise.all([
        syncJoinTable(
          supabase,
          'indicadores_areas',
          'indicadores_id',
          id,
          'setor_concessionaria_id',
          parseIdList(formData.get('areaIds')),
        ),
        syncJoinTable(
          supabase,
          'indicadores_funcoes',
          'indicadores_id',
          id,
          'funcao_colaborador_id',
          parseIdList(formData.get('funcaoIds')),
        ),
      ])
    } catch (syncError) {
      return {
        ok: false,
        message: syncError instanceof Error ? syncError.message : 'Erro ao salvar vinculos.',
      }
    }
  }

  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}

export async function deleteIndicatorAction(
  _: IndicatorActionState,
  formData: FormData,
): Promise<IndicatorActionState> {
  await guardAdmin()
  const parsed = DeleteIndicatorSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }

  try {
    await assertIndicatorScope(parsed.data.id)
  } catch {
    return { ok: false, message: 'Sem permissao para excluir este indicador.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('indicadores').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}

export async function toggleIndicatorActiveAction(
  _: IndicatorActionState,
  formData: FormData,
): Promise<IndicatorActionState> {
  await guardAdmin()
  const parsed = ToggleIndicatorActiveSchema.safeParse({
    id: formData.get('id'),
    ativo: formData.get('ativo')?.toString() === 'true',
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

  try {
    await assertIndicatorScope(parsed.data.id)
  } catch {
    return { ok: false, message: 'Sem permissao para alterar este indicador.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('indicadores')
    .update({ ativo: parsed.data.ativo, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}

export async function updateIndicatorRelationshipsAction(
  _: IndicatorActionState,
  formData: FormData,
): Promise<IndicatorActionState> {
  await guardAdmin()
  const parsed = IndicatorRelationshipsSchema.safeParse({
    id: formData.get('id'),
    areaIds: parseIdList(formData.get('areaIds')),
    funcaoIds: parseIdList(formData.get('funcaoIds')),
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

  try {
    await assertIndicatorScope(parsed.data.id)
  } catch {
    return { ok: false, message: 'Sem permissao para editar vinculos.' }
  }

  const supabase = await createClient()
  try {
    await Promise.all([
      syncJoinTable(
        supabase,
        'indicadores_areas',
        'indicadores_id',
        parsed.data.id,
        'setor_concessionaria_id',
        parsed.data.areaIds,
      ),
      syncJoinTable(
        supabase,
        'indicadores_funcoes',
        'indicadores_id',
        parsed.data.id,
        'funcao_colaborador_id',
        parsed.data.funcaoIds,
      ),
    ])
  } catch (syncError) {
    return {
      ok: false,
      message: syncError instanceof Error ? syncError.message : 'Erro ao sincronizar vinculos.',
    }
  }

  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}

export async function checkIndicatorsAction(): Promise<IndicatorActionState> {
  await guardAdmin()
  const supabase = await createClient()

  const [
    { count: total },
    { count: semNome },
    { count: semSigla },
    { count: inativos },
    { data: ativos },
  ] = await Promise.all([
    supabase.from('indicadores').select('id', { count: 'exact', head: true }),
    supabase.from('indicadores').select('id', { count: 'exact', head: true }).or('nome.is.null,nome.eq.'),
    supabase.from('indicadores').select('id', { count: 'exact', head: true }).or('sigla.is.null,sigla.eq.'),
    supabase.from('indicadores').select('id', { count: 'exact', head: true }).eq('ativo', false),
    supabase.from('indicadores').select('id').eq('ativo', true).limit(200),
  ])

  const activeIds = (ativos ?? []).map((row) => row.id)
  let semVinculo = 0
  if (activeIds.length > 0) {
    const [{ data: areaLinks }, { data: funcaoLinks }] = await Promise.all([
      supabase.from('indicadores_areas').select('indicadores_id').in('indicadores_id', activeIds),
      supabase.from('indicadores_funcoes').select('indicadores_id').in('indicadores_id', activeIds),
    ])
    const linked = new Set([
      ...(areaLinks ?? []).map((row) => row.indicadores_id),
      ...(funcaoLinks ?? []).map((row) => row.indicadores_id),
    ])
    semVinculo = activeIds.filter((id) => !linked.has(id)).length
  }

  const issues = [
    (semNome ?? 0) > 0 ? `${semNome} sem nome` : null,
    (semSigla ?? 0) > 0 ? `${semSigla} sem sigla` : null,
    semVinculo > 0 ? `${semVinculo} ativos sem area/funcao` : null,
    (inativos ?? 0) > 0 ? `${inativos} inativos` : null,
  ].filter(Boolean)

  const message =
    issues.length === 0
      ? `Checagem concluida: ${total ?? 0} indicador(es), nenhuma inconsistencia encontrada.`
      : `Checagem concluida: ${total ?? 0} indicador(es). Pendencias: ${issues.join('; ')}.`

  return { ok: true, message }
}
