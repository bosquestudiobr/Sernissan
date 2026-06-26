'use client'

import { useMemo, useTransition } from 'react'
import { useActionState } from 'react'

import type { OrganizationalContextOptions, OrganizationalContextView } from '@/lib/types/user'
import {
  enrichOrganizationalContext,
  filterConcessionarias,
  filterGrupos,
  resolveChainFromConcessionaria,
  resolveChainFromGrupo,
  resolveChainFromSetor,
} from '@/lib/organizational-context/hierarchy'
import {
  setOrganizationalContextAction,
  type SetContextActionState,
} from '@/server/actions/set-context'
import { cn } from '@/lib/utils'

type HeaderSelectorsProps = {
  context: OrganizationalContextView
  options: OrganizationalContextOptions
}

const initialState: SetContextActionState = { ok: true }

export function HeaderSelectors({ context, options }: HeaderSelectorsProps) {
  const [state, formAction] = useActionState(setOrganizationalContextAction, initialState)
  const [isPending, startTransition] = useTransition()

  const gruposFiltrados = useMemo(() => {
    if (!context.setorId) return options.grupos
    return filterGrupos(options, context.setorId)
  }, [context.setorId, options])

  const concessionariasFiltradas = useMemo(() => {
    if (!context.grupoId) return options.concessionarias
    return filterConcessionarias(options, context.grupoId)
  }, [context.grupoId, options])

  function submitContext(next: {
    setorId: string | null
    grupoId: string | null
    concessionariaId: string | null
  }) {
    const enriched = enrichOrganizationalContext(
      {
        empresaId: context.empresaId,
        paisId: context.paisId,
        divisaoId: context.divisaoId,
        setorId: next.setorId,
        grupoId: next.grupoId,
        concessionariaId: next.concessionariaId,
      },
      options,
    )

    const formData = new FormData()
    for (const key of ['empresaId', 'paisId', 'divisaoId', 'setorId', 'grupoId', 'concessionariaId'] as const) {
      formData.set(key, enriched[key] ?? '')
    }

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="hidden flex-1 items-end gap-3 lg:flex">
      <SelectorField
        label="Setor"
        value={context.setorId ?? ''}
        options={options.setores}
        disabled={isPending || options.setores.length === 0}
        onChange={(setorId) => {
          const chain = resolveChainFromSetor(setorId || null, options)
          const grupoId = options.grupos.find((g) => g.setorId === setorId)?.id ?? null
          const concessionariaId = options.concessionarias.find((c) => c.grupoId === grupoId)?.id ?? null
          submitContext({ setorId: chain.setorId, grupoId, concessionariaId })
        }}
      />
      <SelectorField
        label="Grupo"
        value={context.grupoId ?? ''}
        options={gruposFiltrados}
        disabled={isPending || gruposFiltrados.length === 0}
        onChange={(grupoId) => {
          const chain = resolveChainFromGrupo(grupoId || null, options)
          const concessionariaId = options.concessionarias.find((c) => c.grupoId === grupoId)?.id ?? null
          submitContext({
            setorId: chain.setorId,
            grupoId: chain.grupoId,
            concessionariaId,
          })
        }}
      />
      <SelectorField
        label="Concessionaria"
        value={context.concessionariaId ?? ''}
        options={concessionariasFiltradas}
        disabled={isPending || concessionariasFiltradas.length === 0}
        onChange={(concessionariaId) => {
          const chain = resolveChainFromConcessionaria(concessionariaId || null, options)
          submitContext({
            setorId: chain.setorId,
            grupoId: chain.grupoId,
            concessionariaId: chain.concessionariaId,
          })
        }}
      />
      {state.ok === false && state.message ? (
        <p className="text-xs text-[var(--sn-red)]">{state.message}</p>
      ) : null}
    </div>
  )
}

function SelectorField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="min-w-[140px]">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--sn-muted)]">{label}</p>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-0.5 flex h-8 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-left text-xs text-[var(--sn-text)]',
          disabled && 'cursor-not-allowed opacity-70',
        )}
      >
        <option value="">Nao definido</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
