'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { PlacarEmptyState } from '@/features/placar/PlacarEmptyState'
import { PlacarStatusBadge } from '@/features/placar/PlacarStatusBadge'
import type { PlacarRow } from '@/server/queries/placar'
import type { PlacarActionState } from '@/server/actions/placar'

type PlacarTableProps = {
  data: PlacarRow[]
  canEdit: boolean
  onEdit: (row: PlacarRow) => void
  deleteAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
}

function formatPlacarDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function PlacarTable({ data, canEdit, onEdit, deleteAction }: PlacarTableProps) {
  const columns: DataTableColumn<PlacarRow>[] = [
    {
      key: 'data',
      header: 'Data',
      cell: (row) => formatPlacarDate(row.data),
    },
    {
      key: 'concessionaria',
      header: 'Concessionaria',
      cell: (row) => row.concessionariaNome ?? '—',
    },
    {
      key: 'origem',
      header: 'Origem',
      cell: (row) => row.origemLabel ?? row.opcao_origem ?? '—',
    },
    {
      key: 'acumulado',
      header: 'Acumulado',
      cell: (row) => row.acumuladoLabel ?? row.opcao_acumulado ?? '—',
    },
    {
      key: 'indicadores',
      header: 'Ind.',
      className: 'w-16',
      cell: (row) => String(row.indicadorCount),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <PlacarStatusBadge finalizado={row.finalizado} rankingAtualizado={row.ranking_atualizado} />
      ),
    },
  ]

  if (data.length === 0) {
    return <PlacarEmptyState />
  }

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum placar encontrado"
      emptyDescription="Ajuste os filtros ou crie um novo placar."
      rowActions={
        canEdit
          ? (row) => (
              <div className="flex items-center justify-end gap-1">
                <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                  <Pencil className="size-3.5" />
                </Button>
                {!row.finalizado ? (
                  <ConfirmDialog
                    title="Excluir placar"
                    description="Confirma a exclusao deste placar aberto?"
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
                ) : null}
              </div>
            )
          : undefined
      }
    />
  )
}
