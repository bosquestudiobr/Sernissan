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
import type { CompetencyMapDetail } from '@/server/queries/competencias'
import type { CompetencyActionState } from '@/server/actions/competencias'

type Option = { label: string; value: string }
type ActionFn = (prev: CompetencyActionState, formData: FormData) => Promise<CompetencyActionState>

type CompetencyMapFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CompetencyMapDetail | null
  funcoes: Option[]
  habitOptions: Option[]
  createAction: ActionFn
  updateAction: ActionFn
  updateHabitsAction: ActionFn
}

const initialState: CompetencyActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function CompetencyMapFormDialog({
  open,
  onOpenChange,
  editing,
  funcoes,
  habitOptions,
  createAction,
  updateAction,
  updateHabitsAction,
}: CompetencyMapFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending

  const [habitMessage, setHabitMessage] = useState<string | null>(null)
  const [habitPending, setHabitPending] = useState(false)

  async function saveHabits(formData: FormData) {
    setHabitPending(true)
    setHabitMessage(null)
    const result = await updateHabitsAction({ ok: false }, formData)
    setHabitPending(false)
    setHabitMessage(result.ok ? (result.message ?? 'Salvo.') : (result.message ?? 'Erro ao salvar.'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar mapa' : 'Novo mapa'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="versao">Versao</Label>
              <Input id="versao" name="versao" defaultValue={editing?.versao ?? ''} required className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="funcao_mapa">Funcao</Label>
              <select
                id="funcao_mapa"
                name="funcao_mapa"
                defaultValue={editing?.funcaoMapa ?? ''}
                className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
              >
                <option value="">—</option>
                {funcoes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="entrega">Entrega</Label>
            <Input id="entrega" name="entrega" defaultValue={editing?.entrega ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="para_que">Para que</Label>
            <Input id="para_que" name="para_que" defaultValue={editing?.para_que ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="datetime-local"
              defaultValue={toDatetimeLocal(editing?.data ?? null)}
              className="bg-[var(--sn-field)]"
            />
          </div>

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
              {isEdit ? 'Salvar' : 'Criar mapa'}
            </Button>
          </DialogFooter>
        </form>

        {isEdit && editing ? (
          <form
            action={saveHabits}
            className="space-y-3 rounded-md border border-[var(--sn-border)] p-3"
          >
            <input type="hidden" name="id" value={editing.id} />
            <p className="text-sm font-medium">Habitos do mapa</p>
            <MultiSelectField
              name="habitoIds"
              label="Habitos"
              options={habitOptions}
              defaultSelected={editing.habitoIds}
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="bg-[var(--sn-black)] text-white hover:bg-black/90"
                disabled={habitPending}
              >
                Salvar habitos
              </Button>
              {habitMessage ? <span className="text-xs text-[var(--sn-muted)]">{habitMessage}</span> : null}
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
