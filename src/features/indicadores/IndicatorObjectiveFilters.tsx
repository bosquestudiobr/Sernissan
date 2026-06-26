'use client'

import { FormEvent, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Option = { label: string; value: string }

type IndicatorObjectiveFiltersProps = {
  areas: Option[]
  funcoes: Option[]
}

export function IndicatorObjectiveFilters({ areas, funcoes }: IndicatorObjectiveFiltersProps) {
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

    for (const key of ['areaId', 'funcaoId', 'ativo']) {
      const value = formData.get(key)?.toString()
      if (value) params.set(key, value)
      else params.delete(key)
    }

    startTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Buscar</Label>
        <Input
          name="q"
          defaultValue={searchParams.get('q') ?? ''}
          placeholder="Buscar por nome ou sigla"
          className="h-9 w-full min-w-[240px] bg-[var(--sn-field)]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Area</Label>
        <select
          name="areaId"
          defaultValue={searchParams.get('areaId') ?? ''}
          className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todas</option>
          {areas.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Funcao</Label>
        <select
          name="funcaoId"
          defaultValue={searchParams.get('funcaoId') ?? ''}
          className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todas</option>
          {funcoes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Ativo</Label>
        <select
          name="ativo"
          defaultValue={searchParams.get('ativo') ?? ''}
          className="h-9 min-w-[120px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="true">Sim</option>
          <option value="false">Nao</option>
        </select>
      </div>
      <Button type="submit" variant="outline" className="h-9" disabled={pending}>
        Filtrar
      </Button>
    </form>
  )
}
