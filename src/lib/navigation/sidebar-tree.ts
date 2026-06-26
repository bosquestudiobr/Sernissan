import type { AppModule } from '@/lib/types/user'

export type SidebarPageInput = {
  id: string
  dbValue: string
  label: string
  href: string
  icon: string
  sortOrder: number
  menuPai?: string | null
}

export function buildSidebarTree(pages: SidebarPageInput[]): AppModule[] {
  const byDb = new Map(pages.map((page) => [page.dbValue, page]))
  const childrenByParent = new Map<string, AppModule[]>()

  for (const page of pages) {
    if (!page.menuPai) continue
    if (!byDb.has(page.menuPai)) continue
    const child: AppModule = {
      id: page.id,
      dbValue: page.dbValue,
      label: page.label,
      href: page.href,
      icon: page.icon,
      sortOrder: page.sortOrder,
    }
    const list = childrenByParent.get(page.menuPai) ?? []
    list.push(child)
    childrenByParent.set(page.menuPai, list)
  }

  const roots: AppModule[] = []

  for (const page of pages) {
    if (page.menuPai) continue
    const children = (childrenByParent.get(page.dbValue) ?? []).sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
    roots.push({
      id: page.id,
      dbValue: page.dbValue,
      label: page.label,
      href: page.href,
      icon: page.icon,
      sortOrder: page.sortOrder,
      children: children.length > 0 ? children : undefined,
    })
  }

  return roots.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function flattenSidebarItems(items: AppModule[]): AppModule[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenSidebarItems(item.children) : [])])
}

export function isItemActive(pathname: string | null, href: string) {
  const path = pathname ?? ''
  return path === href || (href !== '/' && path.startsWith(href))
}

export function findActiveSidebarItem(items: AppModule[], pathname: string | null): AppModule | null {
  for (const item of flattenSidebarItems(items)) {
    if (isItemActive(pathname, item.href)) return item
  }
  return null
}

export function findExpandedParentIds(items: AppModule[], pathname: string | null): string[] {
  const expanded: string[] = []
  for (const item of items) {
    if (!item.children?.length) continue
    const childActive = item.children.some((child) => isItemActive(pathname, child.href))
    if (childActive) expanded.push(item.id)
  }
  return expanded
}
