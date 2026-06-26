import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import type { ScopeContext } from '@/server/queries/admin/lists'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { IndicatorFiltersSchema } from '@/lib/validations/indicadores/library'

export type IndicatorLibraryParams = {
  page: number
  pageSize: number
  q?: string
  areaId?: string
  funcaoId?: string
  ativo?: 'true' | 'false'
  sort?: string
  sortDir: 'asc' | 'desc'
}

export type IndicatorLibraryRow = {
  id: string
  nome: string | null
  sigla: string | null
  api_id: string | null
  ordem: number | null
  pontos: number | null
  meta: number | null
  unidade: string | null
  unidadeLabel: string | null
  unidadeSimbolo: string | null
  importancia: string | null
  ativo: boolean | null
  empresa: string | null
  created_at: string
  areaIds: string[]
  funcaoIds: string[]
  areaLabels: string
  funcaoLabels: string
}

export function parseIndicatorLibraryParams(
  searchParams: Record<string, string | string[] | undefined>,
): IndicatorLibraryParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const parsed = IndicatorFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    areaId: get('areaId'),
    funcaoId: get('funcaoId'),
    ativo: get('ativo'),
    sort: get('sort'),
    sortDir: get('sortDir'),
  })

  const data = parsed.success
    ? parsed.data
    : { page: 1, pageSize: 20, sortDir: 'asc' as const }

  return {
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    areaId: data.areaId,
    funcaoId: data.funcaoId,
    ativo: data.ativo,
    sort: data.sort,
    sortDir: data.sortDir ?? 'asc',
  }
}

async function filterIdsByArea(areaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores_areas')
    .select('indicadores_id')
    .eq('setor_concessionaria_id', areaId)
  if (error) throw error
  return data?.map((row) => row.indicadores_id) ?? []
}

async function filterIdsByFuncao(funcaoId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores_funcoes')
    .select('indicadores_id')
    .eq('funcao_colaborador_id', funcaoId)
  if (error) throw error
  return data?.map((row) => row.indicadores_id) ?? []
}

export async function getIndicatorOptionSets() {
  const supabase = await createClient()
  const [{ data: unidades }, { data: importancias }] = await Promise.all([
    supabase
      .from('app_options')
      .select('db_value, label, metadata')
      .eq('option_set', 'unidade')
      .eq('is_deleted', false)
      .order('sort_order'),
    supabase
      .from('app_options')
      .select('db_value, label, metadata')
      .eq('option_set', 'importancias')
      .eq('is_deleted', false)
      .order('sort_order'),
  ])

  return {
    unidades: (unidades ?? []).map((row) => ({
      value: row.db_value ?? '',
      label: row.label ?? row.db_value ?? '',
      simbolo: (row.metadata as { simbolo?: string } | null)?.simbolo ?? '',
    })),
    importancias: (importancias ?? []).map((row) => ({
      value: row.db_value ?? '',
      label: row.label ?? row.db_value ?? '',
    })),
  }
}

export async function getIndicatorLibraryFilterOptions(empresaId?: string | null) {
  const supabase = await createClient()
  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  let funcoesQuery = supabase.from('funcao_colaborador').select('id, nome').order('nome')
  if (empresaId) {
    areasQuery = areasQuery.eq('empresa', empresaId)
    funcoesQuery = funcoesQuery.eq('empresa', empresaId)
  }
  const [{ data: areas }, { data: funcoes }] = await Promise.all([areasQuery, funcoesQuery])
  return {
    areas: (areas ?? []).map((row) => ({ id: row.id, label: row.nome ?? row.id })),
    funcoes: (funcoes ?? []).map((row) => ({ id: row.id, label: row.nome ?? row.id })),
  }
}

