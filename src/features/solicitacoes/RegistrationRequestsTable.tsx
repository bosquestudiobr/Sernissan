'use client'

import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { RequestActions } from '@/features/solicitacoes/RequestActions'
import { RequestEmptyState } from '@/features/solicitacoes/RequestEmptyState'
import { RequestStatusBadge } from '@/features/solicitacoes/RequestStatusBadge'
import type { RegistrationRequestRow } from '@/server/queries/solicitacoes'
import type { SolicitacoesActionState } from '@/server/actions/solicitacoes'

type ActionFn = (prev: SolicitacoesActionState, formData: FormData) => Promise<SolicitacoesActionState>

type RegistrationRequestsTableProps = {
  data: RegistrationRequestRow[]
  canManage: boolean
  approveAction: ActionFn
  rejectAction: ActionFn
  onReview: (id: string) => void
}

function initials(nome: string | null) {
  if (!nome) return '?'
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export function RegistrationRequestsTable({ data, canManage, approveAction, rejectAction, onReview }: RegistrationRequestsTableProps) {
  if (data.length === 0) {
    return <RequestEmptyState title="Nenhuma solicitacao de cadastro" description="Sem cadastros pendentes para os filtros atuais." />
  }

  const columns: DataTableColumn<RegistrationRequestRow>[] = [
    {
      key: 'nome',
      header: 'Colaborador',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[var(--sn-field)] text-xs font-semibold text-[var(--sn-muted)]">
            {initials(row.profileNome ?? row.requestNome)}
          </span>
          <span>{row.profileNome ?? row.requestNome ?? '—'}</span>
        </div>
      ),
    },
    { key: 'area', header: 'Area', cell: (row) => row.areaNome ?? '—' },
    { key: 'funcao', header: 'Funcao', cell: (row) => row.funcaoNome ?? '—' },
    { key: 'concessionaria', header: 'Concessionaria', cell: (row) => row.concessionariaNome ?? '—' },
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
