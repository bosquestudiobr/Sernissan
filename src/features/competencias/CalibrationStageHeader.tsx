type CalibrationStageHeaderProps = {
  label: string
}

export function CalibrationStageHeader({ label }: CalibrationStageHeaderProps) {
  return (
    <th className="h-9 min-w-[120px] px-3 text-center text-xs font-semibold text-[var(--sn-text)]">
      {label}
    </th>
  )
}
