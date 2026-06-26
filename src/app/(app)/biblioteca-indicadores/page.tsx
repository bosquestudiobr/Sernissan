import { Suspense } from 'react'

import { IndicatorLibraryView } from '@/features/indicadores/IndicatorLibraryView'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import {
  checkIndicatorsAction,
  createIndicatorAction,
  deleteIndicatorAction,
  toggleIndicatorActiveAction,
  updateIndicatorAction,
} from '@/server/actions/indicadores/library'
import {
  getIndicatorLibraryFilterOptions,
  getIndicatorOptionSets,
  listIndicatorLibrary,
  parseIndicatorLibraryParams,
} from '@/server/queries/indicadores/library'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function BibliotecaIndicadoresPage({ searchParams }: PageProps) {
  const params = parseIndicatorLibraryParams(await searchParams)
  const { scopeCtx } = await buildAdminPageContext()

  const [result, filterData, optionSets] = await Promise.all([
    listIndicatorLibrary(params, scopeCtx),
    getIndicatorLibraryFilterOptions(scopeCtx.user.empresaId),
    getIndicatorOptionSets(),
  ])

  const toOptions = (items: { id: string; label: string }[]) =>
    items.map((item) => ({ label: item.label, value: item.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <IndicatorLibraryView
        result={result}
        filterOptions={{
          areas: toOptions(filterData.areas),
          funcoes: toOptions(filterData.funcoes),
        }}
        optionSets={{
          unidades: optionSets.unidades.map((u) => ({ label: u.label, value: u.value })),
          importancias: optionSets.importancias.map((i) => ({ label: i.label, value: i.value })),
        }}
        createAction={createIndicatorAction}
        updateAction={updateIndicatorAction}
        deleteAction={deleteIndicatorAction}
        toggleAction={toggleIndicatorActiveAction}
        checkAction={checkIndicatorsAction}
      />
    </Suspense>
  )
}
