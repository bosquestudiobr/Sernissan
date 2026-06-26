import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { HabitosView } from '@/features/habitos/HabitosView'
import { buildHabitosPageContext } from '@/features/habitos/buildHabitosPageContext'
import {
  completeHabitoAction,
  createHabitoAction,
  deleteHabitoAction,
  markHabitoDoneAction,
  refreshHabitosAction,
  reopenHabitoAction,
  toggleHabitoActiveAction,
  updateHabitoAction,
} from '@/server/actions/habitos'
import {
  getHabitosFilterOptions,
  getHabitosSummary,
  listHabitos,
  parseHabitosParams,
} from '@/server/queries/habitos'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function HabitosPage({ searchParams }: PageProps) {
  const params = parseHabitosParams(await searchParams)
  const { user, scopes, orgContext, canManage, canReopen, canDelete } = await buildHabitosPageContext()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }

  const [result, summary, filterOptions] = await Promise.all([
    listHabitos(params, ctx),
    getHabitosSummary(ctx),
    getHabitosFilterOptions(ctx),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <HabitosView
        result={result}
        summary={summary}
        filterOptions={filterOptions}
        canManage={canManage}
        canReopen={canReopen}
        canDelete={canDelete}
        createAction={createHabitoAction}
        updateAction={updateHabitoAction}
        deleteAction={deleteHabitoAction}
        completeAction={completeHabitoAction}
        toggleActiveAction={toggleHabitoActiveAction}
        reopenAction={reopenHabitoAction}
        markDoneAction={markHabitoDoneAction}
        refreshAction={refreshHabitosAction}
      />
    </Suspense>
  )
}
