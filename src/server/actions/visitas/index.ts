'use server'

import { revalidatePath } from 'next/cache'

import { canDeleteVisita, canManageVisitas } from '@/lib/permissions/visitas'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateRvToken } from '@/lib/rv/token'
import {
  DeleteRvAttachmentSchema,
  DeleteVisitaSchema,
  GeneratePublicLinkSchema,
  ParticipanteSchema,
  ProximoPassoSchema,
  RemoveChildSchema,
  VisitaCreateSchema,
  VisitaUpdateSchema,
} from '@/lib/validations/visitas'
import { getUserScopes } from '@/server/queries/scopes'

export type VisitaActionState = {
  ok: boolean
  message?: string
  token?: string
  signedUrl?: string
  fieldErrors?: Record<string, string[] | undefined>
}

const RV_ANEXOS_BUCKET = 'rv-anexos'
const MAX_ANEXO_MB = 10
const ALLOWED_ANEXO_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): VisitaActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Visita nao encontrada.' }
  if (err instanceof Error && err.message === 'LOCKED') return { ok: false, message: 'Visita assinada/bloqueada: edicao nao permitida.' }
  return { ok: false, message: fallback }
}

function normalizeOptionalText(value?: string | null) {
  if (!value || value.trim() === '') return null
  return value.trim()
}

