import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import {
  INCLUSION_TIPO,
  REGISTRATION_TIPO,
  SolicitacoesFiltersSchema,
} from '@/lib/validations/solicitacoes'
import { buildPageCount, rangeFromPage } from '@/server/queries/list-helpers'

export type SolicitacoesParams = {
  pageCad: number
  pageInc: number
  pageSize: number
  q?: string
  status?: 'pendente' | 'aprovada' | 'rejeitada'
  tipo?: string
  concessionariaId?: string
}

export type RegistrationRequestRow = {
  id: string
  requestNome: string | null
  profileNome: string | null
  foto: string | null
  areaNome: string | null
  funcaoNome: string | null
  concessionariaNome: string | null
  atendida: boolean | null
  created_at: string
  userId: string | null
}

export type InclusionRequestRow = {
  id: string
  usuarioNome: string | null
  concessionariaNome: string | null
  tipoInclusao: string | null
  atendida: boolean | null
  created_at: string
  userId: string | null
}

export type RequestDetail = {
  id: string
  nome: string | null
  text: string | null
  tipo: string | null
  atendida: boolean | null
  userId: string | null
  colaboradorId: string | null
  concessionariaId: string | null
  concessionariaNome: string | null
  usuarioNome: string | null
  created_at: string
}

export type SolicitacoesQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

export function parseSolicitacoesParams(
  searchParams: Record<string, string | string[] | undefined>,
): SolicitacoesParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const parsed = SolicitacoesFiltersSchema.safeParse({
    pageCad: get('pageCad'),
    pageInc: get('pageInc'),
    pageSize: get('pageSize'),
    q: get('q'),
    status: get('status'),
    tipo: get('tipo'),
    concessionariaId: get('concessionariaId'),
  })
  const data = parsed.success ? parsed.data : { pageCad: 1, pageInc: 1, pageSize: 20 }
  return {
    pageCad: data.pageCad ?? 1,
    pageInc: data.pageInc ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    status: data.status,
    tipo: data.tipo,
    concessionariaId: data.concessionariaId,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyScope(query: any, ctx: SolicitacoesQueryContext) {
  if (ctx.orgContext.concessionariaId) {
    query = query.eq('concessionaria', ctx.orgContext.concessionariaId)
  } else if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('concessionaria', ctx.scopes.concessionariaIds)
  }
  return query
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyStatus(query: any, status?: 'pendente' | 'aprovada' | 'rejeitada') {
  if (status === 'pendente') return query.is('atendida', null)
  if (status === 'aprovada') return query.eq('atendida', true)
  if (status === 'rejeitada') return query.eq('atendida', false)
  return query
}

async function resolveProfileMap(userIds: string[]) {
  const map = new Map<string, { nome: string | null; foto: string | null; area: string | null; funcao: string | null; concessionaria: string | null }>()
  if (userIds.length === 0) return map
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, foto, area, funcao, concessionaria')
    .in('id', userIds)
  if (error) throw error
  for (const r of data ?? []) map.set(r.id, { nome: r.nome, foto: r.foto, area: r.area, funcao: r.funcao, concessionaria: r.concessionaria })
  return map
}

async function resolveNames(table: 'setor_concessionaria' | 'funcao_colaborador' | 'concessionaria', ids: string[]) {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data, error } = await supabase.from(table).select('id, nome').in('id', ids)
  if (error) throw error
  for (const r of data ?? []) map.set(r.id, r.nome ?? r.id)
  return map
}

