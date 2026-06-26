import { createClient } from '@/lib/supabase/server'

export type FilterOption = { id: string; label: string }

export async function getAdminFilterOptions(empresaId?: string | null) {
  const supabase = await createClient()

  let empresasQuery = supabase.from('empresa').select('id, nome').order('nome')
  if (empresaId) empresasQuery = empresasQuery.eq('id', empresaId)
  const { data: empresas } = await empresasQuery

  let paisesQuery = supabase.from('pais').select('id, nome').order('nome')
  if (empresaId) paisesQuery = paisesQuery.eq('empresa', empresaId)
  const { data: paises } = await paisesQuery

  let divisoesQuery = supabase.from('divisao').select('id, nome').order('nome')
  if (empresaId) divisoesQuery = divisoesQuery.eq('empresa', empresaId)
  const { data: divisoes } = await divisoesQuery

  let setoresQuery = supabase.from('setores').select('id, nome').order('nome')
  if (empresaId) setoresQuery = setoresQuery.eq('empresa', empresaId)
  const { data: setores } = await setoresQuery

  let gruposQuery = supabase.from('grupo').select('id, nome').order('nome')
  if (empresaId) gruposQuery = gruposQuery.eq('empresa', empresaId)
  const { data: grupos } = await gruposQuery

  const map = (rows: { id: string; nome: string | null }[] | null): FilterOption[] =>
    (rows ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id }))

  return {
    empresas: map(empresas),
    paises: map(paises),
    divisoes: map(divisoes),
    setores: map(setores),
    grupos: map(grupos),
  }
}
export async function getAreaFuncaoFilterOptions(empresaId?: string | null) {
  const supabase = await createClient()

  let empresasQuery = supabase.from('empresa').select('id, nome').order('nome')
  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  if (empresaId) {
    empresasQuery = empresasQuery.eq('id', empresaId)
    areasQuery = areasQuery.eq('empresa', empresaId)
  }

  const [{ data: empresas }, { data: areas }] = await Promise.all([empresasQuery, areasQuery])
  const map = (rows: { id: string; nome: string | null }[] | null): FilterOption[] =>
    (rows ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id }))

  return { empresas: map(empresas), areas: map(areas) }
}

export async function getUserAdminFilterOptions(empresaId?: string | null) {
  const supabase = await createClient()
  const base = await getAdminFilterOptions(empresaId)

  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  let funcoesQuery = supabase.from('funcao_colaborador').select('id, nome').order('nome')
  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  if (empresaId) {
    areasQuery = areasQuery.eq('empresa', empresaId)
    funcoesQuery = funcoesQuery.eq('empresa', empresaId)
    concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
  }

  const [{ data: perfis }, { data: areas }, { data: funcoes }, { data: concessionarias }] = await Promise.all([
    supabase
      .from('app_options')
      .select('db_value, label')
      .eq('option_set', 'perfil')
      .eq('is_deleted', false)
      .order('sort_order'),
    areasQuery,
    funcoesQuery,
    concessionariasQuery,
  ])

  const map = (rows: { id: string; nome: string | null }[] | null): FilterOption[] =>
    (rows ?? []).map((r) => ({ id: r.id, label: r.nome ?? r.id }))

  return {
    ...base,
    perfis: (perfis ?? []).map((p) => ({ id: p.db_value, label: p.label ?? p.db_value })),
    areas: map(areas),
    funcoes: map(funcoes),
    concessionarias: map(concessionarias),
  }
}
