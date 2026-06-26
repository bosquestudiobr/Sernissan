import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { deriveAgendaStatus, eventOccursOnDay, type AgendaStatus } from '@/lib/agenda/status'
import { isHighPrivilegeScope, canAccessConcessionaria } from '@/lib/permissions/scopes'
import { AgendaFiltersSchema } from '@/lib/validations/agenda'
import { buildPageCount, rangeFromPage } from '@/server/queries/list-helpers'

export type AgendaParams = {
  page: number
  pageSize: number
  q?: string
  status?: AgendaStatus
  concessionariaId?: string
  responsavelId?: string
  from?: string
  to?: string
  view: 'list' | 'calendar'
  month?: string
}

export type AgendaRow = {
  id: string
  titulo: string | null
  dataInicio: string | null
  dataFim: string | null
  diaTodo: boolean
  concessionariaId: string | null
  concessionariaNome: string | null
  responsavelId: string | null
  responsavelNome: string | null
  gerenteId: string | null
  gerenteNome: string | null
  placarId: string | null
  concluido: boolean
  cancelado: boolean
  status: AgendaStatus
  participantCount: number
  created_at: string
}

export type AgendaDetail = AgendaRow & {
  convidadoIds: string[]
  participantIds: string[]
  concluidoEm: string | null
}

export type AgendaCalendarItem = {
  id: string
  titulo: string | null
  dataInicio: string | null
  dataFim: string | null
  status: AgendaStatus
}

export type AgendaSummary = {
  hoje: number
  pendentes: number
  concluidos: number
  atrasados: number
}

export type AgendaQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

export function parseAgendaParams(searchParams: Record<string, string | string[] | undefined>): AgendaParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const parsed = AgendaFiltersSchema.safeParse({
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    status: get('status'),
    concessionariaId: get('concessionariaId'),
    responsavelId: get('responsavelId'),
    from: get('from'),
    to: get('to'),
    view: get('view'),
    month: get('month'),
  })
  const data = parsed.success ? parsed.data : { page: 1, pageSize: 20, view: 'list' as const }
  return {
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    status: data.status,
    concessionariaId: data.concessionariaId,
    responsavelId: data.responsavelId,
    from: data.from,
    to: data.to,
    view: data.view ?? 'list',
    month: data.month,
  }
}

function resolveEmpresaId(ctx: AgendaQueryContext) {
  return ctx.empresaId ?? ctx.scopes.empresaId ?? null
}

function applyScope<T extends { eq: (col: string, val: string) => T; in: (col: string, vals: string[]) => T }>(
  query: T,
  ctx: AgendaQueryContext,
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

async function resolveNames(table: 'profiles' | 'concessionaria', ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const supabase = await createClient()
  const { data } = await supabase.from(table).select('id, nome').in('id', ids)
  return new Map((data ?? []).map((r) => [r.id, r.nome ?? '—']))
}

async function getAgendamentoIdsForResponsavel(userId: string) {
  const supabase = await createClient()
  const { data: linked } = await supabase.from('agendamentos_users').select('agendamentos_id').eq('user_id', userId)
  const ids = new Set((linked ?? []).map((r) => r.agendamentos_id))
  const { data: owned } = await supabase.from('agendamentos').select('id').eq('user', userId)
  for (const row of owned ?? []) ids.add(row.id)
  return [...ids]
}

function mapRow(
  row: {
    id: string
    titulo: string | null
    data_inicio: string | null
    data_fim: string | null
    dia_todo: boolean | null
    concessionaria: string | null
    user: string | null
    gerente: string | null
    placar: string | null
    concluido: boolean | null
    cancelado: boolean | null
    created_at: string
  },
  names: {
    concessionaria: Map<string, string>
    profiles: Map<string, string>
  },
  participantCount: number,
): AgendaRow {
  const concluido = row.concluido ?? false
  const cancelado = row.cancelado ?? false
  return {
    id: row.id,
    titulo: row.titulo,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim,
    diaTodo: row.dia_todo ?? false,
    concessionariaId: row.concessionaria,
    concessionariaNome: row.concessionaria ? names.concessionaria.get(row.concessionaria) ?? null : null,
    responsavelId: row.user,
    responsavelNome: row.user ? names.profiles.get(row.user) ?? null : null,
    gerenteId: row.gerente,
    gerenteNome: row.gerente ? names.profiles.get(row.gerente) ?? null : null,
    placarId: row.placar,
    concluido,
    cancelado,
    status: deriveAgendaStatus({ concluido, cancelado, dataFim: row.data_fim }),
    participantCount,
    created_at: row.created_at,
  }
}

const SELECT_FIELDS =
  'id, titulo, data_inicio, data_fim, dia_todo, concessionaria, user, gerente, placar, concluido, cancelado, created_at'

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

function matchesStatusFilter(row: AgendaRow, status?: AgendaStatus) {
  if (!status) return true
  return row.status === status
}

async function countParticipants(ids: string[]) {
  const map = new Map<string, number>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data } = await supabase.from('agendamentos_users').select('agendamentos_id').in('agendamentos_id', ids)
  for (const row of data ?? []) {
    map.set(row.agendamentos_id, (map.get(row.agendamentos_id) ?? 0) + 1)
  }
  return map
}

