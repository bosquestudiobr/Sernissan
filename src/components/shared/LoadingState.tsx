import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

export function LoadingState({ label = 'Carregando...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-12 text-sm text-[var(--sn-muted)]', className)}>
      <Loader2 className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  )
}
