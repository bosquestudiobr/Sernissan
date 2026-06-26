'use client'

import { CalibrationResponseSelect } from '@/features/competencias/CalibrationResponseSelect'
import { responseColorClass, responseShortLabel } from '@/features/competencias/calibration-colors'

type Option = { value: string; label: string }

type CalibrationMatrixCellProps = {
  value: string | null
  options: Option[]
  canEdit: boolean
  onChange: (value: string | null) => void
}

export function CalibrationMatrixCell({ value, options, canEdit, onChange }: CalibrationMatrixCellProps) {
  if (!canEdit) {
    return (
      <div
        className={`flex h-8 items-center justify-center rounded-md border border-[var(--sn-border)] px-2 text-xs ${responseColorClass(value as 'sim' | 'parcial' | 'n_o' | null)}`}
      >
        {responseShortLabel(value as 'sim' | 'parcial' | 'n_o' | null)}
      </div>
    )
  }
  return <CalibrationResponseSelect value={value} options={options} onChange={onChange} />
}
