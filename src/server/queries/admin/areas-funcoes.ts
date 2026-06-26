import { createClient } from '@/lib/supabase/server'
import type { ListParams, PaginatedResult } from '@/lib/types/pagination'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import type { ScopeContext } from '@/server/queries/admin/lists'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySearch(query: any, search: string | undefined, columns: string[]) {
  if (!search) return query
  const pattern = `%${search}%`
  return query.or(columns.map((col) => `${col}.ilike.${pattern}`).join(','))
}

export async function listAreas(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<{ id: string; nome: string | null; empresa: string | null; created_at: string }>> {
  const supabase = await createClient()
  let query = supabase
    .from('setor_concessionaria')
    .select('id, nome, empresa, created_at', { count: 'exact' })

  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  query = applySearch(query, params.search, ['nome'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}

export async function listFuncoes(
  params: ListParams,
  ctx: ScopeContext,
): Promise<
  PaginatedResult<{
    id: string
    nome: string | null
    empresa: string | null
    area: string | null
    chave: boolean | null
    lideranca: boolean | null
    created_at: string
  }>
> {
  const supabase = await createClient()
  let query = supabase
    .from('funcao_colaborador')
    .select('id, nome, empresa, area, chave, lideranca, created_at', { count: 'exact' })

  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.area) query = query.eq('area', params.filters.area)
  query = applySearch(query, params.search, ['nome'])
  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  const total = count ?? 0
  return { data: data ?? [], page: params.page, pageSize: params.pageSize, total, pageCount: buildPageCount(total, params.pageSize) }
}
