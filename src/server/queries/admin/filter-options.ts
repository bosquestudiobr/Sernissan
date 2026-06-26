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