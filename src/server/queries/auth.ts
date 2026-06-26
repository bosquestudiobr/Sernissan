import { createClient } from '@/lib/supabase/server'
import type { CurrentUserView } from '@/lib/types/user'

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
    .select('id, nome, perfil, foto, ativo, aprovado')
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

  return {
    id: user.id,
    email: user.email ?? '',
    nome: profile?.nome ?? fallbackName,
    perfil: profile?.perfil ?? 'Colaborador',
    avatarUrl: profile?.foto ?? null,
    ativo: profile?.ativo ?? null,
    aprovado: profile?.aprovado ?? null,
  }
}
