'use client'

import { useMemo, useState } from 'react'

import { Label } from '@/components/ui/label'

type Option = { label: string; value: string }

type MultiSelectFieldProps = {
  name: string
  label: string
  options: Option[]
  defaultSelected?: string[]
}

export function MultiSelectField({ name, label, options, defaultSelected = [] }: MultiSelectFieldProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected)
  const hiddenValue = useMemo(() => selected.join(','), [selected])

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value) ? current.filter((id) => id !== value) : [...current, value],
    )
  }

  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <input type="hidden" name={name} value={hiddenValue} />
      <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] p-2">
        {options.length === 0 ? (
          <p className="text-xs text-[var(--sn-muted)]">Nenhuma opcao disponivel.</p>
        ) : (
          options.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="size-4 rounded border-[var(--sn-border)]"
              />
              <span>{option.label}</span>
            </label>
          ))
        )}
      </div>
      <p className="text-xs text-[var(--sn-muted)]">{selected.length} selecionado(s)</p>
    </div>
  )
}
