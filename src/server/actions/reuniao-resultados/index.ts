'use server'

import { revalidatePath } from 'next/cache'

import {
  canDeleteReuniaoResultado,
  canFinalizeReuniaoResultado,
  canManageReuniaoResultados,
} from '@/lib/permissions/reuniao-resultados'
import { requireCurrentUser } from '@/lib/permissions'
import { createClient } from '@/lib/supabase/server'
import {
  DeleteReuniaoResultadoSchema,
  ReuniaoAgendaItemSchema,
  ReuniaoFinalizeSchema,
  ReuniaoNextStepSchema,
  ReuniaoReopenSchema,
  ReuniaoResultadoCreateSchema,
  ReuniaoResultadoUpdateSchema,
  RemoveReuniaoAgendaItemSchema,
  RemoveReuniaoNextStepSchema,
} from '@/lib/validations/reuniao-resultados'
import { getUserScopes } from '@/server/queries/scopes'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getReuniaoResultadoById } from '@/server/queries/reuniao-resultados'

export type ReuniaoActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): ReuniaoActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Reuniao nao encontrada.' }
  if (err instanceof Error && err.message === 'LOCKED') return { ok: false, message: 'Reuniao finalizada: edicao nao permitida.' }
  return { ok: false, message: fallback }
}

function normalizeOptionalText(value?: string | null) {
  if (!value || value.trim() === '') return null
  return value.trim()
}

