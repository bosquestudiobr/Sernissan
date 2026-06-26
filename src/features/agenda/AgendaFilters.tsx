'use client'

import { FormEvent, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Option = { label: string; value: string }

type AgendaFiltersProps = {
  concessionarias: Option[]
  profiles: Option[]
  statusOptions: Option[]
}

export function AgendaFilters({ concessionarias, profiles, statusOptions }: AgendaFiltersProps) {
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
    for (const key of ['status', 'concessionariaId', 'responsavelId', 'from', 'to', 'view']) {
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
        <Input name="q" defaultValue={searchParams.get('q') ?? ''} placeholder="Titulo" className="h-9 w-full min-w-[160px] bg-[var(--sn-field)]" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Status</Label>
        <select name="status" defaultValue={searchParams.get('status') ?? ''} className="h-9 min-w-[120px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
          <option value="">Todos</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Concessionaria</Label>
        <select name="concessionariaId" defaultValue={searchParams.get('concessionariaId') ?? ''} className="h-9 min-w-[140px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
          <option value="">Todas</option>
          {concessionarias.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Responsavel</Label>
        <select name="responsavelId" defaultValue={searchParams.get('responsavelId') ?? ''} className="h-9 min-w-[140px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
          <option value="">Todos</option>
          {profiles.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">De</Label>
        <Input name="from" type="date" defaultValue={searchParams.get('from') ?? ''} className="h-9 bg-[var(--sn-field)]" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[var(--sn-muted)]">Ate</Label>
        <Input name="to" type="date" defaultValue={searchParams.get('to') ?? ''} className="h-9 bg-[var(--sn-field)]" />
      </div>
      <input type="hidden" name="view" value={searchParams.get('view') ?? 'list'} />
      <Button type="submit" variant="outline" className="h-9" disabled={pending}>Filtrar</Button>
    </form>
  )
}
