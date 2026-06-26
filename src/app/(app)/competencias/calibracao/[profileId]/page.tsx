import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'

import { LoadingState } from '@/components/shared/LoadingState'
import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { CalibrationMatrixView } from '@/features/competencias/CalibrationMatrixView'
import { buildCompetenciasPageContext } from '@/features/competencias/buildCompetenciasPageContext'
import { canEditCalibration, canManageCompetencias } from '@/lib/permissions/competencias'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { buildCalibrationValidationAlerts } from '@/lib/competencias/calibration-performance'
import {
  finalizeCalibrationAction,
  reopenCalibrationAction,
  saveCalibrationMatrixAction,
} from '@/server/actions/competencias/calibration'
import {
  countMatrixHabitos,
  getCalibrationMatrix,
  getCalibrationOptions,
  getCalibrationPerformanceSummary,
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

  const [matrix, stages, options] = await Promise.all([
    getCalibrationMatrix(profile),
    Promise.resolve(getCalibrationStages()),
    getCalibrationOptions(),
  ])

  const totalHabitos = countMatrixHabitos(matrix)
  const performance = await getCalibrationPerformanceSummary(matrix.calibracaoId, totalHabitos)
  const alerts = buildCalibrationValidationAlerts({
    hasMaps: matrix.hasMaps,
    totalHabitos,
    performance,
    finalizada: matrix.finalizada,
  })

  const canEdit = inScope && canEditCalibration(user.perfilNivel) && !matrix.finalizada
  const canReopen = inScope && canManageCompetencias(user.perfilNivel)

  return (
    <Suspense fallback={<LoadingState />}>
      <PageTitleActions title="Matriz de calibracao" description="Respostas por etapa, resumo e status." />
      <CalibrationMatrixView
        profile={profile}
        matrix={matrix}
        stages={stages}
        options={options.map((o) => ({ value: o.value, label: o.label }))}
        performance={performance}
        alerts={alerts}
        canEdit={canEdit}
        canReopen={canReopen}
        saveMatrixAction={saveCalibrationMatrixAction}
        finalizeAction={finalizeCalibrationAction}
        reopenAction={reopenCalibrationAction}
      />
    </Suspense>
  )
}