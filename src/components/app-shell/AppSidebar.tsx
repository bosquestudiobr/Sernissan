'use client'

import {
  BarChart3,
  BookOpen,
  Calendar,
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
import { useState } from 'react'

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

export function AppSidebar({ items, activeModuleId }: AppSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

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

      <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? Home
          const isActive =
            item.id === activeModuleId ||
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          const link = (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--sn-red)]/10 text-[var(--sn-red)]'
                  : 'text-[var(--sn-muted)] hover:bg-[var(--sn-field)] hover:text-[var(--sn-text)]',
                expanded ? 'justify-start' : 'justify-center px-0',
              )}
            >
              <Icon className="size-5 shrink-0" />
              {expanded ? <span className="truncate font-medium">{item.label}</span> : null}
            </Link>
          )

          if (expanded) return <div key={item.id}>{link}</div>

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger className="w-full">{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </aside>
  )
}
