import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { VisitasView } from '@/features/visitas/VisitasView'
import { buildVisitasPageContext } from '@/features/visitas/buildVisitasPageContext'
import {
  createVisitaAction,
  deleteVisitaAction,
  refreshVisitasAction,
  updateVisitaAction,
} from '@/server/actions/visitas'
import {
  getVisitasFilterOptions,
  listVisitas,
  parseVisitasParams,
} from '@/server/queries/visitas'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function VisitasPage({ searchParams }: PageProps) {
  const params = parseVisitasParams(await searchParams)
  const { user, scopes, orgContext, canManage } = await buildVisitasPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const [result, filterData] = await Promise.all([listVisitas(params, ctx), getVisitasFilterOptions(ctx)])

  const toOptions = (items: { id: string; label: string }[]) => items.map((i) => ({ label: i.label, value: i.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <VisitasView
        result={result}
        filterOptions={{
          concessionarias: toOptions(filterData.concessionarias),
          modalidades: toOptions(filterData.modalidades),
          focos: toOptions(filterData.focos),
        }}
        canManage={canManage}
        createAction={createVisitaAction}
        updateAction={updateVisitaAction}
        deleteAction={deleteVisitaAction}
        refreshAction={refreshVisitasAction}
      />
    </Suspense>
  )
}