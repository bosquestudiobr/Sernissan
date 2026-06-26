'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type FilterOption = {
  label: string
  value: string
}

type FilterSelectProps = {
  label: string
  options: FilterOption[]
  defaultValue?: string
  className?: string
}

export function FilterSelect({ label, options, defaultValue, className }: FilterSelectProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <span className="text-xs font-medium text-[var(--sn-muted)]">{label}</span>
      <Select defaultValue={defaultValue ?? options[0]?.value}>
        <SelectTrigger className="h-9 w-full min-w-[160px] bg-[var(--sn-field)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
