import { Suspense } from 'react'

import { IndicatorObjectivesView } from '@/features/indicadores/IndicatorObjectivesView'
import { buildIndicatorPageContext } from '@/features/indicadores/buildIndicatorPageContext'
import { LoadingState } from '@/components/shared/LoadingState'
import {
  approveIndicatorRequestAction,
  refreshIndicatorObjectivesAction,
  rejectIndicatorRequestAction,
  requestIndicatorAction,
  toggleIndicatorObjectiveActiveAction,
  updateIndicatorObjectiveAction,
} from '@/server/actions/indicadores/objectives'
import { getIndicatorOptionSets } from '@/server/queries/indicadores/library'
import {
  getIndicatorObjectiveFilterOptions,
  getPendingIndicatorRequestsCount,
  listIndicatorObjectives,
  listIndicatorRequests,
  parseIndicatorObjectivesParams,
} from '@/server/queries/indicadores/objectives'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function IndicadoresPage({ searchParams }: PageProps) {
  const params = parseIndicatorObjectivesParams(await searchParams)
  const { user, scopes, orgContext, canApprove } = await buildIndicatorPageContext()

  const [result, filterData, optionSets, pendingCount, requests] = await Promise.all([
    listIndicatorObjectives(params, {
      scopes,
      orgContext,
      empresaId: user.empresaId,
    }),
    getIndicatorObjectiveFilterOptions(user.empresaId),
    getIndicatorOptionSets(),
    getPendingIndicatorRequestsCount(orgContext.concessionariaId),
    listIndicatorRequests(orgContext.concessionariaId, true),
  ])

  const toOptions = (items: { id: string; label: string }[]) =>
    items.map((item) => ({ label: item.label, value: item.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <IndicatorObjectivesView
        result={result}
        pendingCount={pendingCount}
        requests={requests}
        filterOptions={{
          areas: toOptions(filterData.areas),
          funcoes: toOptions(filterData.funcoes),
        }}
        unidades={optionSets.unidades.map((u) => ({ label: u.label, value: u.value }))}
        concessionariaId={orgContext.concessionariaId}
        canApprove={canApprove}
        updateAction={updateIndicatorObjectiveAction}
        toggleAction={toggleIndicatorObjectiveActiveAction}
        requestAction={requestIndicatorAction}
        approveAction={approveIndicatorRequestAction}
        rejectAction={rejectIndicatorRequestAction}
        refreshAction={refreshIndicatorObjectivesAction}
      />
    </Suspense>
  )
}
