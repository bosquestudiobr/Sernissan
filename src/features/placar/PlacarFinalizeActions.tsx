'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, RotateCcw } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import type { PlacarActionState } from '@/server/actions/placar'

type ActionFn = (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>

type PlacarFinalizeActionsProps = {
  placarId: string
  finalizado: boolean
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

export function PlacarFinalizeActions({
  placarId,
  finalizado,
  finalizeAction,
  reopenAction,
}: PlacarFinalizeActionsProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function run(action: ActionFn) {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const fd = new FormData()
        fd.set('id', placarId)
        const result = await action({ ok: false }, fd)
        if (result.ok) router.refresh()
        resolve()
      })
    })
  }

  if (finalizado) {
    return (
      <ConfirmDialog
        title="Reabrir placar"
        description="Confirma reabrir este placar finalizado? Ele voltara a permitir recalculo."
        confirmLabel="Reabrir"
        onConfirm={() => run(reopenAction)}
        trigger={
          <Button type="button" variant="outline" className="h-9">
            <RotateCcw className="mr-1 size-4" /> Reabrir
          </Button>
        }
      />
    )
  }

  return (
    <ConfirmDialog
      title="Finalizar placar"
      description="Confirma finalizar este placar? Ele ficara bloqueado para recalculo ate ser reaberto."
      confirmLabel="Finalizar"
      onConfirm={() => run(finalizeAction)}
      trigger={
        <Button type="button" variant="outline" className="h-9 text-emerald-700">
          <CheckCircle2 className="mr-1 size-4" /> Finalizar
        </Button>
      }
    />
  )
}
