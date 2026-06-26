'use server'

import { revalidatePath } from 'next/cache'

import { canManagePlacar } from '@/lib/permissions/placar'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import { createClient } from '@/lib/supabase/server'
import {
  DeletePlacarSchema,
  PlacarCreateSchema,
  PlacarIndicatorsSchema,
  PlacarUpdateSchema,
} from '@/lib/validations/placar'
import { getUserScopes } from '@/server/queries/scopes'
import { getPlacarRanking } from '@/server/queries/placar'
import { recalculatePlacar } from '@/server/jobs/placar/recalculate-placar'
import { recalculateIndicators } from '@/server/jobs/placar/recalculate-indicators'
import { recalculateRanking } from '@/server/jobs/placar/recalculate-ranking'
import { recalculatePoints } from '@/server/jobs/placar/recalculate-points'
import type { RankingRow } from '@/server/jobs/placar/types'
import {
  FinalizePlacarSchema,
  RecalculatePlacarSchema,
  ReopenPlacarSchema,
} from '@/lib/validations/placar'

export type PlacarActionState = {
  ok: boolean
  message?: string
  summary?: string
  ranking?: RankingRow[]
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function guardPlacarMutation() {
  const user = await requireCurrentUser()
  if (!canManagePlacar(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  return { user, scopes }
}

function normalizeOptionalText(value?: string | null) {
  if (!value || value.trim() === '') return null
  return value.trim()
}

async function assertPlacarScope(placarId: string) {
  const { user, scopes } = await guardPlacarMutation()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('placar')
    .select('id, empresa, concessionaria, finalizado')
    .eq('id', placarId)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('NOT_FOUND')

  if (user.empresaId && data.empresa && data.empresa !== user.empresaId) {
    throw new Error('FORBIDDEN')
  }
  if (
    data.concessionaria &&
    !isHighPrivilegeScope(scopes.perfilNivel) &&
    !canAccessConcessionaria(scopes, data.concessionaria)
  ) {
    throw new Error('FORBIDDEN')
  }

  return { user, scopes, placar: data }
}

async function assertConcessionariaScope(concessionariaId: string, scopes: Awaited<ReturnType<typeof getUserScopes>>) {
  if (!isHighPrivilegeScope(scopes.perfilNivel) && !canAccessConcessionaria(scopes, concessionariaId)) {
    throw new Error('FORBIDDEN')
  }
}

async function syncConcessionariaPlacar(concessionariaId: string, placarId: string) {
  const supabase = await createClient()
  await syncJoinTable(supabase, 'concessionaria_placars', 'placar_id', placarId, 'concessionaria_id', [concessionariaId])
}

async function validateIndicatorScope(concessionariaId: string, indicadorIds: string[]) {
  if (indicadorIds.length === 0) return
  const supabase = await createClient()
  const { data: links, error: linkError } = await supabase
    .from('concessionaria_indicadores')
    .select('indicadores_id')
    .eq('concessionaria_id', concessionariaId)
    .in('indicadores_id', indicadorIds)
  if (linkError) throw linkError

  const allowed = new Set(links?.map((row) => row.indicadores_id) ?? [])
  const missing = indicadorIds.filter((id) => !allowed.has(id))

  if (missing.length > 0) {
    const { data: fallback, error } = await supabase
      .from('indicadores')
      .select('id')
      .eq('concessionaria', concessionariaId)
      .in('id', missing)
    if (error) throw error
    const fallbackIds = new Set(fallback?.map((row) => row.id) ?? [])
    const stillMissing = missing.filter((id) => !fallbackIds.has(id))
    if (stillMissing.length > 0) throw new Error('INDICADOR_FORA_ESCOPO')
  }
}

export async function createPlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const { user, scopes } = await guardPlacarMutation()
    const parsed = PlacarCreateSchema.safeParse({
      data: formData.get('data'),
      concessionaria: formData.get('concessionaria'),
      empresa: formData.get('empresa') || user.empresaId || null,
      opcao_origem: formData.get('opcao_origem'),
      opcao_acumulado: formData.get('opcao_acumulado'),
      finalizado: formData.get('finalizado'),
    })
    if (!parsed.success) {
      return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    }

    await assertConcessionariaScope(parsed.data.concessionaria, scopes)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('placar')
      .insert({
        data: parsed.data.data,
        concessionaria: parsed.data.concessionaria,
        empresa: parsed.data.empresa ?? user.empresaId,
        opcao_origem: normalizeOptionalText(parsed.data.opcao_origem),
        opcao_acumulado: normalizeOptionalText(parsed.data.opcao_acumulado),
        finalizado: parsed.data.finalizado ?? false,
        created_by: user.id,
        ranking_atualizado: false,
      })
      .select('id')
      .single()
    if (error) return { ok: false, message: 'Nao foi possivel criar o placar.' }

    await syncConcessionariaPlacar(parsed.data.concessionaria, data.id)

    const indicadorIds = parseIdList(formData.get('indicadorIds'))
    if (indicadorIds.length > 0) {
      await validateIndicatorScope(parsed.data.concessionaria, indicadorIds)
      await syncJoinTable(supabase, 'placar_indicadores', 'placar_id', data.id, 'indicadores_id', indicadorIds)
    }

    revalidatePath('/placar')
    return { ok: true, message: 'Placar criado com sucesso.' }
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return { ok: false, message: 'Sem permissao para esta operacao.' }
    }
    if (err instanceof Error && err.message === 'INDICADOR_FORA_ESCOPO') {
      return { ok: false, message: 'Um ou mais indicadores nao pertencem a concessionaria.' }
    }
    return { ok: false, message: 'Erro ao criar placar.' }
  }
}

