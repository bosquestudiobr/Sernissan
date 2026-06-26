import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { PlacarFiltersSchema } from '@/lib/validations/placar'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'

export type PlacarParams = {
  page: number
  pageSize: number
  q?: string
  concessionariaId?: string
  finalizado?: 'true' | 'false'
  opcaoOrigem?: string
  opcaoAcumulado?: string
  sort?: string
  sortDir: 'asc' | 'desc'
}

export type PlacarRow = {
  id: string
  data: string | null
  finalizado: boolean | null
  ranking_atualizado: boolean | null
  opcao_origem: string | null
  opcao_acumulado: string | null
  concessionaria: string | null
  concessionariaNome: string | null
  empresa: string | null
  created_at: string
  indicadorCount: number
  indicadorIds: string[]
  origemLabel: string | null
  acumuladoLabel: string | null
}

export type PlacarDetail = PlacarRow & {
  indicadorIds: string[]
}

export type PlacarIndicatorOption = {
  id: string
  nome: string | null
  sigla: string | null
  ativo: boolean | null
}

export function parsePlacarParams(
  searchParams: Record<string, string | string[] | undefined>,
): PlacarParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const parsed = PlacarFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    concessionariaId: get('concessionariaId'),
    finalizado: get('finalizado'),
    opcaoOrigem: get('opcaoOrigem'),
    opcaoAcumulado: get('opcaoAcumulado'),
    sort: get('sort'),
    sortDir: get('sortDir'),
  })

  const data = parsed.success ? parsed.data : { page: 1, pageSize: 20, sortDir: 'asc' as const }

  return {
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    concessionariaId: data.concessionariaId,
    finalizado: data.finalizado,
    opcaoOrigem: data.opcaoOrigem,
    opcaoAcumulado: data.opcaoAcumulado,
    sort: data.sort,
    sortDir: data.sortDir ?? 'desc',
  }
}

type PlacarQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

async function getOpcoesApiLabels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_options')
    .select('db_value, label, metadata')
    .eq('option_set', 'opcoes_api')
    .eq('is_deleted', false)
  if (error) throw error

  const origem = new Map<string, string>()
  const acumulado = new Map<string, string>()
  for (const row of data ?? []) {
    const tipo = (row.metadata as { tipo?: string } | null)?.tipo
    const value = row.db_value ?? ''
    const label = row.label ?? value
    if (tipo === 'origem') origem.set(value, label)
    if (tipo === 'acumulado') acumulado.set(value, label)
  }
  return { origem, acumulado }
}

async function resolveConcessionariaIdsBySearch(q: string, empresaId?: string | null): Promise<string[]> {
  const supabase = await createClient()
  let query = supabase.from('concessionaria').select('id').ilike('nome', `%${q}%`)
  if (empresaId) query = query.eq('empresa', empresaId)
  const { data, error } = await query
  if (error) throw error
  return data?.map((row) => row.id) ?? []
}

async function getIndicatorIdsByPlacar(placarIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>()
  if (placarIds.length === 0) return map

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('placar_indicadores')
    .select('placar_id, indicadores_id')
    .in('placar_id', placarIds)
  if (error) throw error

  for (const row of data ?? []) {
    const current = map.get(row.placar_id) ?? []
    current.push(row.indicadores_id)
    map.set(row.placar_id, current)
  }
  return map
}

async function getIndicatorCounts(placarIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  if (placarIds.length === 0) return map

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('placar_indicadores')
    .select('placar_id')
    .in('placar_id', placarIds)
  if (error) throw error

  for (const row of data ?? []) {
    map.set(row.placar_id, (map.get(row.placar_id) ?? 0) + 1)
  }
  return map
}

async function getConcessionariaNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data, error } = await supabase.from('concessionaria').select('id, nome').in('id', ids)
  if (error) throw error
  for (const row of data ?? []) map.set(row.id, row.nome ?? row.id)
  return map
}

function applyPlacarScope(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  ctx: PlacarQueryContext,
) {
  const empresaFilter = ctx.empresaId ?? ctx.scopes.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)

  if (ctx.orgContext.concessionariaId) {
    query = query.eq('concessionaria', ctx.orgContext.concessionariaId)
  } else if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('concessionaria', ctx.scopes.concessionariaIds)
  }

  return query
}

export async function getPlacarFilterOptions(ctx: PlacarQueryContext) {
  const supabase = await createClient()
  const [{ origem, acumulado }, concessionariasResult] = await Promise.all([
    getOpcoesApiLabels(),
    (async () => {
      let query = supabase.from('concessionaria').select('id, nome').order('nome')
      const empresaFilter = ctx.empresaId ?? ctx.scopes.empresaId
      if (empresaFilter) query = query.eq('empresa', empresaFilter)
      if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
        query = query.in('id', ctx.scopes.concessionariaIds)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    })(),
  ])

  return {
    concessionarias: concessionariasResult.map((row) => ({ id: row.id, label: row.nome ?? row.id })),
    origens: [...origem.entries()].map(([value, label]) => ({ value, label })),
    acumulados: [...acumulado.entries()].map(([value, label]) => ({ value, label })),
  }
}

