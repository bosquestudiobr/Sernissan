import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { signOutAction } from '@/server/actions/auth'

type ForbiddenStateProps = {
  title?: string
  description?: string
}

export function ForbiddenState({
  title = 'Acesso negado',
  description = 'Voce nao tem permissao para acessar este recurso ou sua conta ainda nao foi aprovada.',
}: ForbiddenStateProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--sn-bg)] px-6 py-16 text-center">
      <div className="max-w-lg space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--sn-red)]">SerNissan</p>
        <h1 className="text-3xl font-semibold text-[var(--sn-text)]">{title}</h1>
        <p className="text-base text-[var(--sn-muted)]">{description}</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/entrar"
          className="inline-flex h-9 items-center rounded-md bg-[var(--sn-black)] px-4 text-sm font-medium text-white hover:bg-black/90"
        >
          Voltar ao login
        </Link>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sair
          </Button>
        </form>
      </div>
    </main>
  )
}
