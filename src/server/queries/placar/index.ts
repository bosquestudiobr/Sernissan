import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { PlacarFiltersSchema } from '@/lib/validations/placar'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import { computeIndicatorPoints } from '@/server/jobs/placar/recalculate-points'
import { computeRanking } from '@/server/jobs/placar/recalculate-ranking'
import type { RankingRow } from '@/server/jobs/placar/types'

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
  totalPontos: number
  colaboradorCount: number
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

async function getPlacarTotals(placarIds: string[]): Promise<Map<string, { totalPontos: number; colaboradores: number }>> {
  const map = new Map<string, { totalPontos: number; colaboradores: number }>()
  if (placarIds.length === 0) return map

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('placar, pontos_ranking, colaborador_user')
    .in('placar', placarIds)
  if (error) throw error

  const colaboradores = new Map<string, Set<string>>()
  for (const row of data ?? []) {
    if (!row.placar) continue
    const current = map.get(row.placar) ?? { totalPontos: 0, colaboradores: 0 }
    current.totalPontos = Math.round((current.totalPontos + (row.pontos_ranking ?? 0) + Number.EPSILON) * 10000) / 10000
    map.set(row.placar, current)
    if (row.colaborador_user) {
      const set = colaboradores.get(row.placar) ?? new Set<string>()
      set.add(row.colaborador_user)
      colaboradores.set(row.placar, set)
    }
  }
  for (const [placarId, set] of colaboradores.entries()) {
    const current = map.get(placarId)
    if (current) current.colaboradores = set.size
  }
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
  const [counts, indicatorIdsMap, concessionariaNames, totals] = await Promise.all([
    getIndicatorCounts(placarIds),
    getIndicatorIdsByPlacar(placarIds),
    getConcessionariaNames(concessionariaIds),
    getPlacarTotals(placarIds),
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
    totalPontos: totals.get(row.id)?.totalPontos ?? 0,
    colaboradorCount: totals.get(row.id)?.colaboradores ?? 0,
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
    totalPontos: 0,
    colaboradorCount: 0,
    origemLabel: data.opcao_origem ? origem.get(data.opcao_origem) ?? data.opcao_origem : null,
    acumuladoLabel: data.opcao_acumulado ? acumulado.get(data.opcao_acumulado) ?? data.opcao_acumulado : null,
    indicadorIds: indicadores.map((item) => item.id),
  }
}

export const getPlacarDetail = getPlacarById

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






export type PlacarSummary = {
  placarId: string
  indicadorCount: number
  indicadoresComValor: number
  totalPontos: number
  colaboradorCount: number
  rankingAtualizado: boolean
  finalizado: boolean
}

export async function getPlacarSummary(placarId: string): Promise<PlacarSummary> {
  const supabase = await createClient()

  const [{ data: placar, error: placarError }, { data: indicadores, error: indError }] = await Promise.all([
    supabase.from('placar').select('id, finalizado, ranking_atualizado').eq('id', placarId).maybeSingle(),
    supabase.from('indicadores').select('pontos_ranking, valor, colaborador_user').eq('placar', placarId),
  ])
  if (placarError) throw placarError
  if (indError) throw indError

  const rows = indicadores ?? []
  let total = 0
  let comValor = 0
  const colaboradores = new Set<string>()
  for (const row of rows) {
    total += row.pontos_ranking ?? 0
    if (row.valor != null) comValor += 1
    if (row.colaborador_user) colaboradores.add(row.colaborador_user)
  }

  return {
    placarId,
    indicadorCount: rows.length,
    indicadoresComValor: comValor,
    totalPontos: Math.round((total + Number.EPSILON) * 10000) / 10000,
    colaboradorCount: colaboradores.size,
    rankingAtualizado: placar?.ranking_atualizado ?? false,
    finalizado: placar?.finalizado ?? false,
  }
}

export async function getPlacarRanking(placarId: string): Promise<RankingRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('colaborador_user, pontos_ranking')
    .eq('placar', placarId)
  if (error) throw error

  const rows = data ?? []
  const colaboradorIds = [...new Set(rows.map((r) => r.colaborador_user).filter(Boolean) as string[])]

  const names = new Map<string, string>()
  if (colaboradorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome')
      .in('id', colaboradorIds)
    if (profilesError) throw profilesError
    for (const p of profiles ?? []) names.set(p.id, p.nome ?? p.id)
  }

  return computeRanking(
    rows.map((r) => ({
      colaboradorId: r.colaborador_user,
      colaboradorNome: r.colaborador_user ? names.get(r.colaborador_user) ?? null : null,
      pontos: r.pontos_ranking ?? 0,
    })),
  )
}

