import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { LoadingState } from '@/components/shared/LoadingState'
import { VisitaDetailView } from '@/features/visitas/VisitaDetailView'
import { buildVisitasPageContext } from '@/features/visitas/buildVisitasPageContext'
import {
  addParticipanteAction,
  addProximoPassoAction,
  deleteRvAttachmentAction,
  generateRvPublicLinkAction,
  getRvAttachmentSignedUrlAction,
  removeParticipanteAction,
  removeProximoPassoAction,
  uploadRvAttachmentAction,
} from '@/server/actions/visitas'
import {
  getVisitaAttachments,
  getVisitaById,
  getVisitaNextSteps,
  getVisitaParticipants,
} from '@/server/queries/visitas'

type PageProps = { params: Promise<{ id: string }> }

export default async function VisitaDetailPage({ params }: PageProps) {
  const { id } = await params
  const { user, scopes, orgContext, canManage } = await buildVisitasPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const visita = await getVisitaById(id, ctx)
  if (!visita) notFound()

  const [participants, nextSteps, attachments] = await Promise.all([
    getVisitaParticipants(id),
    getVisitaNextSteps(id),
    getVisitaAttachments(id),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <VisitaDetailView
        visita={visita}
        participants={participants}
        nextSteps={nextSteps}
        attachments={attachments}
        canManage={canManage}
        addParticipanteAction={addParticipanteAction}
        removeParticipanteAction={removeParticipanteAction}
        addProximoPassoAction={addProximoPassoAction}
        removeProximoPassoAction={removeProximoPassoAction}
        uploadAttachmentAction={uploadRvAttachmentAction}
        deleteAttachmentAction={deleteRvAttachmentAction}
        signedUrlAction={getRvAttachmentSignedUrlAction}
        generateLinkAction={generateRvPublicLinkAction}
      />
    </Suspense>
  )
}