'use client'

import Link from 'next/link'
import { Pencil, Trash2, Eye } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { VisitaStatusBadge } from '@/features/visitas/VisitaStatusBadge'
import type { VisitaRow } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type VisitasTableProps = {
  data: VisitaRow[]
  canManage: boolean
  onEdit: (row: VisitaRow) => void
  deleteAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function VisitasTable({ data, canManage, onEdit, deleteAction }: VisitasTableProps) {
  const columns: DataTableColumn<VisitaRow>[] = [
    { key: 'data', header: 'Data', cell: (row) => formatDate(row.dataVisita) },
    { key: 'dealer', header: 'Concessionaria', cell: (row) => row.dealerNome ?? '—' },
    { key: 'consultor', header: 'Consultor', cell: (row) => row.consultorNome ?? '—' },
    { key: 'modalidade', header: 'Modalidade', cell: (row) => row.modalidadeNome ?? '—' },
    { key: 'status', header: 'Status', cell: (row) => <VisitaStatusBadge status={row.status} /> },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhuma visita encontrada"
      emptyDescription="Ajuste os filtros ou crie uma nova visita."
      rowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/visitas/${row.id}`} className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 hover:bg-[var(--sn-field)]" title="Abrir">
            <Eye className="size-3.5" />
          </Link>
          {canManage ? (
            <>
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                <Pencil className="size-3.5" />
              </Button>
              {row.status !== 'assinada' ? (
                <ConfirmDialog
                  title="Excluir visita"
                  description="Confirma excluir esta visita?"
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
            </>
          ) : null}
        </div>
      )}
    />
  )
}
