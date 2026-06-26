import type { AppModule, CurrentUserView } from '@/lib/types/user'
import { buildSidebarTree } from '@/lib/navigation/sidebar-tree'
import { mapBubbleIconToLucide, resolveModuleHref } from '@/lib/navigation'
import { fixUtf8Mojibake } from '@/lib/text/encoding'
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

async function loadPerfilNivelMap(): Promise<Map<string, number>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_options')
    .select('db_value, metadata')
    .eq('option_set', 'perfil')
    .eq('is_deleted', false)

  if (error) throw error

  const map = new Map<string, number>()
  for (const row of data ?? []) {
    if (!row.db_value) continue
    const nivel = (row.metadata as { nivel?: number } | null)?.nivel
    map.set(row.db_value, typeof nivel === 'number' ? nivel : 7)
  }
  return map
}

function canAccessByLevel(userNivel: number, maxNivel: number): boolean {
  return userNivel <= maxNivel
}

export async function getAllowedSidebarItems(user: CurrentUserView): Promise<AppModule[]> {
  const supabase = await createClient()
  const [pagesRes, nivelMap] = await Promise.all([
    supabase
      .from('app_options')
      .select('key, label, db_value, sort_order, metadata, is_deleted')
      .eq('option_set', 'pages')
      .order('sort_order', { ascending: true }),
    loadPerfilNivelMap(),
  ])

  if (pagesRes.error) throw pagesRes.error

  const pages = (pagesRes.data ?? []) as PageRow[]
  const perfilNivel = user.perfilNivel
  const flat: Parameters<typeof buildSidebarTree>[0] = []

  for (const page of pages) {
    if (page.is_deleted) continue

    const metadata = page.metadata ?? {}
    if (!metadata.show_melu_lateral) continue

    const maxNivel = nivelMap.get(metadata.max_nivel ?? '') ?? 7
    if (!canAccessByLevel(perfilNivel, maxNivel)) continue

    const dbValue = page.db_value ?? page.key

    flat.push({
      id: page.key,
      dbValue,
      label: fixUtf8Mojibake(metadata.label ?? page.label ?? dbValue),
      href: resolveModuleHref(dbValue),
      icon: mapBubbleIconToLucide(metadata.icon),
      sortOrder: page.sort_order ?? 0,
      menuPai: metadata.menu_pai ?? null,
    })
  }

  return buildSidebarTree(flat)
}