export type PlacarCalculationStatus = {
  placarId: string
  rankingAtualizado: boolean
  finalizado: boolean
  updatedAt: string | null
  indicadorCount: number
  indicadoresComValor: number
}

export async function getPlacarCalculationStatus(placarId: string): Promise<PlacarCalculationStatus> {
  const supabase = await createClient()
  const [{ data: placar, error: placarError }, { data: indicadores, error: indError }] = await Promise.all([
    supabase.from('placar').select('id, finalizado, ranking_atualizado, updated_at').eq('id', placarId).maybeSingle(),
    supabase.from('indicadores').select('valor').eq('placar', placarId),
  ])
  if (placarError) throw placarError
  if (indError) throw indError

  const rows = indicadores ?? []
  return {
    placarId,
    rankingAtualizado: placar?.ranking_atualizado ?? false,
    finalizado: placar?.finalizado ?? false,
    updatedAt: placar?.updated_at ?? null,
    indicadorCount: rows.length,
    indicadoresComValor: rows.filter((r) => r.valor != null).length,
  }
}

export type PlacarRecalculationPreview = {
  placarId: string
  indicadorCount: number
  totalPontosAtual: number
  totalPontosPrevisto: number
}

export async function getPlacarRecalculationPreview(placarId: string): Promise<PlacarRecalculationPreview> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('meta, valor, pontos, pontos_ranking')
    .eq('placar', placarId)
  if (error) throw error

  const rows = data ?? []
  let atual = 0
  let previsto = 0
  for (const row of rows) {
    atual += row.pontos_ranking ?? 0
    previsto += computeIndicatorPoints({ meta: row.meta, valor: row.valor, peso: row.pontos })
  }

  return {
    placarId,
    indicadorCount: rows.length,
    totalPontosAtual: Math.round((atual + Number.EPSILON) * 10000) / 10000,
    totalPontosPrevisto: Math.round((previsto + Number.EPSILON) * 10000) / 10000,
  }
}

export type PlacarIndicatorSummaryRow = {
  id: string
  nome: string | null
  sigla: string | null
  meta: number | null
  valor: number | null
  pontos: number | null
  pontosRanking: number | null
  colaboradorNome: string | null
  ativoPlacar: boolean | null
}

export async function getPlacarIndicatorSummary(placarId: string): Promise<PlacarIndicatorSummaryRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('indicadores')
    .select('id, nome, sigla, meta, valor, pontos, pontos_ranking, colaborador_user, ativo_placar, ordem')
    .eq('placar', placarId)
    .order('ordem', { ascending: true })
  if (error) throw error

  const rows = data ?? []
  const colaboradorIds = [...new Set(rows.map((r) => r.colaborador_user).filter(Boolean) as string[])]
  const names = new Map<string, string>()
  if (colaboradorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome')
      .in('id', colaboradorIds)
    if (profilesError) throw profilesError
    for (const p of profiles ?? []) names.set(p.id, p.nome ?? p.id)
  }

  return rows.map((r) => ({
    id: r.id,
    nome: r.nome,
    sigla: r.sigla,
    meta: r.meta,
    valor: r.valor,
    pontos: r.pontos,
    pontosRanking: r.pontos_ranking,
    colaboradorNome: r.colaborador_user ? names.get(r.colaborador_user) ?? null : null,
    ativoPlacar: r.ativo_placar,
  }))
}

export type PlacarAuditLogRow = {
  id: string
  action: string
  summary: Record<string, unknown>
  createdAt: string
  profileNome: string | null
}

export async function getPlacarAuditLog(placarId: string, limit = 20): Promise<PlacarAuditLogRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('placar_recalculation_logs')
    .select('id, action, summary, created_at, profile_id')
    .eq('placar_id', placarId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  const rows = data ?? []
  const profileIds = [...new Set(rows.map((r) => r.profile_id).filter(Boolean) as string[])]
  const names = new Map<string, string>()
  if (profileIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome')
      .in('id', profileIds)
    if (profilesError) throw profilesError
    for (const p of profiles ?? []) names.set(p.id, p.nome ?? p.id)
  }

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    summary: (r.summary as Record<string, unknown> | null) ?? {},
    createdAt: r.created_at,
    profileNome: r.profile_id ? names.get(r.profile_id) ?? null : null,
  }))
}

