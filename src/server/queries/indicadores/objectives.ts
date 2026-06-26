import { createClient } from '@/lib/supabase/server'
import { INDICATOR_REQUEST_TIPO } from '@/lib/validations/indicadores/objectives'
import { parseIndicatorRequestText } from '@/lib/indicadores/request-text'
import type { PaginatedResult } from '@/lib/types/pagination'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import type { UserScopes } from '@/lib/types/user'
import type { OrganizationalContextView } from '@/lib/types/user'
import { IndicatorObjectiveFiltersSchema } from '@/lib/validations/indicadores/objectives'
import {
  getIndicatorAreaFunctionMaps,
  getIndicatorOptionSets,
} from '@/server/queries/indicadores/library'

export type IndicatorObjectiveParams = {
  page: number
  pageSize: number
  q?: string
  areaId?: string
  funcaoId?: string
  ativo?: 'true' | 'false'
  sort?: string
  sortDir: 'asc' | 'desc'
}

export type IndicatorObjectiveRow = {
  id: string
  nome: string | null
  sigla: string | null
  pontos: number | null
  meta: number | null
  unidade: string | null
  unidadeLabel: string | null
  unidadeSimbolo: string | null
  ativo: boolean | null
  concessionaria: string | null
  areaLabels: string
  funcaoLabels: string
}

export type IndicatorRequestRow = {
  id: string
  nome: string | null
  sigla: string
  observacao: string
  created_at: string
  concessionaria: string | null
  user: string | null
  atendida: boolean | null
}

export function parseIndicatorObjectivesParams(
  searchParams: Record<string, string | string[] | undefined>,
): IndicatorObjectiveParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const parsed = IndicatorObjectiveFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    areaId: get('areaId'),
    funcaoId: get('funcaoId'),
    ativo: get('ativo'),
    sort: get('sort'),
    sortDir: get('sortDir'),
  })

  const data = parsed.success ? parsed.data : { page: 1, pageSize: 20, sortDir: 'asc' as const }

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

async function getConcessionariaIndicatorIds(concessionariaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('concessionaria_indicadores')
    .select('indicadores_id')
    .eq('concessionaria_id', concessionariaId)
  if (error) throw error
  return data?.map((row) => row.indicadores_id) ?? []
}

export async function getIndicatorObjectiveFilterOptions(empresaId?: string | null) {
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

export async function listIndicatorObjectives(
  params: IndicatorObjectiveParams,
  ctx: {
    scopes: UserScopes
    orgContext: OrganizationalContextView
    empresaId?: string | null
  },
): Promise<PaginatedResult<IndicatorObjectiveRow>> {
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

  const concessionariaId = ctx.orgContext.concessionariaId
  let contextIds: string[] | null = null
  if (concessionariaId) {
    const linkedIds = await getConcessionariaIndicatorIds(concessionariaId)
    contextIds = linkedIds
  }

  let query = supabase
    .from('indicadores')
    .select('id, nome, sigla, pontos, meta, unidade, ativo, concessionaria', { count: 'exact' })

  const empresaFilter = ctx.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)

  if (concessionariaId) {
    if (contextIds && contextIds.length > 0) {
      query = query.or(`concessionaria.eq.${concessionariaId},id.in.(${contextIds.join(',')})`)
    } else {
      query = query.eq('concessionaria', concessionariaId)
    }
  }

  if (filteredIds) query = query.in('id', filteredIds)
  if (params.ativo === 'true') query = query.eq('ativo', true)
  if (params.ativo === 'false') query = query.eq('ativo', false)
  if (params.q) {
    const pattern = `%${params.q}%`
    query = query.or(`nome.ilike.${pattern},sigla.ilike.${pattern}`)
  }

  const sortCol = resolveSortColumn(params.sort, ['nome', 'sigla', 'meta', 'pontos'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const { areaLabels, funcaoLabels } = await getIndicatorAreaFunctionMaps(rows.map((row) => row.id))

  const enriched: IndicatorObjectiveRow[] = rows.map((row) => {
    const unidadeOpt = row.unidade ? unidadeByValue.get(row.unidade) : undefined
    return {
      ...row,
      unidadeLabel: unidadeOpt?.label ?? row.unidade,
      unidadeSimbolo: unidadeOpt?.simbolo ?? '',
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

export async function getIndicatorObjectiveById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('id, nome, sigla, pontos, meta, unidade, ativo, concessionaria')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getPendingIndicatorRequestsCount(concessionariaId?: string | null) {
  const supabase = await createClient()
  let query = supabase
    .from('solicitacoes')
    .select('id', { count: 'exact', head: true })
    .eq('tipo', INDICATOR_REQUEST_TIPO)
    .is('atendida', null)
  if (concessionariaId) query = query.eq('concessionaria', concessionariaId)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

export async function listIndicatorRequests(concessionariaId?: string | null, pendingOnly = true) {
  const supabase = await createClient()
  let query = supabase
    .from('solicitacoes')
    .select('id, nome, text, created_at, concessionaria, user, atendida')
    .eq('tipo', INDICATOR_REQUEST_TIPO)
    .order('created_at', { ascending: false })
    .limit(50)

  if (concessionariaId) query = query.eq('concessionaria', concessionariaId)
  if (pendingOnly) query = query.is('atendida', null)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((row): IndicatorRequestRow => {
    const parsed = parseIndicatorRequestText(row.text)
    return {
      id: row.id,
      nome: row.nome,
      sigla: parsed.sigla,
      observacao: parsed.observacao,
      created_at: row.created_at,
      concessionaria: row.concessionaria,
      user: row.user,
      atendida: row.atendida,
    }
  })
}

export async function getAvailableLibraryIndicatorsForContext(
  concessionariaId?: string | null,
  empresaId?: string | null,
) {
  const supabase = await createClient()
  let query = supabase
    .from('indicadores')
    .select('id, nome, sigla')
    .eq('ativo', true)
    .order('nome')
    .limit(100)

  if (empresaId) query = query.eq('empresa', empresaId)
  if (concessionariaId) {
    const linked = await getConcessionariaIndicatorIds(concessionariaId)
    if (linked.length > 0) query = query.not('id', 'in', `(${linked.join(',')})`)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
