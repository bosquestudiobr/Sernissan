import { Suspense } from 'react'

import { PlacarView } from '@/features/placar/PlacarView'
import { buildPlacarPageContext } from '@/features/placar/buildPlacarPageContext'
import { LoadingState } from '@/components/shared/LoadingState'
import {
  createPlacarAction,
  deletePlacarAction,
  finalizePlacarAction,
  loadPlacarRankingAction,
  recalculatePlacarAction,
  recalculatePlacarRankingAction,
  refreshPlacarAction,
  reopenPlacarAction,
  updatePlacarAction,
  updatePlacarIndicatorsAction,
} from '@/server/actions/placar'
import {
  getAvailableIndicatorsForPlacar,
  getPlacarFilterOptions,
  listPlacares,
  parsePlacarParams,
} from '@/server/queries/placar'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function PlacarPage({ searchParams }: PageProps) {
  const params = parsePlacarParams(await searchParams)
  const { user, scopes, orgContext, canEdit } = await buildPlacarPageContext()

  const ctx = {
    scopes,
    orgContext,
    empresaId: user.empresaId,
  }

  const [result, filterData] = await Promise.all([
    listPlacares(params, ctx),
    getPlacarFilterOptions(ctx),
  ])

  const concessionariaForIndicators =
    params.concessionariaId ?? orgContext.concessionariaId ?? filterData.concessionarias[0]?.id ?? null

  const availableIndicators = concessionariaForIndicators
    ? await getAvailableIndicatorsForPlacar(concessionariaForIndicators)
    : []

  const toOptions = (items: { id?: string; value?: string; label: string }[]) =>
    items.map((item) => ({ label: item.label, value: item.id ?? item.value ?? '' }))

  return (
    <Suspense fallback={<LoadingState />}>
      <PlacarView
        result={result}
        filterOptions={{
          concessionarias: toOptions(filterData.concessionarias),
          origens: filterData.origens,
          acumulados: filterData.acumulados,
        }}
        availableIndicators={availableIndicators}
        defaultConcessionariaId={orgContext.concessionariaId}
        canEdit={canEdit}
        createAction={createPlacarAction}
        updateAction={updatePlacarAction}
        deleteAction={deletePlacarAction}
        updateIndicatorsAction={updatePlacarIndicatorsAction}
        recalcAction={recalculatePlacarAction}
        recalcRankingAction={recalculatePlacarRankingAction}
        finalizeAction={finalizePlacarAction}
        reopenAction={reopenPlacarAction}
        loadRankingAction={loadPlacarRankingAction}
        refreshAction={refreshPlacarAction}
      />
    </Suspense>
  )
}

