'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AgendaMultiSelect, AgendaResponsibleSelect } from '@/features/agenda/AgendaResponsibleSelect'
import type { AgendaDetail } from '@/server/queries/agenda'
import type { AgendaActionState } from '@/server/actions/agenda'

type Option = { label: string; value: string }
type ActionFn = (prev: AgendaActionState, formData: FormData) => Promise<AgendaActionState>

type AgendaFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: AgendaDetail | null
  concessionarias: Option[]
  profiles: Option[]
  placares: Option[]
  createAction: ActionFn
  updateAction: ActionFn
}

const initialState: AgendaActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function AgendaFormDialog({
  open,
  onOpenChange,
  editing,
  concessionarias,
  profiles,
  placares,
  createAction,
  updateAction,
}: AgendaFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending
  const locked = editing?.concluido || editing?.cancelado

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar compromisso' : 'Novo compromisso'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="space-y-1">
            <Label htmlFor="titulo">Titulo</Label>
            <Input id="titulo" name="titulo" defaultValue={editing?.titulo ?? ''} required disabled={locked} className="bg-[var(--sn-field)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="data_inicio">Inicio</Label>
              <Input id="data_inicio" name="data_inicio" type="datetime-local" defaultValue={toDatetimeLocal(editing?.dataInicio ?? null)} required disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="data_fim">Fim</Label>
              <Input id="data_fim" name="data_fim" type="datetime-local" defaultValue={toDatetimeLocal(editing?.dataFim ?? null)} disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="dia_todo" value="true" defaultChecked={editing?.diaTodo ?? false} disabled={locked} />
            Dia inteiro
          </label>

          <AgendaResponsibleSelect name="concessionaria" label="Concessionaria" options={concessionarias} defaultValue={editing?.concessionariaId ?? undefined} required />
          <AgendaResponsibleSelect name="user" label="Responsavel" options={profiles} defaultValue={editing?.responsavelId ?? undefined} />
          <AgendaResponsibleSelect name="gerente" label="Gerente" options={profiles} defaultValue={editing?.gerenteId ?? undefined} />

          <div className="space-y-1">
            <Label htmlFor="placar">Placar (opcional)</Label>
            <select id="placar" name="placar" defaultValue={editing?.placarId ?? ''} disabled={locked} className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
              <option value="">—</option>
              {placares.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {!locked ? (
            <>
              <AgendaMultiSelect name="participantIds" label="Participantes" options={profiles} defaultSelected={editing?.participantIds ?? []} />
              <AgendaMultiSelect name="convidadoIds" label="Convidados" options={profiles} defaultSelected={editing?.convidadoIds ?? []} />
            </>
          ) : null}

          {formState.message && !formState.ok ? <p className="text-sm text-[var(--sn-red)]">{formState.message}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            {!locked ? (
              <Button type="submit" className="bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending} onClick={() => { if (!pending) setTimeout(() => onOpenChange(false), 0) }}>
                {isEdit ? 'Salvar' : 'Criar compromisso'}
              </Button>
            ) : null}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
