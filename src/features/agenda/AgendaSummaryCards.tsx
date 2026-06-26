import type { AgendaSummary } from '@/server/queries/agenda'

type AgendaSummaryCardsProps = {
  summary: AgendaSummary
}

export function AgendaSummaryCards({ summary }: AgendaSummaryCardsProps) {
  const items = [
    { label: 'Hoje', value: summary.hoje },
    { label: 'Pendentes', value: summary.pendentes },
    { label: 'Concluidos', value: summary.concluidos },
    { label: 'Atrasados', value: summary.atrasados },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-[var(--sn-border)] bg-white p-3">
          <p className="text-xs text-[var(--sn-muted)]">{item.label}</p>
          <p className="mt-1 text-xl font-semibold text-[var(--sn-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
