import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { deriveHabitoStatus, computeHabitoProgress, type HabitoStatus } from '@/lib/habitos/status'
import { isHighPrivilegeScope, canAccessConcessionaria } from '@/lib/permissions/scopes'
import { HabitosFiltersSchema } from '@/lib/validations/habitos'
import { buildPageCount, rangeFromPage } from '@/server/queries/list-helpers'

export type HabitosParams = {
  page: number
  pageSize: number
  q?: string
  status?: HabitoStatus
  concessionariaId?: string
  responsavelId?: string
  areaId?: string
  funcaoId?: string
  from?: string
  to?: string
}

export type HabitoRow = {
  id: string
  titulo: string | null
  descricao: string | null
  dataInicio: string | null
  dataFim: string | null
  concessionariaId: string | null
  concessionariaNome: string | null
  responsavelId: string | null
  responsavelNome: string | null
  areaId: string | null
  areaNome: string | null
  funcaoId: string | null
  funcaoNome: string | null
  competenciaHabitoId: string | null
  competenciaHabitoLabel: string | null
  agendamentoId: string | null
  ativo: boolean
  concluido: boolean
  status: HabitoStatus
  metaExecucoes: number | null
  execucoesRealizadas: number
  progressPercent: number
  progressLabel: string
  concluidoEm: string | null
  created_at: string
}

export type HabitoDetail = HabitoRow

export type HabitosSummary = {
  total: number
  pendentes: number
  concluidos: number
  atrasados: number
}

export type HabitoProgress = {
  metaExecucoes: number | null
  execucoesRealizadas: number
  percent: number
  label: string
}

export type HabitosQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

const SELECT_FIELDS =
  'id, titulo, descricao, data_inicio, data_fim, concessionaria, colaborador, area, funcao, competencia_habito, agendamento, ativo, concluido, concluido_em, meta_execucoes, execucoes_realizadas, created_at'

export function parseHabitosParams(searchParams: Record<string, string | string[] | undefined>): HabitosParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const parsed = HabitosFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    status: get('status'),
    concessionariaId: get('concessionariaId'),
    responsavelId: get('responsavelId'),
    areaId: get('areaId'),
    funcaoId: get('funcaoId'),
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
    funcaoId: data.funcaoId,
    from: data.from,
    to: data.to,
  }
}

function resolveEmpresaId(ctx: HabitosQueryContext) {
  return ctx.empresaId ?? ctx.scopes.empresaId ?? null
}

function applyScope<T extends { eq: (col: string, val: string) => T; in: (col: string, vals: string[]) => T }>(
  query: T,
  ctx: HabitosQueryContext,
): T {
  const empresaId = resolveEmpresaId(ctx)
  if (empresaId) query = query.eq('empresa', empresaId)

  if (ctx.orgContext.concessionariaId) {
    query = query.eq('concessionaria', ctx.orgContext.concessionariaId)
  } else if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('concessionaria', ctx.scopes.concessionariaIds)
  }

  return query
}

async function resolveNames(table: 'profiles' | 'concessionaria' | 'setor_concessionaria' | 'funcao_colaborador', ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const supabase = await createClient()
  const { data } = await supabase.from(table).select('id, nome').in('id', ids)
  return new Map((data ?? []).map((r) => [r.id, r.nome ?? '—']))
}

async function resolveCompetenciaHabitoLabels(ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const supabase = await createClient()
  const { data } = await supabase.from('competencia_habito').select('id, pergunta, descricao').in('id', ids)
  return new Map(
    (data ?? []).map((r) => [r.id, r.pergunta?.trim() || r.descricao?.trim() || r.id.slice(0, 8)]),
  )
}

function applyDateOverlap<T extends { gte: (col: string, val: string) => T; lte: (col: string, val: string) => T }>(
  query: T,
  from?: string,
  to?: string,
) {
  if (from) query = query.gte('data_inicio', from)
  if (to) {
    const end = to.includes('T') ? to : `${to}T23:59:59.999Z`
    query = query.lte('data_inicio', end)
  }
  return query
}

