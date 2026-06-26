'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Pencil, Power, RotateCcw, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { HabitoProgressPanel } from '@/features/habitos/HabitoProgressPanel'
import { HabitoStatusBadge } from '@/features/habitos/HabitoStatusBadge'
import type { HabitoRow } from '@/server/queries/habitos'
import type { HabitoActionState } from '@/server/actions/habitos'

type ActionFn = (prev: HabitoActionState, formData: FormData) => Promise<HabitoActionState>

type HabitosTableProps = {
  data: HabitoRow[]
  canManage: boolean
  canReopen: boolean
  canDelete: boolean
  onEdit: (row: HabitoRow) => void
  deleteAction: ActionFn
  completeAction: ActionFn
  toggleActiveAction: ActionFn
  reopenAction: ActionFn
  markDoneAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function HabitosTable({
  data,
  canManage,
  canReopen,
  canDelete,
  onEdit,
  deleteAction,
  completeAction,
  toggleActiveAction,
  reopenAction,
  markDoneAction,
}: HabitosTableProps) {
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

  const columns: DataTableColumn<HabitoRow>[] = [
    { key: 'titulo', header: 'Titulo', cell: (row) => row.titulo ?? '—' },
    { key: 'responsavel', header: 'Responsavel', cell: (row) => row.responsavelNome ?? '—' },
    { key: 'area', header: 'Area', cell: (row) => row.areaNome ?? '—' },
    { key: 'funcao', header: 'Funcao', cell: (row) => row.funcaoNome ?? '—' },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
    { key: 'prazo', header: 'Prazo', cell: (row) => formatDate(row.dataFim) },
    { key: 'status', header: 'Status', cell: (row) => <HabitoStatusBadge status={row.status} /> },
    {
      key: 'progresso',
      header: 'Progresso',
      cell: (row) =>
        row.metaExecucoes != null && row.metaExecucoes > 0 ? (
          <span className="text-xs">{row.progressLabel}</span>
        ) : (
          '—'
        ),
    },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum habito encontrado"
      emptyDescription="Ajuste os filtros ou crie um novo habito."
      rowActions={(row) => (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center justify-end gap-1">
            {row.competenciaHabitoId ? (
              <Link
                href="/competencias?tab=habitos"
                className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 text-xs hover:bg-[var(--sn-field)]"
                title={row.competenciaHabitoLabel ?? 'Catalogo competencias'}
              >
                Competencia
              </Link>
            ) : null}
            {row.agendamentoId ? (
              <Link
                href={`/agenda`}
                className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 text-xs hover:bg-[var(--sn-field)]"
              >
                Agenda
              </Link>
            ) : null}
            {canManage && !row.concluido ? (
              <>
                <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-emerald-700" title="Concluir" onClick={() => run(completeAction, row.id)}>
                  <CheckCircle2 className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-8 px-2" title={row.ativo ? 'Inativar' : 'Ativar'} onClick={() => run(toggleActiveAction, row.id)}>
                  <Power className="size-3.5" />
                </Button>
              </>
            ) : null}
            {canReopen && row.concluido ? (
              <Button type="button" size="sm" variant="outline" className="h-8 px-2" title="Reabrir" onClick={() => run(reopenAction, row.id)}>
                <RotateCcw className="size-3.5" />
              </Button>
            ) : null}
            {canDelete && !row.concluido ? (
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
            ) : null}
          </div>
          <HabitoProgressPanel row={row} canManage={canManage} markDoneAction={markDoneAction} />
        </div>
      )}
    />
  )
}
