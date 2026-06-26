'use client'

import { useActionState } from 'react'

import { Switch } from '@/components/ui/switch'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type ObjectiveActiveSwitchProps = {
  id: string
  ativo: boolean | null
  concessionariaId?: string | null
  toggleAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

export function ObjectiveActiveSwitch({
  id,
  ativo,
  concessionariaId,
  toggleAction,
}: ObjectiveActiveSwitchProps) {
  const [, formAction] = useActionState(toggleAction, { ok: false })

  function handleChange(checked: boolean) {
    const fd = new FormData()
    fd.set('id', id)
    fd.set('ativo', String(checked))
    if (concessionariaId) fd.set('concessionariaId', concessionariaId)
    formAction(fd)
  }

  return <Switch checked={ativo === true} onCheckedChange={handleChange} />
}
