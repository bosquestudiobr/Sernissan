import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { signOutAction } from '@/server/actions/auth'
import { requireCurrentUser } from '@/lib/permissions'
import {
  getCurrentOrganizationalContext,
} from '@/server/queries/organizational-context'
import { getAllowedSidebarItems } from '@/server/queries/sidebar'
import { flattenSidebarItems } from '@/lib/navigation/sidebar-tree'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const user = await requireCurrentUser()
  const [context, sidebarItems] = await Promise.all([
    getCurrentOrganizationalContext(user.id),
    getAllowedSidebarItems(user),
  ])

  return (
    <>
      <PageTitleActions
        title="Inicio"
        description="Area autenticada do SerNissan com contexto organizacional ativo."
        actions={
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="h-9">
              Sair
            </Button>
          </form>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--sn-muted)]">
            Usuario
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Nome</dt>
              <dd className="font-medium text-[var(--sn-text)]">{user.nome}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">E-mail</dt>
              <dd className="text-sm text-[var(--sn-text)]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Perfil</dt>
              <dd className="text-sm text-[var(--sn-text)]">{user.perfilLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Nivel</dt>
              <dd className="text-sm text-[var(--sn-text)]">{user.perfilNivel}</dd>
            </div>
          </dl>
        </DataCard>

        <DataCard>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--sn-muted)]">
            Contexto organizacional
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Empresa</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.empresa}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Pais</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.pais}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Divisao</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.divisao}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Setor</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.setor}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Grupo</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.grupo}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--sn-muted)]">Concessionaria</dt>
              <dd className="font-medium text-[var(--sn-text)]">{context.concessionaria}</dd>
            </div>
          </dl>
        </DataCard>
      </div>

      <DataCard className="mt-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--sn-muted)]">
          Modulos disponiveis
        </h2>
        {sidebarItems.length === 0 ? (
          <p className="text-sm text-[var(--sn-muted)]">Nenhum modulo liberado para seu perfil.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {flattenSidebarItems(sidebarItems).map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-3 py-2 text-sm text-[var(--sn-text)]"
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </DataCard>
    </>
  )
}
