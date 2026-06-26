import { createClient } from '@/lib/supabase/server'
import type { FilterOption } from '@/server/queries/admin/filter-options'

export async function getRelationshipOptions(empresaId?: string | null) {
  const supabase = await createClient()

  let divisoesQuery = supabase.from('divisao').select('id, nome').order('nome')
  let setoresQuery = supabase.from('setores').select('id, nome').order('nome')
  let concessionariasQuery = supabase.from('concessionaria').select('id, nome').order('nome')
  let areasQuery = supabase.from('setor_concessionaria').select('id, nome').order('nome')
  let funcoesQuery = supabase.from('funcao_colaborador').select('id, nome').order('nome')

  if (empresaId) {
    divisoesQuery = divisoesQuery.eq('empresa', empresaId)
    setoresQuery = setoresQuery.eq('empresa', empresaId)
    concessionariasQuery = concessionariasQuery.eq('empresa', empresaId)
    areasQuery = areasQuery.eq('empresa', empresaId)
    funcoesQuery = funcoesQuery.eq('empresa', empresaId)
  }

  const [{ data: divisoes }, { data: setores }, { data: concessionarias }, { data: areas }, { data: funcoes }] =
    await Promise.all([divisoesQuery, setoresQuery, concessionariasQuery, areasQuery, funcoesQuery])

  const map = (rows: { id: string; nome: string | null }[] | null): FilterOption[] =>
    (rows ?? []).map((row) => ({ id: row.id, label: row.nome ?? row.id }))

  return {
    divisoes: map(divisoes),
    setores: map(setores),
    concessionarias: map(concessionarias),
    areas: map(areas),
    funcoes: map(funcoes),
  }
}

export async function getPaisDivisoesMap(paisIds: string[]) {
  if (paisIds.length === 0) return {} as Record<string, string[]>
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pais_divisoes')
    .select('pais_id, divisao_id')
    .in('pais_id', paisIds)
  if (error) throw error
  const map: Record<string, string[]> = {}
  data?.forEach((row) => {
    if (!map[row.pais_id]) map[row.pais_id] = []
    map[row.pais_id].push(row.divisao_id)
  })
  return map
}

export async function getDivisaoSetoresMap(divisaoIds: string[]) {
  if (divisaoIds.length === 0) return {} as Record<string, string[]>
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('divisao_setores')
    .select('divisao_id, setores_id')
    .in('divisao_id', divisaoIds)
  if (error) throw error
  const map: Record<string, string[]> = {}
  data?.forEach((row) => {
    if (!map[row.divisao_id]) map[row.divisao_id] = []
    map[row.divisao_id].push(row.setores_id)
  })
  return map
}

export async function getGrupoConcessionariasMap(grupoIds: string[]) {
  if (grupoIds.length === 0) return {} as Record<string, string[]>
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('grupo_concessionarias')
    .select('grupo_id, concessionaria_id')
    .in('grupo_id', grupoIds)
  if (error) throw error
  const map: Record<string, string[]> = {}
  data?.forEach((row) => {
    if (!map[row.grupo_id]) map[row.grupo_id] = []
    map[row.grupo_id].push(row.concessionaria_id)
  })
  return map
}
