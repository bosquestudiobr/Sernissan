'use client'

type Option = { label: string; value: string }

type HabitoResponsibleSelectProps = {
  name: string
  label: string
  options: Option[]
  defaultValue?: string
  required?: boolean
  disabled?: boolean
}

export function HabitoResponsibleSelect({
  name,
  label,
  options,
  defaultValue,
  required,
  disabled,
}: HabitoResponsibleSelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-[var(--sn-text)]">{label}</label>
      <select
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue ?? ''}
        className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm disabled:opacity-60"
      >
        <option value="">Selecione</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
