import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchInputProps = {
  placeholder?: string
  defaultValue?: string
  name?: string
  className?: string
}

export function SearchInput({
  placeholder = 'Buscar...',
  defaultValue,
  name = 'search',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--sn-muted)]" />
      <Input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-9 bg-[var(--sn-field)] pl-9"
      />
    </div>
  )
}
