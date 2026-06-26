import type { IndicatorRequestRow } from '@/server/queries/indicadores/objectives'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'
import { IndicatorRequestActions } from '@/features/indicadores/IndicatorRequestActions'

type IndicatorRequestsPanelProps = {
  requests: IndicatorRequestRow[]
  canApprove: boolean
  approveAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  rejectAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

export function IndicatorRequestsPanel({
  requests,
  canApprove,
  approveAction,
  rejectAction,
}: IndicatorRequestsPanelProps) {
  if (requests.length === 0) return null

  return (
    <div className="mb-4 rounded-md border border-[var(--sn-border)] bg-[var(--sn-surface)] p-3">
      <h3 className="mb-2 text-sm font-semibold text-[var(--sn-text)]">Solicitacoes pendentes</h3>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--sn-border)] bg-white px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-[var(--sn-text)]">
                {request.nome} {request.sigla ? `(${request.sigla})` : ''}
              </p>
              {request.observacao ? (
                <p className="text-xs text-[var(--sn-muted)]">{request.observacao}</p>
              ) : null}
            </div>
            <IndicatorRequestActions
              request={request}
              canApprove={canApprove}
              approveAction={approveAction}
              rejectAction={rejectAction}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
