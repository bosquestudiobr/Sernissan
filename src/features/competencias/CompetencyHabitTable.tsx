'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { CompetencyEmptyState } from '@/features/competencias/CompetencyEmptyState'
import { CompetencyStatusBadge } from '@/features/competencias/CompetencyStatusBadge'
import type { CompetencyHabitRow } from '@/server/queries/competencias'
import type { CompetencyActionState } from '@/server/actions/competencias'

type ActionFn = (prev: CompetencyActionState, formData: FormData) => Promise<CompetencyActionState>

type CompetencyHabitTableProps = {
  data: CompetencyHabitRow[]
  canManage: boolean
  onEdit: (row: CompetencyHabitRow) => void
  deleteAction: ActionFn
}

export function CompetencyHabitTable({ data, canManage, onEdit, deleteAction }: CompetencyHabitTableProps) {
  const columns: DataTableColumn<CompetencyHabitRow>[] = [
    { key: 'pergunta', header: 'Pergunta', cell: (row) => row.pergunta ?? '—' },
    { key: 'area', header: 'Area', className: 'w-32', cell: (row) => row.area ?? '—' },
    { key: 'mv', header: 'MV', className: 'w-24', cell: (row) => row.mv ?? '—' },
    { key: 'peso', header: 'Peso', className: 'w-16', cell: (row) => (row.peso != null ? String(row.peso) : '—') },
    { key: 'trilha', header: 'Trilha', className: 'w-16', cell: (row) => (row.trilha != null ? String(row.trilha) : '—') },
    {
      key: 'essencial',
      header: 'Tipo',
      className: 'w-24',
      cell: (row) => <CompetencyStatusBadge essencial={row.essencial} />,
    },
  ]

  if (data.length === 0) {
    return <CompetencyEmptyState title="Nenhum habito encontrado" description="Ajuste os filtros ou crie um novo habito." />
  }

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum habito encontrado"
      rowActions={
        canManage
          ? (row) => (
              <div className="flex items-center justify-end gap-1">
                <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                  <Pencil className="size-3.5" />
                </Button>
                <ConfirmDialog
                  title="Excluir habito"
                  description="Confirma excluir este habito?"
                  confirmLabel="Excluir"
                  onConfirm={async () => {
                    const fd = new FormData()
                    fd.set('id', row.id)
                    await deleteAction({ ok: false }, fd)
                  }}
                  trigger={
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-[var(--sn-red)]">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                />
              </div>
            )
          : undefined
      }
    />
  )
}
