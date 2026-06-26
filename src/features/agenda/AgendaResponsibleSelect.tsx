'use client'

type Option = { label: string; value: string }

type AgendaResponsibleSelectProps = {
  name: string
  label: string
  options: Option[]
  defaultValue?: string
  required?: boolean
}

export function AgendaResponsibleSelect({ name, label, options, defaultValue, required }: AgendaResponsibleSelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-[var(--sn-text)]">{label}</label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ''}
        className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
      >
        <option value="">Selecione</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

type AgendaMultiSelectProps = {
  name: string
  label: string
  options: Option[]
  defaultSelected?: string[]
}

export function AgendaMultiSelect({ name, label, options, defaultSelected = [] }: AgendaMultiSelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-[var(--sn-text)]">{label}</label>
      <select
        id={name}
        name={name}
        multiple
        defaultValue={defaultSelected}
        className="min-h-[72px] w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 py-1 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <p className="text-xs text-[var(--sn-muted)]">Segure Ctrl para selecionar varios.</p>
    </div>
  )
}
