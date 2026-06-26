import { createClient } from '@/lib/supabase/server'
import type { CurrentUserView, UserScopes } from '@/lib/types/user'
import type { ListParams, PaginatedResult } from '@/lib/types/pagination'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'

export type ScopeContext = {
  user: CurrentUserView
  scopes: UserScopes
  empresaId?: string | null
  setorId?: string | null
  grupoId?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySearch(query: any, search: string | undefined, columns: string[]) {
  if (!search) return query
  const pattern = `%${search}%`
  return query.or(columns.map((col) => `${col}.ilike.${pattern}`).join(','))
}

export async function listEmpresas(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; email: string | null; fone: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('empresa').select('id, nome, email, fone, cor_principal, cor_secundaria, created_at', { count: 'exact' })
  if (ctx.user.empresaId && !isHighPrivilegeScope(ctx.scopes.perfilNivel)) query = query.eq('id', ctx.user.empresaId)
  query = applySearch(query, params.search, ['nome', 'email'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listPaises(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; empresa: string | null; id_2: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('pais').select('id, nome, empresa, id_2, created_at', { count: 'exact' })
  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  query = applySearch(query, params.search, ['nome', 'id_2'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listDivisoes(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; empresa: string | null; pais: string | null; id_2: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('divisao').select('id, nome, empresa, pais, id_2, created_at', { count: 'exact' })
  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.pais) query = query.eq('pais', params.filters.pais)
  query = applySearch(query, params.search, ['nome', 'id_2'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listSetores(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; empresa: string | null; divisao: string | null; id_2: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('setores').select('id, nome, empresa, divisao, id_2, created_at', { count: 'exact' })
  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.divisao) query = query.eq('divisao', params.filters.divisao)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.setorIds.length > 0) query = query.in('id', ctx.scopes.setorIds)
  if (ctx.setorId) query = query.eq('id', ctx.setorId)
  query = applySearch(query, params.search, ['nome', 'id_2'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listGrupos(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; empresa: string | null; setor: string | null; id_2: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('grupo').select('id, nome, empresa, setor, id_2, created_at', { count: 'exact' })
  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.setor) query = query.eq('setor', params.filters.setor)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.grupoIds.length > 0) query = query.in('id', ctx.scopes.grupoIds)
  if (ctx.grupoId) query = query.eq('id', ctx.grupoId)
  query = applySearch(query, params.search, ['nome', 'id_2'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listConcessionarias(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; bir: string | null; uf: string | null; municipio: string | null; grupo: string | null; setor: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase.from('concessionaria').select('id, nome, bir, uf, municipio, grupo, setor, created_at', { count: 'exact' })
  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.grupo) query = query.eq('grupo', params.filters.grupo)
  if (params.filters.setor) query = query.eq('setor', params.filters.setor)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) query = query.in('id', ctx.scopes.concessionariaIds)
  if (ctx.grupoId) query = query.eq('grupo', ctx.grupoId)
  query = applySearch(query, params.search, ['nome', 'bir', 'municipio'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}
