'use client'

import { useActionState, useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { TablePagination } from '@/components/data-table/TablePagination'
import { RowActions } from '@/components/data-table/RowActions'
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
import type { PaginatedResult } from '@/lib/types/pagination'
import type { AdminActionState } from '@/server/actions/admin'

export type AdminField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'select'
  required?: boolean
  options?: { label: string; value: string }[]
}

type AdminCrudViewProps<T extends { id: string }> = {
  title: string
  description?: string
  entityLabel: string
  fields: AdminField[]
  columns: DataTableColumn<T>[]
  result: PaginatedResult<T>
  filters?: React.ReactNode
  createAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  updateAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  deleteAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  mapRowToFields: (row: T) => Record<string, string | null | undefined>
}

const initialState: AdminActionState = { ok: false }

export function AdminCrudView<T extends { id: string }>({
  title,
  description,
  entityLabel,
  fields,
  columns,
  result,
  filters,
  createAction,
  updateAction,
  deleteAction,
  mapRowToFields,
}: AdminCrudViewProps<T>) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [createState, createFormAction, createPending] = useActionState(createAction, initialState)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const [, deleteFormAction] = useActionState(deleteAction, initialState)

  const isEdit = editing !== null
  const formAction = isEdit ? updateFormAction : createFormAction
  const formState = isEdit ? updateState : createState
  const pending = isEdit ? updatePending : createPending

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(row: T) {
    setEditing(row)
    setOpen(true)
  }

  async function handleDelete(row: T) {
    const fd = new FormData()
    fd.set('id', row.id)
    await deleteFormAction(fd)
  }

  const values = editing ? mapRowToFields(editing) : {}

  return (
    <AdminPageShell
      title={title}
      description={description}
      actions={
        <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={openCreate}>
          <Plus className="mr-1 size-4" /> Adicionar {entityLabel}
        </Button>
      }
      filters={filters}
      footer={
        <TablePagination
          page={result.page}
          pageCount={result.pageCount}
          total={result.total}
          className="border-t border-[var(--sn-border)] pt-4"
        />
      }
    >
      <ServerDataTable
        columns={columns}
        data={result.data}
        rowActions={(row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => handleDelete(row)} />}
        emptyTitle={`Nenhum ${entityLabel.toLowerCase()} encontrado`}
        emptyDescription="Ajuste os filtros ou adicione um novo registro."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEdit ? `Editar ${entityLabel}` : `Novo ${entityLabel}`}</DialogTitle>
          </DialogHeader>
          <form
            action={formAction}
            onSubmit={() => {
              if (!pending) setTimeout(() => setOpen(false), 0)
            }}
            className="space-y-3"
          >
            {isEdit ? <input type="hidden" name="id" value={editing.id} /> : null}
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    defaultValue={values[field.name] ?? ''}
                    required={field.required}
                    className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type ?? 'text'}
                    defaultValue={values[field.name] ?? ''}
                    required={field.required}
                    className="bg-[var(--sn-field)]"
                  />
                )}
                {formState.fieldErrors?.[field.name]?.[0] ? (
                  <p className="text-xs text-[var(--sn-red)]">{formState.fieldErrors[field.name]?.[0]}</p>
                ) : null}
              </div>
            ))}
            {formState.message && !formState.ok ? (
              <p className="text-sm text-[var(--sn-red)]">{formState.message}</p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending} className="bg-[var(--sn-black)] text-white hover:bg-black/90">
                {pending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}