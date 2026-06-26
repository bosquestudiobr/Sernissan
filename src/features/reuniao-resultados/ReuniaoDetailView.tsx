'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { Button } from '@/components/ui/button'
import { ReuniaoAgendaItemsPanel } from '@/features/reuniao-resultados/ReuniaoAgendaItemsPanel'
import { ReuniaoNextStepsPanel } from '@/features/reuniao-resultados/ReuniaoNextStepsPanel'
import { ReuniaoParticipantsPanel } from '@/features/reuniao-resultados/ReuniaoParticipantsPanel'
import { ReuniaoPlacarSnapshot } from '@/features/reuniao-resultados/ReuniaoPlacarSnapshot'
import { ReuniaoStatusBadge } from '@/features/reuniao-resultados/ReuniaoStatusBadge'
import { ReuniaoSummaryCards } from '@/features/reuniao-resultados/ReuniaoSummaryCards'
import type {
  AgendaItemRow,
  NextStepRow,
  ReuniaoDetail,
  SnapshotRow,
  StatusSummary,
} from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type Option = { label: string; value: string }
type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoDetailViewProps = {
  reuniao: ReuniaoDetail
  summary: StatusSummary
  agendaItems: AgendaItemRow[]
  nextSteps: NextStepRow[]
  snapshot: SnapshotRow[]
  filterOptions: { indicadores: Option[] }
  canManage: boolean
  canFinalize: boolean
  addAgendaItemAction: ActionFn
  removeAgendaItemAction: ActionFn
  addNextStepAction: ActionFn
  removeNextStepAction: ActionFn
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('pt-BR')
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-[var(--sn-muted)]">{label}</p>
      <p className="text-sm text-[var(--sn-text)]">{value ?? '—'}</p>
    </div>
  )
}

export function ReuniaoDetailView(props: ReuniaoDetailViewProps) {
  const { reuniao, canManage, canFinalize } = props
  const locked = reuniao.finalizada
  const router = useRouter()
  const [, startTransition] = useTransition()

  function runAction(action: ActionFn) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', reuniao.id)
      const result = await action({ ok: false }, fd)
      if (result.ok) router.refresh()
    })
  }

  return (
    <>
      <PageTitleActions
        title="XR — Reuniao de Resultados"
        description={reuniao.id2 != null ? `Codigo ${reuniao.id2}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/reuniao-resultados" className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]">
              <ArrowLeft className="mr-1 size-4" /> Voltar
            </Link>
            <ReuniaoStatusBadge status={reuniao.status} />
            {canFinalize ? (
              reuniao.finalizada ? (
                <ConfirmDialog
                  title="Reabrir reuniao"
                  description="Confirma reabrir esta reuniao finalizada?"
                  confirmLabel="Reabrir"
                  onConfirm={() => runAction(props.reopenAction)}
                  trigger={
                    <Button type="button" variant="outline" className="h-9">
                      <RotateCcw className="mr-1 size-4" /> Reabrir
                    </Button>
                  }
                />
              ) : (
                <ConfirmDialog
                  title="Finalizar reuniao"
                  description="Confirma finalizar? A edicao de pauta e proximos passos sera bloqueada."
                  confirmLabel="Finalizar"
                  onConfirm={() => runAction(props.finalizeAction)}
                  trigger={
                    <Button type="button" variant="outline" className="h-9 text-emerald-700">
                      <CheckCircle2 className="mr-1 size-4" /> Finalizar
                    </Button>
                  }
                />
              )
            ) : null}
          </div>
        }
      />

      <div className="space-y-4">
        {locked ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Reuniao finalizada em {formatDate(reuniao.dataFinalizada)}. Edicao bloqueada.
          </div>
        ) : null}

        <ReuniaoSummaryCards summary={props.summary} />

        <DataCard className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--sn-text)]">Dados da reuniao</h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Info label="Data" value={formatDate(reuniao.data)} />
            <Info label="Codigo" value={reuniao.id2 != null ? String(reuniao.id2) : null} />
            <Info label="Responsavel" value={reuniao.createdByNome} />
            <Info label="Criada em" value={formatDate(reuniao.created_at)} />
          </div>
        </DataCard>

        <DataCard>
          <h3 className="mb-3 text-sm font-semibold text-[var(--sn-text)]">Participantes</h3>
          <ReuniaoParticipantsPanel />
        </DataCard>

        <DataCard>
          <h3 className="mb-3 text-sm font-semibold text-[var(--sn-text)]">Pauta — indicadores</h3>
          <ReuniaoAgendaItemsPanel
            reuniaoId={reuniao.id}
            data={props.agendaItems}
            indicadores={props.filterOptions.indicadores}
            canManage={canManage}
            locked={locked}
            addAction={props.addAgendaItemAction}
            removeAction={props.removeAgendaItemAction}
          />
        </DataCard>

        <DataCard>
          <h3 className="mb-3 text-sm font-semibold text-[var(--sn-text)]">Proximos passos</h3>
          <ReuniaoNextStepsPanel
            reuniaoId={reuniao.id}
            data={props.nextSteps}
            canManage={canManage}
            locked={locked}
            addAction={props.addNextStepAction}
            removeAction={props.removeNextStepAction}
          />
        </DataCard>

        <DataCard>
          <h3 className="mb-3 text-sm font-semibold text-[var(--sn-text)]">Snapshot de resultados</h3>
          <ReuniaoPlacarSnapshot data={props.snapshot} />
        </DataCard>
      </div>
    </>
  )
}
