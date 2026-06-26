'use client'

import { FormEvent, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FilterOption = { label: string; value: string }

type PlacarFiltersProps = {
  concessionarias: FilterOption[]
  origens: FilterOption[]
  acumulados: FilterOption[]
}

export function PlacarFilters({ concessionarias, origens, acumulados }: PlacarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')

    const q = formData.get('q')?.toString().trim()
    if (q) params.set('q', q)
    else params.delete('q')

    for (const key of ['concessionariaId', 'finalizado', 'opcaoOrigem', 'opcaoAcumulado']) {
      const value = formData.get(key)?.toString()
      if (value) params.set(key, value)
      else params.delete(key)
    }

    startTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <form onSubmit={onSubmit} className="mb-4 flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Buscar</Label>
        <Input
          name="q"
          defaultValue={searchParams.get('q') ?? ''}
          placeholder="Concessionaria"
          className="h-9 w-full min-w-[200px] bg-[var(--sn-field)]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Concessionaria</Label>
        <select
          name="concessionariaId"
          defaultValue={searchParams.get('concessionariaId') ?? ''}
          className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todas</option>
          {concessionarias.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Status</Label>
        <select
          name="finalizado"
          defaultValue={searchParams.get('finalizado') ?? ''}
          className="h-9 min-w-[120px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="false">Aberto</option>
          <option value="true">Finalizado</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Origem</Label>
        <select
          name="opcaoOrigem"
          defaultValue={searchParams.get('opcaoOrigem') ?? ''}
          className="h-9 min-w-[140px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todas</option>
          {origens.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Acumulado</Label>
        <select
          name="opcaoAcumulado"
          defaultValue={searchParams.get('opcaoAcumulado') ?? ''}
          className="h-9 min-w-[120px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todos</option>
          {acumulados.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="outline" className="h-9" disabled={pending}>
        Filtrar
      </Button>
    </form>
  )
}
