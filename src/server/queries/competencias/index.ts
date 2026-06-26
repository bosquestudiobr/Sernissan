import { createClient } from '@/lib/supabase/server'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { CompetencyFiltersSchema } from '@/lib/validations/competencias'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'

export type CompetencyTab = 'mapas' | 'habitos'

export type CompetencyParams = {
  tab: CompetencyTab
  page: number
  pageSize: number
  q?: string
  areaId?: string
  funcaoId?: string
  concessionariaId?: string
  sort?: string
  sortDir: 'asc' | 'desc'
}

export type CompetencyMapRow = {
  id: string
  versao: string | null
  entrega: string | null
  para_que: string | null
  funcaoMapa: string | null
  funcaoNome: string | null
  habitoCount: number
  data: string | null
  habitoIds: string[]
  created_at: string
}

export type CompetencyMapDetail = CompetencyMapRow

export type CompetencyHabitRow = {
  id: string
  pergunta: string | null
  descricao: string | null
  mv: string | null
  area: string | null
  peso: number | null
  trilha: number | null
  essencial: boolean | null
  momentoDeVerdade: string | null
  created_at: string
}

export type CompetencyHabitDetail = CompetencyHabitRow & {
  id_2: string | null
}

export type CalibrationCollaboratorRow = {
  id: string
  nome: string | null
  foto: string | null
  areaNome: string | null
  funcaoNome: string | null
  concessionariaNome: string | null
  ativo: boolean | null
  aprovado: boolean | null
}

export type CompetencyQueryContext = {
  scopes: UserScopes
  orgContext: OrganizationalContextView
  empresaId?: string | null
}

export function parseCompetencyParams(
  searchParams: Record<string, string | string[] | undefined>,
): CompetencyParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const parsed = CompetencyFiltersSchema.safeParse({
    tab: get('tab'),
    page: get('page'),
    pageSize: get('pageSize'),
    q: get('q'),
    areaId: get('areaId'),
    funcaoId: get('funcaoId'),
    concessionariaId: get('concessionariaId'),
    sort: get('sort'),
    sortDir: get('sortDir'),
  })

  const data = parsed.success ? parsed.data : { page: 1, pageSize: 20, sortDir: 'asc' as const }

  return {
    tab: data.tab ?? 'mapas',
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 20,
    q: data.q,
    areaId: data.areaId,
    funcaoId: data.funcaoId,
    concessionariaId: data.concessionariaId,
    sort: data.sort,
    sortDir: data.sortDir ?? 'desc',
  }
}

async function getFuncaoIdsForEmpresa(empresaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('funcao_colaborador').select('id').eq('empresa', empresaId)
  if (error) throw error
  return data?.map((r) => r.id) ?? []
}

async function getFuncaoIdsByArea(areaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('funcao_colaborador').select('id').eq('area', areaId)
  if (error) throw error
  return data?.map((r) => r.id) ?? []
}

async function getFuncaoNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (ids.length === 0) return map
  const supabase = await createClient()
  const { data, error } = await supabase.from('funcao_colaborador').select('id, nome').in('id', ids)
  if (error) throw error
  for (const r of data ?? []) map.set(r.id, r.nome ?? r.id)
  return map
}

async function getHabitoIdsByMap(mapIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>()
  if (mapIds.length === 0) return map
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('competencia_mapa_habitos')
    .select('competencia_mapa_id, competencia_habito_id')
    .in('competencia_mapa_id', mapIds)
  if (error) throw error
  for (const r of data ?? []) {
    const arr = map.get(r.competencia_mapa_id) ?? []
    arr.push(r.competencia_habito_id)
    map.set(r.competencia_mapa_id, arr)
  }
  return map
}

function intersect(a: string[] | null, b: string[]): string[] | null {
  if (a === null) return b
  const set = new Set(b)
  return a.filter((id) => set.has(id))
}

