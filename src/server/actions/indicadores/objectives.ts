'use server'

import { revalidatePath } from 'next/cache'

import { formatIndicatorRequestText, parseIndicatorRequestText } from '@/lib/indicadores/request-text'
import { assertCan, requireCurrentUser } from '@/lib/permissions'
import {
  canApproveIndicatorRequest,
  canEditIndicatorObjective,
  canRequestIndicator,
} from '@/lib/permissions/indicadores'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import {
  INDICATOR_REQUEST_TIPO,
  IndicatorObjectiveUpdateSchema,
  IndicatorRequestSchema,
  ReviewIndicatorRequestSchema,
  ToggleIndicatorObjectiveActiveSchema,
} from '@/lib/validations/indicadores/objectives'
import { createClient } from '@/lib/supabase/server'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { canAccessConcessionaria } from '@/lib/permissions/scopes'
import { getUserScopes } from '@/server/queries/scopes'

export type IndicatorObjectiveActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function guardOperational() {
  const user = await requireCurrentUser()
  if (!canEditIndicatorObjective(user.perfilNivel)) throw new Error('FORBIDDEN')
  return user
}

async function assertIndicatorInScope(indicatorId: string, concessionariaId?: string | null) {
  const user = await guardOperational()
  const scopes = await getUserScopes(user.id)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('concessionaria, empresa')
    .eq('id', indicatorId)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('NOT_FOUND')
  if (user.empresaId && data.empresa && data.empresa !== user.empresaId) throw new Error('FORBIDDEN')
  const conc = concessionariaId ?? data.concessionaria
  if (conc && !canAccessConcessionaria(scopes, conc)) throw new Error('FORBIDDEN')
  return user
}

