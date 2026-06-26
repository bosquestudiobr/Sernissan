import { responseColorClass } from '@/features/competencias/calibration-colors'

const ITEMS: { value: 'sim' | 'parcial' | 'n_o' | null; label: string }[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'n_o', label: 'Nao' },
  { value: null, label: 'Nao avaliado' },
]

export function CalibrationLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--sn-muted)]">
      <span className="font-medium">Legenda:</span>
      {ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className={`inline-block size-3 rounded-sm border border-[var(--sn-border)] ${responseColorClass(item.value)}`} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
