import { createClient } from '@/lib/supabase/server'
import type { CurrentUserView } from '@/lib/types/user'

import { getPerfilLabel, getPerfilNivel } from './scopes'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

export async function getProfileByAuthId(authUserId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, perfil, foto, ativo, aprovado, empresa')
    .eq('id', authUserId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCurrentUserView(): Promise<CurrentUserView | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const profile = await getProfileByAuthId(user.id)
  const fallbackName = user.email?.split('@')[0] ?? 'Usuario'
  const perfilDbValue = profile?.perfil ?? null
  const [perfilNivel, perfilLabel] = await Promise.all([
    getPerfilNivel(perfilDbValue),
    getPerfilLabel(perfilDbValue),
  ])

  return {
    id: user.id,
    email: user.email ?? '',
    nome: profile?.nome ?? fallbackName,
    perfil: perfilLabel,
    perfilDbValue,
    perfilLabel,
    perfilNivel,
    avatarUrl: profile?.foto ?? null,
    ativo: profile?.ativo ?? null,
    aprovado: profile?.aprovado ?? null,
    empresaId: profile?.empresa ?? null,
  }
}