export async function updatePlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = PlacarUpdateSchema.safeParse({
      id: formData.get('id'),
      data: formData.get('data'),
      concessionaria: formData.get('concessionaria'),
      empresa: formData.get('empresa'),
      opcao_origem: formData.get('opcao_origem'),
      opcao_acumulado: formData.get('opcao_acumulado'),
      finalizado: formData.get('finalizado'),
    })
    if (!parsed.success) {
      return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    }

    const { scopes } = await assertPlacarScope(parsed.data.id)
    await assertConcessionariaScope(parsed.data.concessionaria, scopes)

    const supabase = await createClient()
    const { error } = await supabase
      .from('placar')
      .update({
        data: parsed.data.data,
        concessionaria: parsed.data.concessionaria,
        empresa: parsed.data.empresa,
        opcao_origem: normalizeOptionalText(parsed.data.opcao_origem),
        opcao_acumulado: normalizeOptionalText(parsed.data.opcao_acumulado),
        finalizado: parsed.data.finalizado ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar o placar.' }

    await syncConcessionariaPlacar(parsed.data.concessionaria, parsed.data.id)

    revalidatePath('/placar')
    return { ok: true, message: 'Placar atualizado com sucesso.' }
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return { ok: false, message: 'Sem permissao para esta operacao.' }
    }
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      return { ok: false, message: 'Placar nao encontrado.' }
    }
    return { ok: false, message: 'Erro ao atualizar placar.' }
  }
}

export async function deletePlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = DeletePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (placar.finalizado) {
      return { ok: false, message: 'Placares finalizados nao podem ser excluidos.' }
    }

    const supabase = await createClient()
    const { error } = await supabase.from('placar').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir o placar.' }

    revalidatePath('/placar')
    return { ok: true, message: 'Placar excluido com sucesso.' }
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return { ok: false, message: 'Sem permissao para esta operacao.' }
    }
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      return { ok: false, message: 'Placar nao encontrado.' }
    }
    return { ok: false, message: 'Erro ao excluir placar.' }
  }
}

export async function updatePlacarIndicatorsAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = PlacarIndicatorsSchema.safeParse({
      id: formData.get('id'),
      indicadorIds: parseIdList(formData.get('indicadorIds')),
    })
    if (!parsed.success) {
      return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (!placar.concessionaria) {
      return { ok: false, message: 'Placar sem concessionaria definida.' }
    }

    await validateIndicatorScope(placar.concessionaria, parsed.data.indicadorIds)

    const supabase = await createClient()
    await syncJoinTable(
      supabase,
      'placar_indicadores',
      'placar_id',
      parsed.data.id,
      'indicadores_id',
      parsed.data.indicadorIds,
    )

    revalidatePath('/placar')
    return { ok: true, message: 'Indicadores do placar atualizados.' }
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return { ok: false, message: 'Sem permissao para esta operacao.' }
    }
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      return { ok: false, message: 'Placar nao encontrado.' }
    }
    if (err instanceof Error && err.message === 'INDICADOR_FORA_ESCOPO') {
      return { ok: false, message: 'Um ou mais indicadores nao pertencem a concessionaria.' }
    }
    return { ok: false, message: 'Erro ao atualizar indicadores.' }
  }
}

