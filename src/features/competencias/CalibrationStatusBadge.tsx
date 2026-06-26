import { cn } from '@/lib/utils'

type CalibrationStatusBadgeProps = {
  hasCalibration: boolean
  lastUpdated: string | null
  className?: string
}

export function CalibrationStatusBadge({ hasCalibration, lastUpdated, className }: CalibrationStatusBadgeProps) {
  const label = !hasCalibration ? 'Nao iniciada' : lastUpdated ? 'Em andamento' : 'Iniciada'
  const tone = !hasCalibration
    ? 'bg-[var(--sn-field)] text-[var(--sn-muted)]'
    : 'bg-[var(--sn-yellow-soft)] text-amber-900'
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', tone, className)}>
      {label}
    </span>
  )
}
