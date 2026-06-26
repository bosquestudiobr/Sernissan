import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { VisitasFiltersSchema } from '@/lib/validations/visitas'
import { deriveRvStatus, type RvStatus } from '@/lib/rv/status'
import { buildPageCount, rangeFromPage } from '@/server/queries/list-helpers'

export type VisitasParams = {
  page: number
  pageSize: number
  q?: string
  status?: RvStatus
  concessionariaId?: string
  consultorId?: string
  from?: string
  to?: string
}

export type VisitaRow = {
  id: string
  dataVisita: string | null
  dealerId: string | null
  dealerNome: string | null
  consultorNome: string | null
  modalidadeId: string | null
  modalidadeNome: string | null
  focoId: string | null
  relato: string | null
  pontosDestaque: string | null
  avaliacaoConsultor: string | null
  status: RvStatus
  assinadoEm: string | null
  hasToken: boolean
  tokenExpiracao: string | null
  created_at: string
}

export type VisitaDetail = {
  id: string
  dataVisita: string | null
  horaInicio: string | null
  horaFim: string | null
  dealerId: string | null
  dealerNome: string | null
  consultorId: string | null
  consultorNome: string | null
  modalidadeId: string | null
  modalidadeNome: string | null
  focoId: string | null
  focoNome: string | null
  relato: string | null
  pontosDestaque: string | null
  avaliacaoConsultor: string | null
  status: RvStatus
  assinadoEm: string | null
  enviadoEm: string | null
  tokenExpiracao: string | null
  hasToken: boolean
  bloqueadoEdicao: boolean
  created_at: string
}

export type ParticipanteRow = { id: string; nome: string | null; cargo: string | null; ordem: number | null }
export type ProximoPassoRow = { id: string; acao: string | null; responsavel: string | null; prazo: string | null; ordem: number | null; concluido: boolean | null }
export type AnexoRow = { id: string; nome: string | null; tipo: string | null; arquivo: string | null; tamanhoMb: number | null; created_at: string }

export type VisitasQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