export async function refreshPlacarAction(): Promise<PlacarActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManagePlacar(user.perfilNivel)) {
      return { ok: false, message: 'Sem permissao.' }
    }
    revalidatePath('/placar')
    return { ok: true }
  } catch {
    return { ok: false, message: 'Erro ao atualizar.' }
  }
}




function recalcErrorState(err: unknown): PlacarActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') {
    return { ok: false, message: 'Sem permissao para esta operacao.' }
  }
  if (err instanceof Error && err.message === 'NOT_FOUND') {
    return { ok: false, message: 'Placar nao encontrado.' }
  }
  if (err instanceof Error && err.message === 'PLACAR_FINALIZADO') {
    return { ok: false, message: 'Placar finalizado: reabra antes de recalcular.' }
  }
  return { ok: false, message: 'Erro ao processar recalculo.' }
}

export async function recalculatePlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = RecalculatePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (placar.finalizado) throw new Error('PLACAR_FINALIZADO')

    const supabase = await createClient()
    const summary = await recalculatePlacar(supabase, parsed.data.id)

    revalidatePath('/placar')
    return {
      ok: true,
      message: 'Recalculo concluido.',
      summary: `${summary.indicators.activated} indicadores, ${summary.points.processed} pontuados (${summary.points.totalPontos} pts), ${summary.ranking.colaboradores} colaboradores no ranking.`,
      ranking: summary.ranking.ranking,
    }
  } catch (err) {
    return recalcErrorState(err)
  }
}

export async function recalculatePlacarIndicatorsAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = RecalculatePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (placar.finalizado) throw new Error('PLACAR_FINALIZADO')

    const supabase = await createClient()
    const result = await recalculateIndicators(supabase, parsed.data.id)

    revalidatePath('/placar')
    return { ok: true, message: 'Indicadores recalculados.', summary: `${result.activated} de ${result.linked} indicadores ativados.` }
  } catch (err) {
    return recalcErrorState(err)
  }
}

export async function recalculatePlacarRankingAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = RecalculatePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (placar.finalizado) throw new Error('PLACAR_FINALIZADO')

    const supabase = await createClient()
    await recalculatePoints(supabase, parsed.data.id)
    const ranking = await recalculateRanking(supabase, parsed.data.id)

    revalidatePath('/placar')
    return {
      ok: true,
      message: 'Ranking recalculado.',
      summary: `${ranking.colaboradores} colaboradores no ranking.`,
      ranking: ranking.ranking,
    }
  } catch (err) {
    return recalcErrorState(err)
  }
}

export async function finalizePlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = FinalizePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { placar } = await assertPlacarScope(parsed.data.id)
    if (placar.finalizado) return { ok: true, message: 'Placar ja estava finalizado.' }

    const supabase = await createClient()
    const { error } = await supabase
      .from('placar')
      .update({ finalizado: true, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel finalizar.' }

    revalidatePath('/placar')
    return { ok: true, message: 'Placar finalizado.' }
  } catch (err) {
    return recalcErrorState(err)
  }
}

export async function reopenPlacarAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = ReopenPlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    await assertPlacarScope(parsed.data.id)

    const supabase = await createClient()
    const { error } = await supabase
      .from('placar')
      .update({ finalizado: false, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel reabrir.' }

    revalidatePath('/placar')
    return { ok: true, message: 'Placar reaberto.' }
  } catch (err) {
    return recalcErrorState(err)
  }
}

export async function loadPlacarRankingAction(
  _: PlacarActionState,
  formData: FormData,
): Promise<PlacarActionState> {
  try {
    const parsed = RecalculatePlacarSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    await assertPlacarScope(parsed.data.id)
    const ranking = await getPlacarRanking(parsed.data.id)
    return { ok: true, ranking }
  } catch (err) {
    return recalcErrorState(err)
  }
}
