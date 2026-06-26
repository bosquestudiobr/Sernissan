import type { ReactNode } from 'react'

import { AppFooter } from '@/components/app-shell/AppFooter'
import { AppHeader } from '@/components/app-shell/AppHeader'
import { AppSidebar } from '@/components/app-shell/AppSidebar'
import type { CurrentUserView, OrganizationalContextView } from '@/lib/types/user'
import { cn } from '@/lib/utils'

type AppShellProps = {
  children: ReactNode
  user: CurrentUserView
  context: OrganizationalContextView
  activeModuleId?: string
}

export function AppShell({ children, user, context, activeModuleId = 'home' }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--sn-bg)]">
      <AppHeader user={user} context={context} />
      <div className="flex flex-1">
        <AppSidebar activeModuleId={activeModuleId} />
        <main className={cn('flex min-w-0 flex-1 flex-col')}>{children}</main>
      </div>
      <AppFooter />
    </div>
  )
}
