import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ListParams, PaginatedResult } from '@/lib/types/pagination'
import { buildPageCount, rangeFromPage, resolveSortColumn } from '@/server/queries/list-helpers'
import { getPerfilLabel, getPerfilNivel } from '@/server/queries/scopes'
import type { ScopeContext } from '@/server/queries/admin/lists'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'

export type UsuarioListRow = {
  id: string
  nome: string | null
  email: string | null
  perfil: string | null
  perfilLabel: string
  perfilNivel: number
  ativo: boolean | null
  aprovado: boolean | null
  empresa: string | null
  setor: string | null
  grupo: string | null
  concessionaria: string | null
  area: string | null
  funcao: string | null
  created_at: string
}

async function resolveEmailSearchIds(search: string): Promise<string[] | null> {
  if (!search.includes('@')) return null
  const admin = createAdminClient()
  const pattern = search.toLowerCase()
  const ids: string[] = []
  let page = 1
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const users = data.users ?? []
    users.forEach((user) => {
      if (user.email?.toLowerCase().includes(pattern)) ids.push(user.id)
    })
    if (users.length < 200) break
    page += 1
  }
  return ids
}

async function getEmailsMap(ids: string[]): Promise<Record<string, string>> {
  if (ids.length === 0) return {}
  const admin = createAdminClient()
  const entries = await Promise.all(
    ids.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id)
      return [id, data.user?.email ?? null] as const
    }),
  )
  return Object.fromEntries(entries.filter((entry): entry is [string, string] => Boolean(entry[1])))
}

export async function listUsuarios(
  params: ListParams,
  ctx: ScopeContext,
): Promise<PaginatedResult<UsuarioListRow>> {
  const supabase = await createClient()
  let query = supabase
    .from('profiles')
    .select(
      'id, nome, perfil, ativo, aprovado, empresa, setor, grupo, concessionaria, area, funcao, created_at',
      { count: 'exact' },
    )

  const empresaFilter = params.filters.empresa ?? ctx.empresaId ?? ctx.user.empresaId
  if (empresaFilter) query = query.eq('empresa', empresaFilter)
  if (params.filters.perfil) query = query.eq('perfil', params.filters.perfil)
  if (params.filters.ativo === 'true') query = query.eq('ativo', true)
  if (params.filters.ativo === 'false') query = query.eq('ativo', false)
  if (params.filters.aprovado === 'true') query = query.eq('aprovado', true)
  if (params.filters.aprovado === 'false') query = query.eq('aprovado', false)
  if (params.filters.grupo) query = query.eq('grupo', params.filters.grupo)
  if (params.filters.concessionaria) query = query.eq('concessionaria', params.filters.concessionaria)
  if (params.filters.area) query = query.eq('area', params.filters.area)
  if (params.filters.funcao) query = query.eq('funcao', params.filters.funcao)

  if (!isHighPrivilegeScope(ctx.scopes.perfilNivel) && ctx.scopes.grupoIds.length > 0) {
    query = query.in('grupo', ctx.scopes.grupoIds)
  }

  if (params.search) {
    const emailIds = await resolveEmailSearchIds(params.search)
    if (emailIds) {
      if (emailIds.length === 0) {
        return { data: [], page: params.page, pageSize: params.pageSize, total: 0, pageCount: 1 }
      }
      query = query.in('id', emailIds)
    } else {
      query = query.ilike('nome', `%${params.search}%`)
    }
  }

  const sortCol = resolveSortColumn(params.sort, ['nome', 'created_at'], 'nome')
  query = query.order(sortCol, { ascending: params.sortDir === 'asc' })
  const { from, to } = rangeFromPage(params.page, params.pageSize)
  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  const rows = data ?? []
  const emails = await getEmailsMap(rows.map((row) => row.id))
  const enriched: UsuarioListRow[] = await Promise.all(
    rows.map(async (row) => {
      const perfilNivel = await getPerfilNivel(row.perfil)
      const perfilLabel = await getPerfilLabel(row.perfil)
      return {
        ...row,
        email: emails[row.id] ?? null,
        perfilLabel,
        perfilNivel,
      }
    }),
  )

  const total = count ?? 0
  return {
    data: enriched,
    page: params.page,
    pageSize: params.pageSize,
    total,
    pageCount: buildPageCount(total, params.pageSize),
  }
}

export async function getUsuarioById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, nome, perfil, ativo, aprovado, empresa, setor, divisao, grupo, concessionaria, area, funcao, created_at',
    )
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const admin = createAdminClient()
  const { data: authData } = await admin.auth.admin.getUserById(id)
  const perfilNivel = await getPerfilNivel(data.perfil)
  const perfilLabel = await getPerfilLabel(data.perfil)

  return {
    ...data,
    email: authData.user?.email ?? null,
    perfilNivel,
    perfilLabel,
  }
}

export async function getUsuarioVinculos(profileId: string) {
  const supabase = await createClient()
  const [{ data: grupos }, { data: concessionarias }, { data: areas }] = await Promise.all([
    supabase.from('profiles_grupos_disponiveis').select('grupo_id').eq('profiles_id', profileId),
    supabase
      .from('profiles_concessionarias_equipe')
      .select('concessionaria_id')
      .eq('profiles_id', profileId),
    supabase
      .from('profiles_areas_disponiveis')
      .select('setor_concessionaria_id')
      .eq('profiles_id', profileId),
  ])

  return {
    grupoIds: grupos?.map((row) => row.grupo_id) ?? [],
    concessionariaIds: concessionarias?.map((row) => row.concessionaria_id) ?? [],
    areaIds: areas?.map((row) => row.setor_concessionaria_id) ?? [],
  }
}

