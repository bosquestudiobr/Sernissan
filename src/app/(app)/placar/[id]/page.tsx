import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { LoadingState } from '@/components/shared/LoadingState'
import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { buildPlacarPageContext } from '@/features/placar/buildPlacarPageContext'
import { PlacarSummaryCards } from '@/features/placar/PlacarSummaryCards'
import { PlacarCalculationStatus } from '@/features/placar/PlacarCalculationStatus'
import { PlacarRankingTable } from '@/features/placar/PlacarRankingTable'
import { PlacarIndicatorSummaryTable } from '@/features/placar/PlacarIndicatorSummaryTable'
import { PlacarAuditPanel } from '@/features/placar/PlacarAuditPanel'
import { PlacarRecalculationActions } from '@/features/placar/PlacarRecalculationActions'
import { PlacarFinalizeActions } from '@/features/placar/PlacarFinalizeActions'
import {
  finalizePlacarAction,
  recalculatePlacarAction,
  recalculatePlacarIndicatorsAction,
  recalculatePlacarRankingAction,
  reopenPlacarAction,
} from '@/server/actions/placar'
import {
  getPlacarAuditLog,
  getPlacarCalculationStatus,
  getPlacarDetail,
  getPlacarIndicatorSummary,
  getPlacarRanking,
  getPlacarSummary,
} from '@/server/queries/placar'

type PageProps = { params: Promise<{ id: string }> }

function formatDate(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export default async function PlacarDetailPage({ params }: PageProps) {
  const { id } = await params
  const { user, scopes, orgContext, canEdit } = await buildPlacarPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const placar = await getPlacarDetail(id, ctx)
  if (!placar) notFound()

  const [summary, status, ranking, indicators, auditLog] = await Promise.all([
    getPlacarSummary(id),
    getPlacarCalculationStatus(id),
    getPlacarRanking(id),
    getPlacarIndicatorSummary(id),
    getPlacarAuditLog(id),
  ])

  const title = `Placar ${formatDate(placar.data)}`.trim()
  const description = placar.concessionariaNome ?? undefined

  return (
    <Suspense fallback={<LoadingState />}>
      <PageTitleActions
        title={title}
        description={description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/placar"
              className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]"
            >
              <ArrowLeft className="mr-1 size-4" /> Voltar
            </Link>
            {canEdit ? (
              <PlacarFinalizeActions
                placarId={placar.id}
                finalizado={placar.finalizado === true}
                finalizeAction={finalizePlacarAction}
                reopenAction={reopenPlacarAction}
              />
            ) : null}
          </div>
        }
      />

      <div className="space-y-4">
        {canEdit ? (
          <DataCard>
            <PlacarRecalculationActions
              placarId={placar.id}
              finalizado={placar.finalizado === true}
              recalcAllAction={recalculatePlacarAction}
              recalcIndicatorsAction={recalculatePlacarIndicatorsAction}
              recalcRankingAction={recalculatePlacarRankingAction}
            />
          </DataCard>
        ) : null}

        <PlacarSummaryCards summary={summary} />

        <div className="grid gap-4 lg:grid-cols-2">
          <PlacarCalculationStatus status={status} />
          <DataCard className="space-y-3">
            <p className="text-sm font-medium text-[var(--sn-text)]">Ranking</p>
            <PlacarRankingTable ranking={ranking} />
          </DataCard>
        </div>

        <DataCard className="space-y-3">
          <p className="text-sm font-medium text-[var(--sn-text)]">Indicadores vinculados</p>
          <PlacarIndicatorSummaryTable rows={indicators} />
        </DataCard>

        <DataCard className="space-y-3">
          <p className="text-sm font-medium text-[var(--sn-text)]">Auditoria de recalculo</p>
          <PlacarAuditPanel logs={auditLog} />
        </DataCard>
      </div>
    </Suspense>
  )
}