async function guardManage() {
  const user = await requireCurrentUser()
  if (!canManageReuniaoResultados(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  return { user, scopes }
}

async function assertReuniaoInScope(id: string) {
  const { user, scopes } = await guardManage()
  const orgContext = await getCurrentOrganizationalContext(user.id)
  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const reuniao = await getReuniaoResultadoById(id, ctx)
  if (!reuniao) throw new Error('NOT_FOUND')
  return { user, scopes, reuniao }
}

function assertNotFinalized(reuniao: { finalizada: boolean }) {
  if (reuniao.finalizada) throw new Error('LOCKED')
}

async function nextId2(empresaId: string | null) {
  const supabase = await createClient()
  let query = supabase.from('xr_placar').select('id_2').order('id_2', { ascending: false }).limit(1)
  if (empresaId) query = query.eq('empresa', empresaId)
  const { data } = await query.maybeSingle()
  return (data?.id_2 ?? 0) + 1
}

function revalidateReuniao(id?: string) {
  revalidatePath('/reuniao-resultados')
  if (id) revalidatePath(`/reuniao-resultados/${id}`)
}

export async function createReuniaoResultadoAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const { user } = await guardManage()
    const parsed = ReuniaoResultadoCreateSchema.safeParse({
      data: formData.get('data'),
      id_2: formData.get('id_2') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const id2 = parsed.data.id_2 ?? (await nextId2(user.empresaId))
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('xr_placar')
      .insert({
        data: parsed.data.data,
        id_2: id2,
        empresa: user.empresaId,
        created_by: user.id,
        finalizada: false,
      })
      .select('id')
      .single()
    if (error) return { ok: false, message: 'Nao foi possivel criar a reuniao.' }

    revalidateReuniao(data.id)
    return { ok: true, message: 'Reuniao criada.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar reuniao.')
  }
}

export async function updateReuniaoResultadoAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = ReuniaoResultadoUpdateSchema.safeParse({
      id: formData.get('id'),
      data: formData.get('data'),
      id_2: formData.get('id_2') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { reuniao } = await assertReuniaoInScope(parsed.data.id)
    assertNotFinalized(reuniao)

    const supabase = await createClient()
    const { error } = await supabase
      .from('xr_placar')
      .update({
        data: parsed.data.data,
        ...(parsed.data.id_2 != null ? { id_2: parsed.data.id_2 } : {}),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar a reuniao.' }

    revalidateReuniao(parsed.data.id)
    return { ok: true, message: 'Reuniao atualizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar reuniao.')
  }
}

export async function deleteReuniaoResultadoAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const { user } = await guardManage()
    if (!canDeleteReuniaoResultado(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = DeleteReuniaoResultadoSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { reuniao } = await assertReuniaoInScope(parsed.data.id)
    assertNotFinalized(reuniao)

    const supabase = await createClient()
    const { error } = await supabase.from('xr_placar').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir a reuniao.' }

    revalidateReuniao()
    return { ok: true, message: 'Reuniao excluida.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir reuniao.')
  }
}

export async function finalizeReuniaoResultadoAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const { user } = await guardManage()
    if (!canFinalizeReuniaoResultado(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = ReuniaoFinalizeSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertReuniaoInScope(parsed.data.id)
    const supabase = await createClient()
    const { error } = await supabase
      .from('xr_placar')
      .update({ finalizada: true, data_finalizada: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel finalizar a reuniao.' }

    revalidateReuniao(parsed.data.id)
    return { ok: true, message: 'Reuniao finalizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao finalizar reuniao.')
  }
}

export async function reopenReuniaoResultadoAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const { user } = await guardManage()
    if (!canFinalizeReuniaoResultado(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = ReuniaoReopenSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertReuniaoInScope(parsed.data.id)
    const supabase = await createClient()
    const { error } = await supabase
      .from('xr_placar')
      .update({ finalizada: false, data_finalizada: null })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel reabrir a reuniao.' }

    revalidateReuniao(parsed.data.id)
    return { ok: true, message: 'Reuniao reaberta.' }
  } catch (err) {
    return errorState(err, 'Erro ao reabrir reuniao.')
  }
}

export async function addReuniaoAgendaItemAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = ReuniaoAgendaItemSchema.safeParse({
      reuniaoId: formData.get('reuniaoId'),
      indicadorId: formData.get('indicadorId'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { reuniao } = await assertReuniaoInScope(parsed.data.reuniaoId)
    assertNotFinalized(reuniao)

    const supabase = await createClient()
    const { error } = await supabase.from('xr_placar_indicadores').upsert(
      {
        xr_placar_id: parsed.data.reuniaoId,
        rr_indicadores_id: parsed.data.indicadorId,
      },
      { onConflict: 'xr_placar_id,rr_indicadores_id', ignoreDuplicates: true },
    )
    if (error) return { ok: false, message: 'Nao foi possivel adicionar indicador a pauta.' }

    revalidateReuniao(parsed.data.reuniaoId)
    return { ok: true, message: 'Indicador adicionado a pauta.' }
  } catch (err) {
    return errorState(err, 'Erro ao adicionar item da pauta.')
  }
}

export async function removeReuniaoAgendaItemAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = RemoveReuniaoAgendaItemSchema.safeParse({
      reuniaoId: formData.get('reuniaoId'),
      indicadorId: formData.get('indicadorId'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { reuniao } = await assertReuniaoInScope(parsed.data.reuniaoId)
    assertNotFinalized(reuniao)

    const supabase = await createClient()
    const { error } = await supabase
      .from('xr_placar_indicadores')
      .delete()
      .eq('xr_placar_id', parsed.data.reuniaoId)
      .eq('rr_indicadores_id', parsed.data.indicadorId)
    if (error) return { ok: false, message: 'Nao foi possivel remover indicador da pauta.' }

    revalidateReuniao(parsed.data.reuniaoId)
    return { ok: true, message: 'Indicador removido da pauta.' }
  } catch (err) {
    return errorState(err, 'Erro ao remover item da pauta.')
  }
}

async function upsertNextStep(parsed: {
  id?: string
  reuniaoId: string
  descricao: string
  data?: string | null
  responsavel?: string | null
  indicadorId?: string | null
  grupoId?: string | null
  completa?: boolean
}, userId: string, reuniao: { id2: number | null; empresaId: string | null }) {
  if (reuniao.id2 == null) throw new Error('NOT_FOUND')
  const supabase = await createClient()
  const payload = {
    descricao: parsed.descricao,
    data: parsed.data ?? null,
    responsavel: normalizeOptionalText(parsed.responsavel),
    indicador: parsed.indicadorId ?? null,
    grupo: parsed.grupoId ?? null,
    completa: parsed.completa ?? false,
    preliminar: reuniao.id2,
    empresa: reuniao.empresaId,
    created_by: userId,
  }

  if (parsed.id) {
    const { error } = await supabase.from('xr_acao').update(payload).eq('id', parsed.id)
    if (error) throw error
    return
  }

  const { error } = await supabase.from('xr_acao').insert(payload)
  if (error) throw error
}

export async function addReuniaoNextStepAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = ReuniaoNextStepSchema.safeParse({
      reuniaoId: formData.get('reuniaoId'),
      descricao: formData.get('descricao'),
      data: formData.get('data') || null,
      responsavel: formData.get('responsavel') || null,
      indicadorId: formData.get('indicadorId') || null,
      grupoId: formData.get('grupoId') || null,
      completa: formData.get('completa') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { user, reuniao } = await assertReuniaoInScope(parsed.data.reuniaoId)
    assertNotFinalized(reuniao)
    await upsertNextStep(parsed.data, user.id, reuniao)

    revalidateReuniao(parsed.data.reuniaoId)
    return { ok: true, message: 'Proximo passo adicionado.' }
  } catch (err) {
    return errorState(err, 'Erro ao adicionar proximo passo.')
  }
}

export async function updateReuniaoNextStepAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = ReuniaoNextStepSchema.safeParse({
      id: formData.get('id') || undefined,
      reuniaoId: formData.get('reuniaoId'),
      descricao: formData.get('descricao'),
      data: formData.get('data') || null,
      responsavel: formData.get('responsavel') || null,
      indicadorId: formData.get('indicadorId') || null,
      grupoId: formData.get('grupoId') || null,
      completa: formData.get('completa') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    if (!parsed.data.id) return { ok: false, message: 'ID do proximo passo obrigatorio.' }

    const { user, reuniao } = await assertReuniaoInScope(parsed.data.reuniaoId)
    assertNotFinalized(reuniao)
    await upsertNextStep(parsed.data, user.id, reuniao)

    revalidateReuniao(parsed.data.reuniaoId)
    return { ok: true, message: 'Proximo passo atualizado.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar proximo passo.')
  }
}

export async function removeReuniaoNextStepAction(
  _: ReuniaoActionState,
  formData: FormData,
): Promise<ReuniaoActionState> {
  try {
    const parsed = RemoveReuniaoNextStepSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const supabase = await createClient()
    const { data: acao } = await supabase.from('xr_acao').select('preliminar, empresa').eq('id', parsed.data.id).maybeSingle()
    if (!acao) throw new Error('NOT_FOUND')

    const { data: reuniao } = await supabase
      .from('xr_placar')
      .select('id, finalizada')
      .eq('id_2', acao.preliminar ?? -1)
      .maybeSingle()
    if (!reuniao) throw new Error('NOT_FOUND')

    await assertReuniaoInScope(reuniao.id)
    assertNotFinalized({ finalizada: reuniao.finalizada ?? false })

    const { error } = await supabase.from('xr_acao').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel remover proximo passo.' }

    revalidateReuniao(reuniao.id)
    return { ok: true, message: 'Proximo passo removido.' }
  } catch (err) {
    return errorState(err, 'Erro ao remover proximo passo.')
  }
}

export async function refreshReuniaoResultadosAction(): Promise<ReuniaoActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManageReuniaoResultados(user.perfilNivel)) throw new Error('FORBIDDEN')
    revalidateReuniao()
    return { ok: true, message: 'Lista atualizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar lista.')
  }
}