function mapRow(
  row: {
    id: string
    titulo: string | null
    descricao: string | null
    data_inicio: string | null
    data_fim: string | null
    concessionaria: string | null
    colaborador: string | null
    area: string | null
    funcao: string | null
    competencia_habito: string | null
    agendamento: string | null
    ativo: boolean | null
    concluido: boolean | null
    concluido_em: string | null
    meta_execucoes: number | null
    execucoes_realizadas: number | null
    created_at: string
  },
  names: {
    concessionaria: Map<string, string>
    profiles: Map<string, string>
    areas: Map<string, string>
    funcoes: Map<string, string>
    competenciaHabitos: Map<string, string>
  },
): HabitoRow {
  const ativo = row.ativo ?? true
  const concluido = row.concluido ?? false
  const execucoes = row.execucoes_realizadas ?? 0
  const progress = computeHabitoProgress(row.meta_execucoes, execucoes)
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim,
    concessionariaId: row.concessionaria,
    concessionariaNome: row.concessionaria ? names.concessionaria.get(row.concessionaria) ?? null : null,
    responsavelId: row.colaborador,
    responsavelNome: row.colaborador ? names.profiles.get(row.colaborador) ?? null : null,
    areaId: row.area,
    areaNome: row.area ? names.areas.get(row.area) ?? null : null,
    funcaoId: row.funcao,
    funcaoNome: row.funcao ? names.funcoes.get(row.funcao) ?? null : null,
    competenciaHabitoId: row.competencia_habito,
    competenciaHabitoLabel: row.competencia_habito ? names.competenciaHabitos.get(row.competencia_habito) ?? null : null,
    agendamentoId: row.agendamento,
    ativo,
    concluido,
    status: deriveHabitoStatus({ ativo, concluido, dataFim: row.data_fim }),
    metaExecucoes: row.meta_execucoes,
    execucoesRealizadas: execucoes,
    progressPercent: progress.percent,
    progressLabel: progress.label,
    concluidoEm: row.concluido_em,
    created_at: row.created_at,
  }
}

async function enrichRows(
  rawRows: Array<{
    id: string
    titulo: string | null
    descricao: string | null
    data_inicio: string | null
    data_fim: string | null
    concessionaria: string | null
    colaborador: string | null
    area: string | null
    funcao: string | null
    competencia_habito: string | null
    agendamento: string | null
    ativo: boolean | null
    concluido: boolean | null
    concluido_em: string | null
    meta_execucoes: number | null
    execucoes_realizadas: number | null
    created_at: string
  }>,
) {
  const [concessionariaMap, profileMap, areaMap, funcaoMap, competenciaMap] = await Promise.all([
    resolveNames('concessionaria', [...new Set(rawRows.map((r) => r.concessionaria).filter(Boolean))] as string[]),
    resolveNames('profiles', [...new Set(rawRows.map((r) => r.colaborador).filter(Boolean))] as string[]),
    resolveNames('setor_concessionaria', [...new Set(rawRows.map((r) => r.area).filter(Boolean))] as string[]),
    resolveNames('funcao_colaborador', [...new Set(rawRows.map((r) => r.funcao).filter(Boolean))] as string[]),
    resolveCompetenciaHabitoLabels([...new Set(rawRows.map((r) => r.competencia_habito).filter(Boolean))] as string[]),
  ])
  return rawRows.map((row) =>
    mapRow(row, {
      concessionaria: concessionariaMap,
      profiles: profileMap,
      areas: areaMap,
      funcoes: funcaoMap,
      competenciaHabitos: competenciaMap,
    }),
  )
}

