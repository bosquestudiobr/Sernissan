'use server'

import { revalidatePath } from 'next/cache'

import { canManageSolicitacoes } from '@/lib/permissions/solicitacoes'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import {
  ApproveInclusionRequestSchema,
  ApproveRegistrationRequestSchema,
  RejectInclusionRequestSchema,
  RejectRegistrationRequestSchema,
  ReviewRequestSchema,
} from '@/lib/validations/solicitacoes'
import { getUserScopes } from '@/server/queries/scopes'
import { getRequestById, type RequestDetail } from '@/server/queries/solicitacoes'

export type SolicitacoesActionState = {
  ok: boolean
  message?: string
  detail?: RequestDetail
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): SolicitacoesActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Solicitacao nao encontrada.' }
  return { ok: false, message: fallback }
}

async function guardManage() {
  const user = await requireCurrentUser()
  if (!canManageSolicitacoes(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  return { user, scopes }
}

async function assertRequestInScope(id: string) {
  const { user, scopes } = await guardManage()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('id, tipo, atendida, user, colaborador_2, concessionaria')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('NOT_FOUND')

  if (!isHighPrivilegeScope(scopes.perfilNivel)) {
    if (!data.concessionaria || !canAccessConcessionaria(scopes, data.concessionaria)) {
      throw new Error('FORBIDDEN')
    }
  }
  return { user, scopes, request: data }
}

export async function approveRegistrationRequestAction(
  _: SolicitacoesActionState,
  formData: FormData,
): Promise<SolicitacoesActionState> {
  try {
    const parsed = ApproveRegistrationRequestSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { request } = await assertRequestInScope(parsed.data.id)
    const supabase = await createClient()

    if (request.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ aprovado: true, ativo: true, updated_at: new Date().toISOString() })
        .eq('id', request.user)
      if (profileError) return { ok: false, message: 'Nao foi possivel aprovar o cadastro.' }
    }

    const { error } = await supabase
      .from('solicitacoes')
      .update({ atendida: true, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar a solicitacao.' }

    revalidatePath('/solicitacoes')
    return { ok: true, message: 'Cadastro aprovado.' }
  } catch (err) {
    return errorState(err, 'Erro ao aprovar cadastro.')
  }
}

export async function rejectRegistrationRequestAction(
  _: SolicitacoesActionState,
  formData: FormData,
): Promise<SolicitacoesActionState> {
  try {
    const parsed = RejectRegistrationRequestSchema.safeParse({
      id: formData.get('id'),
      motivo: formData.get('motivo') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertRequestInScope(parsed.data.id)
    const supabase = await createClient()
    const { error } = await supabase
      .from('solicitacoes')
      .update({ atendida: false, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel rejeitar.' }

    revalidatePath('/solicitacoes')
    return { ok: true, message: 'Cadastro rejeitado.' }
  } catch (err) {
    return errorState(err, 'Erro ao rejeitar cadastro.')
  }
}

export async function approveInclusionRequestAction(
  _: SolicitacoesActionState,
  formData: FormData,
): Promise<SolicitacoesActionState> {
  try {
    const parsed = ApproveInclusionRequestSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { request } = await assertRequestInScope(parsed.data.id)
    const supabase = await createClient()

    const targetUser = request.colaborador_2 ?? request.user
    if (targetUser && request.concessionaria) {
      const { error: linkError } = await supabase
        .from('profiles_concessionarias_equipe')
        .upsert(
          { profiles_id: targetUser, concessionaria_id: request.concessionaria },
          { onConflict: 'profiles_id,concessionaria_id', ignoreDuplicates: true },
        )
      if (linkError) return { ok: false, message: 'Nao foi possivel vincular o colaborador.' }
    }

    const { error } = await supabase
      .from('solicitacoes')
      .update({ atendida: true, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar a solicitacao.' }

    revalidatePath('/solicitacoes')
    return { ok: true, message: 'Inclusao aprovada.' }
  } catch (err) {
    return errorState(err, 'Erro ao aprovar inclusao.')
  }
}

export async function rejectInclusionRequestAction(
  _: SolicitacoesActionState,
  formData: FormData,
): Promise<SolicitacoesActionState> {
  try {
    const parsed = RejectInclusionRequestSchema.safeParse({
      id: formData.get('id'),
      motivo: formData.get('motivo') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertRequestInScope(parsed.data.id)
    const supabase = await createClient()
    const { error } = await supabase
      .from('solicitacoes')
      .update({ atendida: false, updated_at: new Date().toISOString() })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel rejeitar.' }

    revalidatePath('/solicitacoes')
    return { ok: true, message: 'Inclusao rejeitada.' }
  } catch (err) {
    return errorState(err, 'Erro ao rejeitar inclusao.')
  }
}

export async function reviewRequestAction(
  _: SolicitacoesActionState,
  formData: FormData,
): Promise<SolicitacoesActionState> {
  try {
    const parsed = ReviewRequestSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
    await assertRequestInScope(parsed.data.id)
    const detail = await getRequestById(parsed.data.id)
    if (!detail) throw new Error('NOT_FOUND')
    return { ok: true, detail }
  } catch (err) {
    return errorState(err, 'Erro ao carregar solicitacao.')
  }
}

export async function refreshSolicitacoesAction(): Promise<SolicitacoesActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManageSolicitacoes(user.perfilNivel)) return { ok: false, message: 'Sem permissao.' }
    revalidatePath('/solicitacoes')
    return { ok: true }
  } catch {
    return { ok: false, message: 'Erro ao atualizar.' }
  }
}
