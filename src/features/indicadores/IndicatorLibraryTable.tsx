'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { CopyIndicatorIdButton } from '@/features/indicadores/CopyIndicatorIdButton'
import { IndicatorActiveSwitch } from '@/features/indicadores/IndicatorActiveSwitch'
import type { IndicatorLibraryRow } from '@/server/queries/indicadores/library'
import type { IndicatorActionState } from '@/server/actions/indicadores/library'

type IndicatorLibraryTableProps = {
  data: IndicatorLibraryRow[]
  onEdit: (row: IndicatorLibraryRow) => void
  deleteAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  toggleAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
}

export function IndicatorLibraryTable({
  data,
  onEdit,
  deleteAction,
  toggleAction,
}: IndicatorLibraryTableProps) {
  const columns: DataTableColumn<IndicatorLibraryRow>[] = [
    {
      key: 'ordem',
      header: '#',
      className: 'w-12',
      cell: (row) => (row.ordem != null ? String(row.ordem) : '—'),
    },
    { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
    { key: 'sigla', header: 'Sigla', cell: (row) => row.sigla ?? '—' },
    { key: 'api_id', header: 'API', cell: (row) => row.api_id ?? '—' },
    { key: 'areas', header: 'Areas', cell: (row) => row.areaLabels || '—' },
    { key: 'funcoes', header: 'Funcoes', cell: (row) => row.funcaoLabels || '—' },
    {
      key: 'pontos',
      header: 'Peso',
      className: 'w-16',
      cell: (row) => (row.pontos != null ? String(row.pontos) : '—'),
    },
    { key: 'unidade', header: 'Unidade', cell: (row) => row.unidadeLabel ?? row.unidade ?? '—' },
    {
      key: 'meta',
      header: 'Meta',
      className: 'w-20',
      cell: (row) => (row.meta != null ? String(row.meta) : '—'),
    },
    {
      key: 'simbolo',
      header: 'Simb.',
      className: 'w-14',
      cell: (row) => row.unidadeSimbolo || '—',
    },
    {
      key: 'ativo',
      header: 'Ativo',
      className: 'w-16',
      cell: (row) => <IndicatorActiveSwitch id={row.id} ativo={row.ativo} toggleAction={toggleAction} />,
    },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum indicador encontrado"
      emptyDescription="Ajuste os filtros ou adicione um indicador na biblioteca."
      rowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          <CopyIndicatorIdButton id={row.id} />
          <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
            <Pencil className="size-3.5" />
          </Button>
          <ConfirmDialog
            title="Excluir indicador"
            description={`Confirma a exclusao de "${row.nome ?? row.sigla ?? 'indicador'}"?`}
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
      )}
    />
  )
}