export async function listRegistrationRequests(
  params: SolicitacoesParams,
  ctx: SolicitacoesQueryContext,
): Promise<PaginatedResult<RegistrationRequestRow>> {
  const supabase = await createClient()
  let query = supabase
    .from('solicitacoes')
    .select('id, nome, text, user, atendida, concessionaria, created_at', { count: 'exact' })
    .eq('tipo', REGISTRATION_TIPO)
  query = applyScope(query, ctx)
  query = applyStatus(query, params.status)
  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.q) query = query.ilike('nome', `%${params.q}%`)
  query = query.order('created_at', { ascending: false })

  const { from, to } = rangeFromPage(params.pageCad, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const userIds = [...new Set(rows.map((r) => r.user).filter(Boolean) as string[])]
  const profileMap = await resolveProfileMap(userIds)
  const areaIds = [...new Set([...profileMap.values()].map((p) => p.area).filter(Boolean) as string[])]
  const funcaoIds = [...new Set([...profileMap.values()].map((p) => p.funcao).filter(Boolean) as string[])]
  const concIds = [...new Set(rows.map((r) => r.concessionaria).filter(Boolean) as string[])]
  const [areaNames, funcaoNames, concNames] = await Promise.all([
    resolveNames('setor_concessionaria', areaIds),
    resolveNames('funcao_colaborador', funcaoIds),
    resolveNames('concessionaria', concIds),
  ])

  const mapped: RegistrationRequestRow[] = rows.map((r) => {
    const profile = r.user ? profileMap.get(r.user) : undefined
    return {
      id: r.id,
      requestNome: r.nome,
      profileNome: profile?.nome ?? null,
      foto: profile?.foto ?? null,
      areaNome: profile?.area ? areaNames.get(profile.area) ?? null : null,
      funcaoNome: profile?.funcao ? funcaoNames.get(profile.funcao) ?? null : null,
      concessionariaNome: r.concessionaria ? concNames.get(r.concessionaria) ?? null : null,
      atendida: r.atendida,
      created_at: r.created_at,
      userId: r.user,
    }
  })

  const total = count ?? 0
  return { data: mapped, page: params.pageCad, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listInclusionRequests(
  params: SolicitacoesParams,
  ctx: SolicitacoesQueryContext,
): Promise<PaginatedResult<InclusionRequestRow>> {
  const supabase = await createClient()
  let query = supabase
    .from('solicitacoes')
    .select('id, nome, text, user, colaborador_2, atendida, concessionaria, tipo, created_at', { count: 'exact' })
    .eq('tipo', INCLUSION_TIPO)
  query = applyScope(query, ctx)
  query = applyStatus(query, params.status)
  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.q) query = query.ilike('nome', `%${params.q}%`)
  query = query.order('created_at', { ascending: false })

  const { from, to } = rangeFromPage(params.pageInc, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const userIds = [...new Set(rows.flatMap((r) => [r.user, r.colaborador_2]).filter(Boolean) as string[])]
  const profileMap = await resolveProfileMap(userIds)
  const concIds = [...new Set(rows.map((r) => r.concessionaria).filter(Boolean) as string[])]
  const concNames = await resolveNames('concessionaria', concIds)

  const mapped: InclusionRequestRow[] = rows.map((r) => {
    const targetId = r.colaborador_2 ?? r.user
    return {
      id: r.id,
      usuarioNome: targetId ? profileMap.get(targetId)?.nome ?? r.nome ?? null : r.nome ?? null,
      concessionariaNome: r.concessionaria ? concNames.get(r.concessionaria) ?? null : null,
      tipoInclusao: r.nome ?? r.tipo,
      atendida: r.atendida,
      created_at: r.created_at,
      userId: targetId,
    }
  })

  const total = count ?? 0
  return { data: mapped, page: params.pageInc, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function getRequestById(id: string): Promise<RequestDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('id, nome, text, tipo, atendida, user, colaborador_2, concessionaria, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const targetId = data.colaborador_2 ?? data.user
  const [profileMap, concNames] = await Promise.all([
    resolveProfileMap(targetId ? [targetId] : []),
    resolveNames('concessionaria', data.concessionaria ? [data.concessionaria] : []),
  ])

  return {
    id: data.id,
    nome: data.nome,
    text: data.text,
    tipo: data.tipo,
    atendida: data.atendida,
    userId: data.user,
    colaboradorId: data.colaborador_2,
    concessionariaId: data.concessionaria,
    concessionariaNome: data.concessionaria ? concNames.get(data.concessionaria) ?? null : null,
    usuarioNome: targetId ? profileMap.get(targetId)?.nome ?? data.nome ?? null : data.nome ?? null,
    created_at: data.created_at,
  }
}

export async function getSolicitacoesFilterOptions(ctx: SolicitacoesQueryContext) {
  const supabase = await createClient()
  let query = supabase.from('concessionaria').select('id, nome').order('nome')
  const empresaId = ctx.empresaId ?? ctx.scopes.empresaId
  if (empresaId) query = query.eq('empresa', empresaId)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('id', ctx.scopes.concessionariaIds)
  }
  const { data, error } = await query
  if (error) throw error
  return { concessionarias: (data ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })) }
}

export async function getPendingSolicitacoesCount(ctx: SolicitacoesQueryContext): Promise<number> {
  const supabase = await createClient()
  let query = supabase
    .from('solicitacoes')
    .select('id', { count: 'exact', head: true })
    .is('atendida', null)
    .in('tipo', [REGISTRATION_TIPO, INCLUSION_TIPO])
  query = applyScope(query, ctx)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}
