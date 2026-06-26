import { Inbox } from 'lucide-react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  className?: string
}

export function EmptyState({
  title = 'Nenhum registro encontrado',
  description = 'Ajuste os filtros ou cadastre um novo item.',
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}>
      <Inbox className="size-8 text-[var(--sn-muted)]" />
      <p className="text-sm font-semibold text-[var(--sn-text)]">{title}</p>
      <p className="max-w-md text-sm text-[var(--sn-muted)]">{description}</p>
    </div>
  )
}
