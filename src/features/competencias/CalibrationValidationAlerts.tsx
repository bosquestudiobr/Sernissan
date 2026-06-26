type CalibrationValidationAlertsProps = {
  alerts: { level: 'info' | 'warning'; message: string }[]
}

export function CalibrationValidationAlerts({ alerts }: CalibrationValidationAlertsProps) {
  if (alerts.length === 0) return null
  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <p
          key={index}
          className={`rounded-md border px-3 py-2 text-xs ${
            alert.level === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-[var(--sn-border)] bg-[var(--sn-field)] text-[var(--sn-muted)]'
          }`}
        >
          {alert.message}
        </p>
      ))}
    </div>
  )
}
