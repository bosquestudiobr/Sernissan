'use client'

import { useActionState } from 'react'

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
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type Option = { label: string; value: string }

type IndicatorRequestDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  areas: Option[]
  funcoes: Option[]
  concessionariaId?: string | null
  requestAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

const initialState: IndicatorObjectiveActionState = { ok: false }

export function IndicatorRequestDialog({
  open,
  onOpenChange,
  areas,
  funcoes,
  concessionariaId,
  requestAction,
}: IndicatorRequestDialogProps) {
  const [state, formAction, pending] = useActionState(requestAction, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar indicador</DialogTitle>
        </DialogHeader>
        <form
          action={formAction}
          onSubmit={() => {
            if (!pending) setTimeout(() => onOpenChange(false), 0)
          }}
          className="space-y-3"
        >
          {concessionariaId ? <input type="hidden" name="concessionariaId" value={concessionariaId} /> : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sigla">Sigla</Label>
              <Input id="sigla" name="sigla" required className="bg-[var(--sn-field)]" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="observacao">Justificativa</Label>
            <textarea
              id="observacao"
              name="observacao"
              rows={3}
              className="w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 py-1 text-sm"
            />
          </div>
          <MultiSelectField name="areaIds" label="Areas relacionadas" options={areas} />
          <MultiSelectField name="funcaoIds" label="Funcoes relacionadas" options={funcoes} />
          {state.message && !state.ok ? (
            <p className="text-sm text-[var(--sn-red)]">{state.message}</p>
          ) : null}
          {state.ok && state.message ? (
            <p className="text-sm text-green-700">{state.message}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending} className="bg-[var(--sn-black)] text-white hover:bg-black/90">
              {pending ? 'Enviando...' : 'Solicitar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
