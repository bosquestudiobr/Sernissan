'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Pencil, RotateCcw, Trash2, XCircle } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { AgendaStatusBadge } from '@/features/agenda/AgendaStatusBadge'
import type { AgendaRow } from '@/server/queries/agenda'
import type { AgendaActionState } from '@/server/actions/agenda'

type ActionFn = (prev: AgendaActionState, formData: FormData) => Promise<AgendaActionState>

type AgendaTableProps = {
  data: AgendaRow[]
  canManage: boolean
  canReopen: boolean
  canDelete: boolean
  onEdit: (row: AgendaRow) => void
  deleteAction: ActionFn
  completeAction: ActionFn
  cancelAction: ActionFn
  reopenAction: ActionFn
}

function formatDate(value: string | null, diaTodo: boolean) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return diaTodo ? date.toLocaleDateString('pt-BR') : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function AgendaTable({
  data,
  canManage,
  canReopen,
  canDelete,
  onEdit,
  deleteAction,
  completeAction,
  cancelAction,
  reopenAction,
}: AgendaTableProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function run(action: ActionFn, id: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      const result = await action({ ok: false }, fd)
      if (result.ok) router.refresh()
    })
  }

  const columns: DataTableColumn<AgendaRow>[] = [
    { key: 'titulo', header: 'Titulo', cell: (row) => row.titulo ?? '—' },
    { key: 'inicio', header: 'Inicio', cell: (row) => formatDate(row.dataInicio, row.diaTodo) },
    { key: 'fim', header: 'Fim', cell: (row) => formatDate(row.dataFim, row.diaTodo) },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
    { key: 'responsavel', header: 'Responsavel', cell: (row) => row.responsavelNome ?? '—' },
    { key: 'status', header: 'Status', cell: (row) => <AgendaStatusBadge status={row.status} /> },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum compromisso encontrado"
      emptyDescription="Ajuste os filtros ou crie um novo compromisso."
      rowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          {row.placarId ? (
            <Link href={`/placar/${row.placarId}`} className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 text-xs hover:bg-[var(--sn-field)]">
              Placar
            </Link>
          ) : null}
          {canManage && !row.concluido && !row.cancelado ? (
            <>
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-emerald-700" title="Concluir" onClick={() => run(completeAction, row.id)}>
                <CheckCircle2 className="size-3.5" />
              </Button>
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" title="Cancelar" onClick={() => run(cancelAction, row.id)}>
                <XCircle className="size-3.5" />
              </Button>
            </>
          ) : null}
          {canReopen && (row.concluido || row.cancelado) ? (
            <Button type="button" size="sm" variant="outline" className="h-8 px-2" title="Reabrir" onClick={() => run(reopenAction, row.id)}>
              <RotateCcw className="size-3.5" />
            </Button>
          ) : null}
          {canDelete && !row.concluido && !row.cancelado ? (
            <ConfirmDialog
              title="Excluir compromisso"
              description="Confirma excluir este compromisso?"
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
