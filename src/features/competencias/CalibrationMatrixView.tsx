'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { DataCard } from '@/components/shared/DataCard'
import { CalibrationCollaboratorCard } from '@/features/competencias/CalibrationCollaboratorCard'
import { CalibrationProgressCards } from '@/features/competencias/CalibrationProgressCards'
import { CalibrationValidationAlerts } from '@/features/competencias/CalibrationValidationAlerts'
import { CalibrationReadOnlyBanner } from '@/features/competencias/CalibrationReadOnlyBanner'
import { CalibrationMatrixToolbar } from '@/features/competencias/CalibrationMatrixToolbar'
import { CalibrationMatrixTable } from '@/features/competencias/CalibrationMatrixTable'
import { CalibrationSaveBar } from '@/features/competencias/CalibrationSaveBar'
import { CalibrationPerformanceSummary } from '@/features/competencias/CalibrationPerformanceSummary'
import { CalibrationStageProgress } from '@/features/competencias/CalibrationStageProgress'
import type {
  CalibrationMatrix,
  CalibrationProfileView,
  CalibrationStage,
  CalibrationStageInfo,
} from '@/server/queries/competencias/calibration'
import type { CalibrationActionState } from '@/server/actions/competencias/calibration'
import type { CalibrationAlert, CalibrationPerformance } from '@/lib/competencias/calibration-performance'

type Option = { value: string; label: string }
type ActionFn = (prev: CalibrationActionState, formData: FormData) => Promise<CalibrationActionState>

type CalibrationMatrixViewProps = {
  profile: CalibrationProfileView
  matrix: CalibrationMatrix
  stages: CalibrationStageInfo[]
  options: Option[]
  performance: CalibrationPerformance
  alerts: CalibrationAlert[]
  canEdit: boolean
  canReopen: boolean
  saveMatrixAction: ActionFn
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

function cellKey(habitoId: string, stage: CalibrationStage) {
  return `${habitoId}:${stage}`
}

export function CalibrationMatrixView({
  profile,
  matrix,
  stages,
  options,
  performance,
  alerts,
  canEdit,
  canReopen,
  saveMatrixAction,
  finalizeAction,
  reopenAction,
}: CalibrationMatrixViewProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const initial = useMemo(() => {
    const map: Record<string, string | null> = {}
    for (const group of matrix.groups) {
      for (const row of group.rows) {
        for (const stage of stages) {
          map[cellKey(row.habitoId, stage.key)] = row.responses[stage.key] ?? null
        }
      }
    }
    return map
  }, [matrix, stages])

  const [responses, setResponses] = useState<Record<string, string | null>>(initial)
  const [baseline, setBaseline] = useState<Record<string, string | null>>(initial)

  const dirtyKeys = useMemo(
    () => Object.keys(responses).filter((k) => (responses[k] ?? null) !== (baseline[k] ?? null)),
    [responses, baseline],
  )

  function getValue(habitoId: string, stage: CalibrationStage) {
    return responses[cellKey(habitoId, stage)] ?? null
  }

  function onChange(habitoId: string, stage: CalibrationStage, value: string | null) {
    setResponses((prev) => ({ ...prev, [cellKey(habitoId, stage)]: value }))
  }

  function onSave() {
    const cells = dirtyKeys.map((key) => {
      const [habitoId, stage] = key.split(':')
      return { habitoId, stage: stage as CalibrationStage, opcao: responses[key] ?? null }
    })
    if (cells.length === 0) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('profileId', profile.id)
      fd.set('cells', JSON.stringify(cells))
      const result = await saveMatrixAction({ ok: false }, fd)
      setMessage(result.summary ?? result.message ?? null)
      setError(!result.ok)
      if (result.ok) {
        setBaseline({ ...responses })
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      <CalibrationCollaboratorCard profile={profile} hasCalibration={matrix.calibracaoId !== null} lastUpdated={matrix.lastUpdated} />

      <CalibrationProgressCards performance={performance} />

      <CalibrationValidationAlerts alerts={alerts} />

      {!canEdit ? <CalibrationReadOnlyBanner finalizada={matrix.finalizada} /> : null}

      {!matrix.hasMaps ? (
        <DataCard>
          <p className="py-6 text-center text-sm text-[var(--sn-muted)]">
            Nenhum mapa de competencia vinculado a funcao deste colaborador. Cadastre um mapa em Competencias.
          </p>
        </DataCard>
      ) : (
        <>
          <DataCard className="space-y-4">
            <CalibrationMatrixToolbar
              profileId={profile.id}
              finalizada={matrix.finalizada}
              canEdit={canEdit}
              canReopen={canReopen}
              finalizeAction={finalizeAction}
              reopenAction={reopenAction}
            />
            <CalibrationMatrixTable
              groups={matrix.groups}
              stages={stages}
              options={options}
              canEdit={canEdit}
              getValue={getValue}
              onChange={onChange}
            />
            <CalibrationSaveBar
              dirtyCount={dirtyKeys.length}
              pending={pending}
              message={message}
              error={error}
              canEdit={canEdit}
              onSave={onSave}
            />
          </DataCard>

          <DataCard className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--sn-text)]">Resumo por etapa</p>
              <CalibrationPerformanceSummary performance={performance} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--sn-text)]">Progresso</p>
              <CalibrationStageProgress performance={performance} />
            </div>
          </DataCard>
        </>
      )}
    </div>
  )
}
