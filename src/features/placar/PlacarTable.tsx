'use client'

import Link from 'next/link'
import { Pencil, Trash2, CheckCircle2, RotateCcw, Eye } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { PlacarEmptyState } from '@/features/placar/PlacarEmptyState'
import { PlacarStatusBadge } from '@/features/placar/PlacarStatusBadge'
import { PlacarRecalcButton } from '@/features/placar/PlacarRecalcButton'
import type { PlacarRow } from '@/server/queries/placar'
import type { PlacarActionState } from '@/server/actions/placar'

type ActionFn = (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>

type PlacarTableProps = {
  data: PlacarRow[]
  canEdit: boolean
  onEdit: (row: PlacarRow) => void
  deleteAction: ActionFn
  recalcAction: ActionFn
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

function formatPlacarDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

async function runWithId(action: ActionFn, id: string) {
  const fd = new FormData()
  fd.set('id', id)
  await action({ ok: false }, fd)
}

export function PlacarTable({
  data,
  canEdit,
  onEdit,
  deleteAction,
  recalcAction,
  finalizeAction,
  reopenAction,
}: PlacarTableProps) {
  const columns: DataTableColumn<PlacarRow>[] = [
    { key: 'data', header: 'Data', cell: (row) => formatPlacarDate(row.data) },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
    { key: 'origem', header: 'Origem', cell: (row) => row.origemLabel ?? row.opcao_origem ?? '—' },
    { key: 'acumulado', header: 'Acumulado', cell: (row) => row.acumuladoLabel ?? row.opcao_acumulado ?? '—' },
    { key: 'indicadores', header: 'Ind.', className: 'w-14', cell: (row) => String(row.indicadorCount) },
    { key: 'colaboradores', header: 'Colab.', className: 'w-16', cell: (row) => String(row.colaboradorCount) },
    {
      key: 'pontos',
      header: 'Pontos',
      className: 'w-20',
      cell: (row) => (row.totalPontos != null ? String(row.totalPontos) : '—'),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <PlacarStatusBadge finalizado={row.finalizado} rankingAtualizado={row.ranking_atualizado} />,
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
      rowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/placar/${row.id}`}
            className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 hover:bg-[var(--sn-field)]"
            title="Abrir detalhes"
          >
            <Eye className="size-3.5" />
          </Link>
          {canEdit ? (
            <>
              <PlacarRecalcButton placarId={row.id} action={recalcAction} disabled={row.finalizado === true} />
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                <Pencil className="size-3.5" />
              </Button>
              {row.finalizado ? (
                <ConfirmDialog
                  title="Reabrir placar"
                  description="Confirma reabrir este placar finalizado?"
                  confirmLabel="Reabrir"
                  onConfirm={() => runWithId(reopenAction, row.id)}
                  trigger={
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2">
                      <RotateCcw className="size-3.5" />
                    </Button>
                  }
                />
              ) : (
                <>
                  <ConfirmDialog
                    title="Finalizar placar"
                    description="Confirma finalizar este placar? Ele ficara bloqueado para recalculo."
                    confirmLabel="Finalizar"
                    onConfirm={() => runWithId(finalizeAction, row.id)}
                    trigger={
                      <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-emerald-700">
                        <CheckCircle2 className="size-3.5" />
                      </Button>
                    }
                  />
                  <ConfirmDialog
                    title="Excluir placar"
                    description="Confirma a exclusao deste placar aberto?"
                    confirmLabel="Excluir"
                    onConfirm={() => runWithId(deleteAction, row.id)}
                    trigger={
                      <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-[var(--sn-red)]">
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                  />
                </>
              )}
            </>
          ) : null}
        </div>
      )}
    />
  )
}
