'use server'

import { revalidatePath } from 'next/cache'

import { isHabitoLocked } from '@/lib/habitos/status'
import {
  canDeleteHabito,
  canManageHabitos,
  canReopenHabito,
} from '@/lib/permissions/habitos'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import {
  DeleteHabitoSchema,
  HabitoCreateSchema,
  HabitoProgressSchema,
  HabitoStatusUpdateSchema,
  HabitoUpdateSchema,
} from '@/lib/validations/habitos'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { assertHabitoInScope, getHabitoById } from '@/server/queries/habitos'
import { getUserScopes } from '@/server/queries/scopes'

export type HabitoActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): HabitoActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Habito nao encontrado.' }
  if (err instanceof Error && err.message === 'LOCKED') return { ok: false, message: 'Habito concluido: edicao nao permitida.' }
  return { ok: false, message: fallback }
}

async function guardManage() {
  const user = await requireCurrentUser()
  if (!canManageHabitos(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  const orgContext = await getCurrentOrganizationalContext(user.id)
  return { user, scopes, orgContext }
}

async function assertItemInScope(id: string) {
  const { user, scopes, orgContext } = await guardManage()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const item = await getHabitoById(id, ctx)
  if (!item) throw new Error('NOT_FOUND')
  if (!assertHabitoInScope(item.concessionariaId, ctx)) throw new Error('FORBIDDEN')
  return { user, scopes, orgContext, item, ctx }
}

function assertEditable(item: { concluido: boolean }) {
  if (isHabitoLocked(item)) throw new Error('LOCKED')
}

function parseFormBase(formData: FormData) {
  return {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    data_inicio: formData.get('data_inicio') || null,
    data_fim: formData.get('data_fim') || null,
    colaborador: formData.get('colaborador') || null,
    concessionaria: formData.get('concessionaria'),
    funcao: formData.get('funcao') || null,
    area: formData.get('area') || null,
    competenciaHabitoId: formData.get('competenciaHabitoId') || null,
    agendamentoId: formData.get('agendamentoId') || null,
    metaExecucoes: formData.get('metaExecucoes') || null,
    execucoesRealizadas: formData.get('execucoesRealizadas') || undefined,
    ativo: formData.get('ativo') || undefined,
  }
}

export async function createHabitoAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const { user, scopes } = await guardManage()
    const parsed = HabitoCreateSchema.safeParse(parseFormBase(formData))
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    if (!isHighPrivilegeScope(scopes.perfilNivel) && !canAccessConcessionaria(scopes, parsed.data.concessionaria)) {
      throw new Error('FORBIDDEN')
    }

    const supabase = await createClient()
    const { error } = await supabase.from('habitos').insert({
      titulo: parsed.data.titulo,
      descricao: parsed.data.descricao ?? null,
      data_inicio: parsed.data.data_inicio ?? null,
      data_fim: parsed.data.data_fim ?? null,
      colaborador: parsed.data.colaborador ?? null,
      concessionaria: parsed.data.concessionaria,
      funcao: parsed.data.funcao ?? null,
      area: parsed.data.area ?? null,
      competencia_habito: parsed.data.competenciaHabitoId ?? null,
      agendamento: parsed.data.agendamentoId ?? null,
      meta_execucoes: parsed.data.metaExecucoes ?? null,
      execucoes_realizadas: parsed.data.execucoesRealizadas ?? 0,
      ativo: parsed.data.ativo ?? true,
      concluido: false,
      empresa: user.empresaId,
      created_by: user.id,
    })
    if (error) return { ok: false, message: 'Nao foi possivel criar o habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Habito criado.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar habito.')
  }
}

export async function updateHabitoAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const parsed = HabitoUpdateSchema.safeParse({ id: formData.get('id'), ...parseFormBase(formData) })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase
      .from('habitos')
      .update({
        titulo: parsed.data.titulo,
        descricao: parsed.data.descricao ?? null,
        data_inicio: parsed.data.data_inicio ?? null,
        data_fim: parsed.data.data_fim ?? null,
        colaborador: parsed.data.colaborador ?? null,
        concessionaria: parsed.data.concessionaria,
        funcao: parsed.data.funcao ?? null,
        area: parsed.data.area ?? null,
        competencia_habito: parsed.data.competenciaHabitoId ?? null,
        agendamento: parsed.data.agendamentoId ?? null,
        meta_execucoes: parsed.data.metaExecucoes ?? null,
        execucoes_realizadas: parsed.data.execucoesRealizadas ?? item.execucoesRealizadas,
        ativo: parsed.data.ativo ?? item.ativo,
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar o habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Habito atualizado.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar habito.')
  }
}

export async function deleteHabitoAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const { user } = await guardManage()
    if (!canDeleteHabito(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = DeleteHabitoSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase.from('habitos').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir o habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Habito excluido.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir habito.')
  }
}

export async function toggleHabitoActiveAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const parsed = HabitoStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    if (item.concluido) throw new Error('LOCKED')

    const supabase = await createClient()
    const { error } = await supabase
      .from('habitos')
      .update({ ativo: !item.ativo })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel alterar o status do habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: item.ativo ? 'Habito inativado.' : 'Habito ativado.' }
  } catch (err) {
    return errorState(err, 'Erro ao alterar status do habito.')
  }
}

export async function completeHabitoAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const parsed = HabitoStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const { error } = await supabase
      .from('habitos')
      .update({ concluido: true, ativo: true, concluido_em: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel concluir o habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Habito concluido.' }
  } catch (err) {
    return errorState(err, 'Erro ao concluir habito.')
  }
}

export async function markHabitoDoneAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const parsed = HabitoProgressSchema.safeParse({
      id: formData.get('id'),
      execucoesRealizadas: formData.get('execucoesRealizadas'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { item } = await assertItemInScope(parsed.data.id)
    assertEditable(item)

    const supabase = await createClient()
    const execucoes = parsed.data.execucoesRealizadas
    const reachedMeta = item.metaExecucoes != null && execucoes >= item.metaExecucoes
    const { error } = await supabase
      .from('habitos')
      .update({
        execucoes_realizadas: execucoes,
        ...(reachedMeta ? { concluido: true, concluido_em: new Date().toISOString() } : {}),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel registrar execucao.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Execucao registrada.' }
  } catch (err) {
    return errorState(err, 'Erro ao registrar execucao.')
  }
}

export async function reopenHabitoAction(_: HabitoActionState, formData: FormData): Promise<HabitoActionState> {
  try {
    const { user } = await guardManage()
    if (!canReopenHabito(user.perfilNivel)) throw new Error('FORBIDDEN')

    const parsed = HabitoStatusUpdateSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertItemInScope(parsed.data.id)

    const supabase = await createClient()
    const { error } = await supabase
      .from('habitos')
      .update({ concluido: false, concluido_em: null, ativo: true })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel reabrir o habito.' }

    revalidatePath('/habitos')
    return { ok: true, message: 'Habito reaberto.' }
  } catch (err) {
    return errorState(err, 'Erro ao reabrir habito.')
  }
}

export async function refreshHabitosAction(): Promise<HabitoActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManageHabitos(user.perfilNivel)) throw new Error('FORBIDDEN')
    revalidatePath('/habitos')
    return { ok: true, message: 'Habitos atualizados.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar habitos.')
  }
}

export async function loadHabitoForEditAction(id: string) {
  try {
    const { user, scopes, orgContext } = await guardManage()
    const ctx = { scopes, orgContext, empresaId: user.empresaId }
    return await getHabitoById(id, ctx)
  } catch {
    return null
  }
}
