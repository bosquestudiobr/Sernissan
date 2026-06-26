'use client'

import { useMemo, useState, useTransition } from 'react'
import { useActionState } from 'react'
import { Network } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  enrichOrganizationalContext,
  filterConcessionarias,
  filterDivisoes,
  filterGrupos,
  filterPaises,
  filterSetores,
  resolveChainFromConcessionaria,
  resolveChainFromGrupo,
  resolveChainFromSetor,
} from '@/lib/organizational-context/hierarchy'
import type { OrganizationalContextOptions, OrganizationalContextView } from '@/lib/types/user'
import {
  setOrganizationalContextAction,
  type SetContextActionState,
} from '@/server/actions/set-context'
import { cn } from '@/lib/utils'

type HierarchyDialogProps = {
  context: OrganizationalContextView
  options: OrganizationalContextOptions
  className?: string
}

const initialState: SetContextActionState = { ok: true }

type Draft = {
  empresaId: string
  paisId: string
  divisaoId: string
  setorId: string
  grupoId: string
  concessionariaId: string
}

function toDraft(context: OrganizationalContextView): Draft {
  return {
    empresaId: context.empresaId ?? '',
    paisId: context.paisId ?? '',
    divisaoId: context.divisaoId ?? '',
    setorId: context.setorId ?? '',
    grupoId: context.grupoId ?? '',
    concessionariaId: context.concessionariaId ?? '',
  }
}

function draftToFormData(draft: Draft) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(draft)) {
    if (value) fd.set(key, value)
    else fd.set(key, '')
  }
  return fd
}

export function HierarchyDialog({ context, options, className }: HierarchyDialogProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(context))
  const [state, formAction] = useActionState(setOrganizationalContextAction, initialState)
  const [isPending, startTransition] = useTransition()

  const paisesFiltrados = useMemo(() => filterPaises(options, draft.empresaId || null), [draft.empresaId, options])
  const divisoesFiltradas = useMemo(() => filterDivisoes(options, draft.paisId || null), [draft.paisId, options])
  const setoresFiltrados = useMemo(
    () => filterSetores(options, draft.divisaoId || null, draft.empresaId || null),
    [draft.divisaoId, draft.empresaId, options],
  )
  const gruposFiltrados = useMemo(() => filterGrupos(options, draft.setorId || null), [draft.setorId, options])
  const concessionariasFiltradas = useMemo(
    () => filterConcessionarias(options, draft.grupoId || null),
    [draft.grupoId, options],
  )

  function applyDraft(next: Draft) {
    const enriched = enrichOrganizationalContext(
      {
        empresaId: next.empresaId || null,
        paisId: next.paisId || null,
        divisaoId: next.divisaoId || null,
        setorId: next.setorId || null,
        grupoId: next.grupoId || null,
        concessionariaId: next.concessionariaId || null,
      },
      options,
    )
    setDraft({
      empresaId: enriched.empresaId ?? '',
      paisId: enriched.paisId ?? '',
      divisaoId: enriched.divisaoId ?? '',
      setorId: enriched.setorId ?? '',
      grupoId: enriched.grupoId ?? '',
      concessionariaId: enriched.concessionariaId ?? '',
    })
  }

  function handleOpenChange(next: boolean) {
    if (next) setDraft(toDraft(context))
    setOpen(next)
  }

  function handleSubmit() {
    startTransition(() => {
      formAction(draftToFormData(draft))
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn('h-9 shrink-0 border-[var(--sn-border)] px-2.5', className)}
            title="Hierarquia organizacional"
          >
            <Network className="size-4 text-[var(--sn-red)]" />
            <span className="sr-only">Hierarquia</span>
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hierarquia organizacional</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <HierarchyField
            label="Empresa"
            value={draft.empresaId}
            options={options.empresas}
            disabled={isPending || options.empresas.length === 0}
            onChange={(empresaId) => applyDraft({ ...draft, empresaId, paisId: '', divisaoId: '', setorId: '', grupoId: '', concessionariaId: '' })}
          />
          <HierarchyField
            label="Pais"
            value={draft.paisId}
            options={paisesFiltrados}
            disabled={isPending || paisesFiltrados.length === 0}
            onChange={(paisId) => applyDraft({ ...draft, paisId, divisaoId: '', setorId: '', grupoId: '', concessionariaId: '' })}
          />
          <HierarchyField
            label="Divisao"
            value={draft.divisaoId}
            options={divisoesFiltradas}
            disabled={isPending || divisoesFiltradas.length === 0}
            onChange={(divisaoId) => {
              const chain = resolveChainFromSetor(
                options.setores.find((s) => s.divisaoId === divisaoId)?.id ?? null,
                options,
              )
              applyDraft({
                empresaId: chain.empresaId ?? draft.empresaId,
                paisId: chain.paisId ?? draft.paisId,
                divisaoId,
                setorId: chain.setorId ?? '',
                grupoId: '',
                concessionariaId: '',
              })
            }}
          />
          <HierarchyField
            label="Setor"
            value={draft.setorId}
            options={setoresFiltrados}
            disabled={isPending || setoresFiltrados.length === 0}
            onChange={(setorId) => {
              const chain = resolveChainFromSetor(setorId || null, options)
              const grupoId = options.grupos.find((g) => g.setorId === setorId)?.id ?? ''
              const concessionariaId = options.concessionarias.find((c) => c.grupoId === grupoId)?.id ?? ''
              applyDraft({
                empresaId: chain.empresaId ?? '',
                paisId: chain.paisId ?? '',
                divisaoId: chain.divisaoId ?? '',
                setorId,
                grupoId,
                concessionariaId,
              })
            }}
          />
          <HierarchyField
            label="Grupo"
            value={draft.grupoId}
            options={gruposFiltrados}
            disabled={isPending || gruposFiltrados.length === 0}
            onChange={(grupoId) => {
              const chain = resolveChainFromGrupo(grupoId || null, options)
              const concessionariaId = options.concessionarias.find((c) => c.grupoId === grupoId)?.id ?? ''
              applyDraft({
                empresaId: chain.empresaId ?? '',
                paisId: chain.paisId ?? '',
                divisaoId: chain.divisaoId ?? '',
                setorId: chain.setorId ?? '',
                grupoId,
                concessionariaId,
              })
            }}
          />
          <HierarchyField
            label="Concessionaria"
            value={draft.concessionariaId}
            options={concessionariasFiltradas}
            disabled={isPending || concessionariasFiltradas.length === 0}
            onChange={(concessionariaId) => {
              const chain = resolveChainFromConcessionaria(concessionariaId || null, options)
              applyDraft({
                empresaId: chain.empresaId ?? '',
                paisId: chain.paisId ?? '',
                divisaoId: chain.divisaoId ?? '',
                setorId: chain.setorId ?? '',
                grupoId: chain.grupoId ?? '',
                concessionariaId,
              })
            }}
          />
        </div>

        {state.ok === false && state.message ? (
          <p className="text-sm text-[var(--sn-red)]">{state.message}</p>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[var(--sn-black)] text-white hover:bg-black/90"
            disabled={isPending}
            onClick={handleSubmit}
          >
            Aplicar contexto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HierarchyField({
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
    <div className="space-y-1">
      <label className="text-[10px] font-medium uppercase tracking-wide text-[var(--sn-muted)]">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm',
          disabled && 'cursor-not-allowed opacity-70',
        )}
      >
        <option value="">Nao definido</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
