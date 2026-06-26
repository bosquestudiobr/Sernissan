import type { PlacarAuditLogRow } from '@/server/queries/placar'

type PlacarAuditPanelProps = {
  logs: PlacarAuditLogRow[]
}

const ACTION_LABELS: Record<string, string> = {
  recalculate_all: 'Recalculo completo',
  recalculate_indicators: 'Recalculo de indicadores',
  recalculate_ranking: 'Recalculo de ranking',
  finalize: 'Finalizacao',
  reopen: 'Reabertura',
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR')
}

export function PlacarAuditPanel({ logs }: PlacarAuditPanelProps) {
  if (logs.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[var(--sn-muted)]">
        Sem registros de recalculo ainda.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-[var(--sn-border)]">
      {logs.map((log) => (
        <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <div>
            <span className="font-medium text-[var(--sn-text)]">
              {ACTION_LABELS[log.action] ?? log.action}
            </span>
            <span className="ml-2 text-xs text-[var(--sn-muted)]">por {log.profileNome ?? 'sistema'}</span>
          </div>
          <span className="text-xs text-[var(--sn-muted)]">{formatDateTime(log.createdAt)}</span>
        </li>
      ))}
    </ul>
  )
}
