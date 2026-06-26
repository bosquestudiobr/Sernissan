'use client'

import { useActionState, useState } from 'react'

import { MultiSelectField } from '@/components/admin/MultiSelectField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlacarIndicatorsPanel } from '@/features/placar/PlacarIndicatorsPanel'
import { PlacarRankingPanel } from '@/features/placar/PlacarRankingPanel'
import type { PlacarDetail, PlacarIndicatorOption } from '@/server/queries/placar'
import type { PlacarActionState } from '@/server/actions/placar'

type Option = { label: string; value: string }

type PlacarFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: PlacarDetail | null
  concessionarias: Option[]
  origens: Option[]
  acumulados: Option[]
  availableIndicators: PlacarIndicatorOption[]
  defaultConcessionariaId?: string | null
  createAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  updateAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  updateIndicatorsAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  loadRankingAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  recalcRankingAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
}

const initialState: PlacarActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function PlacarFormDialog({
  open,
  onOpenChange,
  editing,
  concessionarias,
  origens,
  acumulados,
  availableIndicators,
  defaultConcessionariaId,
  createAction,
  updateAction,
  updateIndicatorsAction,
  loadRankingAction,
  recalcRankingAction,
}: PlacarFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending
  const [finalizado, setFinalizado] = useState(editing?.finalizado ?? false)
  const [concessionariaId, setConcessionariaId] = useState(
    editing?.concessionaria ?? defaultConcessionariaId ?? '',
  )

  const indicatorOptions = availableIndicators.map((item) => ({
    value: item.id,
    label: [item.sigla, item.nome].filter(Boolean).join(' — ') || item.id,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar placar' : 'Novo placar'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}
          <input type="hidden" name="finalizado" value={String(finalizado)} />

          <div className="space-y-1">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="datetime-local"
              defaultValue={toDatetimeLocal(editing?.data ?? null)}
              required
              className="bg-[var(--sn-field)]"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="concessionaria">Concessionaria</Label>
            <select
              id="concessionaria"
              name="concessionaria"
              required
              value={concessionariaId}
              onChange={(e) => setConcessionariaId(e.target.value)}
              className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
            >
              <option value="">Selecione</option>
              {concessionarias.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="opcao_origem">Origem</Label>
              <select
                id="opcao_origem"
                name="opcao_origem"
                defaultValue={editing?.opcao_origem ?? ''}
                className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
              >
                <option value="">—</option>
                {origens.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="opcao_acumulado">Acumulado</Label>
              <select
                id="opcao_acumulado"
                name="opcao_acumulado"
                defaultValue={editing?.opcao_acumulado ?? ''}
                className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
              >
                <option value="">—</option>
                {acumulados.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isEdit ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={finalizado} onChange={(e) => setFinalizado(e.target.checked)} />
              Finalizado
            </label>
          ) : (
            <MultiSelectField
              key={`create-${concessionariaId}-${String(open)}`}
              name="indicadorIds"
              label="Indicadores iniciais"
              options={indicatorOptions}
              defaultSelected={[]}
            />
          )}

          {formState.message && !formState.ok ? (
            <p className="text-sm text-[var(--sn-red)]">{formState.message}</p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--sn-black)] text-white hover:bg-black/90"
              disabled={pending}
              onClick={() => {
                if (!pending) setTimeout(() => onOpenChange(false), 0)
              }}
            >
              {isEdit ? 'Salvar' : 'Criar placar'}
            </Button>
          </DialogFooter>
        </form>

        {isEdit && editing ? (
          <PlacarIndicatorsPanel
            placarId={editing.id}
            available={availableIndicators}
            selectedIds={editing.indicadorIds}
            updateAction={updateIndicatorsAction}
            disabled={editing.finalizado === true}
          />
        ) : null}

        {isEdit && editing ? (
          <PlacarRankingPanel
            placarId={editing.id}
            loadAction={loadRankingAction}
            recalcAction={recalcRankingAction}
            disabled={editing.finalizado === true}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}


