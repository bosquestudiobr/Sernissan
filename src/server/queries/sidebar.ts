import type { AppModule, CurrentUserView } from '@/lib/types/user'
import { mapBubbleIconToLucide, resolveModuleHref } from '@/lib/navigation'
import { createClient } from '@/lib/supabase/server'

type PageMetadata = {
  icon?: string
  label?: string
  menu_pai?: string
  max_nivel?: string
  show_melu_lateral?: boolean
}

type PageRow = {
  key: string
  label: string | null
  db_value: string | null
  sort_order: number | null
  metadata: PageMetadata | null
  is_deleted: boolean | null
}

async function getMaxNivelValue(maxNivelDbValue: string | null | undefined): Promise<number> {
  if (!maxNivelDbValue) return 7

  const supabase = await createClient()
  const { data } = await supabase
    .from('app_options')
    .select('metadata')
    .eq('option_set', 'perfil')
    .eq('db_value', maxNivelDbValue)
    .eq('is_deleted', false)
    .maybeSingle()

  const nivel = (data?.metadata as { nivel?: number } | null)?.nivel
  return typeof nivel === 'number' ? nivel : 7
}

function canAccessByLevel(userNivel: number, maxNivel: number): boolean {
  return userNivel <= maxNivel
}

export async function getAllowedSidebarItems(user: CurrentUserView): Promise<AppModule[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_options')
    .select('key, label, db_value, sort_order, metadata, is_deleted')
    .eq('option_set', 'pages')
    .order('sort_order', { ascending: true })

  if (error) throw error

  const pages = (data ?? []) as PageRow[]
  const perfilNivel = user.perfilNivel

  const visible: AppModule[] = []

  for (const page of pages) {
    if (page.is_deleted) continue

    const metadata = page.metadata ?? {}
    if (!metadata.show_melu_lateral) continue
    if (!metadata.icon) continue

    const maxNivel = await getMaxNivelValue(metadata.max_nivel)
    if (!canAccessByLevel(perfilNivel, maxNivel)) continue

    const dbValue = page.db_value ?? page.key
  visible.push({
      id: page.key,
      dbValue,
      label: metadata.label ?? page.label ?? dbValue,
      href: resolveModuleHref(dbValue),
      icon: mapBubbleIconToLucide(metadata.icon),
    })
  }

  return visible
}
