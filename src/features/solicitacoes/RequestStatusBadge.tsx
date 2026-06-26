import { cn } from '@/lib/utils'
import { requestStatus, REQUEST_STATUS_LABEL } from '@/lib/solicitacoes/status'

type RequestStatusBadgeProps = {
  atendida: boolean | null
  className?: string
}

export function RequestStatusBadge({ atendida, className }: RequestStatusBadgeProps) {
  const status = requestStatus(atendida)
  const tone =
    status === 'aprovada'
      ? 'bg-[var(--sn-green-soft)] text-emerald-900'
      : status === 'rejeitada'
        ? 'bg-[var(--sn-red-soft)] text-[var(--sn-red-dark)]'
        : 'bg-[var(--sn-yellow-soft)] text-amber-900'
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', tone, className)}>
      {REQUEST_STATUS_LABEL[status]}
    </span>
  )
}
