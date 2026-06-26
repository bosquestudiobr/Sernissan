import type { StatusSummary } from '@/server/queries/reuniao-resultados'

type ReuniaoSummaryCardsProps = {
  summary: StatusSummary
}

export function ReuniaoSummaryCards({ summary }: ReuniaoSummaryCardsProps) {
  const items = [
    { label: 'Indicadores na pauta', value: summary.indicatorCount },
    { label: 'Proximos passos', value: summary.actionCount },
    { label: 'Acoes em aberto', value: summary.openActionCount },
    { label: 'Resultados registrados', value: summary.resultCount },
    { label: 'Resultados finais', value: summary.finalResultCount },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-[var(--sn-border)] bg-white p-3">
          <p className="text-xs text-[var(--sn-muted)]">{item.label}</p>
          <p className="mt-1 text-xl font-semibold text-[var(--sn-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
