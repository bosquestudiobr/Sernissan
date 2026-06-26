'use client'

import { Pencil } from 'lucide-react'

import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { Button } from '@/components/ui/button'
import { ObjectiveActiveSwitch } from '@/features/indicadores/ObjectiveActiveSwitch'
import type { IndicatorObjectiveRow } from '@/server/queries/indicadores/objectives'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type IndicatorObjectivesTableProps = {
  data: IndicatorObjectiveRow[]
  concessionariaId?: string | null
  onEdit: (row: IndicatorObjectiveRow) => void
  toggleAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

export function IndicatorObjectivesTable({
  data,
  concessionariaId,
  onEdit,
  toggleAction,
}: IndicatorObjectivesTableProps) {
  const columns: DataTableColumn<IndicatorObjectiveRow>[] = [
    { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
    { key: 'sigla', header: 'Sigla', cell: (row) => row.sigla ?? '—' },
    { key: 'areas', header: 'Areas', cell: (row) => row.areaLabels || '—' },
    { key: 'funcoes', header: 'Funcoes', cell: (row) => row.funcaoLabels || '—' },
    {
      key: 'pontos',
      header: 'Peso',
      className: 'w-16',
      cell: (row) => (row.pontos != null ? String(row.pontos) : '—'),
    },
    {
      key: 'meta',
      header: 'Meta',
      className: 'w-20',
      cell: (row) => (row.meta != null ? String(row.meta) : '—'),
    },
    { key: 'unidade', header: 'Unidade', cell: (row) => row.unidadeLabel ?? row.unidade ?? '—' },
    {
      key: 'ativo',
      header: 'Ativo',
      className: 'w-16',
      cell: (row) => (
        <ObjectiveActiveSwitch id={row.id} ativo={row.ativo} concessionariaId={concessionariaId} toggleAction={toggleAction} />
      ),
    },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum indicador encontrado"
      emptyDescription="Ajuste os filtros ou solicite um novo indicador."
      rowActions={(row) => (
        <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onEdit(row)}>
          <Pencil className="size-3.5" />
        </Button>
      )}
    />
  )
}