export async function getIndicatorAreaFunctionMaps(indicatorIds: string[]) {
  if (indicatorIds.length === 0) {
    return {
      areaMap: {} as Record<string, string[]>,
      funcaoMap: {} as Record<string, string[]>,
      areaLabels: {} as Record<string, string>,
      funcaoLabels: {} as Record<string, string>,
    }
  }

  const supabase = await createClient()
  const [{ data: areaLinks }, { data: funcaoLinks }, { data: areas }, { data: funcoes }] =
    await Promise.all([
      supabase
        .from('indicadores_areas')
        .select('indicadores_id, setor_concessionaria_id')
        .in('indicadores_id', indicatorIds),
      supabase
        .from('indicadores_funcoes')
        .select('indicadores_id, funcao_colaborador_id')
        .in('indicadores_id', indicatorIds),
      supabase.from('setor_concessionaria').select('id, nome'),
      supabase.from('funcao_colaborador').select('id, nome'),
    ])

  const areaNameById = new Map((areas ?? []).map((row) => [row.id, row.nome ?? row.id]))
  const funcaoNameById = new Map((funcoes ?? []).map((row) => [row.id, row.nome ?? row.id]))

  const areaMap: Record<string, string[]> = {}
  const funcaoMap: Record<string, string[]> = {}

  areaLinks?.forEach((row) => {
    if (!areaMap[row.indicadores_id]) areaMap[row.indicadores_id] = []
    areaMap[row.indicadores_id].push(row.setor_concessionaria_id)
  })

  funcaoLinks?.forEach((row) => {
    if (!funcaoMap[row.indicadores_id]) funcaoMap[row.indicadores_id] = []
    funcaoMap[row.indicadores_id].push(row.funcao_colaborador_id)
  })

  const areaLabels: Record<string, string> = {}
  const funcaoLabels: Record<string, string> = {}

  indicatorIds.forEach((id) => {
    areaLabels[id] = (areaMap[id] ?? []).map((areaId) => areaNameById.get(areaId) ?? areaId).join(', ')
    funcaoLabels[id] = (funcaoMap[id] ?? []).map((funcaoId) => funcaoNameById.get(funcaoId) ?? funcaoId).join(', ')
  })

  return { areaMap, funcaoMap, areaLabels, funcaoLabels }
}

export async function listIndicatorLibrary(
  params: IndicatorLibraryParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<IndicatorLibraryRow>> {
  const supabase = await createClient()
  const optionSets = await getIndicatorOptionSets()
  const unidadeByValue = new Map(optionSets.unidades.map((u) => [u.value, u]))

  let filteredIds: string[] | null = null

  if (params.areaId) {
    filteredIds = await filterIdsByArea(params.areaId)
    if (filteredIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 1 }
    }
  }

  if (params.funcaoId) {
    const funcaoIds = await filterIdsByFuncao(params.funcaoId)
    if (funcaoIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 1 }
    }
    filteredIds = filteredIds ? filteredIds.filter((id) => funcaoIds.includes(id)) : funcaoIds
    if (filteredIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 1 }
    }
  }

  let query = supabase
    .from('indicadores')
    .select(
      'id, nome, sigla, api_id, ordem, pontos, meta, unidade, importancia, ativo, empresa, created_at',
      { count: 'exact' },
    )

  const empresaFilter = ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('concessionaria', ctx.scopes.concessionariaIds)
  }
  if (filteredIds) query = query.in('id', filteredIds)
  if (params.ativo === 'true') query = query.eq('ativo', true)
  if (params.ativo === 'false') query = query.eq('ativo', false)
  if (params.q) {
    const pattern = `%${params.q}%`
    query = query.or(`nome.ilike.${pattern},sigla.ilike.${pattern}`)
  }

  const sortCol = resolveSortColumn(params.sort, ['ordem', 'nome', 'sigla', 'created_at'], 'ordem')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc', nullsFirst: false })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const { areaMap, funcaoMap, areaLabels, funcaoLabels } = await getIndicatorAreaFunctionMaps(
    rows.map((row) => row.id),
  )

  const enriched: IndicatorLibraryRow[] = rows.map((row) => {
    const unidadeOpt = row.unidade ? unidadeByValue.get(row.unidade) : undefined
    return {
      ...row,
      unidadeLabel: unidadeOpt?.label ?? row.unidade,
      unidadeSimbolo: unidadeOpt?.simbolo ?? '',
      areaIds: areaMap[row.id] ?? [],
      funcaoIds: funcaoMap[row.id] ?? [],
      areaLabels: areaLabels[row.id] ?? '',
      funcaoLabels: funcaoLabels[row.id] ?? '',
    }
  })

  const total = count ?? 0
  return {
    data: enriched,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

export async function getIndicatorById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select(
      'id, nome, sigla, api_id, ordem, pontos, meta, unidade, importancia, ativo, empresa, created_at',
    )
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const { areaMap, funcaoMap } = await getIndicatorAreaFunctionMaps([id])
  return {
    ...data,
    areaIds: areaMap[id] ?? [],
    funcaoIds: funcaoMap[id] ?? [],
  }
}
