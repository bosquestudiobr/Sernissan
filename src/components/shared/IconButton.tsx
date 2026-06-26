import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type IconButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

export function IconButton({ icon: Icon, label, onClick, className }: IconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn('text-[var(--sn-muted)] hover:text-[var(--sn-text)]', className)}
    >
      <Icon className="size-4" />
    </Button>
  )
}
