'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Eye, Pencil, RotateCcw, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { ReuniaoStatusBadge } from '@/features/reuniao-resultados/ReuniaoStatusBadge'
import type { ReuniaoRow } from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoResultadosTableProps = {
  data: ReuniaoRow[]
  canManage: boolean
  canFinalize: boolean
  canDelete: boolean
  onEdit: (row: ReuniaoRow) => void
  deleteAction: ActionFn
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function ReuniaoResultadosTable({
  data,
  canManage,
  canFinalize,
  canDelete,
  onEdit,
  deleteAction,
  finalizeAction,
  reopenAction,
}: ReuniaoResultadosTableProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function runAction(action: ActionFn, id: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      const result = await action({ ok: false }, fd)
      if (result.ok) router.refresh()
    })
  }

  const columns: DataTableColumn<ReuniaoRow>[] = [
    { key: 'codigo', header: 'Codigo', cell: (row) => row.id2 ?? '—' },
    { key: 'data', header: 'Data', cell: (row) => formatDate(row.data) },
    { key: 'responsavel', header: 'Responsavel', cell: (row) => row.createdByNome ?? '—' },
    { key: 'indicadores', header: 'Indicadores', cell: (row) => String(row.indicatorCount) },
    { key: 'acoes', header: 'Acoes', cell: (row) => String(row.actionCount) },
    { key: 'status', header: 'Status', cell: (row) => <ReuniaoStatusBadge status={row.status} /> },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhuma reuniao encontrada"
      emptyDescription="Ajuste os filtros ou crie uma nova reuniao."
      rowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/reuniao-resultados/${row.id}`} className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 hover:bg-[var(--sn-field)]" title="Abrir">
            <Eye className="size-3.5" />
          </Link>
          {canManage && !row.finalizada ? (
            <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
              <Pencil className="size-3.5" />
            </Button>
          ) : null}
          {canFinalize ? (
            row.finalizada ? (
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" title="Reabrir" onClick={() => runAction(reopenAction, row.id)}>
                <RotateCcw className="size-3.5" />
              </Button>
            ) : (
              <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-emerald-700" title="Finalizar" onClick={() => runAction(finalizeAction, row.id)}>
                <CheckCircle2 className="size-3.5" />
              </Button>
            )
          ) : null}
          {canDelete && !row.finalizada ? (
            <ConfirmDialog
              title="Excluir reuniao"
              description="Confirma excluir esta reuniao de resultados?"
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
      )}
    />
  )
}
