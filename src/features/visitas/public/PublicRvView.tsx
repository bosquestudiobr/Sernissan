import { PublicRvSummary } from '@/features/visitas/public/PublicRvSummary'
import { PublicRvSignatureForm } from '@/features/visitas/public/PublicRvSignatureForm'
import { PublicRvExpiredState } from '@/features/visitas/public/PublicRvExpiredState'
import { PublicRvSignedState } from '@/features/visitas/public/PublicRvSignedState'
import type { PublicRvView } from '@/server/queries/visitas/public'
import type { PublicSignActionState } from '@/server/actions/visitas/public'

type ActionFn = (prev: PublicSignActionState, formData: FormData) => Promise<PublicSignActionState>

type PublicRvViewProps = {
  token: string
  data: PublicRvView
  signAction: ActionFn
}

export function PublicRvViewComponent({ token, data, signAction }: PublicRvViewProps) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[var(--sn-bg)] px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-[var(--sn-text)]">Ciencia da Visita</h1>
        <p className="text-sm text-[var(--sn-muted)]">SerNissan — Relatorio de Visita</p>
      </div>

      {!data.found ? (
        <PublicRvExpiredState />
      ) : data.signed ? (
        <PublicRvSignedState />
      ) : data.expired || !data.visita ? (
        <PublicRvExpiredState />
      ) : (
        <div className="space-y-4">
          <section className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-6 shadow-sm">
            <PublicRvSummary visita={data.visita} />
          </section>
          <section className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[var(--sn-text)]">Assinatura</h2>
            <PublicRvSignatureForm token={token} action={signAction} />
          </section>
        </div>
      )}
    </main>
  )
}
