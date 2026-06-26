'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HabitoResponsibleSelect } from '@/features/habitos/HabitoResponsibleSelect'
import type { HabitoDetail } from '@/server/queries/habitos'
import type { HabitoActionState } from '@/server/actions/habitos'

type Option = { label: string; value: string }
type ActionFn = (prev: HabitoActionState, formData: FormData) => Promise<HabitoActionState>

type HabitoFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: HabitoDetail | null
  concessionarias: Option[]
  profiles: Option[]
  areas: Option[]
  funcoes: Option[]
  competenciaHabitos: Option[]
  createAction: ActionFn
  updateAction: ActionFn
}

const initialState: HabitoActionState = { ok: false }

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function HabitoFormDialog({
  open,
  onOpenChange,
  editing,
  concessionarias,
  profiles,
  areas,
  funcoes,
  competenciaHabitos,
  createAction,
  updateAction,
}: HabitoFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending
  const locked = editing?.concluido

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar habito' : 'Novo habito'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="space-y-1">
            <Label htmlFor="titulo">Titulo</Label>
            <Input id="titulo" name="titulo" defaultValue={editing?.titulo ?? ''} required disabled={locked} className="bg-[var(--sn-field)]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao">Descricao</Label>
            <textarea
              id="descricao"
              name="descricao"
              defaultValue={editing?.descricao ?? ''}
              disabled={locked}
              rows={3}
              className="w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="data_inicio">Inicio</Label>
              <Input id="data_inicio" name="data_inicio" type="datetime-local" defaultValue={toDatetimeLocal(editing?.dataInicio ?? null)} disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="data_fim">Prazo</Label>
              <Input id="data_fim" name="data_fim" type="datetime-local" defaultValue={toDatetimeLocal(editing?.dataFim ?? null)} disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <HabitoResponsibleSelect name="concessionaria" label="Concessionaria" options={concessionarias} defaultValue={editing?.concessionariaId ?? undefined} required disabled={locked} />
          <HabitoResponsibleSelect name="colaborador" label="Responsavel" options={profiles} defaultValue={editing?.responsavelId ?? undefined} disabled={locked} />
          <HabitoResponsibleSelect name="area" label="Area" options={areas} defaultValue={editing?.areaId ?? undefined} disabled={locked} />
          <HabitoResponsibleSelect name="funcao" label="Funcao" options={funcoes} defaultValue={editing?.funcaoId ?? undefined} disabled={locked} />

          <div className="space-y-1">
            <Label htmlFor="competenciaHabitoId">Habito de competencia (opcional)</Label>
            <select
              id="competenciaHabitoId"
              name="competenciaHabitoId"
              defaultValue={editing?.competenciaHabitoId ?? ''}
              disabled={locked}
              className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
            >
              <option value="">—</option>
              {competenciaHabitos.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs text-[var(--sn-muted)]">Vinculo leve ao catalogo de competencias; nao altera calibracao.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="metaExecucoes">Meta de execucoes</Label>
              <Input id="metaExecucoes" name="metaExecucoes" type="number" min={0} defaultValue={editing?.metaExecucoes ?? ''} disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="execucoesRealizadas">Execucoes realizadas</Label>
              <Input id="execucoesRealizadas" name="execucoesRealizadas" type="number" min={0} defaultValue={editing?.execucoesRealizadas ?? 0} disabled={locked} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          {!locked ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="ativo" value="true" defaultChecked={editing?.ativo ?? true} />
              Ativo
            </label>
          ) : null}

          {formState.message && !formState.ok ? <p className="text-sm text-[var(--sn-red)]">{formState.message}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            {!locked ? (
              <Button type="submit" className="bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending} onClick={() => { if (!pending) setTimeout(() => onOpenChange(false), 0) }}>
                {isEdit ? 'Salvar' : 'Criar habito'}
              </Button>
            ) : null}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
