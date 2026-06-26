'use client'

import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileText,
  Grid3x3,
  Home,
  LayoutGrid,
  Settings,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { findExpandedParentIds } from '@/lib/navigation/sidebar-tree'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { AppModule } from '@/lib/types/user'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  Home,
  BarChart3,
  Trophy,
  Grid3x3,
  FileText,
  Settings,
  LayoutGrid,
  Calendar,
  BookOpen,
  Circle,
}

type AppSidebarProps = {
  items: AppModule[]
  activeModuleId?: string
}

function isItemActive(pathname: string | null, href: string) {
  const path = pathname ?? ''
  return path === href || (href !== '/' && path.startsWith(href))
}

function isBranchActive(pathname: string | null, item: AppModule) {
  if (isItemActive(pathname, item.href)) return true
  return item.children?.some((child) => isItemActive(pathname, child.href)) ?? false
}

export function AppSidebar({ items, activeModuleId }: AppSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [flyoutId, setFlyoutId] = useState<string | null>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)

  const autoExpanded = useMemo(() => findExpandedParentIds(items, pathname), [items, pathname])

  function isGroupOpen(id: string) {
    return openGroups.has(id) || autoExpanded.includes(id)
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!flyoutRef.current?.contains(event.target as Node)) setFlyoutId(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const flyoutItem = useMemo(
    () => items.find((item) => item.id === flyoutId && item.children?.length),
    [flyoutId, items],
  )

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <aside
      className={cn(
        'sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 border-r border-[var(--sn-border)] bg-[var(--sn-card)] transition-all md:flex md:flex-col',
        expanded ? 'w-56' : 'w-[72px]',
      )}
    >
      <div className="flex justify-center py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex size-8 items-center justify-center rounded-md bg-[var(--sn-red)] text-white hover:bg-[var(--sn-red-dark)]"
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
        >
          {expanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      <nav className="relative flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4">
        {items.map((item) => (
          <SidebarNode
            key={item.id}
            item={item}
            pathname={pathname}
            activeModuleId={activeModuleId}
            expanded={expanded}
            open={isGroupOpen(item.id)}
            onToggle={() => toggleGroup(item.id)}
            onFlyout={() => setFlyoutId((current) => (current === item.id ? null : item.id))}
            flyoutOpen={flyoutId === item.id}
          />
        ))}

        {!expanded && flyoutItem?.children ? (
          <div
            ref={flyoutRef}
            className="absolute left-[calc(100%+4px)] top-16 z-50 min-w-[200px] rounded-md border border-[var(--sn-border)] bg-white py-1 shadow-lg"
          >
            <p className="border-b border-[var(--sn-border)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--sn-muted)]">
              {flyoutItem.label}
            </p>
            {flyoutItem.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                onClick={() => setFlyoutId(null)}
                className={cn(
                  'block px-3 py-2 text-sm hover:bg-[var(--sn-field)]',
                  isItemActive(pathname, child.href) ? 'font-medium text-[var(--sn-red)]' : 'text-[var(--sn-text)]',
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </aside>
  )
}

function SidebarNode({
  item,
  pathname,
  activeModuleId,
  expanded,
  open,
  onToggle,
  onFlyout,
  flyoutOpen,
}: {
  item: AppModule
  pathname: string
  activeModuleId?: string
  expanded: boolean
  open: boolean
  onToggle: () => void
  onFlyout: () => void
  flyoutOpen: boolean
}) {
  const Icon = ICONS[item.icon] ?? Home
  const hasChildren = Boolean(item.children?.length)
  const active = item.id === activeModuleId || isBranchActive(pathname, item)

  if (hasChildren) {
    if (!expanded) {
      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={onFlyout}
                className={cn(
                  'flex w-full items-center justify-center rounded-md px-0 py-2 text-sm transition-colors',
                  active || flyoutOpen
                    ? 'bg-[var(--sn-red)]/10 text-[var(--sn-red)]'
                    : 'text-[var(--sn-muted)] hover:bg-[var(--sn-field)] hover:text-[var(--sn-text)]',
                )}
              />
            }
          >
            <Icon className="size-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      )
    }

    return (
      <div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
            active ? 'bg-[var(--sn-red)]/10 text-[var(--sn-red)]' : 'text-[var(--sn-muted)] hover:bg-[var(--sn-field)] hover:text-[var(--sn-text)]',
          )}
        >
          <Icon className="size-5 shrink-0" />
          <span className="flex-1 truncate font-medium">{item.label}</span>
          <ChevronDown className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')} />
        </button>
        {open ? (
          <div className="ml-3 mt-1 space-y-0.5 border-l border-[var(--sn-border)] pl-3">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                className={cn(
                  'block rounded-md px-2 py-1.5 text-sm transition-colors',
                  isItemActive(pathname, child.href)
                    ? 'bg-[var(--sn-red)]/10 font-medium text-[var(--sn-red)]'
                    : 'text-[var(--sn-muted)] hover:bg-[var(--sn-field)] hover:text-[var(--sn-text)]',
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  const link = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-[var(--sn-red)]/10 text-[var(--sn-red)]'
          : 'text-[var(--sn-muted)] hover:bg-[var(--sn-field)] hover:text-[var(--sn-text)]',
        expanded ? 'justify-start' : 'justify-center px-0',
      )}
    >
      <Icon className="size-5 shrink-0" />
      {expanded ? <span className="truncate font-medium">{item.label}</span> : null}
    </Link>
  )

  if (expanded) return <div>{link}</div>

  return (
    <Tooltip>
      <TooltipTrigger className="w-full">{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
