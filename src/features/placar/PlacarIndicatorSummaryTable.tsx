import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import type { PlacarIndicatorSummaryRow } from '@/server/queries/placar'

type PlacarIndicatorSummaryTableProps = {
  rows: PlacarIndicatorSummaryRow[]
}

const dash = (v: number | null) => (v != null ? String(v) : '—')

export function PlacarIndicatorSummaryTable({ rows }: PlacarIndicatorSummaryTableProps) {
  const columns: DataTableColumn<PlacarIndicatorSummaryRow>[] = [
    { key: 'sigla', header: 'Sigla', className: 'w-20', cell: (row) => row.sigla ?? '—' },
    { key: 'nome', header: 'Indicador', cell: (row) => row.nome ?? '—' },
    { key: 'colaborador', header: 'Colaborador', cell: (row) => row.colaboradorNome ?? '—' },
    { key: 'meta', header: 'Meta', className: 'w-20 text-right', cell: (row) => dash(row.meta) },
    { key: 'valor', header: 'Valor', className: 'w-20 text-right', cell: (row) => dash(row.valor) },
    { key: 'pontos', header: 'Peso', className: 'w-16 text-right', cell: (row) => dash(row.pontos) },
    { key: 'pontosRanking', header: 'Pontos', className: 'w-20 text-right', cell: (row) => dash(row.pontosRanking) },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={rows}
      emptyTitle="Nenhum indicador vinculado"
      emptyDescription="Vincule indicadores ao placar e recalcule."
    />
  )
}