export async function listHabitos(
  params: HabitosParams,
  ctx: HabitosQueryContext,
): Promise<PaginatedResult<HabitoRow>> {
  const supabase = await createClient()
  const { from, to } = rangeFromPage(params.page, params.pageSize)

  let query = supabase
    .from('habitos')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('data_inicio', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  query = applyScope(query, ctx)
  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.responsavelId) query = query.eq('colaborador', params.responsavelId)
  if (params.areaId) query = query.eq('area', params.areaId)
  if (params.funcaoId) query = query.eq('funcao', params.funcaoId)
  if (params.q?.trim()) query = query.ilike('titulo', `%${params.q.trim()}%`)
  query = applyDateOverlap(query, params.from, params.to)

  if (params.status === 'concluido') query = query.eq('concluido', true).eq('ativo', true)
  else if (params.status === 'inativo') query = query.eq('ativo', false)
  else if (params.status === 'pendente' || params.status === 'atrasado') {
    query = query.eq('concluido', false).eq('ativo', true)
  }

  const needsPostFilter = params.status === 'atrasado' || params.status === 'pendente'
  const { data: rows, count, error } = needsPostFilter
    ? await query.limit(500)
    : await query.range(from, to)

  if (error) throw error

  let mapped = await enrichRows(rows ?? [])

  if (params.status === 'atrasado') mapped = mapped.filter((r) => r.status === 'atrasado')
  else if (params.status === 'pendente') mapped = mapped.filter((r) => r.status === 'pendente')

  const total = needsPostFilter ? mapped.length : (count ?? 0)
  const paged = needsPostFilter ? mapped.slice(from, to + 1) : mapped

  return {
    data: paged,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

export async function getHabitoById(id: string, ctx: HabitosQueryContext): Promise<HabitoDetail | null> {
  const supabase = await createClient()
  let query = supabase.from('habitos').select(`${SELECT_FIELDS}, empresa`).eq('id', id)
  query = applyScope(query, ctx)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (!data) return null

  const empresaId = resolveEmpresaId(ctx)
  if (empresaId && data.empresa && data.empresa !== empresaId) return null

  const [mapped] = await enrichRows([data])
  return mapped
}

export async function getHabitosFilterOptions(ctx: HabitosQueryContext) {
  const supabase = await createClient()
  const empresaId = resolveEmpresaId(ctx)

  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    concessionariasQuery = concessionariasQuery.in('id', ctx.scopes.concessionariaIds)
  }

  let profilesQuery = supabase.from('profiles').select('id, nome').eq('ativo', true).order('nome')
  if (empresaId) profilesQuery = profilesQuery.eq('empresa', empresaId)

  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  if (empresaId) areasQuery = areasQuery.eq('empresa', empresaId)

  let funcoesQuery = supabase.from('funcao_colaborador').select('id, nome').order('nome')
  if (empresaId) funcoesQuery = funcoesQuery.eq('empresa', empresaId)

  const catalogQuery = supabase
    .from('competencia_habito')
    .select('id, pergunta, descricao')
    .order('pergunta')
    .limit(200)

  const [concessionarias, profiles, areas, funcoes, catalog] = await Promise.all([
    concessionariasQuery,
    profilesQuery,
    areasQuery,
    funcoesQuery,
    catalogQuery,
  ])

  return {
    concessionarias: (concessionarias.data ?? []).map((c) => ({ value: c.id, label: c.nome ?? '—' })),
    profiles: (profiles.data ?? []).map((p) => ({ value: p.id, label: p.nome ?? '—' })),
    areas: (areas.data ?? []).map((a) => ({ value: a.id, label: a.nome ?? '—' })),
    funcoes: (funcoes.data ?? []).map((f) => ({ value: f.id, label: f.nome ?? '—' })),
    competenciaHabitos: (catalog.data ?? []).map((h) => ({
      value: h.id,
      label: h.pergunta?.trim() || h.descricao?.trim() || h.id.slice(0, 8),
    })),
    agendamentos: [] as { value: string; label: string }[],
    status: getHabitoStatusOptions(),
  }
}

export function getHabitoStatusOptions() {
  return [
    { value: 'pendente', label: 'Pendente' },
    { value: 'atrasado', label: 'Atrasado' },
    { value: 'concluido', label: 'Concluido' },
    { value: 'inativo', label: 'Inativo' },
  ]
}

export async function getHabitosSummary(ctx: HabitosQueryContext): Promise<HabitosSummary> {
  const supabase = await createClient()
  let query = supabase.from('habitos').select('ativo, concluido, data_fim')
  query = applyScope(query, ctx)
  const { data, error } = await query.limit(1000)
  if (error) throw error

  let total = 0
  let pendentes = 0
  let concluidos = 0
  let atrasados = 0

  for (const row of data ?? []) {
    total += 1
    const status = deriveHabitoStatus({
      ativo: row.ativo ?? true,
      concluido: row.concluido ?? false,
      dataFim: row.data_fim,
    })
    if (status === 'pendente') pendentes += 1
    if (status === 'concluido') concluidos += 1
    if (status === 'atrasado') atrasados += 1
  }

  return { total, pendentes, concluidos, atrasados }
}

export async function getHabitoProgress(id: string, ctx: HabitosQueryContext): Promise<HabitoProgress | null> {
  const habito = await getHabitoById(id, ctx)
  if (!habito) return null
  return {
    metaExecucoes: habito.metaExecucoes,
    execucoesRealizadas: habito.execucoesRealizadas,
    percent: habito.progressPercent,
    label: habito.progressLabel,
  }
}

export function assertHabitoInScope(
  concessionariaId: string | null,
  ctx: HabitosQueryContext,
): boolean {
  if (!concessionariaId) return isHighPrivilegeScope(ctx.scopes.perfilNivel)
  if (isHighPrivilegeScope(ctx.scopes.perfilNivel)) return true
  return canAccessConcessionaria(ctx.scopes, concessionariaId)
}
