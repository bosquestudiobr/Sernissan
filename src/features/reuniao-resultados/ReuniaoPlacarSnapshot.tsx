import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import type { SnapshotRow } from '@/server/queries/reuniao-resultados'

type ReuniaoPlacarSnapshotProps = {
  data: SnapshotRow[]
}

export function ReuniaoPlacarSnapshot({ data }: ReuniaoPlacarSnapshotProps) {
  const columns: DataTableColumn<SnapshotRow>[] = [
    { key: 'indicador', header: 'Indicador', cell: (row) => row.indicadorNome ?? '—' },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
    { key: 'meta', header: 'Meta', cell: (row) => row.meta ?? '—' },
    { key: 'resultado', header: 'Resultado', cell: (row) => row.resultado ?? '—' },
    { key: 'percentual', header: '%', cell: (row) => row.percentual ?? '—' },
    { key: 'pontos', header: 'Pontos', cell: (row) => row.pontos ?? '—' },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Sem resultados registrados"
      emptyDescription="Resultados XR aparecem aqui em modo leitura (sem recalculo de placar)."
    />
  )
}
