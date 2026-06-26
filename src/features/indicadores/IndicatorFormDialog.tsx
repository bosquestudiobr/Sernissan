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
import type { IndicatorLibraryRow } from '@/server/queries/indicadores/library'
import type { IndicatorActionState } from '@/server/actions/indicadores/library'

type Option = { label: string; value: string }

type IndicatorFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: IndicatorLibraryRow | null
  areas: Option[]
  funcoes: Option[]
  unidades: Option[]
  importancias: Option[]
  createAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  updateAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
}

const initialState: IndicatorActionState = { ok: false }

export function IndicatorFormDialog({
  open,
  onOpenChange,
  editing,
  areas,
  funcoes,
  unidades,
  importancias,
  createAction,
  updateAction,
}: IndicatorFormDialogProps) {
  const isEdit = editing !== null
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending
  const [ativo, setAtivo] = useState(editing?.ativo ?? true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar indicador' : 'Novo indicador'}</DialogTitle>
        </DialogHeader>
        <form
          action={formAction}
          onSubmit={() => {
            if (!pending) setTimeout(() => onOpenChange(false), 0)
          }}
          className="space-y-3"
        >
          {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}
          <input type="hidden" name="ativo" value={String(ativo)} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" defaultValue={editing?.nome ?? ''} required className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sigla">Sigla</Label>
              <Input id="sigla" name="sigla" defaultValue={editing?.sigla ?? ''} required className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="api_id">API ID</Label>
            <Input id="api_id" name="api_id" defaultValue={editing?.api_id ?? ''} className="bg-[var(--sn-field)]" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ordem">Ordem</Label>
              <Input id="ordem" name="ordem" type="number" defaultValue={editing?.ordem ?? ''} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pontos">Peso</Label>
              <Input id="pontos" name="pontos" type="number" defaultValue={editing?.pontos ?? ''} className="bg-[var(--sn-field)]" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="meta">Meta</Label>
              <Input id="meta" name="meta" type="number" defaultValue={editing?.meta ?? ''} className="bg-[var(--sn-field)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="unidade">Unidade</Label>
              <select
                id="unidade"
                name="unidade"
                defaultValue={editing?.unidade ?? ''}
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
            <div className="space-y-1">
              <Label htmlFor="importancia">Importancia</Label>
              <select
                id="importancia"
                name="importancia"
                defaultValue={editing?.importancia ?? ''}
                className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
              >
                <option value="">Selecione...</option>
                {importancias.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <MultiSelectField
            name="areaIds"
            label="Areas vinculadas"
            options={areas}
            defaultSelected={editing?.areaIds ?? []}
          />
          <MultiSelectField
            name="funcaoIds"
            label="Funcoes vinculadas"
            options={funcoes}
            defaultSelected={editing?.funcaoIds ?? []}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(event) => setAtivo(event.target.checked)}
              className="size-4 rounded border-[var(--sn-border)]"
            />
            Indicador ativo
          </label>

          {formState.message && !formState.ok ? (
            <p className="text-sm text-[var(--sn-red)]">{formState.message}</p>
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
      </DialogContent>
    </Dialog>
  )
}
