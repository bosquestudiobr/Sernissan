import type { PlacarSummary } from '@/server/queries/placar'

type PlacarSummaryCardsProps = {
  summary: PlacarSummary
}

type CardProps = { label: string; value: string; hint?: string }

function Card({ label, value, hint }: CardProps) {
  return (
    <div className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--sn-text)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--sn-muted)]">{hint}</p> : null}
    </div>
  )
}

export function PlacarSummaryCards({ summary }: PlacarSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card label="Indicadores" value={String(summary.indicadorCount)} />
      <Card
        label="Com valor"
        value={String(summary.indicadoresComValor)}
        hint={`${summary.indicadorCount - summary.indicadoresComValor} sem valor`}
      />
      <Card label="Total de pontos" value={String(summary.totalPontos)} />
      <Card label="Colaboradores" value={String(summary.colaboradorCount)} />
    </div>
  )
}
