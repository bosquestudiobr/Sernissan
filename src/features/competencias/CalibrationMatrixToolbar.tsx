'use client'

import { CalibrationLegend } from '@/features/competencias/CalibrationLegend'
import { CalibrationPdfPlaceholderButton } from '@/features/competencias/CalibrationPdfPlaceholderButton'
import { CalibrationFinalizeActions } from '@/features/competencias/CalibrationFinalizeActions'
import type { CalibrationActionState } from '@/server/actions/competencias/calibration'

type ActionFn = (prev: CalibrationActionState, formData: FormData) => Promise<CalibrationActionState>

type CalibrationMatrixToolbarProps = {
  profileId: string
  finalizada: boolean
  canEdit: boolean
  canReopen: boolean
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

export function CalibrationMatrixToolbar({
  profileId,
  finalizada,
  canEdit,
  canReopen,
  finalizeAction,
  reopenAction,
}: CalibrationMatrixToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <CalibrationLegend />
      <div className="flex flex-wrap items-center gap-2">
        <CalibrationPdfPlaceholderButton />
        <CalibrationFinalizeActions
          profileId={profileId}
          finalizada={finalizada}
          canEdit={canEdit}
          canReopen={canReopen}
          finalizeAction={finalizeAction}
          reopenAction={reopenAction}
        />
      </div>
    </div>
  )
}
