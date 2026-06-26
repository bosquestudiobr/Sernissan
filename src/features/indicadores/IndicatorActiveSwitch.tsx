'use client'

import { useActionState } from 'react'

import { Switch } from '@/components/ui/switch'
import type { IndicatorActionState } from '@/server/actions/indicadores/library'

type IndicatorActiveSwitchProps = {
  id: string
  ativo: boolean | null
  toggleAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
}

export function IndicatorActiveSwitch({ id, ativo, toggleAction }: IndicatorActiveSwitchProps) {
  const [, formAction] = useActionState(toggleAction, { ok: false })

  function handleChange(checked: boolean) {
    const fd = new FormData()
    fd.set('id', id)
    fd.set('ativo', String(checked))
    formAction(fd)
  }

  return <Switch checked={ativo === true} onCheckedChange={handleChange} />
}
