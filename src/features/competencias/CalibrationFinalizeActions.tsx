'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, RotateCcw } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import type { CalibrationActionState } from '@/server/actions/competencias/calibration'

type ActionFn = (prev: CalibrationActionState, formData: FormData) => Promise<CalibrationActionState>

type CalibrationFinalizeActionsProps = {
  profileId: string
  finalizada: boolean
  canEdit: boolean
  canReopen: boolean
  finalizeAction: ActionFn
  reopenAction: ActionFn
}

export function CalibrationFinalizeActions({
  profileId,
  finalizada,
  canEdit,
  canReopen,
  finalizeAction,
  reopenAction,
}: CalibrationFinalizeActionsProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function run(action: ActionFn) {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const fd = new FormData()
        fd.set('profileId', profileId)
        const result = await action({ ok: false }, fd)
        if (result.ok) router.refresh()
        resolve()
      })
    })
  }

  if (finalizada) {
    if (!canReopen) return null
    return (
      <ConfirmDialog
        title="Reabrir calibracao"
        description="Confirma reabrir esta calibracao finalizada? A edicao sera liberada."
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

  if (!canEdit) return null
  return (
    <ConfirmDialog
      title="Finalizar calibracao"
      description="Confirma finalizar? A matriz ficara somente leitura ate ser reaberta."
      confirmLabel="Finalizar"
      onConfirm={() => run(finalizeAction)}
      trigger={
        <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90">
          <CheckCircle2 className="mr-1 size-4" /> Finalizar
        </Button>
      }
    />
  )
}
