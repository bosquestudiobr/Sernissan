'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { PlacarIndicatorOption } from '@/server/queries/placar'
import type { PlacarActionState } from '@/server/actions/placar'

type PlacarIndicatorsPanelProps = {
  placarId: string
  available: PlacarIndicatorOption[]
  selectedIds: string[]
  updateAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  disabled?: boolean
}

export function PlacarIndicatorsPanel({
  placarId,
  available,
  selectedIds,
  updateAction,
  disabled,
}: PlacarIndicatorsPanelProps) {
  const options = useMemo(
    () =>
      available.map((item) => ({
        value: item.id,
        label: [item.sigla, item.nome].filter(Boolean).join(' — ') || item.id,
      })),
    [available],
  )
  const [ids, setIds] = useState(selectedIds)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function toggle(value: string) {
    setIds((current) =>
      current.includes(value) ? current.filter((id) => id !== value) : [...current, value],
    )
  }

  async function onSave() {
    setPending(true)
    setMessage(null)
    const fd = new FormData()
    fd.set('id', placarId)
    fd.set('indicadorIds', ids.join(','))
    const result = await updateAction({ ok: false }, fd)
    setPending(false)
    setMessage(result.ok ? (result.message ?? 'Salvo.') : (result.message ?? 'Erro ao salvar.'))
  }

  return (
    <div className="space-y-3 rounded-md border border-[var(--sn-border)] p-3">
      <div>
        <p className="text-sm font-medium">Indicadores do placar</p>
        <p className="text-xs text-[var(--sn-muted)]">Vincule indicadores ativos da concessionaria.</p>
      </div>
      <div className="space-y-1">
        <Label className="text-sm">Indicadores</Label>
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] p-2">
          {options.length === 0 ? (
            <p className="text-xs text-[var(--sn-muted)]">Nenhuma opcao disponivel.</p>
          ) : (
            options.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ids.includes(option.value)}
                  onChange={() => toggle(option.value)}
                  disabled={disabled || pending}
                  className="size-4 rounded border-[var(--sn-border)]"
                />
                <span>{option.label}</span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="bg-[var(--sn-black)] text-white hover:bg-black/90"
          disabled={disabled || pending}
          onClick={onSave}
        >
          Salvar indicadores
        </Button>
        {message ? <span className="text-xs text-[var(--sn-muted)]">{message}</span> : null}
      </div>
    </div>
  )
}
