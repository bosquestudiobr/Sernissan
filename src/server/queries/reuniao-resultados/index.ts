import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { deriveXrReuniaoStatus, type XrReuniaoStatus } from '@/lib/xr/status'
import { ReuniaoResultadosFiltersSchema } from '@/lib/validations/reuniao-resultados'
import { buildPageCount, rangeFromPage } from '@/server/queries/list-helpers'

export type ReuniaoResultadosParams = {
  page: number
  pageSize: number
  q?: string
  status?: XrReuniaoStatus
  concessionariaId?: string
  responsavelId?: string
  areaId?: string
  from?: string
  to?: string
}

export type ReuniaoRow = {
  id: string
  data: string | null
  id2: number | null
  finalizada: boolean
  dataFinalizada: string | null
  createdById: string | null
  createdByNome: string | null
  indicatorCount: number
  actionCount: number
  resultCount: number
  status: XrReuniaoStatus
  created_at: string
}

export type ReuniaoDetail = {
  id: string
  data: string | null
  id2: number | null
  finalizada: boolean
  dataFinalizada: string | null
  empresaId: string | null
  createdById: string | null
  createdByNome: string | null
  indicatorCount: number
  actionCount: number
  resultCount: number
  openActionCount: number
  status: XrReuniaoStatus
  created_at: string
}

export type AgendaItemRow = {
  id: string
  nome: string | null
  areaId: string | null
  areaNome: string | null
  status: string | null
  pontos: string | null
}

export type NextStepRow = {
  id: string
  descricao: string | null
  data: string | null
  responsavel: string | null
  completa: boolean | null
  indicadorId: string | null
  indicadorNome: string | null
  grupoId: string | null
  grupoNome: string | null
}

export type SnapshotRow = {
  id: string
  indicadorId: string | null
  indicadorNome: string | null
  concessionariaId: string | null
  concessionariaNome: string | null
  meta: string | null
  resultado: string | null
  percentual: string | null
  pontos: string | null
}

export type StatusSummary = {
  indicatorCount: number
  actionCount: number
  openActionCount: number
  resultCount: number
  finalResultCount: number
}

export type ReuniaoQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

export function parseReuniaoResultadosParams(
  searchParams: Record<string, string | string[] | undefined>,
): ReuniaoResultadosParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const parsed = ReuniaoResultadosFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    status: get('status'),
    concessionariaId: get('concessionariaId'),
    responsavelId: get('responsavelId'),
    areaId: get('areaId'),
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
    responsavelId: data.responsavelId,
    areaId: data.areaId,
    from: data.from,
    to: data.to,
  }
}

function resolveEmpresaId(ctx: ReuniaoQueryContext) {
  return ctx.empresaId ?? ctx.scopes.empresaId ?? null
}

function applyEmpresaScope<T extends { eq: (col: string, val: string) => T }>(query: T, ctx: ReuniaoQueryContext): T {
  const empresaId = resolveEmpresaId(ctx)
  if (empresaId) query = query.eq('empresa', empresaId)
  return query
}

async function resolveProfileNames(ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, nome').in('id', ids)
  return new Map((data ?? []).map((p) => [p.id, p.nome ?? '—']))
}

async function resolveConcessionariaNames(ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const supabase = await createClient()
  const { data } = await supabase.from('concessionaria').select('id, nome').in('id', ids)
  return new Map((data ?? []).map((c) => [c.id, c.nome ?? '—']))
}

async function getReuniaoIdsForConcessionaria(concessionariaId: string, empresaId: string | null) {
  const supabase = await createClient()
  let query = supabase
    .from('xr_indicador_resultado')
    .select('preliminar')
    .eq('concessionaria', concessionariaId)
    .not('preliminar', 'is', null)
  if (empresaId) query = query.eq('empresa', empresaId)
  const { data } = await query
  return [...new Set((data ?? []).map((r) => r.preliminar).filter(Boolean))] as string[]
}

