'use client'

import { FormEvent, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FilterOption = { label: string; value: string }

type CompetenciasFiltersProps = {
  areas?: FilterOption[]
  funcoes?: FilterOption[]
  concessionarias?: FilterOption[]
  showArea?: boolean
  showFuncao?: boolean
  showConcessionaria?: boolean
}

export function CompetenciasFilters({
  areas = [],
  funcoes = [],
  concessionarias = [],
  showArea = true,
  showFuncao = true,
  showConcessionaria = false,
}: CompetenciasFiltersProps) {
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

    for (const key of ['areaId', 'funcaoId', 'concessionariaId']) {
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
          placeholder="Buscar"
          className="h-9 w-full min-w-[200px] bg-[var(--sn-field)]"
        />
      </div>
      {showArea ? (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--sn-muted)]">Area</Label>
          <select
            name="areaId"
            defaultValue={searchParams.get('areaId') ?? ''}
            className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
          >
            <option value="">Todas</option>
            {areas.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {showFuncao ? (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--sn-muted)]">Funcao</Label>
          <select
            name="funcaoId"
            defaultValue={searchParams.get('funcaoId') ?? ''}
            className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
          >
            <option value="">Todas</option>
            {funcoes.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {showConcessionaria ? (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--sn-muted)]">Concessionaria</Label>
          <select
            name="concessionariaId"
            defaultValue={searchParams.get('concessionariaId') ?? ''}
            className="h-9 min-w-[160px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
          >
            <option value="">Todas</option>
            {concessionarias.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <Button type="submit" variant="outline" className="h-9" disabled={pending}>
        Filtrar
      </Button>
    </form>
  )
}
