'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FilterConfig = {
  key: string
  label: string
  options: { label: string; value: string }[]
}

type AdminFiltersProps = {
  filters?: FilterConfig[]
}

export function AdminFilters({ filters = [] }: AdminFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    const search = formData.get('search')?.toString().trim()
    if (search) params.set('search', search)
    else params.delete('search')
    for (const filter of filters) {
      const value = formData.get(filter.key)?.toString()
      if (value) params.set(filter.key, value)
      else params.delete(filter.key)
    }
    startTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <form onSubmit={onSubmit} className="mb-4 flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Buscar</Label>
        <Input
          name="search"
          defaultValue={searchParams.get('search') ?? ''}
          placeholder="Buscar..."
          className="h-9 w-full min-w-[220px] bg-[var(--sn-field)]"
        />
      </div>
      {filters.map((filter) => (
        <div key={filter.key} className="space-y-1">
          <Label className="text-xs text-[var(--sn-muted)]">{filter.label}</Label>
          <select
            name={filter.key}
            defaultValue={searchParams.get(filter.key) ?? ''}
            className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
          >
            <option value="">Todos</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <Button type="submit" variant="outline" className="h-9" disabled={pending}>
        Filtrar
      </Button>
    </form>
  )
}
