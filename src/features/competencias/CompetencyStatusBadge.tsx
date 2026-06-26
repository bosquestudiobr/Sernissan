import { cn } from '@/lib/utils'

type CompetencyStatusBadgeProps = {
  essencial?: boolean | null
  className?: string
}

export function CompetencyStatusBadge({ essencial, className }: CompetencyStatusBadgeProps) {
  if (!essencial) {
    return (
      <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[var(--sn-field)] text-[var(--sn-muted)]', className)}>
        Padrao
      </span>
    )
  }
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-[var(--sn-red)]/10 text-[var(--sn-red)]', className)}>
      Essencial
    </span>
  )
}