export function parseVisitasParams(searchParams: Record<string, string | string[] | undefined>): VisitasParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const parsed = VisitasFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    status: get('status'),
    concessionariaId: get('concessionariaId'),
    consultorId: get('consultorId'),
    from: get('from'),
    to: get('to'),
  })
  const data = parsed.success ? parsed.data : { page: 1, pageSize: 20 }
  return {
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    status: data.status,
    concessionariaId: data.concessionariaId,
    consultorId: data.consultorId,
    from: data.from,
    to: data.to,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyScope(query: any, ctx: VisitasQueryContext) {
  if (ctx.orgContext.concessionariaId) {
    query = query.eq('dealer', ctx.orgContext.concessionariaId)
  } else if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('dealer', ctx.scopes.concessionariaIds)
  }
  return query
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyStatusFilter(query: any, status: RvStatus | undefined, nowIso: string) {
  if (status === 'assinada') return query.not('assinado_em', 'is', null)
  if (status === 'expirada') return query.is('assinado_em', null).lt('data_expiracao_token', nowIso)
  if (status === 'enviada') return query.is('assinado_em', null).not('enviado_em', 'is', null)
  if (status === 'rascunho') return query.is('assinado_em', null).is('enviado_em', null)
  return query
}

async function resolveConcessionariaNames(ids: string[]) {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase.from('concessionaria').select('id, nome').in('id', ids)
  for (const r of data ?? []) map.set(r.id, r.nome ?? r.id)
  return map
}

async function resolveProfileNames(ids: string[]) {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, nome').in('id', ids)
  for (const r of data ?? []) map.set(r.id, r.nome ?? r.id)
  return map
}

async function resolveModalidadeNames(ids: string[]) {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase.from('rv_modalidade').select('id, nome').in('id', ids)
  for (const r of data ?? []) map.set(r.id, r.nome ?? r.id)
  return map
}

export async function listVisitas(params: VisitasParams, ctx: VisitasQueryContext): Promise<PaginatedResult<VisitaRow>> {
  const supabase = await createClient()
  const nowIso = new Date().toISOString()
  let query = supabase
    .from('rv')
    .select('id, data_visita, dealer, consultor, modalidade, foco, relato, pontos_destaque, avaliacao_consultor, assinado_em, enviado_em, token_ciencia, data_expiracao_token, created_at', { count: 'exact' })

  query = applyScope(query, ctx)
  query = applyStatusFilter(query, params.status, nowIso)
  if (params.concessionariaId) query = query.eq('dealer', params.concessionariaId)
  if (params.consultorId) query = query.eq('consultor', params.consultorId)
  if (params.from) query = query.gte('data_visita', params.from)
  if (params.to) query = query.lte('data_visita', params.to)
  if (params.q) query = query.ilike('relato', `%${params.q}%`)
  query = query.order('data_visita', { ascending: false, nullsFirst: false })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const dealerIds = [...new Set(rows.map((r) => r.dealer).filter(Boolean) as string[])]
  const consultorIds = [...new Set(rows.map((r) => r.consultor).filter(Boolean) as string[])]
  const modalidadeIds = [...new Set(rows.map((r) => r.modalidade).filter(Boolean) as string[])]
  const [dealerNames, consultorNames, modalidadeNames] = await Promise.all([
    resolveConcessionariaNames(dealerIds),
    resolveProfileNames(consultorIds),
    resolveModalidadeNames(modalidadeIds),
  ])

  const mapped: VisitaRow[] = rows.map((r) => ({
    id: r.id,
    dataVisita: r.data_visita,
    dealerId: r.dealer,
    dealerNome: r.dealer ? dealerNames.get(r.dealer) ?? null : null,
    consultorNome: r.consultor ? consultorNames.get(r.consultor) ?? null : null,
    modalidadeId: r.modalidade,
    modalidadeNome: r.modalidade ? modalidadeNames.get(r.modalidade) ?? null : null,
    focoId: r.foco,
    relato: r.relato,
    pontosDestaque: r.pontos_destaque,
    avaliacaoConsultor: r.avaliacao_consultor,
    status: deriveRvStatus({ assinadoEm: r.assinado_em, enviadoEm: r.enviado_em, dataExpiracaoToken: r.data_expiracao_token }),
    assinadoEm: r.assinado_em,
    hasToken: Boolean(r.token_ciencia),
    tokenExpiracao: r.data_expiracao_token,
    created_at: r.created_at,
  }))

  const total = count ?? 0
  return { data: mapped, page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function getVisitaById(id: string, ctx: VisitasQueryContext): Promise<VisitaDetail | null> {
  const supabase = await createClient()
  let query = supabase
    .from('rv')
    .select('id, data_visita, hora_inicio, hora_fim, dealer, consultor, modalidade, foco, relato, pontos_destaque, avaliacao_consultor, assinado_em, enviado_em, data_expiracao_token, token_ciencia, bloqueado_edicao, created_at')
    .eq('id', id)
  query = applyScope(query, ctx)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (!data) return null

  const [dealerNames, consultorNames, modalidadeNames, focoRow] = await Promise.all([
    resolveConcessionariaNames(data.dealer ? [data.dealer] : []),
    resolveProfileNames(data.consultor ? [data.consultor] : []),
    resolveModalidadeNames(data.modalidade ? [data.modalidade] : []),
    data.foco ? supabase.from('rv_foco').select('nome').eq('id', data.foco).maybeSingle() : Promise.resolve({ data: null }),
  ])

  return {
    id: data.id,
    dataVisita: data.data_visita,
    horaInicio: data.hora_inicio,
    horaFim: data.hora_fim,
    dealerId: data.dealer,
    dealerNome: data.dealer ? dealerNames.get(data.dealer) ?? null : null,
    consultorId: data.consultor,
    consultorNome: data.consultor ? consultorNames.get(data.consultor) ?? null : null,
    modalidadeId: data.modalidade,
    modalidadeNome: data.modalidade ? modalidadeNames.get(data.modalidade) ?? null : null,
    focoId: data.foco,
    focoNome: (focoRow.data as { nome?: string } | null)?.nome ?? null,
    relato: data.relato,
    pontosDestaque: data.pontos_destaque,
    avaliacaoConsultor: data.avaliacao_consultor,
    status: deriveRvStatus({ assinadoEm: data.assinado_em, enviadoEm: data.enviado_em, dataExpiracaoToken: data.data_expiracao_token }),
    assinadoEm: data.assinado_em,
    enviadoEm: data.enviado_em,
    tokenExpiracao: data.data_expiracao_token,
    hasToken: Boolean(data.token_ciencia),
    bloqueadoEdicao: data.bloqueado_edicao ?? false,
    created_at: data.created_at,
  }
}

export async function getVisitasFilterOptions(ctx: VisitasQueryContext) {
  const supabase = await createClient()
  const empresaId = ctx.empresaId ?? ctx.scopes.empresaId
  let concQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) concQuery = concQuery.eq('empresa', empresaId)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    concQuery = concQuery.in('id', ctx.scopes.concessionariaIds)
  }
  const [{ data: concs }, { data: modalidades }, { data: focos }] = await Promise.all([
    concQuery,
    supabase.from('rv_modalidade').select('id, nome').eq('ativo_bool', true).order('ordem'),
    supabase.from('rv_foco').select('id, nome').eq('ativo_bool', true).order('ordem'),
  ])
  return {
    concessionarias: (concs ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
    modalidades: (modalidades ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
    focos: (focos ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
  }
}

export async function getVisitaParticipants(rvId: string): Promise<ParticipanteRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rv_participante')
    .select('id, nome, cargo, ordem')
    .eq('rv', rvId)
    .order('ordem', { ascending: true, nullsFirst: false })
  if (error) throw error
  return (data ?? []).map((r) => ({ id: r.id, nome: r.nome, cargo: r.cargo, ordem: r.ordem }))
}

export async function getVisitaNextSteps(rvId: string): Promise<ProximoPassoRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rv_proximo_passo')
    .select('id, acao, responsavel, prazo, ordem, concluido_bool')
    .eq('rv', rvId)
    .order('ordem', { ascending: true, nullsFirst: false })
  if (error) throw error
  return (data ?? []).map((r) => ({ id: r.id, acao: r.acao, responsavel: r.responsavel, prazo: r.prazo, ordem: r.ordem, concluido: r.concluido_bool }))
}

export async function getVisitaAttachments(rvId: string): Promise<AnexoRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rv_anexo')
    .select('id, nome, tipo, arquivo, tamanho_mb, created_at')
    .eq('rv', rvId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({ id: r.id, nome: r.nome, tipo: r.tipo, arquivo: r.arquivo, tamanhoMb: r.tamanho_mb, created_at: r.created_at }))
}