async function getReuniaoIdsForArea(areaId: string, empresaId: string | null) {
  const supabase = await createClient()
  let indicadoresQuery = supabase.from('rr_indicadores').select('id').eq('area', areaId)
  if (empresaId) indicadoresQuery = indicadoresQuery.eq('empresa', empresaId)
  const { data: indicadores } = await indicadoresQuery
  const indicadorIds = (indicadores ?? []).map((i) => i.id)
  if (indicadorIds.length === 0) return [] as string[]

  const { data: links } = await supabase
    .from('xr_placar_indicadores')
    .select('xr_placar_id')
    .in('rr_indicadores_id', indicadorIds)
  return [...new Set((links ?? []).map((l) => l.xr_placar_id))]
}

async function countIndicators(reuniaoIds: string[]) {
  const map = new Map<string, number>()
  if (reuniaoIds.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase
    .from('xr_placar_indicadores')
    .select('xr_placar_id')
    .in('xr_placar_id', reuniaoIds)
  for (const row of data ?? []) {
    map.set(row.xr_placar_id, (map.get(row.xr_placar_id) ?? 0) + 1)
  }
  return map
}

async function countActions(reuniaoRows: { id: string; id2: number | null; empresa: string | null }[]) {
  const map = new Map<string, number>()
  const supabase = await createClient()
  for (const row of reuniaoRows) {
    if (row.id2 == null) {
      map.set(row.id, 0)
      continue
    }
    let query = supabase.from('xr_acao').select('id', { count: 'exact', head: true }).eq('preliminar', row.id2)
    if (row.empresa) query = query.eq('empresa', row.empresa)
    const { count } = await query
    map.set(row.id, count ?? 0)
  }
  return map
}

async function countResults(reuniaoIds: string[]) {
  const map = new Map<string, number>()
  if (reuniaoIds.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase
    .from('xr_indicador_resultado')
    .select('preliminar')
    .in('preliminar', reuniaoIds)
  for (const row of data ?? []) {
    if (!row.preliminar) continue
    map.set(row.preliminar, (map.get(row.preliminar) ?? 0) + 1)
  }
  return map
}

function matchesStatusFilter(
  status: XrReuniaoStatus,
  filter: XrReuniaoStatus | undefined,
  finalizada: boolean,
  indicatorCount: number,
  resultCount: number,
) {
  if (!filter) return true
  const derived = deriveXrReuniaoStatus({ finalizada, indicatorCount, resultCount })
  return derived === filter
}

export async function listReunioesResultados(
  params: ReuniaoResultadosParams,
  ctx: ReuniaoQueryContext,
): Promise<PaginatedResult<ReuniaoRow>> {
  const supabase = await createClient()
  const empresaId = resolveEmpresaId(ctx)
  const { from, to } = rangeFromPage(params.page, params.pageSize)

  let scopedIds: string[] | null = null
  if (params.concessionariaId) {
    scopedIds = await getReuniaoIdsForConcessionaria(params.concessionariaId, empresaId)
    if (scopedIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 0 }
    }
  }
  if (params.areaId) {
    const areaIds = await getReuniaoIdsForArea(params.areaId, empresaId)
    scopedIds = scopedIds ? scopedIds.filter((id) => areaIds.includes(id)) : areaIds
    if (scopedIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 0 }
    }
  }

  let query = supabase
    .from('xr_placar')
    .select('id, data, id_2, finalizada, data_finalizada, created_by, created_at, empresa', { count: 'exact' })
    .order('data', { ascending: false })

  query = applyEmpresaScope(query, ctx)
  if (scopedIds) query = query.in('id', scopedIds)
  if (params.responsavelId) query = query.eq('created_by', params.responsavelId)
  if (params.from) query = query.gte('data', params.from)
  if (params.to) query = query.lte('data', params.to)
  if (params.q?.trim()) {
    const q = params.q.trim()
    if (/^\d+$/.test(q)) {
      query = query.eq('id_2', Number(q))
    }
  }

  const { data: rows, count, error } = await params.status
    ? await query.limit(500)
    : await query.range(from, to)
  if (error) throw error

  const rawRows = rows ?? []
  const reuniaoIds = rawRows.map((r) => r.id)
  const [indicatorMap, actionMap, resultMap] = await Promise.all([
    countIndicators(reuniaoIds),
    countActions(rawRows.map((r) => ({ id: r.id, id2: r.id_2, empresa: r.empresa }))),
    countResults(reuniaoIds),
  ])

  const profileIds = [...new Set(rawRows.map((r) => r.created_by).filter(Boolean))] as string[]
  const profileMap = await resolveProfileNames(profileIds)

  let mapped = rawRows.map((row) => {
    const indicatorCount = indicatorMap.get(row.id) ?? 0
    const resultCount = resultMap.get(row.id) ?? 0
    const finalizada = row.finalizada ?? false
    return {
      id: row.id,
      data: row.data,
      id2: row.id_2,
      finalizada,
      dataFinalizada: row.data_finalizada,
      createdById: row.created_by,
      createdByNome: row.created_by ? profileMap.get(row.created_by) ?? null : null,
      indicatorCount,
      actionCount: actionMap.get(row.id) ?? 0,
      resultCount,
      status: deriveXrReuniaoStatus({ finalizada, indicatorCount, resultCount }),
      created_at: row.created_at,
    }
  })

  if (params.status) {
    mapped = mapped.filter((row) =>
      matchesStatusFilter(row.status, params.status, row.finalizada, row.indicatorCount, row.resultCount),
    )
  }

  const total = params.status ? mapped.length : (count ?? 0)
  const paged = params.status ? mapped.slice(from, to + 1) : mapped

  return {
    data: paged,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

async function buildDetailFromRow(
  row: {
    id: string
    data: string | null
    id_2: number | null
    finalizada: boolean | null
    data_finalizada: string | null
    empresa: string | null
    created_by: string | null
    created_at: string
  },
  ctx: ReuniaoQueryContext,
): Promise<ReuniaoDetail | null> {
  const empresaId = resolveEmpresaId(ctx)
  if (empresaId && row.empresa && row.empresa !== empresaId) return null

  const [indicatorMap, actionMap, resultMap, profileMap] = await Promise.all([
    countIndicators([row.id]),
    countActions([{ id: row.id, id2: row.id_2, empresa: row.empresa }]),
    countResults([row.id]),
    resolveProfileNames(row.created_by ? [row.created_by] : []),
  ])

  const supabase = await createClient()
  let openActionCount = 0
  if (row.id_2 != null) {
    let openQuery = supabase
      .from('xr_acao')
      .select('id', { count: 'exact', head: true })
      .eq('preliminar', row.id_2)
      .or('completa.is.null,completa.eq.false')
    if (row.empresa) openQuery = openQuery.eq('empresa', row.empresa)
    const { count } = await openQuery
    openActionCount = count ?? 0
  }

  const indicatorCount = indicatorMap.get(row.id) ?? 0
  const resultCount = resultMap.get(row.id) ?? 0
  const finalizada = row.finalizada ?? false

  return {
    id: row.id,
    data: row.data,
    id2: row.id_2,
    finalizada,
    dataFinalizada: row.data_finalizada,
    empresaId: row.empresa,
    createdById: row.created_by,
    createdByNome: row.created_by ? profileMap.get(row.created_by) ?? null : null,
    indicatorCount,
    actionCount: actionMap.get(row.id) ?? 0,
    resultCount,
    openActionCount,
    status: deriveXrReuniaoStatus({ finalizada, indicatorCount, resultCount }),
    created_at: row.created_at,
  }
}

export async function getReuniaoResultadoById(id: string, ctx: ReuniaoQueryContext): Promise<ReuniaoDetail | null> {
  const supabase = await createClient()
  let query = supabase
    .from('xr_placar')
    .select('id, data, id_2, finalizada, data_finalizada, empresa, created_by, created_at')
    .eq('id', id)
  query = applyEmpresaScope(query, ctx)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (!data) return null
  return buildDetailFromRow(data, ctx)
}

export async function getReuniaoResultadoDetail(id: string, ctx: ReuniaoQueryContext): Promise<ReuniaoDetail | null> {
  return getReuniaoResultadoById(id, ctx)
}

export async function getReuniaoStatusSummary(id: string, ctx: ReuniaoQueryContext): Promise<StatusSummary | null> {
  const detail = await getReuniaoResultadoById(id, ctx)
  if (!detail) return null

  const supabase = await createClient()
  const { count: finalResultCount } = await supabase
    .from('xr_placar_resultados_finais')
    .select('xr_resultado_final_id', { count: 'exact', head: true })
    .eq('xr_placar_id', id)

  return {
    indicatorCount: detail.indicatorCount,
    actionCount: detail.actionCount,
    openActionCount: detail.openActionCount,
    resultCount: detail.resultCount,
    finalResultCount: finalResultCount ?? 0,
  }
}

export async function getReuniaoResultadoFilterOptions(ctx: ReuniaoQueryContext) {
  const supabase = await createClient()
  const empresaId = resolveEmpresaId(ctx)

  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    concessionariasQuery = concessionariasQuery.in('id', ctx.scopes.concessionariaIds)
  }

  let areasQuery = supabase.from('xr_tipo_indicador').select('id, nome').order('nome')
  if (empresaId) areasQuery = areasQuery.eq('empresa', empresaId)

  let indicadoresQuery = supabase.from('rr_indicadores').select('id, nome').order('nome')
  if (empresaId) indicadoresQuery = indicadoresQuery.eq('empresa', empresaId)

  let gruposQuery = supabase.from('grupo').select('id, nome').order('nome')
  if (empresaId) gruposQuery = gruposQuery.eq('empresa', empresaId)

  const [concessionarias, areas, indicadores, grupos] = await Promise.all([
    concessionariasQuery,
    areasQuery,
    indicadoresQuery,
    gruposQuery,
  ])

  return {
    concessionarias: (concessionarias.data ?? []).map((c) => ({ value: c.id, label: c.nome ?? '—' })),
    areas: (areas.data ?? []).map((a) => ({ value: a.id, label: a.nome ?? '—' })),
    indicadores: (indicadores.data ?? []).map((i) => ({ value: i.id, label: i.nome ?? '—' })),
    grupos: (grupos.data ?? []).map((g) => ({ value: g.id, label: g.nome ?? '—' })),
    status: [
      { value: 'rascunho', label: 'Rascunho' },
      { value: 'em_andamento', label: 'Em andamento' },
      { value: 'finalizada', label: 'Finalizada' },
    ],
  }
}

export async function getReuniaoAgendaItems(reuniaoId: string): Promise<AgendaItemRow[]> {
  const supabase = await createClient()
  const { data: links, error } = await supabase
    .from('xr_placar_indicadores')
    .select('rr_indicadores_id')
    .eq('xr_placar_id', reuniaoId)
  if (error) throw error
  const indicadorIds = (links ?? []).map((l) => l.rr_indicadores_id)
  if (indicadorIds.length === 0) return []

  const { data: indicadores } = await supabase
    .from('rr_indicadores')
    .select('id, nome, area, status, pontos')
    .in('id', indicadorIds)
    .order('sort', { ascending: true })

  const areaIds = [...new Set((indicadores ?? []).map((i) => i.area).filter(Boolean))] as string[]
  const areaMap = new Map<string, string>()
  if (areaIds.length > 0) {
    const { data: areas } = await supabase.from('xr_tipo_indicador').select('id, nome').in('id', areaIds)
    for (const area of areas ?? []) areaMap.set(area.id, area.nome ?? '—')
  }

  return (indicadores ?? []).map((i) => ({
    id: i.id,
    nome: i.nome,
    areaId: i.area,
    areaNome: i.area ? areaMap.get(i.area) ?? null : null,
    status: i.status,
    pontos: i.pontos,
  }))
}

export async function getReuniaoNextSteps(reuniaoId: string): Promise<NextStepRow[]> {
  const supabase = await createClient()
  const { data: reuniao } = await supabase.from('xr_placar').select('id_2, empresa').eq('id', reuniaoId).maybeSingle()
  if (!reuniao?.id_2) return []

  let query = supabase
    .from('xr_acao')
    .select('id, descricao, data, responsavel, completa, indicador, grupo')
    .eq('preliminar', reuniao.id_2)
    .order('data', { ascending: true })
  if (reuniao.empresa) query = query.eq('empresa', reuniao.empresa)

  const { data, error } = await query
  if (error) throw error

  const indicadorIds = [...new Set((data ?? []).map((a) => a.indicador).filter(Boolean))] as string[]
  const grupoIds = [...new Set((data ?? []).map((a) => a.grupo).filter(Boolean))] as string[]

  const indicadorMap = new Map<string, string>()
  const grupoMap = new Map<string, string>()
  if (indicadorIds.length > 0) {
    const { data: indicadores } = await supabase.from('rr_indicadores').select('id, nome').in('id', indicadorIds)
    for (const i of indicadores ?? []) indicadorMap.set(i.id, i.nome ?? '—')
  }
  if (grupoIds.length > 0) {
    const { data: grupos } = await supabase.from('grupo').select('id, nome').in('id', grupoIds)
    for (const g of grupos ?? []) grupoMap.set(g.id, g.nome ?? '—')
  }

  return (data ?? []).map((a) => ({
    id: a.id,
    descricao: a.descricao,
    data: a.data,
    responsavel: a.responsavel,
    completa: a.completa,
    indicadorId: a.indicador,
    indicadorNome: a.indicador ? indicadorMap.get(a.indicador) ?? null : null,
    grupoId: a.grupo,
    grupoNome: a.grupo ? grupoMap.get(a.grupo) ?? null : null,
  }))
}

export async function getReuniaoPlacarSnapshot(reuniaoId: string, concessionariaId?: string): Promise<SnapshotRow[]> {
  const supabase = await createClient()
  let query = supabase
    .from('xr_indicador_resultado')
    .select('id, indicador, concessionaria, meta, resultado, percentual, pontos')
    .eq('preliminar', reuniaoId)
    .order('created_at', { ascending: true })
    .limit(200)
  if (concessionariaId) query = query.eq('concessionaria', concessionariaId)

  const { data, error } = await query
  if (error) throw error

  const indicadorIds = [...new Set((data ?? []).map((r) => r.indicador).filter(Boolean))] as string[]
  const concessionariaIds = [...new Set((data ?? []).map((r) => r.concessionaria).filter(Boolean))] as string[]

  const [indicadorMap, concessionariaMap] = await Promise.all([
    (async () => {
      const map = new Map<string, string>()
      if (indicadorIds.length === 0) return map
      const { data: indicadores } = await supabase.from('rr_indicadores').select('id, nome').in('id', indicadorIds)
      for (const i of indicadores ?? []) map.set(i.id, i.nome ?? '—')
      return map
    })(),
    resolveConcessionariaNames(concessionariaIds),
  ])

  return (data ?? []).map((r) => ({
    id: r.id,
    indicadorId: r.indicador,
    indicadorNome: r.indicador ? indicadorMap.get(r.indicador) ?? null : null,
    concessionariaId: r.concessionaria,
    concessionariaNome: r.concessionaria ? concessionariaMap.get(r.concessionaria) ?? null : null,
    meta: r.meta,
    resultado: r.resultado,
    percentual: r.percentual,
    pontos: r.pontos,
  }))
}
