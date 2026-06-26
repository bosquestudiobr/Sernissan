'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { VisitaStatusBadge } from '@/features/visitas/VisitaStatusBadge'
import { ParticipantesTable } from '@/features/visitas/ParticipantesTable'
import { ProximosPassosTable } from '@/features/visitas/ProximosPassosTable'
import { AnexosPanel } from '@/features/visitas/AnexosPanel'
import { GeneratePublicLinkButton } from '@/features/visitas/GeneratePublicLinkButton'
import type { AnexoRow, ParticipanteRow, ProximoPassoRow, VisitaDetail } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type VisitaDetailViewProps = {
  visita: VisitaDetail
  participants: ParticipanteRow[]
  nextSteps: ProximoPassoRow[]
  attachments: AnexoRow[]
  canManage: boolean
  addParticipanteAction: ActionFn
  removeParticipanteAction: ActionFn
  addProximoPassoAction: ActionFn
  removeProximoPassoAction: ActionFn
  uploadAttachmentAction: ActionFn
  deleteAttachmentAction: ActionFn
  signedUrlAction: ActionFn
  generateLinkAction: ActionFn
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

export function VisitaDetailView(props: VisitaDetailViewProps) {
  const { visita, canManage } = props
  const locked = visita.bloqueadoEdicao || visita.status === 'assinada'

  return (
    <>
      <PageTitleActions
        title="Detalhe da visita"
        description={visita.dealerNome ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/visitas" className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]">
              <ArrowLeft className="mr-1 size-4" /> Voltar
            </Link>
            <VisitaStatusBadge status={visita.status} />
          </div>
        }
      />

      <div className="space-y-4">
        <DataCard className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Info label="Data" value={formatDate(visita.dataVisita)} />
            <Info label="Concessionaria" value={visita.dealerNome} />
            <Info label="Consultor" value={visita.consultorNome} />
            <Info label="Modalidade" value={visita.modalidadeNome} />
            <Info label="Foco" value={visita.focoNome} />
            <Info label="Assinado em" value={visita.assinadoEm ? formatDate(visita.assinadoEm) : 'Nao assinado'} />
            <Info label="Expira em" value={visita.tokenExpiracao ? formatDate(visita.tokenExpiracao) : 'Sem link'} />
          </div>
          {visita.relato ? <Info label="Relato" value={visita.relato} /> : null}
          {visita.pontosDestaque ? <Info label="Pontos de destaque" value={visita.pontosDestaque} /> : null}
          {canManage ? (
            <GeneratePublicLinkButton rvId={visita.id} disabled={visita.status === 'assinada'} action={props.generateLinkAction} />
          ) : null}
        </DataCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <DataCard className="space-y-3">
            <p className="text-sm font-medium text-[var(--sn-text)]">Participantes</p>
            <ParticipantesTable
              rvId={visita.id}
              data={props.participants}
              canManage={canManage}
              locked={locked}
              addAction={props.addParticipanteAction}
              removeAction={props.removeParticipanteAction}
            />
          </DataCard>
          <DataCard className="space-y-3">
            <p className="text-sm font-medium text-[var(--sn-text)]">Proximos passos</p>
            <ProximosPassosTable
              rvId={visita.id}
              data={props.nextSteps}
              canManage={canManage}
              locked={locked}
              addAction={props.addProximoPassoAction}
              removeAction={props.removeProximoPassoAction}
            />
          </DataCard>
        </div>

        <DataCard className="space-y-3">
          <p className="text-sm font-medium text-[var(--sn-text)]">Anexos</p>
          <AnexosPanel
            rvId={visita.id}
            data={props.attachments}
            canManage={canManage}
            locked={locked}
            uploadAction={props.uploadAttachmentAction}
            removeAction={props.deleteAttachmentAction}
            signedUrlAction={props.signedUrlAction}
          />
        </DataCard>
      </div>
    </>
  )
}
