import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { SolicitacoesView } from '@/features/solicitacoes/SolicitacoesView'
import { buildSolicitacoesPageContext } from '@/features/solicitacoes/buildSolicitacoesPageContext'
import {
  approveInclusionRequestAction,
  approveRegistrationRequestAction,
  refreshSolicitacoesAction,
  rejectInclusionRequestAction,
  rejectRegistrationRequestAction,
  reviewRequestAction,
} from '@/server/actions/solicitacoes'
import {
  getPendingSolicitacoesCount,
  getSolicitacoesFilterOptions,
  listInclusionRequests,
  listRegistrationRequests,
  parseSolicitacoesParams,
} from '@/server/queries/solicitacoes'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function SolicitacoesPage({ searchParams }: PageProps) {
  const params = parseSolicitacoesParams(await searchParams)
  const { user, scopes, orgContext, canManage } = await buildSolicitacoesPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const [registrationResult, inclusionResult, filterData, pendingCount] = await Promise.all([
    listRegistrationRequests(params, ctx),
    listInclusionRequests(params, ctx),
    getSolicitacoesFilterOptions(ctx),
    getPendingSolicitacoesCount(ctx),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <SolicitacoesView
        registrationResult={registrationResult}
        inclusionResult={inclusionResult}
        filterOptions={{ concessionarias: filterData.concessionarias.map((c) => ({ label: c.label, value: c.id })) }}
        pendingCount={pendingCount}
        canManage={canManage}
        approveRegistrationAction={approveRegistrationRequestAction}
        rejectRegistrationAction={rejectRegistrationRequestAction}
        approveInclusionAction={approveInclusionRequestAction}
        rejectInclusionAction={rejectInclusionRequestAction}
        reviewAction={reviewRequestAction}
        refreshAction={refreshSolicitacoesAction}
      />
    </Suspense>
  )
}