export async function listPlacares(
  params: PlacarParams,
  ctx: PlacarQueryContext,
): Promise<PaginatedResult<PlacarRow>> {
  const supabase = await createClient()
  const [{ origem, acumulado }, searchConcessionariaIds] = await Promise.all([
    getOpcoesApiLabels(),
    params.q ? resolveConcessionariaIdsBySearch(params.q, ctx.empresaId ?? ctx.scopes.empresaId) : Promise.resolve([] as string[]),
  ])

  let query = supabase
    .from('placar')
    .select(
      'id, data, finalizado, ranking_atualizado, opcao_origem, opcao_acumulado, concessionaria, empresa, created_at',
      { count: 'exact' },
    )

  query = applyPlacarScope(query, ctx)

  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.finalizado === 'true') query = query.eq('finalizado', true)
  if (params.finalizado === 'false') query = query.eq('finalizado', false)
  if (params.opcaoOrigem) query = query.eq('opcao_origem', params.opcaoOrigem)
  if (params.opcaoAcumulado) query = query.eq('opcao_acumulado', params.opcaoAcumulado)

  if (params.q) {
    if (searchConcessionariaIds.length === 0) {
      return {
        data: [],
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
        pageCount: 1,
      }
    }
    query = query.in('concessionaria', searchConcessionariaIds)
  }

  const sortCol = resolveSortColumn(params.sort, ['data', 'created_at', 'finalizado'], 'data')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const placarIds = rows.map((row) => row.id)
  const concessionariaIds = [...new Set(rows.map((row) => row.concessionaria).filter(Boolean) as string[])]
  const [counts, indicatorIdsMap, concessionariaNames] = await Promise.all([
    getIndicatorCounts(placarIds),
    getIndicatorIdsByPlacar(placarIds),
    getConcessionariaNames(concessionariaIds),
  ])

  const mapped: PlacarRow[] = rows.map((row) => ({
    id: row.id,
    data: row.data,
    finalizado: row.finalizado,
    ranking_atualizado: row.ranking_atualizado,
    opcao_origem: row.opcao_origem,
    opcao_acumulado: row.opcao_acumulado,
    concessionaria: row.concessionaria,
    concessionariaNome: row.concessionaria ? concessionariaNames.get(row.concessionaria) ?? null : null,
    empresa: row.empresa,
    created_at: row.created_at,
    indicadorCount: counts.get(row.id) ?? 0,
    indicadorIds: indicatorIdsMap.get(row.id) ?? [],
    origemLabel: row.opcao_origem ? origem.get(row.opcao_origem) ?? row.opcao_origem : null,
    acumuladoLabel: row.opcao_acumulado ? acumulado.get(row.opcao_acumulado) ?? row.opcao_acumulado : null,
  }))

  const total = count ?? 0
  return {
    data: mapped,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

export async function getPlacarById(id: string, ctx: PlacarQueryContext): Promise<PlacarDetail | null> {
  const supabase = await createClient()
  let query = supabase
    .from('placar')
    .select(
      'id, data, finalizado, ranking_atualizado, opcao_origem, opcao_acumulado, concessionaria, empresa, created_at',
    )
    .eq('id', id)

  query = applyPlacarScope(query, ctx)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (!data) return null

  const [{ origem, acumulado }, indicadores, concessionariaNames] = await Promise.all([
    getOpcoesApiLabels(),
    getPlacarIndicators(id),
    getConcessionariaNames(data.concessionaria ? [data.concessionaria] : []),
  ])

  return {
    id: data.id,
    data: data.data,
    finalizado: data.finalizado,
    ranking_atualizado: data.ranking_atualizado,
    opcao_origem: data.opcao_origem,
    opcao_acumulado: data.opcao_acumulado,
    concessionaria: data.concessionaria,
    concessionariaNome: data.concessionaria ? concessionariaNames.get(data.concessionaria) ?? null : null,
    empresa: data.empresa,
    created_at: data.created_at,
    indicadorCount: indicadores.length,
    origemLabel: data.opcao_origem ? origem.get(data.opcao_origem) ?? data.opcao_origem : null,
    acumuladoLabel: data.opcao_acumulado ? acumulado.get(data.opcao_acumulado) ?? data.opcao_acumulado : null,
    indicadorIds: indicadores.map((item) => item.id),
  }
}

export async function getPlacarIndicators(placarId: string): Promise<PlacarIndicatorOption[]> {
  const supabase = await createClient()
  const { data: links, error: linkError } = await supabase
    .from('placar_indicadores')
    .select('indicadores_id')
    .eq('placar_id', placarId)
  if (linkError) throw linkError

  const ids = links?.map((row) => row.indicadores_id) ?? []
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('indicadores')
    .select('id, nome, sigla, ativo')
    .in('id', ids)
    .order('ordem')
  if (error) throw error
  return data ?? []
}

export async function getAvailableIndicatorsForPlacar(concessionariaId: string): Promise<PlacarIndicatorOption[]> {
  const supabase = await createClient()

  const { data: links, error: linkError } = await supabase
    .from('concessionaria_indicadores')
    .select('indicadores_id')
    .eq('concessionaria_id', concessionariaId)
  if (linkError) throw linkError

  const linkedIds = links?.map((row) => row.indicadores_id) ?? []
  let query = supabase
    .from('indicadores')
    .select('id, nome, sigla, ativo')
    .eq('ativo', true)
    .order('nome')

  if (linkedIds.length > 0) {
    query = query.in('id', linkedIds)
  } else {
    query = query.eq('concessionaria', concessionariaId)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}



