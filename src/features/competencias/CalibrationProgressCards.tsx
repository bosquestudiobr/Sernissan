import type { CalibrationPerformance } from '@/lib/competencias/calibration-performance'

type CalibrationProgressCardsProps = {
  performance: CalibrationPerformance
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-[var(--sn-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--sn-text)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--sn-muted)]">{hint}</p> : null}
    </div>
  )
}

export function CalibrationProgressCards({ performance }: CalibrationProgressCardsProps) {
  const sim = Object.values(performance.perStage).reduce((a, s) => a + s.sim, 0)
  const parcial = Object.values(performance.perStage).reduce((a, s) => a + s.parcial, 0)
  const nao = Object.values(performance.perStage).reduce((a, s) => a + s.nao, 0)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Card label="Conclusao" value={`${performance.percentComplete}%`} hint={`${performance.totalAnswered}/${performance.totalCells} celulas`} />
      <Card label="Habitos" value={String(performance.totalHabitos)} />
      <Card label="Sim" value={String(sim)} />
      <Card label="Parcial" value={String(parcial)} />
      <Card label="Nao" value={String(nao)} />
    </div>
  )
}
