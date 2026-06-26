'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ReuniaoDetail } from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ReuniaoDetail | null
  createAction: ActionFn
  updateAction: ActionFn
}

const initialState: ReuniaoActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function ReuniaoFormDialog({ open, onOpenChange, editing, createAction, updateAction }: ReuniaoFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar reuniao' : 'Nova reuniao'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="data">Data da reuniao</Label>
              <Input id="data" name="data" type="datetime-local" defaultValue={toDatetimeLocal(editing?.data ?? null)} required className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="id_2">Codigo (id)</Label>
              <Input id="id_2" name="id_2" type="number" defaultValue={editing?.id2 ?? ''} placeholder="Auto" className="bg-[var(--sn-field)]" />
            </div>
          </div>

          {formState.message && !formState.ok ? <p className="text-sm text-[var(--sn-red)]">{formState.message}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending} onClick={() => { if (!pending) setTimeout(() => onOpenChange(false), 0) }}>
              {isEdit ? 'Salvar' : 'Criar reuniao'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
