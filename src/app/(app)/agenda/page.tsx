import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { AgendaView } from '@/features/agenda/AgendaView'
import { buildAgendaPageContext } from '@/features/agenda/buildAgendaPageContext'
import {
  cancelAgendaItemAction,
  completeAgendaItemAction,
  createAgendaItemAction,
  deleteAgendaItemAction,
  refreshAgendaAction,
  reopenAgendaItemAction,
  updateAgendaItemAction,
} from '@/server/actions/agenda'
import {
  getAgendaCalendarItems,
  getAgendaFilterOptions,
  getAgendaSummary,
  listAgendaItems,
  parseAgendaParams,
} from '@/server/queries/agenda'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default async function AgendaPage({ searchParams }: PageProps) {
  const params = parseAgendaParams(await searchParams)
  const { user, scopes, orgContext, canManage, canReopen, canDelete } = await buildAgendaPageContext()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const month = params.month ?? currentMonth()

  const [result, summary, filterOptions, calendarItems] = await Promise.all([
    listAgendaItems(params, ctx),
    getAgendaSummary(ctx),
    getAgendaFilterOptions(ctx),
    params.view === 'calendar'
      ? getAgendaCalendarItems(month, ctx, {
          concessionariaId: params.concessionariaId,
          responsavelId: params.responsavelId,
          q: params.q,
        })
      : Promise.resolve([]),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <AgendaView
        result={result}
        summary={summary}
        calendarItems={calendarItems}
        month={month}
        view={params.view}
        filterOptions={filterOptions}
        canManage={canManage}
        canReopen={canReopen}
        canDelete={canDelete}
        createAction={createAgendaItemAction}
        updateAction={updateAgendaItemAction}
        deleteAction={deleteAgendaItemAction}
        completeAction={completeAgendaItemAction}
        cancelAction={cancelAgendaItemAction}
        reopenAction={reopenAgendaItemAction}
        refreshAction={refreshAgendaAction}
      />
    </Suspense>
  )
}
