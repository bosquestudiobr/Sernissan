import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import { LoadingState } from '@/components/shared/LoadingState'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { CalibrationMatrixView } from '@/features/competencias/CalibrationMatrixView'
import { buildCompetenciasPageContext } from '@/features/competencias/buildCompetenciasPageContext'
import { canEditCalibration } from '@/lib/permissions/competencias'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { saveCalibrationMatrixAction } from '@/server/actions/competencias/calibration'
import {
  getCalibrationMatrix,
  getCalibrationOptions,
  getCalibrationProfile,
  getCalibrationStages,
} from '@/server/queries/competencias/calibration'

type PageProps = { params: Promise<{ profileId: string }> }

export default async function CalibracaoMatrixPage({ params }: PageProps) {
  const { profileId } = await params
  const { user, scopes } = await buildCompetenciasPageContext()

  const profile = await getCalibrationProfile(profileId)
  if (!profile) notFound()

  const isSelf = profile.id === user.id
  const highPrivilege = isHighPrivilegeScope(scopes.perfilNivel)

  const inScope =
    highPrivilege ||
    ((!user.empresaId || !profile.empresaId || profile.empresaId === user.empresaId) &&
      canAccessConcessionaria(scopes, profile.concessionariaId))

  if (!inScope && !isSelf) redirect('/acesso-negado')

  const canEdit = inScope && canEditCalibration(user.perfilNivel)

  const [matrix, stages, options] = await Promise.all([
    getCalibrationMatrix(profile),
    Promise.resolve(getCalibrationStages()),
    getCalibrationOptions(),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <PageTitleActions title="Matriz de calibracao" description="Respostas por etapa de avaliacao." />
      <CalibrationMatrixView
        profile={profile}
        matrix={matrix}
        stages={stages}
        options={options.map((o) => ({ value: o.value, label: o.label }))}
        canEdit={canEdit}
        saveMatrixAction={saveCalibrationMatrixAction}
      />
    </Suspense>
  )
}