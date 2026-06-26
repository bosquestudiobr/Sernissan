import type { CurrentUserView, OrganizationalContextOptions, OrganizationalContextView } from '@/lib/types/user'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { HeaderSelectors } from '@/features/organizational-context/HeaderSelectors'

type AppHeaderProps = {
  user: CurrentUserView
  context: OrganizationalContextView
  options: OrganizationalContextOptions
}

export function AppHeader({ user, context, options }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sn-border)] bg-[var(--sn-card)]">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <div className="flex min-w-[140px] items-center gap-2">
          <div className="text-lg font-bold tracking-tight text-[var(--sn-red)]">SERNISSAN</div>
        </div>

        <HeaderSelectors context={context} options={options} />

        <div className="ml-auto flex items-center gap-3">
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