export async function listAgendaItems(
  params: AgendaParams,
  ctx: AgendaQueryContext,
): Promise<PaginatedResult<AgendaRow>> {
  const supabase = await createClient()
  const { from, to } = rangeFromPage(params.page, params.pageSize)

  let scopedIds: string[] | null = null
  if (params.responsavelId) {
    scopedIds = await getAgendamentoIdsForResponsavel(params.responsavelId)
    if (scopedIds.length === 0) {
      return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 0 }
    }
  }

  let query = supabase
    .from('agendamentos')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('data_inicio', { ascending: true, nullsFirst: false })

  query = applyScope(query, ctx)
  if (scopedIds) query = query.in('id', scopedIds)
  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.q?.trim()) query = query.ilike('titulo', `%${params.q.trim()}%`)
  query = applyDateOverlap(query, params.from, params.to)

  if (params.status === 'concluido') query = query.eq('concluido', true).eq('cancelado', false)
  else if (params.status === 'cancelado') query = query.eq('cancelado', true)
  else if (params.status === 'pendente') {
    query = query.eq('concluido', false).eq('cancelado', false)
  }

  const needsPostFilter = params.status === 'atrasado'
  const { data: rows, count, error } = needsPostFilter || params.status === 'pendente'
    ? await query.limit(500)
    : await query.range(from, to)

  if (error) throw error

  const rawRows = rows ?? []
  const ids = rawRows.map((r) => r.id)
  const [participantMap, concessionariaMap, profileMap] = await Promise.all([
    countParticipants(ids),
    resolveNames('concessionaria', [...new Set(rawRows.map((r) => r.concessionaria).filter(Boolean))] as string[]),
    resolveNames('profiles', [
      ...new Set([
        ...rawRows.map((r) => r.user).filter(Boolean),
        ...rawRows.map((r) => r.gerente).filter(Boolean),
      ]),
    ] as string[]),
  ])

  let mapped = rawRows.map((row) =>
    mapRow(row, { concessionaria: concessionariaMap, profiles: profileMap }, participantMap.get(row.id) ?? 0),
  )

  if (params.status === 'atrasado') {
    mapped = mapped.filter((r) => r.status === 'atrasado')
  } else if (params.status === 'pendente') {
    mapped = mapped.filter((r) => r.status === 'pendente')
  }

  const total = params.status === 'atrasado' || params.status === 'pendente' ? mapped.length : (count ?? 0)
  const paged = params.status === 'atrasado' || params.status === 'pendente' ? mapped.slice(from, to + 1) : mapped

  return {
    data: paged,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

export async function getAgendaItemById(id: string, ctx: AgendaQueryContext): Promise<AgendaDetail | null> {
  const supabase = await createClient()
  let query = supabase
    .from('agendamentos')
    .select(`${SELECT_FIELDS}, concluido_em, empresa`)
    .eq('id', id)
  query = applyScope(query, ctx)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (!data) return null

  const empresaId = resolveEmpresaId(ctx)
  if (empresaId && data.empresa && data.empresa !== empresaId) return null

  const [concessionariaMap, profileMap, participants, convidados] = await Promise.all([
    resolveNames('concessionaria', data.concessionaria ? [data.concessionaria] : []),
    resolveNames('profiles', [data.user, data.gerente].filter(Boolean) as string[]),
    supabase.from('agendamentos_users').select('user_id').eq('agendamentos_id', id),
    supabase.from('agendamentos_convidados').select('user_id').eq('agendamentos_id', id),
  ])

  const base = mapRow(
    data,
    { concessionaria: concessionariaMap, profiles: profileMap },
    (participants.data ?? []).length,
  )

  return {
    ...base,
    participantIds: (participants.data ?? []).map((p) => p.user_id),
    convidadoIds: (convidados.data ?? []).map((p) => p.user_id),
    concluidoEm: data.concluido_em,
  }
}

export async function getAgendaFilterOptions(ctx: AgendaQueryContext) {
  const supabase = await createClient()
  const empresaId = resolveEmpresaId(ctx)

  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    concessionariasQuery = concessionariasQuery.in('id', ctx.scopes.concessionariaIds)
  }

  let profilesQuery = supabase.from('profiles').select('id, nome').eq('ativo', true).order('nome')
  if (empresaId) profilesQuery = profilesQuery.eq('empresa', empresaId)

  let placaresQuery = supabase.from('placar').select('id, data').order('data', { ascending: false }).limit(50)
  if (empresaId) placaresQuery = placaresQuery.eq('empresa', empresaId)

  const [concessionarias, profiles, placares] = await Promise.all([
    concessionariasQuery,
    profilesQuery,
    placaresQuery,
  ])

  return {
    concessionarias: (concessionarias.data ?? []).map((c) => ({ value: c.id, label: c.nome ?? '—' })),
    profiles: (profiles.data ?? []).map((p) => ({ value: p.id, label: p.nome ?? '—' })),
    placares: (placares.data ?? []).map((p) => ({
      value: p.id,
      label: p.data ? `Placar ${new Date(p.data).toLocaleDateString('pt-BR')}` : p.id.slice(0, 8),
    })),
    status: getAgendaStatusOptions(),
  }
}

