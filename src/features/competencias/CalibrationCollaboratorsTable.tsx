import Link from 'next/link'

import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { CompetencyEmptyState } from '@/features/competencias/CompetencyEmptyState'
import type { CalibrationCollaboratorRow } from '@/server/queries/competencias'

type CalibrationCollaboratorsTableProps = {
  data: CalibrationCollaboratorRow[]
}

export function CalibrationCollaboratorsTable({ data }: CalibrationCollaboratorsTableProps) {
  const columns: DataTableColumn<CalibrationCollaboratorRow>[] = [
    { key: 'nome', header: 'Colaborador', cell: (row) => row.nome ?? '—' },
    { key: 'area', header: 'Area', cell: (row) => row.areaNome ?? '—' },
    { key: 'funcao', header: 'Funcao', cell: (row) => row.funcaoNome ?? '—' },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
  ]

  if (data.length === 0) {
    return (
      <CompetencyEmptyState
        title="Nenhum colaborador elegivel"
        description="Ajuste os filtros ou o contexto organizacional."
      />
    )
  }

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      emptyTitle="Nenhum colaborador elegivel"
      rowActions={(row) => (
        <Link
          href={`/competencias/calibracao/${row.id}`}
          className="inline-flex h-8 items-center rounded-md border border-[var(--sn-border)] px-2 text-xs text-[var(--sn-text)] hover:bg-[var(--sn-field)]"
          title="Abrir matriz de calibracao"
        >
          Abrir matriz
        </Link>
      )}
    />
  )
}
