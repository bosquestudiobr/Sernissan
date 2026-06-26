import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DataCardProps = {
  children: ReactNode
  className?: string
}

export function DataCard({ children, className }: DataCardProps) {
  return (
    <section
      className={cn(
        'rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-4 shadow-sm sm:p-6',
        className,
      )}
    >
      {children}
    </section>
  )
}
