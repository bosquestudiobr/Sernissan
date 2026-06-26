import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { CompetenciasView } from '@/features/competencias/CompetenciasView'
import { buildCompetenciasPageContext } from '@/features/competencias/buildCompetenciasPageContext'
import {
  createCompetencyHabitAction,
  createCompetencyMapAction,
  deleteCompetencyHabitAction,
  deleteCompetencyMapAction,
  updateCompetencyHabitAction,
  updateCompetencyMapAction,
  updateCompetencyMapHabitsAction,
} from '@/server/actions/competencias'
import {
  getCompetencyFilterOptions,
  getCompetencyHabitOptions,
  listCompetencyHabits,
  listCompetencyMaps,
  parseCompetencyParams,
} from '@/server/queries/competencias'
import type { CompetencyHabitRow, CompetencyMapRow } from '@/server/queries/competencias'
import type { PaginatedResult } from '@/lib/types/pagination'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function emptyResult<T>(page: number, pageSize: number): PaginatedResult<T> {
  return { data: [], page, pageSize, total: 0, pageCount: 1 }
}

export default async function CompetenciasPage({ searchParams }: PageProps) {
  const params = parseCompetencyParams(await searchParams)
  const { user, scopes, orgContext, canManage } = await buildCompetenciasPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const isMapas = params.tab === 'mapas'

  const [mapsResult, habitsResult, filterData, habitOptions] = await Promise.all([
    isMapas ? listCompetencyMaps(params, ctx) : Promise.resolve(emptyResult<CompetencyMapRow>(params.page, params.pageSize)),
    !isMapas ? listCompetencyHabits(params) : Promise.resolve(emptyResult<CompetencyHabitRow>(params.page, params.pageSize)),
    getCompetencyFilterOptions(ctx),
    canManage && isMapas ? getCompetencyHabitOptions() : Promise.resolve([] as { id: string; label: string }[]),
  ])

  const toOptions = (items: { id: string; label: string }[]) => items.map((i) => ({ label: i.label, value: i.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <CompetenciasView
        tab={params.tab}
        mapsResult={mapsResult}
        habitsResult={habitsResult}
        filterOptions={{ areas: toOptions(filterData.areas), funcoes: toOptions(filterData.funcoes) }}
        habitOptions={toOptions(habitOptions)}
        canManage={canManage}
        createMapAction={createCompetencyMapAction}
        updateMapAction={updateCompetencyMapAction}
        deleteMapAction={deleteCompetencyMapAction}
        updateMapHabitsAction={updateCompetencyMapHabitsAction}
        createHabitAction={createCompetencyHabitAction}
        updateHabitAction={updateCompetencyHabitAction}
        deleteHabitAction={deleteCompetencyHabitAction}
      />
    </Suspense>
  )
}