'use client'

import { useActionState } from 'react'

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
import type { IndicatorObjectiveRow } from '@/server/queries/indicadores/objectives'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type Option = { label: string; value: string }

type IndicatorObjectiveEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: IndicatorObjectiveRow | null
  unidades: Option[]
  concessionariaId?: string | null
  updateAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

const initialState: IndicatorObjectiveActionState = { ok: false }

export function IndicatorObjectiveEditDialog({
  open,
  onOpenChange,
  editing,
  unidades,
  concessionariaId,
  updateAction,
}: IndicatorObjectiveEditDialogProps) {
  const [state, formAction, pending] = useActionState(updateAction, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar indicador</DialogTitle>
        </DialogHeader>
        {editing ? (
          <form
            action={formAction}
            onSubmit={() => {
              if (!pending) setTimeout(() => onOpenChange(false), 0)
            }}
            className="space-y-3"
          >
            <input type="hidden" name="id" value={editing.id} />
            {concessionariaId ? <input type="hidden" name="concessionariaId" value={concessionariaId} /> : null}
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input value={editing.nome ?? ''} disabled className="bg-[var(--sn-field)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="pontos">Peso</Label>
                <Input
                  id="pontos"
                  name="pontos"
                  type="number"
                  defaultValue={editing.pontos ?? ''}
                  className="bg-[var(--sn-field)]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="meta">Meta</Label>
                <Input
                  id="meta"
                  name="meta"
                  type="number"
                  defaultValue={editing.meta ?? ''}
                  className="bg-[var(--sn-field)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="unidade">Unidade</Label>
              <select
                id="unidade"
                name="unidade"
                defaultValue={editing.unidade ?? ''}
                className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
              >
                <option value="">Selecione...</option>
                {unidades.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {state.message && !state.ok ? (
              <p className="text-sm text-[var(--sn-red)]">{state.message}</p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending} className="bg-[var(--sn-black)] text-white hover:bg-black/90">
                {pending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