export async function updateIndicatorObjectiveAction(
  _: IndicatorObjectiveActionState,
  formData: FormData,
): Promise<IndicatorObjectiveActionState> {
  try {
    await assertIndicatorInScope(String(formData.get('id')), formData.get('concessionariaId')?.toString() || null)
  } catch {
    return { ok: false, message: 'Sem permissao para editar este indicador.' }
  }

  const parsed = IndicatorObjectiveUpdateSchema.safeParse({
    id: formData.get('id'),
    meta: formData.get('meta'),
    pontos: formData.get('pontos'),
    unidade: formData.get('unidade') || null,
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  }

  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('indicadores')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/indicadores')
  return { ok: true }
}

export async function toggleIndicatorObjectiveActiveAction(
  _: IndicatorObjectiveActionState,
  formData: FormData,
): Promise<IndicatorObjectiveActionState> {
  const parsed = ToggleIndicatorObjectiveActiveSchema.safeParse({
    id: formData.get('id'),
    ativo: formData.get('ativo')?.toString() === 'true',
    concessionariaId: formData.get('concessionariaId') || null,
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

  try {
    await assertIndicatorInScope(parsed.data.id, parsed.data.concessionariaId)
  } catch {
    return { ok: false, message: 'Sem permissao para alterar este indicador.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('indicadores')
    .update({ ativo: parsed.data.ativo, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/indicadores')
  return { ok: true }
}

export async function requestIndicatorAction(
  _: IndicatorObjectiveActionState,
  formData: FormData,
): Promise<IndicatorObjectiveActionState> {
  const user = await requireCurrentUser()
  if (!canRequestIndicator(user.perfilNivel)) {
    return { ok: false, message: 'Sem permissao para solicitar indicador.' }
  }

  const orgContext = await getCurrentOrganizationalContext(user.id)
  const concessionariaId =
    formData.get('concessionariaId')?.toString() || orgContext.concessionariaId || null

  const parsed = IndicatorRequestSchema.safeParse({
    nome: formData.get('nome'),
    sigla: formData.get('sigla'),
    observacao: formData.get('observacao'),
    concessionariaId,
    areaIds: parseIdList(formData.get('areaIds')),
    funcaoIds: parseIdList(formData.get('funcaoIds')),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  }

  const scopes = await getUserScopes(user.id)
  if (parsed.data.concessionariaId && !canAccessConcessionaria(scopes, parsed.data.concessionariaId)) {
    return { ok: false, message: 'Concessionaria fora do seu escopo.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('solicitacoes').insert({
    nome: parsed.data.nome,
    text: formatIndicatorRequestText(
      parsed.data.sigla,
      parsed.data.observacao as string | null | undefined,
      parsed.data.areaIds,
      parsed.data.funcaoIds,
    ),
    tipo: INDICATOR_REQUEST_TIPO,
    concessionaria: parsed.data.concessionariaId,
    user: user.id,
    created_by: user.id,
    atendida: null,
  })
  if (error) return { ok: false, message: error.message }

  revalidatePath('/indicadores')
  return { ok: true, message: 'Solicitacao enviada com sucesso.' }
}

export async function approveIndicatorRequestAction(
  _: IndicatorObjectiveActionState,
  formData: FormData,
): Promise<IndicatorObjectiveActionState> {
  const user = await requireCurrentUser()
  if (!canApproveIndicatorRequest(user.perfilNivel)) {
    return { ok: false, message: 'Sem permissao para aprovar solicitacoes.' }
  }
  assertCan(user, 'admin:manage')

  const parsed = ReviewIndicatorRequestSchema.safeParse({
    id: formData.get('id'),
    action: 'approve',
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

  const supabase = await createClient()
  const { data: solicitacao, error: readError } = await supabase
    .from('solicitacoes')
    .select('id, nome, text, concessionaria, atendida')
    .eq('id', parsed.data.id)
    .eq('tipo', INDICATOR_REQUEST_TIPO)
    .maybeSingle()
  if (readError) return { ok: false, message: readError.message }
  if (!solicitacao) return { ok: false, message: 'Solicitacao nao encontrada.' }
  if (solicitacao.atendida !== null) return { ok: false, message: 'Solicitacao ja revisada.' }

  const meta = parseIndicatorRequestText(solicitacao.text)

  const { data: indicador, error: createError } = await supabase
    .from('indicadores')
    .insert({
      nome: solicitacao.nome,
      sigla: meta.sigla || null,
      concessionaria: solicitacao.concessionaria,
      empresa: user.empresaId,
      ativo: true,
      created_by: user.id,
      user_edicao: user.id,
    })
    .select('id')
    .single()
  if (createError) return { ok: false, message: createError.message }

  if (solicitacao.concessionaria) {
    await supabase.from('concessionaria_indicadores').upsert({
      concessionaria_id: solicitacao.concessionaria,
      indicadores_id: indicador.id,
    })
  }

  if (meta.areaIds.length > 0 || meta.funcaoIds.length > 0) {
    await Promise.all([
      syncJoinTable(
        supabase,
        'indicadores_areas',
        'indicadores_id',
        indicador.id,
        'setor_concessionaria_id',
        meta.areaIds,
      ),
      syncJoinTable(
        supabase,
        'indicadores_funcoes',
        'indicadores_id',
        indicador.id,
        'funcao_colaborador_id',
        meta.funcaoIds,
      ),
    ])
  }

  const { error: updateError } = await supabase
    .from('solicitacoes')
    .update({ atendida: true, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
  if (updateError) return { ok: false, message: updateError.message }

  revalidatePath('/indicadores')
  revalidatePath('/biblioteca-indicadores')
  return { ok: true, message: 'Solicitacao aprovada e indicador criado.' }
}

export async function rejectIndicatorRequestAction(
  _: IndicatorObjectiveActionState,
  formData: FormData,
): Promise<IndicatorObjectiveActionState> {
  const user = await requireCurrentUser()
  if (!canApproveIndicatorRequest(user.perfilNivel)) {
    return { ok: false, message: 'Sem permissao para rejeitar solicitacoes.' }
  }

  const parsed = ReviewIndicatorRequestSchema.safeParse({
    id: formData.get('id'),
    action: 'reject',
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('solicitacoes')
    .update({ atendida: false, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .eq('tipo', INDICATOR_REQUEST_TIPO)
    .is('atendida', null)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/indicadores')
  return { ok: true, message: 'Solicitacao rejeitada.' }
}

export async function refreshIndicatorObjectivesAction(): Promise<IndicatorObjectiveActionState> {
  try {
    await guardOperational()
  } catch {
    return { ok: false, message: 'Sem permissao.' }
  }
  revalidatePath('/indicadores')
  return { ok: true, message: 'Lista atualizada.' }
}