export async function getCompetencyFilterOptions(ctx: CompetencyQueryContext) {
  const supabase = await createClient()
  const empresaId = ctx.empresaId ?? ctx.scopes.empresaId

  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  let funcoesQuery = supabase.from('funcao_colaborador').select('id, nome').order('nome')
  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) {
    areasQuery = areasQuery.eq('empresa', empresaId)
    funcoesQuery = funcoesQuery.eq('empresa', empresaId)
    concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
  }
  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    concessionariasQuery = concessionariasQuery.in('id', ctx.scopes.concessionariaIds)
  }

  const [{ data: areas }, { data: funcoes }, { data: concessionarias }] = await Promise.all([
    areasQuery,
    funcoesQuery,
    concessionariasQuery,
  ])
  return {
    areas: (areas ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
    funcoes: (funcoes ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
    concessionarias: (concessionarias ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id })),
  }
}

export async function listCompetencyMaps(
  params: CompetencyParams,
  ctx: CompetencyQueryContext,
): Promise<PaginatedResult<CompetencyMapRow>> {
  const supabase = await createClient()
  const empresaId = ctx.empresaId ?? ctx.scopes.empresaId

  let allowedFuncoes: string[] | null = null
  if (empresaId) allowedFuncoes = await getFuncaoIdsForEmpresa(empresaId)
  if (params.areaId) allowedFuncoes = intersect(allowedFuncoes, await getFuncaoIdsByArea(params.areaId))
  if (params.funcaoId) allowedFuncoes = intersect(allowedFuncoes, [params.funcaoId])

  if (allowedFuncoes !== null && allowedFuncoes.length === 0) {
    return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 1 }
  }

  let query = supabase
    .from('competencia_mapa')
    .select('id, data, versao, entrega, para_que, funcao_mapa, created_at', { count: 'exact' })

  if (allowedFuncoes !== null) query = query.in('funcao_mapa', allowedFuncoes)
  if (params.q) {
    const pattern = `%${params.q}%`
    query = query.or(`versao.ilike.${pattern},entrega.ilike.${pattern},para_que.ilike.${pattern}`)
  }

  const sortCol = resolveSortColumn(params.sort, ['versao', 'created_at', 'data'], 'created_at')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const funcaoIds = [...new Set(rows.map((r) => r.funcao_mapa).filter(Boolean) as string[])]
  const [funcaoNames, habitoIdsMap] = await Promise.all([
    getFuncaoNames(funcaoIds),
    getHabitoIdsByMap(rows.map((r) => r.id)),
  ])

  const mapped: CompetencyMapRow[] = rows.map((r) => ({
    id: r.id,
    versao: r.versao,
    entrega: r.entrega,
    para_que: r.para_que,
    funcaoMapa: r.funcao_mapa,
    funcaoNome: r.funcao_mapa ? funcaoNames.get(r.funcao_mapa) ?? null : null,
    habitoCount: (habitoIdsMap.get(r.id) ?? []).length,
    data: r.data,
    habitoIds: habitoIdsMap.get(r.id) ?? [],
    created_at: r.created_at,
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

export async function listCompetencyHabits(
  params: CompetencyParams,
): Promise<PaginatedResult<CompetencyHabitRow>> {
  const supabase = await createClient()
  let query = supabase
    .from('competencia_habito')
    .select('id, pergunta, descricao, mv, area, peso, trilha, essencial, momento_de_verdade, created_at', {
      count: 'exact',
    })

  if (params.q) {
    const pattern = `%${params.q}%`
    query = query.or(`pergunta.ilike.${pattern},descricao.ilike.${pattern},mv.ilike.${pattern}`)
  }

  const sortCol = resolveSortColumn(params.sort, ['trilha', 'created_at', 'peso'], 'trilha')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc', nullsFirst: false })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const mapped: CompetencyHabitRow[] = (data ?? []).map((r) => ({
    id: r.id,
    pergunta: r.pergunta,
    descricao: r.descricao,
    mv: r.mv,
    area: r.area,
    peso: r.peso,
    trilha: r.trilha,
    essencial: r.essencial,
    momentoDeVerdade: r.momento_de_verdade,
    created_at: r.created_at,
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

export async function listCalibrationCollaborators(
  params: CompetencyParams,
  ctx: CompetencyQueryContext,
): Promise<PaginatedResult<CalibrationCollaboratorRow>> {
  const supabase = await createClient()
  const empresaId = ctx.empresaId ?? ctx.scopes.empresaId

  let query = supabase
    .from('profiles')
    .select('id, nome, foto, area, funcao, concessionaria, ativo, aprovado', { count: 'exact' })
    .eq('ativo', true)
    .eq('aprovado', true)

  if (empresaId) query = query.eq('empresa', empresaId)
  if (ctx.orgContext.concessionariaId) {
    query = query.eq('concessionaria', ctx.orgContext.concessionariaId)
  } else if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.concessionariaIds.length > 0) {
    query = query.in('concessionaria', ctx.scopes.concessionariaIds)
  }
  if (params.concessionariaId) query = query.eq('concessionaria', params.concessionariaId)
  if (params.areaId) query = query.eq('area', params.areaId)
  if (params.funcaoId) query = query.eq('funcao', params.funcaoId)
  if (params.q) query = query.ilike('nome', `%${params.q}%`)

  query = query.order('nome', { ascending: true, nullsFirst: false })

  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const areaIds = [...new Set(rows.map((r) => r.area).filter(Boolean) as string[])]
  const funcaoIds = [...new Set(rows.map((r) => r.funcao).filter(Boolean) as string[])]
  const concessionariaIds = [...new Set(rows.map((r) => r.concessionaria).filter(Boolean) as string[])]

  const [areaNames, funcaoNames, concessionariaNames] = await Promise.all([
    (async () => {
      const m = new Map<string, string>()
      if (areaIds.length === 0) return m
      const { data: d } = await supabase.from('setor_concessionaria').select('id, nome').in('id', areaIds)
      for (const r of d ?? []) m.set(r.id, r.nome ?? r.id)
      return m
    })(),
    getFuncaoNames(funcaoIds),
    (async () => {
      const m = new Map<string, string>()
      if (concessionariaIds.length === 0) return m
      const { data: d } = await supabase.from('concessionaria').select('id, nome').in('id', concessionariaIds)
      for (const r of d ?? []) m.set(r.id, r.nome ?? r.id)
      return m
    })(),
  ])

  const mapped: CalibrationCollaboratorRow[] = rows.map((r) => ({
    id: r.id,
    nome: r.nome,
    foto: r.foto,
    areaNome: r.area ? areaNames.get(r.area) ?? null : null,
    funcaoNome: r.funcao ? funcaoNames.get(r.funcao) ?? null : null,
    concessionariaNome: r.concessionaria ? concessionariaNames.get(r.concessionaria) ?? null : null,
    ativo: r.ativo,
    aprovado: r.aprovado,
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

export async function getCompetencyMapById(id: string): Promise<CompetencyMapDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('competencia_mapa')
    .select('id, data, versao, entrega, para_que, funcao_mapa, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const [funcaoNames, habitoIds] = await Promise.all([
    data.funcao_mapa ? getFuncaoNames([data.funcao_mapa]) : Promise.resolve(new Map<string, string>()),
    getCompetencyMapHabitLinks(id),
  ])

  return {
    id: data.id,
    versao: data.versao,
    entrega: data.entrega,
    para_que: data.para_que,
    funcaoMapa: data.funcao_mapa,
    funcaoNome: data.funcao_mapa ? funcaoNames.get(data.funcao_mapa) ?? null : null,
    habitoCount: habitoIds.length,
    data: data.data,
    created_at: data.created_at,
    habitoIds,
  }
}

export async function getCompetencyHabitById(id: string): Promise<CompetencyHabitDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('competencia_habito')
    .select('id, id_2, pergunta, descricao, mv, area, peso, trilha, essencial, momento_de_verdade, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    id: data.id,
    id_2: data.id_2,
    pergunta: data.pergunta,
    descricao: data.descricao,
    mv: data.mv,
    area: data.area,
    peso: data.peso,
    trilha: data.trilha,
    essencial: data.essencial,
    momentoDeVerdade: data.momento_de_verdade,
    created_at: data.created_at,
  }
}

export async function getCompetencyMapHabitLinks(mapId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('competencia_mapa_habitos')
    .select('competencia_habito_id')
    .eq('competencia_mapa_id', mapId)
  if (error) throw error
  return data?.map((r) => r.competencia_habito_id) ?? []
}

export async function getCompetencyHabitOptions(): Promise<{ id: string; label: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('competencia_habito')
    .select('id, pergunta, mv')
    .order('trilha', { ascending: true, nullsFirst: false })
    .limit(500)
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    label: [r.mv, r.pergunta].filter(Boolean).join(' — ') || r.id,
  }))
}