async function guardManage() {
  const user = await requireCurrentUser()
  if (!canManageVisitas(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  return { user, scopes }
}

async function assertVisitaInScope(id: string) {
  const { user, scopes } = await guardManage()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rv')
    .select('id, dealer, assinado_em, bloqueado_edicao')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('NOT_FOUND')
  if (!isHighPrivilegeScope(scopes.perfilNivel)) {
    if (!data.dealer || !canAccessConcessionaria(scopes, data.dealer)) throw new Error('FORBIDDEN')
  }
  return { user, scopes, rv: data }
}

function assertEditable(rv: { assinado_em: string | null; bloqueado_edicao: boolean | null }) {
  if (rv.assinado_em || rv.bloqueado_edicao) throw new Error('LOCKED')
}

async function recordRvAudit(rvId: string, userId: string | null, acao: string, descricao: string) {
  try {
    const admin = createAdminClient()
    await admin.from('rv_auditoria').insert({
      rv: rvId,
      user: userId,
      acao,
      descricao,
      data: new Date().toISOString(),
    })
  } catch {
    // auditoria best-effort
  }
}

export async function createVisitaAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const { user, scopes } = await guardManage()
    const parsed = VisitaCreateSchema.safeParse({
      data_visita: formData.get('data_visita'),
      dealer: formData.get('dealer'),
      consultor: formData.get('consultor') || user.id,
      modalidade: formData.get('modalidade') || null,
      foco: formData.get('foco') || null,
      relato: formData.get('relato'),
      pontos_destaque: formData.get('pontos_destaque'),
      avaliacao_consultor: formData.get('avaliacao_consultor'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    if (!isHighPrivilegeScope(scopes.perfilNivel) && !canAccessConcessionaria(scopes, parsed.data.dealer)) {
      throw new Error('FORBIDDEN')
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('rv')
      .insert({
        data_visita: parsed.data.data_visita,
        dealer: parsed.data.dealer,
        consultor: parsed.data.consultor ?? user.id,
        modalidade: parsed.data.modalidade ?? null,
        foco: parsed.data.foco ?? null,
        relato: normalizeOptionalText(parsed.data.relato),
        pontos_destaque: normalizeOptionalText(parsed.data.pontos_destaque),
        avaliacao_consultor: normalizeOptionalText(parsed.data.avaliacao_consultor),
        created_by: user.id,
      })
      .select('id')
      .single()
    if (error) return { ok: false, message: 'Nao foi possivel criar a visita.' }

    await recordRvAudit(data.id, user.id, 'criar', 'Visita criada')
    revalidatePath('/visitas')
    return { ok: true, message: 'Visita criada.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar visita.')
  }
}

export async function updateVisitaAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = VisitaUpdateSchema.safeParse({
      id: formData.get('id'),
      data_visita: formData.get('data_visita'),
      dealer: formData.get('dealer'),
      consultor: formData.get('consultor') || null,
      modalidade: formData.get('modalidade') || null,
      foco: formData.get('foco') || null,
      relato: formData.get('relato'),
      pontos_destaque: formData.get('pontos_destaque'),
      avaliacao_consultor: formData.get('avaliacao_consultor'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { user, scopes, rv } = await assertVisitaInScope(parsed.data.id)
    assertEditable(rv)
    if (!isHighPrivilegeScope(scopes.perfilNivel) && !canAccessConcessionaria(scopes, parsed.data.dealer)) {
      throw new Error('FORBIDDEN')
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('rv')
      .update({
        data_visita: parsed.data.data_visita,
        dealer: parsed.data.dealer,
        consultor: parsed.data.consultor,
        modalidade: parsed.data.modalidade ?? null,
        foco: parsed.data.foco ?? null,
        relato: normalizeOptionalText(parsed.data.relato),
        pontos_destaque: normalizeOptionalText(parsed.data.pontos_destaque),
        avaliacao_consultor: normalizeOptionalText(parsed.data.avaliacao_consultor),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar a visita.' }

    await recordRvAudit(parsed.data.id, user.id, 'editar', 'Visita atualizada')
    revalidatePath('/visitas')
    revalidatePath(`/visitas/${parsed.data.id}`)
    return { ok: true, message: 'Visita atualizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar visita.')
  }
}

export async function deleteVisitaAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = DeleteVisitaSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
    const { user, rv } = await assertVisitaInScope(parsed.data.id)
    if (!canDeleteVisita(user.perfilNivel)) throw new Error('FORBIDDEN')
    assertEditable(rv)

    const supabase = await createClient()
    const { error } = await supabase.from('rv').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir a visita.' }

    revalidatePath('/visitas')
    return { ok: true, message: 'Visita excluida.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir visita.')
  }
}

export async function addParticipanteAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  return upsertParticipante(formData)
}
export async function updateParticipanteAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  return upsertParticipante(formData)
}

async function upsertParticipante(formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = ParticipanteSchema.safeParse({
      id: formData.get('id') || undefined,
      rv: formData.get('rv'),
      nome: formData.get('nome'),
      cargo: formData.get('cargo'),
      ordem: formData.get('ordem'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    const { user, rv } = await assertVisitaInScope(parsed.data.rv)
    assertEditable(rv)

    const supabase = await createClient()
    const payload = {
      rv: parsed.data.rv,
      nome: parsed.data.nome,
      cargo: normalizeOptionalText(parsed.data.cargo),
      ordem: parsed.data.ordem ?? null,
    }
    if (parsed.data.id) {
      const { error } = await supabase.from('rv_participante').update(payload).eq('id', parsed.data.id)
      if (error) return { ok: false, message: 'Nao foi possivel atualizar o participante.' }
    } else {
      const { error } = await supabase.from('rv_participante').insert({ ...payload, created_by: user.id })
      if (error) return { ok: false, message: 'Nao foi possivel adicionar o participante.' }
    }
    revalidatePath(`/visitas/${parsed.data.rv}`)
    return { ok: true, message: 'Participante salvo.' }
  } catch (err) {
    return errorState(err, 'Erro ao salvar participante.')
  }
}

export async function removeParticipanteAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = RemoveChildSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
    const supabase = await createClient()
    const { data: row } = await supabase.from('rv_participante').select('rv').eq('id', parsed.data.id).maybeSingle()
    if (row?.rv) {
      const { rv } = await assertVisitaInScope(row.rv)
      assertEditable(rv)
    }
    const { error } = await supabase.from('rv_participante').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel remover.' }
    if (row?.rv) revalidatePath(`/visitas/${row.rv}`)
    return { ok: true, message: 'Participante removido.' }
  } catch (err) {
    return errorState(err, 'Erro ao remover participante.')
  }
}

export async function addProximoPassoAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  return upsertProximoPasso(formData)
}
export async function updateProximoPassoAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  return upsertProximoPasso(formData)
}

async function upsertProximoPasso(formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = ProximoPassoSchema.safeParse({
      id: formData.get('id') || undefined,
      rv: formData.get('rv'),
      acao: formData.get('acao'),
      responsavel: formData.get('responsavel'),
      prazo: formData.get('prazo') || null,
      ordem: formData.get('ordem'),
      concluido_bool: formData.get('concluido_bool'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }
    const { user, rv } = await assertVisitaInScope(parsed.data.rv)
    assertEditable(rv)

    const supabase = await createClient()
    const payload = {
      rv: parsed.data.rv,
      acao: parsed.data.acao,
      responsavel: normalizeOptionalText(parsed.data.responsavel),
      prazo: parsed.data.prazo || null,
      ordem: parsed.data.ordem ?? null,
      concluido_bool: parsed.data.concluido_bool ?? false,
    }
    if (parsed.data.id) {
      const { error } = await supabase.from('rv_proximo_passo').update(payload).eq('id', parsed.data.id)
      if (error) return { ok: false, message: 'Nao foi possivel atualizar o proximo passo.' }
    } else {
      const { error } = await supabase.from('rv_proximo_passo').insert({ ...payload, created_by: user.id })
      if (error) return { ok: false, message: 'Nao foi possivel adicionar o proximo passo.' }
    }
    revalidatePath(`/visitas/${parsed.data.rv}`)
    return { ok: true, message: 'Proximo passo salvo.' }
  } catch (err) {
    return errorState(err, 'Erro ao salvar proximo passo.')
  }
}

export async function removeProximoPassoAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = RemoveChildSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
    const supabase = await createClient()
    const { data: row } = await supabase.from('rv_proximo_passo').select('rv').eq('id', parsed.data.id).maybeSingle()
    if (row?.rv) {
      const { rv } = await assertVisitaInScope(row.rv)
      assertEditable(rv)
    }
    const { error } = await supabase.from('rv_proximo_passo').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel remover.' }
    if (row?.rv) revalidatePath(`/visitas/${row.rv}`)
    return { ok: true, message: 'Proximo passo removido.' }
  } catch (err) {
    return errorState(err, 'Erro ao remover proximo passo.')
  }
}

export async function generateRvPublicLinkAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = GeneratePublicLinkSchema.safeParse({
      id: formData.get('id'),
      diasValidade: formData.get('diasValidade') || 7,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { user, rv } = await assertVisitaInScope(parsed.data.id)
    if (rv.assinado_em) return { ok: false, message: 'Visita ja assinada: link nao pode ser regenerado.' }

    const { raw, hash } = generateRvToken()
    const expira = new Date()
    expira.setDate(expira.getDate() + parsed.data.diasValidade)

    const supabase = await createClient()
    const { error } = await supabase
      .from('rv')
      .update({
        token_ciencia: hash,
        data_expiracao_token: expira.toISOString(),
        enviado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel gerar o link.' }

    await recordRvAudit(parsed.data.id, user.id, 'gerar_link', `Link publico gerado, validade ${parsed.data.diasValidade} dias`)
    revalidatePath(`/visitas/${parsed.data.id}`)
    return { ok: true, message: 'Link gerado.', token: raw }
  } catch (err) {
    return errorState(err, 'Erro ao gerar link.')
  }
}

export async function uploadRvAttachmentAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const rvId = String(formData.get('rv') ?? '')
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'Selecione um arquivo.' }
    if (file.size > MAX_ANEXO_MB * 1024 * 1024) return { ok: false, message: `Arquivo excede ${MAX_ANEXO_MB}MB.` }
    if (file.type && !ALLOWED_ANEXO_TYPES.includes(file.type)) return { ok: false, message: 'Tipo de arquivo nao permitido.' }

    const { user, rv } = await assertVisitaInScope(rvId)
    assertEditable(rv)

    const admin = createAdminClient()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${rvId}/${Date.now()}_${safeName}`
    const { error: uploadError } = await admin.storage.from(RV_ANEXOS_BUCKET).upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    })
    if (uploadError) return { ok: false, message: 'Falha no upload do anexo.' }

    const { error } = await admin.from('rv_anexo').insert({
      rv: rvId,
      nome: file.name,
      tipo: file.type || null,
      arquivo: path,
      uploaded_by: user.id,
      tamanho_mb: Math.round((file.size / (1024 * 1024)) * 100) / 100,
      created_by: user.id,
    })
    if (error) return { ok: false, message: 'Anexo enviado, mas falhou ao registrar.' }

    await recordRvAudit(rvId, user.id, 'anexo_upload', `Anexo ${file.name}`)
    revalidatePath(`/visitas/${rvId}`)
    return { ok: true, message: 'Anexo enviado.' }
  } catch (err) {
    return errorState(err, 'Erro ao enviar anexo.')
  }
}

export async function deleteRvAttachmentAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = DeleteRvAttachmentSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const admin = createAdminClient()
    const { data: row } = await admin.from('rv_anexo').select('id, rv, arquivo').eq('id', parsed.data.id).maybeSingle()
    if (!row) return { ok: false, message: 'Anexo nao encontrado.' }
    if (row.rv) {
      const { rv } = await assertVisitaInScope(row.rv)
      assertEditable(rv)
    }
    if (row.arquivo) await admin.storage.from(RV_ANEXOS_BUCKET).remove([row.arquivo])
    const { error } = await admin.from('rv_anexo').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel remover o anexo.' }
    if (row.rv) revalidatePath(`/visitas/${row.rv}`)
    return { ok: true, message: 'Anexo removido.' }
  } catch (err) {
    return errorState(err, 'Erro ao remover anexo.')
  }
}

export async function getRvAttachmentSignedUrlAction(_: VisitaActionState, formData: FormData): Promise<VisitaActionState> {
  try {
    const parsed = DeleteRvAttachmentSchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
    const admin = createAdminClient()
    const { data: row } = await admin.from('rv_anexo').select('rv, arquivo').eq('id', parsed.data.id).maybeSingle()
    if (!row?.arquivo) return { ok: false, message: 'Anexo nao encontrado.' }
    if (row.rv) await assertVisitaInScope(row.rv)
    const { data, error } = await admin.storage.from(RV_ANEXOS_BUCKET).createSignedUrl(row.arquivo, 60)
    if (error || !data) return { ok: false, message: 'Nao foi possivel gerar o link do anexo.' }
    return { ok: true, signedUrl: data.signedUrl }
  } catch (err) {
    return errorState(err, 'Erro ao abrir anexo.')
  }
}

export async function refreshVisitasAction(): Promise<VisitaActionState> {
  try {
    const user = await requireCurrentUser()
    if (!canManageVisitas(user.perfilNivel)) return { ok: false, message: 'Sem permissao.' }
    revalidatePath('/visitas')
    return { ok: true }
  } catch {
    return { ok: false, message: 'Erro ao atualizar.' }
  }
}
