import { createClient } from '@/lib/supabase/server'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import type { UserScopes } from '@/lib/types/user'

type ProfileScopeRow = {
  setor: string | null
  grupo: string | null
  concessionaria: string | null
  empresa: string | null
  perfil: string | null
}

export async function getPerfilNivel(perfilDbValue: string | null): Promise<number> {
  if (!perfilDbValue) return 7

  const supabase = await createClient()
  const { data } = await supabase
    .from('app_options')
    .select('metadata')
    .eq('option_set', 'perfil')
    .eq('db_value', perfilDbValue)
    .eq('is_deleted', false)
    .maybeSingle()

  const nivel = (data?.metadata as { nivel?: number } | null)?.nivel
  return typeof nivel === 'number' ? nivel : 7
}

export async function getPerfilLabel(perfilDbValue: string | null): Promise<string> {
  if (!perfilDbValue) return 'Colaborador'

  const supabase = await createClient()
  const { data } = await supabase
    .from('app_options')
    .select('label')
    .eq('option_set', 'perfil')
    .eq('db_value', perfilDbValue)
    .eq('is_deleted', false)
    .maybeSingle()

  return data?.label ?? perfilDbValue
}

export async function getUserScopes(userId: string): Promise<UserScopes> {
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('setor, grupo, concessionaria, empresa, perfil')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) throw profileError

  const perfilNivel = await getPerfilNivel(profile?.perfil ?? null)
  const row = (profile ?? {}) as ProfileScopeRow

  const setorIds = new Set<string>()
  const grupoIds = new Set<string>()
  const concessionariaIds = new Set<string>()

  if (row.setor) setorIds.add(row.setor)
  if (row.grupo) grupoIds.add(row.grupo)
  if (row.concessionaria) concessionariaIds.add(row.concessionaria)

  const [{ data: gruposExtras }, { data: concExtras }] = await Promise.all([
    supabase.from('profiles_grupos_disponiveis').select('grupo_id').eq('profiles_id', userId),
    supabase
      .from('profiles_concessionarias_equipe')
      .select('concessionaria_id')
      .eq('profiles_id', userId),
  ])

  gruposExtras?.forEach((item) => grupoIds.add(item.grupo_id))
  concExtras?.forEach((item) => concessionariaIds.add(item.concessionaria_id))

  if (grupoIds.size > 0) {
    const { data: grupos } = await supabase
      .from('grupo')
      .select('id, setor')
      .in('id', [...grupoIds])

    grupos?.forEach((grupo) => {
      if (grupo.setor) setorIds.add(grupo.setor)
    })

    const { data: grupoConcessionarias } = await supabase
      .from('grupo_concessionarias')
      .select('concessionaria_id')
      .in('grupo_id', [...grupoIds])

    grupoConcessionarias?.forEach((item) => concessionariaIds.add(item.concessionaria_id))
  }

  if (isHighPrivilegeScope(perfilNivel) && row.empresa) {
    const [setoresRes, gruposRes, concsRes] = await Promise.all([
      supabase.from('setores').select('id').eq('empresa', row.empresa),
      supabase.from('grupo').select('id, setor').eq('empresa', row.empresa),
      supabase.from('concessionaria').select('id').eq('empresa', row.empresa),
    ])

    setoresRes.data?.forEach((item) => setorIds.add(item.id))
    gruposRes.data?.forEach((item) => {
      grupoIds.add(item.id)
      if (item.setor) setorIds.add(item.setor)
    })
    concsRes.data?.forEach((item) => concessionariaIds.add(item.id))
  }

  return {
    setorIds: [...setorIds],
    grupoIds: [...grupoIds],
    concessionariaIds: [...concessionariaIds],
    empresaId: row.empresa,
    perfilNivel,
  }
}
