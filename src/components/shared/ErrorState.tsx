import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title?: string
  description?: string
  className?: string
}

export function ErrorState({
  title = 'Nao foi possivel carregar os dados',
  description = 'Tente novamente em instantes.',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-[var(--sn-red-soft)] bg-[var(--sn-red-soft)]/30 py-12 text-center',
        className,
      )}
    >
      <AlertCircle className="size-8 text-[var(--sn-red)]" />
      <p className="text-sm font-semibold text-[var(--sn-text)]">{title}</p>
      <p className="max-w-md text-sm text-[var(--sn-muted)]">{description}</p>
    </div>
  )
}
