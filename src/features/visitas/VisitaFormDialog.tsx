'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { VisitaDetail } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type Option = { label: string; value: string }
type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type VisitaFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: VisitaDetail | null
  concessionarias: Option[]
  modalidades: Option[]
  focos: Option[]
  createAction: ActionFn
  updateAction: ActionFn
}

const initialState: VisitaActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function VisitaFormDialog({
  open,
  onOpenChange,
  editing,
  concessionarias,
  modalidades,
  focos,
  createAction,
  updateAction,
}: VisitaFormDialogProps) {
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
          <DialogTitle>{isEdit ? 'Editar visita' : 'Nova visita'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="data_visita">Data da visita</Label>
              <Input id="data_visita" name="data_visita" type="datetime-local" defaultValue={toDatetimeLocal(editing?.dataVisita ?? null)} required className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dealer">Concessionaria</Label>
              <select id="dealer" name="dealer" required defaultValue={editing?.dealerId ?? ''} className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
                <option value="">Selecione</option>
                {concessionarias.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="modalidade">Modalidade</Label>
              <select id="modalidade" name="modalidade" defaultValue={editing?.modalidadeId ?? ''} className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
                <option value="">—</option>
                {modalidades.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="foco">Foco</Label>
              <select id="foco" name="foco" defaultValue={editing?.focoId ?? ''} className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
                <option value="">—</option>
                {focos.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="relato">Relato</Label>
            <textarea id="relato" name="relato" defaultValue={editing?.relato ?? ''} rows={3} className="w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] p-2 text-sm" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="pontos_destaque">Pontos de destaque</Label>
            <Input id="pontos_destaque" name="pontos_destaque" defaultValue={editing?.pontosDestaque ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          {formState.message && !formState.ok ? <p className="text-sm text-[var(--sn-red)]">{formState.message}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending} onClick={() => { if (!pending) setTimeout(() => onOpenChange(false), 0) }}>
              {isEdit ? 'Salvar' : 'Criar visita'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
