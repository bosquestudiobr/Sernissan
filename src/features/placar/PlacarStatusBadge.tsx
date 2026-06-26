import { cn } from '@/lib/utils'

type PlacarStatusBadgeProps = {
  finalizado: boolean | null
  rankingAtualizado?: boolean | null
  className?: string
}

export function PlacarStatusBadge({ finalizado, rankingAtualizado, className }: PlacarStatusBadgeProps) {
  const isFinalizado = finalizado === true
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        isFinalizado ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800',
        className,
      )}
    >
      {isFinalizado ? 'Finalizado' : 'Aberto'}
      {isFinalizado && rankingAtualizado ? ' · Ranking OK' : ''}
    </span>
  )
}
