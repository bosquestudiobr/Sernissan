import Link from 'next/link'

import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { signOutAction } from '@/server/actions/auth'
import { getCurrentUserView } from '@/server/queries/auth'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const user = await getCurrentUserView()

  return (
  <>
      <PageTitleActions
        title="Inicio"
        description="Area autenticada do SerNissan — Fase 1 (placeholder)."
        actions={
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="h-9">
              Sair
            </Button>
          </form>
        }
      />

      <DataCard>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">Aplicativo</dt>
            <dd className="text-lg font-semibold text-[var(--sn-text)]">SerNissan</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">Usuario</dt>
            <dd className="text-lg font-semibold text-[var(--sn-text)]">{user?.nome}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">E-mail</dt>
            <dd className="text-sm text-[var(--sn-text)]">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">Perfil</dt>
            <dd className="text-sm text-[var(--sn-text)]">{user?.perfil}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">Status</dt>
            <dd className="text-sm text-[var(--sn-text)]">
              {user?.ativo === false ? 'Inativo' : user?.aprovado === false ? 'Aguardando aprovacao' : 'Ativo'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">Ambiente</dt>
            <dd className="text-sm font-medium text-[var(--sn-red)]">QA</dd>
          </div>
        </dl>

        <p className="mt-6 text-sm text-[var(--sn-muted)]">
          O header, sidebar e footer seguem o layout Bubble. Os seletores de contexto serao conectados na Fase 2.
        </p>
        </DataCard>
    </>
  )
}

