'use client'

import { responseColorClass } from '@/features/competencias/calibration-colors'

type Option = { value: string; label: string }

type CalibrationResponseSelectProps = {
  value: string | null
  options: Option[]
  disabled?: boolean
  onChange: (value: string | null) => void
}

export function CalibrationResponseSelect({ value, options, disabled, onChange }: CalibrationResponseSelectProps) {
  return (
    <select
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      className={`h-8 w-full min-w-[96px] rounded-md border border-[var(--sn-border)] px-2 text-xs ${responseColorClass(value as 'sim' | 'parcial' | 'n_o' | null)} disabled:opacity-70`}
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
