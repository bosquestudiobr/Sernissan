import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { LoadingState } from '@/components/shared/LoadingState'
import { ReuniaoDetailView } from '@/features/reuniao-resultados/ReuniaoDetailView'
import { buildReuniaoResultadosPageContext } from '@/features/reuniao-resultados/buildReuniaoResultadosPageContext'
import {
  addReuniaoAgendaItemAction,
  addReuniaoNextStepAction,
  finalizeReuniaoResultadoAction,
  removeReuniaoAgendaItemAction,
  removeReuniaoNextStepAction,
  reopenReuniaoResultadoAction,
} from '@/server/actions/reuniao-resultados'
import {
  getReuniaoAgendaItems,
  getReuniaoNextSteps,
  getReuniaoPlacarSnapshot,
  getReuniaoResultadoById,
  getReuniaoResultadoFilterOptions,
  getReuniaoStatusSummary,
} from '@/server/queries/reuniao-resultados'

type PageProps = { params: Promise<{ id: string }> }

export default async function ReuniaoResultadoDetailPage({ params }: PageProps) {
  const { id } = await params
  const { user, scopes, orgContext, canManage, canFinalize } = await buildReuniaoResultadosPageContext()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }

  const reuniao = await getReuniaoResultadoById(id, ctx)
  if (!reuniao) notFound()

  const [summary, agendaItems, nextSteps, snapshot, filterOptions] = await Promise.all([
    getReuniaoStatusSummary(id, ctx),
    getReuniaoAgendaItems(id),
    getReuniaoNextSteps(id),
    getReuniaoPlacarSnapshot(id),
    getReuniaoResultadoFilterOptions(ctx),
  ])

  if (!summary) notFound()

  return (
    <Suspense fallback={<LoadingState />}>
      <ReuniaoDetailView
        reuniao={reuniao}
        summary={summary}
        agendaItems={agendaItems}
        nextSteps={nextSteps}
        snapshot={snapshot}
        filterOptions={filterOptions}
        canManage={canManage}
        canFinalize={canFinalize}
        addAgendaItemAction={addReuniaoAgendaItemAction}
        removeAgendaItemAction={removeReuniaoAgendaItemAction}
        addNextStepAction={addReuniaoNextStepAction}
        removeNextStepAction={removeReuniaoNextStepAction}
        finalizeAction={finalizeReuniaoResultadoAction}
        reopenAction={reopenReuniaoResultadoAction}
      />
    </Suspense>
  )
}
