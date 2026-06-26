import type { CurrentUserView, OrganizationalContextView } from '@/lib/types/user'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { cn } from '@/lib/utils'

type AppHeaderProps = {
  user: CurrentUserView
  context: OrganizationalContextView
}

export function AppHeader({ user, context }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sn-border)] bg-[var(--sn-card)]">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <div className="flex min-w-[140px] items-center gap-2">
          <div className="text-lg font-bold tracking-tight text-[var(--sn-red)]">SERNISSAN</div>
        </div>

        <div className="hidden flex-1 items-center gap-3 lg:flex">
          <MockSelector label="Setor" value={context.setor} />
          <MockSelector label="Grupo" value={context.grupo} />
          <MockSelector label="Concessionaria" value={context.concessionaria} />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[var(--sn-text)]">{user.nome}</p>
            <p className="text-xs text-[var(--sn-muted)]">{user.perfil}</p>
          </div>
          <UserAvatar name={user.nome} imageUrl={user.avatarUrl} />
        </div>
      </div>
    </header>
  )
}

function MockSelector({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[140px]">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--sn-muted)]">{label}</p>
      <button
        type="button"
        disabled
        className={cn(
          'mt-0.5 flex h-8 w-full items-center rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-left text-xs text-[var(--sn-text)]',
          'cursor-not-allowed opacity-80',
        )}
        title="Seletores serao habilitados na Fase 2"
      >
        {value}
      </button>
    </div>
  )
}


