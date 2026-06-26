'use client'

import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { RequestActions } from '@/features/solicitacoes/RequestActions'
import { RequestEmptyState } from '@/features/solicitacoes/RequestEmptyState'
import { RequestStatusBadge } from '@/features/solicitacoes/RequestStatusBadge'
import type { InclusionRequestRow } from '@/server/queries/solicitacoes'
import type { SolicitacoesActionState } from '@/server/actions/solicitacoes'

type ActionFn = (prev: SolicitacoesActionState, formData: FormData) => Promise<SolicitacoesActionState>

type InclusionRequestsTableProps = {
  data: InclusionRequestRow[]
  canManage: boolean
  approveAction: ActionFn
  rejectAction: ActionFn
  onReview: (id: string) => void
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function InclusionRequestsTable({ data, canManage, approveAction, rejectAction, onReview }: InclusionRequestsTableProps) {
  if (data.length === 0) {
    return <RequestEmptyState title="Nenhuma solicitacao de inclusao" description="Sem inclusoes pendentes para os filtros atuais." />
  }

  const columns: DataTableColumn<InclusionRequestRow>[] = [
    { key: 'usuario', header: 'Usuario', cell: (row) => row.usuarioNome ?? '—' },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
    { key: 'tipo', header: 'Tipo', cell: (row) => row.tipoInclusao ?? '—' },
    { key: 'data', header: 'Data', cell: (row) => formatDate(row.created_at) },
    { key: 'status', header: 'Status', cell: (row) => <RequestStatusBadge atendida={row.atendida} /> },
  ]

  return (
    <ServerDataTable
      columns={columns}
      data={data}
      rowActions={(row) => (
        <RequestActions
          id={row.id}
          atendida={row.atendida}
          canManage={canManage}
          approveAction={approveAction}
          rejectAction={rejectAction}
          onReview={onReview}
        />
      )}
    />
  )
}
