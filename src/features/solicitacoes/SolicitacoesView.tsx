'use client'

import { useState } from 'react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { DataCard } from '@/components/shared/DataCard'
import { TablePagination } from '@/components/data-table/TablePagination'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import { SolicitacoesFilters } from '@/features/solicitacoes/SolicitacoesFilters'
import { RegistrationRequestsTable } from '@/features/solicitacoes/RegistrationRequestsTable'
import { InclusionRequestsTable } from '@/features/solicitacoes/InclusionRequestsTable'
import { RequestReviewDialog } from '@/features/solicitacoes/RequestReviewDialog'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { InclusionRequestRow, RegistrationRequestRow } from '@/server/queries/solicitacoes'
import type { SolicitacoesActionState } from '@/server/actions/solicitacoes'

type Option = { label: string; value: string }
type ActionFn = (prev: SolicitacoesActionState, formData: FormData) => Promise<SolicitacoesActionState>
type ReviewKind = 'cadastro' | 'inclusao'

type SolicitacoesViewProps = {
  registrationResult: PaginatedResult<RegistrationRequestRow>
  inclusionResult: PaginatedResult<InclusionRequestRow>
  filterOptions: { concessionarias: Option[] }
  pendingCount: number
  canManage: boolean
  approveRegistrationAction: ActionFn
  rejectRegistrationAction: ActionFn
  approveInclusionAction: ActionFn
  rejectInclusionAction: ActionFn
  reviewAction: ActionFn
  refreshAction: () => Promise<SolicitacoesActionState>
}

export function SolicitacoesView({
  registrationResult,
  inclusionResult,
  filterOptions,
  pendingCount,
  canManage,
  approveRegistrationAction,
  rejectRegistrationAction,
  approveInclusionAction,
  rejectInclusionAction,
  reviewAction,
  refreshAction,
}: SolicitacoesViewProps) {
  const [review, setReview] = useState<{ id: string; kind: ReviewKind } | null>(null)

  return (
    <>
      <AdminPageShell
        title="Solicitacoes"
        description={pendingCount > 0 ? `${pendingCount} solicitacao(oes) pendente(s)` : 'Solicitacoes de cadastro e inclusao.'}
        actions={<RefreshIndicatorsButton action={refreshAction} />}
        filters={<SolicitacoesFilters concessionarias={filterOptions.concessionarias} />}
      >
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--sn-text)]">Solicitacoes de cadastro</p>
            <RegistrationRequestsTable
              data={registrationResult.data}
              canManage={canManage}
              approveAction={approveRegistrationAction}
              rejectAction={rejectRegistrationAction}
              onReview={(id) => setReview({ id, kind: 'cadastro' })}
            />
            <TablePagination
              page={registrationResult.page}
              pageCount={registrationResult.pageCount}
              total={registrationResult.total}
              pageParam="pageCad"
              className="border-t border-[var(--sn-border)] pt-3"
            />
          </div>
        </div>
      </AdminPageShell>

      <DataCard className="mt-4 space-y-3">
        <p className="text-sm font-semibold text-[var(--sn-text)]">Solicitacoes de inclusao</p>
        <InclusionRequestsTable
          data={inclusionResult.data}
          canManage={canManage}
          approveAction={approveInclusionAction}
          rejectAction={rejectInclusionAction}
          onReview={(id) => setReview({ id, kind: 'inclusao' })}
        />
        <TablePagination
          page={inclusionResult.page}
          pageCount={inclusionResult.pageCount}
          total={inclusionResult.total}
          pageParam="pageInc"
          className="border-t border-[var(--sn-border)] pt-3"
        />
      </DataCard>

      <RequestReviewDialog
        open={review !== null}
        onOpenChange={(open) => {
          if (!open) setReview(null)
        }}
        requestId={review?.id ?? null}
        canManage={canManage}
        reviewAction={reviewAction}
        approveAction={review?.kind === 'inclusao' ? approveInclusionAction : approveRegistrationAction}
        rejectAction={review?.kind === 'inclusao' ? rejectInclusionAction : rejectRegistrationAction}
      />
    </>
  )
}
