import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import type { RankingRow } from '@/server/jobs/placar/types'

type PlacarRankingTableProps = {
  ranking: RankingRow[]
}

type Row = RankingRow & { id: string }

export function PlacarRankingTable({ ranking }: PlacarRankingTableProps) {
  const rows: Row[] = ranking.map((r, index) => ({
    ...r,
    id: r.colaboradorId ?? `sem-colaborador-${index}`,
  }))

  const columns: DataTableColumn<Row>[] = [
    { key: 'posicao', header: '#', className: 'w-12', cell: (row) => String(row.posicao) },
    { key: 'colaborador', header: 'Colaborador', cell: (row) => row.colaboradorNome ?? 'Sem colaborador' },
    { key: 'pontos', header: 'Pontos', className: 'w-24 text-right', cell: (row) => String(row.pontosTotal) },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={rows}
      emptyTitle="Sem ranking calculado"
      emptyDescription="Recalcule o placar para gerar o ranking."
    />
  )
}
