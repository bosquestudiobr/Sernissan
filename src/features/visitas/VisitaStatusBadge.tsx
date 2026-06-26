import { cn } from '@/lib/utils'
import { RV_STATUS_LABEL, type RvStatus } from '@/lib/rv/status'

type VisitaStatusBadgeProps = {
  status: RvStatus
  className?: string
}

export function VisitaStatusBadge({ status, className }: VisitaStatusBadgeProps) {
  const tone =
    status === 'assinada'
      ? 'bg-[var(--sn-green-soft)] text-emerald-900'
      : status === 'expirada'
        ? 'bg-[var(--sn-red-soft)] text-[var(--sn-red-dark)]'
        : status === 'enviada'
          ? 'bg-[var(--sn-yellow-soft)] text-amber-900'
          : 'bg-[var(--sn-field)] text-[var(--sn-muted)]'
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', tone, className)}>
      {RV_STATUS_LABEL[status]}
    </span>
  )
}