export function getAgendaStatusOptions() {
  return [
    { value: 'pendente', label: 'Pendente' },
    { value: 'atrasado', label: 'Atrasado' },
    { value: 'concluido', label: 'Concluido' },
    { value: 'cancelado', label: 'Cancelado' },
  ]
}

export async function getAgendaSummary(ctx: AgendaQueryContext): Promise<AgendaSummary> {
  const supabase = await createClient()
  let query = supabase.from('agendamentos').select(SELECT_FIELDS)
  query = applyScope(query, ctx)
  const { data, error } = await query.limit(1000)
  if (error) throw error

  const today = new Date()
  let hoje = 0
  let pendentes = 0
  let concluidos = 0
  let atrasados = 0

  for (const row of data ?? []) {
    const status = deriveAgendaStatus({
      concluido: row.concluido ?? false,
      cancelado: row.cancelado ?? false,
      dataFim: row.data_fim,
    })
    if (eventOccursOnDay(row.data_inicio, row.data_fim, today)) hoje += 1
    if (status === 'pendente') pendentes += 1
    if (status === 'concluido') concluidos += 1
    if (status === 'atrasado') atrasados += 1
  }

  return { hoje, pendentes, concluidos, atrasados }
}

export async function getAgendaCalendarItems(
  month: string,
  ctx: AgendaQueryContext,
  filters?: Pick<AgendaParams, 'concessionariaId' | 'responsavelId' | 'q'>,
): Promise<AgendaCalendarItem[]> {
  const [year, mon] = month.split('-').map(Number)
  const start = new Date(year, mon - 1, 1)
  const end = new Date(year, mon, 0, 23, 59, 59, 999)

  let scopedIds: string[] | null = null
  if (filters?.responsavelId) {
    scopedIds = await getAgendamentoIdsForResponsavel(filters.responsavelId)
    if (scopedIds.length === 0) return []
  }

  const supabase = await createClient()
  let query = supabase
    .from('agendamentos')
    .select('id, titulo, data_inicio, data_fim, concluido, cancelado')
    .gte('data_inicio', start.toISOString())
    .lte('data_inicio', end.toISOString())
    .order('data_inicio', { ascending: true })

  query = applyScope(query, ctx)
  if (scopedIds) query = query.in('id', scopedIds)
  if (filters?.concessionariaId) query = query.eq('concessionaria', filters.concessionariaId)
  if (filters?.q?.trim()) query = query.ilike('titulo', `%${filters.q.trim()}%`)

  const { data, error } = await query.limit(500)
  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    titulo: row.titulo,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim,
    status: deriveAgendaStatus({
      concluido: row.concluido ?? false,
      cancelado: row.cancelado ?? false,
      dataFim: row.data_fim,
    }),
  }))
}

export function assertAgendaInScope(
  concessionariaId: string | null,
  ctx: AgendaQueryContext,
): boolean {
  if (!concessionariaId) return isHighPrivilegeScope(ctx.scopes.perfilNivel)
  if (isHighPrivilegeScope(ctx.scopes.perfilNivel)) return true
  return canAccessConcessionaria(ctx.scopes, concessionariaId)
}
