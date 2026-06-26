'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type StatusSwitchProps = {
  label: string
  checked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function StatusSwitch({
  label,
  checked,
  disabled,
  onCheckedChange,
  className,
}: StatusSwitchProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
      <Label className="text-sm text-[var(--sn-text)]">{label}</Label>
    </div>
  )
}
