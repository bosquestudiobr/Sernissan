'use client'

import { useActionState, useState } from 'react'

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
import type { CompetencyHabitDetail } from '@/server/queries/competencias'
import type { CompetencyActionState } from '@/server/actions/competencias'

type ActionFn = (prev: CompetencyActionState, formData: FormData) => Promise<CompetencyActionState>

type CompetencyHabitFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CompetencyHabitDetail | null
  createAction: ActionFn
  updateAction: ActionFn
}

const initialState: CompetencyActionState = { ok: false }

export function CompetencyHabitFormDialog({
  open,
  onOpenChange,
  editing,
  createAction,
  updateAction,
}: CompetencyHabitFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending
  const [essencial, setEssencial] = useState(editing?.essencial ?? false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar habito' : 'Novo habito'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}
          <input type="hidden" name="essencial" value={String(essencial)} />

          <div className="space-y-1">
            <Label htmlFor="pergunta">Pergunta</Label>
            <Input id="pergunta" name="pergunta" defaultValue={editing?.pergunta ?? ''} required className="bg-[var(--sn-field)]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao">Descricao</Label>
            <Input id="descricao" name="descricao" defaultValue={editing?.descricao ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="area">Area (texto)</Label>
              <Input id="area" name="area" defaultValue={editing?.area ?? ''} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mv">MV</Label>
              <Input id="mv" name="mv" defaultValue={editing?.mv ?? ''} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="momento_de_verdade">Momento de verdade</Label>
            <Input id="momento_de_verdade" name="momento_de_verdade" defaultValue={editing?.momentoDeVerdade ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="peso">Peso</Label>
              <Input id="peso" name="peso" type="number" step="any" defaultValue={editing?.peso ?? ''} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="trilha">Trilha</Label>
              <Input id="trilha" name="trilha" type="number" step="any" defaultValue={editing?.trilha ?? ''} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={essencial} onChange={(e) => setEssencial(e.target.checked)} />
            Essencial
          </label>

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
              {isEdit ? 'Salvar' : 'Criar habito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
