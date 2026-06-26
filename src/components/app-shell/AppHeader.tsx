import type { CurrentUserView, OrganizationalContextOptions, OrganizationalContextView } from '@/lib/types/user'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { ContextSummary } from '@/features/organizational-context/ContextSummary'
import { HeaderSelectors } from '@/features/organizational-context/HeaderSelectors'
import { HierarchyDialog } from '@/features/organizational-context/HierarchyDialog'

type AppHeaderProps = {
  user: CurrentUserView
  context: OrganizationalContextView
  options: OrganizationalContextOptions
}

export function AppHeader({ user, context, options }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sn-border)] bg-[var(--sn-card)]">
      <div className="flex h-14 items-center gap-3 px-4 lg:gap-4 lg:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <div className="text-lg font-bold tracking-tight text-[var(--sn-red)]">SERNISSAN</div>
          <HierarchyDialog context={context} options={options} />
        </div>

        <ContextSummary context={context} className="min-w-0 flex-1 lg:hidden" />

        <HeaderSelectors context={context} options={options} />

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[var(--sn-text)]">{user.nome}</p>
            <p className="text-xs text-[var(--sn-muted)]">{user.perfilLabel}</p>
          </div>
          <UserAvatar name={user.nome} imageUrl={user.avatarUrl} />
        </div>
      </div>
    </header>
  )
}
