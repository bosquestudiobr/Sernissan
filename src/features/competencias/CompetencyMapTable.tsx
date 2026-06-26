'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { CompetencyEmptyState } from '@/features/competencias/CompetencyEmptyState'
import type { CompetencyMapRow } from '@/server/queries/competencias'
import type { CompetencyActionState } from '@/server/actions/competencias'

type ActionFn = (prev: CompetencyActionState, formData: FormData) => Promise<CompetencyActionState>

type CompetencyMapTableProps = {
  data: CompetencyMapRow[]
  canManage: boolean
  onEdit: (row: CompetencyMapRow) => void
  deleteAction: ActionFn
}

export function CompetencyMapTable({ data, canManage, onEdit, deleteAction }: CompetencyMapTableProps) {
  const columns: DataTableColumn<CompetencyMapRow>[] = [
    { key: 'versao', header: 'Versao', cell: (row) => row.versao ?? '—' },
    { key: 'funcao', header: 'Funcao', cell: (row) => row.funcaoNome ?? '—' },
    { key: 'entrega', header: 'Entrega', cell: (row) => row.entrega ?? '—' },
    { key: 'habitos', header: 'Habitos', className: 'w-20', cell: (row) => String(row.habitoCount) },
  ]

  if (data.length === 0) {
    return <CompetencyEmptyState title="Nenhum mapa encontrado" description="Ajuste os filtros ou crie um novo mapa." />
  }

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum mapa encontrado"
      rowActions={
        canManage
          ? (row) => (
              <div className="flex items-center justify-end gap-1">
                <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                  <Pencil className="size-3.5" />
                </Button>
                <ConfirmDialog
                  title="Excluir mapa"
                  description={`Confirma excluir o mapa "${row.versao ?? 'mapa'}"?`}
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
