'use server'

import { revalidatePath } from 'next/cache'

import {
  canDeleteAgendaItem,
  canManageAgenda,
  canReopenAgendaItem,
} from '@/lib/permissions/agenda'
import { isAgendaLocked } from '@/lib/agenda/status'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import {
  AgendaItemCreateSchema,
  AgendaItemUpdateSchema,
  AgendaStatusUpdateSchema,
  DeleteAgendaItemSchema,
} from '@/lib/validations/agenda'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { assertAgendaInScope, getAgendaItemById } from '@/server/queries/agenda'
import { getUserScopes } from '@/server/queries/scopes'

export type AgendaActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): AgendaActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Compromisso nao encontrado.' }
  if (err instanceof Error && err.message === 'LOCKED') return { ok: false, message: 'Compromisso concluido/cancelado: edicao nao permitida.' }
  return { ok: false, message: fallback }
}

function parseIds(formData: FormData, key: string) {
  const all = formData.getAll(key).map((v) => String(v).trim()).filter(Boolean)
  if (all.length > 0) return all
  const raw = formData.get(key)?.toString() ?? ''
  return raw.split(',').map((v) => v.trim()).filter(Boolean)
}

async function guardManage() {
  const user = await requireCurrentUser()
  if (!canManageAgenda(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  const orgContext = await getCurrentOrganizationalContext(user.id)
  return { user, scopes, orgContext }
}

async function assertItemInScope(id: string) {
  const { user, scopes, orgContext } = await guardManage()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const item = await getAgendaItemById(id, ctx)
  if (!item) throw new Error('NOT_FOUND')
  if (!assertAgendaInScope(item.concessionariaId, ctx)) throw new Error('FORBIDDEN')
  return { user, scopes, orgContext, item, ctx }
}

function assertEditable(item: { concluido: boolean; cancelado: boolean }) {
  if (isAgendaLocked(item)) throw new Error('LOCKED')
}

async function syncParticipants(agendamentoId: string, userIds: string[]) {
  const supabase = await createClient()
  const unique = [...new Set(userIds.filter(Boolean))]
  const { data: current } = await supabase
    .from('agendamentos_users')
    .select('user_id')
    .eq('agendamentos_id', agendamentoId)
  const currentIds = new Set((current ?? []).map((r) => r.user_id))
  const desired = new Set(unique)
  const toRemove = [...currentIds].filter((id) => !desired.has(id))
  const toAdd = unique.filter((id) => !currentIds.has(id))

  if (toRemove.length > 0) {
    await supabase
      .from('agendamentos_users')
      .delete()
      .eq('agendamentos_id', agendamentoId)
      .in('user_id', toRemove)
  }
  if (toAdd.length > 0) {
    await supabase.from('agendamentos_users').upsert(
      toAdd.map((user_id) => ({ agendamentos_id: agendamentoId, user_id })),
      { onConflict: 'agendamentos_id,user_id', ignoreDuplicates: true },
    )
  }
}

async function syncConvidados(agendamentoId: string, userIds: string[]) {
  const supabase = await createClient()
  const unique = [...new Set(userIds.filter(Boolean))]
  const { data: current } = await supabase
    .from('agendamentos_convidados')
    .select('user_id')
    .eq('agendamentos_id', agendamentoId)
  const currentIds = new Set((current ?? []).map((r) => r.user_id))
  const desired = new Set(unique)
  const toRemove = [...currentIds].filter((id) => !desired.has(id))
  const toAdd = unique.filter((id) => !currentIds.has(id))

  if (toRemove.length > 0) {
    await supabase
      .from('agendamentos_convidados')
      .delete()
      .eq('agendamentos_id', agendamentoId)
      .in('user_id', toRemove)
  }
  if (toAdd.length > 0) {
    await supabase.from('agendamentos_convidados').upsert(
      toAdd.map((user_id) => ({ agendamentos_id: agendamentoId, user_id })),
      { onConflict: 'agendamentos_id,user_id', ignoreDuplicates: true },
    )
  }
}

export async function createAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const { user, scopes } = await guardManage()
    const parsed = AgendaItemCreateSchema.safeParse({
      titulo: formData.get('titulo'),
      data_inicio: formData.get('data_inicio'),
      data_fim: formData.get('data_fim') || null,
      dia_todo: formData.get('dia_todo') || undefined,
      concessionaria: formData.get('concessionaria'),
      user: formData.get('user') || user.id,
      gerente: formData.get('gerente') || null,
      placar: formData.get('placar') || null,
      participantIds: parseIds(formData, 'participantIds'),
      convidadoIds: parseIds(formData, 'convidadoIds'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    if (!isHighPrivilegeScope(scopes.perfilNivel) && !canAccessConcessionaria(scopes, parsed.data.concessionaria)) {
      throw new Error('FORBIDDEN')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        titulo: parsed.data.titulo,
        data_inicio: parsed.data.data_inicio,
        data_fim: parsed.data.data_fim ?? null,
        dia_todo: parsed.data.dia_todo ?? false,
        concessionaria: parsed.data.concessionaria,
        user: parsed.data.user ?? user.id,
        gerente: parsed.data.gerente ?? null,
        placar: parsed.data.placar ?? null,
        empresa: user.empresaId,
        created_by: user.id,
        concluido: false,
        cancelado: false,
      })
      .select('id')
      .single()
    if (error) return { ok: false, message: 'Nao foi possivel criar o compromisso.' }

    await syncParticipants(data.id, parsed.data.participantIds ?? [])
    await syncConvidados(data.id, parsed.data.convidadoIds ?? [])

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso criado.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar compromisso.')
  }
}

export async function updateAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const parsed = AgendaItemUpdateSchema.safeParse({
      id: formData.get('id'),
      titulo: formData.get('titulo'),
      data_inicio: formData.get('data_inicio'),
      data_fim: formData.get('data_fim') || null,
      dia_todo: formData.get('dia_todo') || undefined,
      concessionaria: formData.get('concessionaria'),
      user: formData.get('user') || null,
      gerente: formData.get('gerente') || null,
      placar: formData.get('placar') || null,
      participantIds: parseIds(formData, 'participantIds'),
      convidadoIds: parseIds(formData, 'convidadoIds'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({
        titulo: parsed.data.titulo,
        data_inicio: parsed.data.data_inicio,
        data_fim: parsed.data.data_fim ?? null,
        dia_todo: parsed.data.dia_todo ?? false,
        concessionaria: parsed.data.concessionaria,
        user: parsed.data.user ?? null,
        gerente: parsed.data.gerente ?? null,
        placar: parsed.data.placar ?? null,
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar o compromisso.' }

    await syncParticipants(parsed.data.id, parsed.data.participantIds ?? [])
    await syncConvidados(parsed.data.id, parsed.data.convidadoIds ?? [])

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso atualizado.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar compromisso.')
  }
}

export async function deleteAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const { user } = await guardManage()
    if (!canDeleteAgendaItem(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = DeleteAgendaItemSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase.from('agendamentos').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir o compromisso.' }

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso excluido.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir compromisso.')
  }
}

export async function completeAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const parsed = AgendaStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({ concluido: true, cancelado: false, concluido_em: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel concluir o compromisso.' }

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso concluido.' }
  } catch (err) {
    return errorState(err, 'Erro ao concluir compromisso.')
  }
}

export async function cancelAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const parsed = AgendaStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({ cancelado: true, concluido: false, concluido_em: null })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel cancelar o compromisso.' }

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso cancelado.' }
  } catch (err) {
    return errorState(err, 'Erro ao cancelar compromisso.')
  }
}

export async function reopenAgendaItemAction(_: AgendaActionState, formData: FormData): Promise<AgendaActionState> {
  try {
    const { user } = await guardManage()
    if (!canReopenAgendaItem(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = AgendaStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertItemInScope(parsed.data.id)

    const supabase = await createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({ cancelado: false, concluido: false, concluido_em: null })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel reabrir o compromisso.' }

    revalidatePath('/agenda')
    return { ok: true, message: 'Compromisso reaberto.' }
  } catch (err) {
    return errorState(err, 'Erro ao reabrir compromisso.')
  }
}

export async function refreshAgendaAction(): Promise<AgendaActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManageAgenda(user.perfilNivel)) throw new Error('FORBIDDEN')
    revalidatePath('/agenda')
    return { ok: true, message: 'Agenda atualizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar agenda.')
  }
}

export async function loadAgendaItemForEditAction(id: string) {
  try {
    const { user, scopes, orgContext } = await guardManage()
    const ctx = { scopes, orgContext, empresaId: user.empresaId }
    return await getAgendaItemById(id, ctx)
  } catch {
    return null
  }
}
