'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import type { IndicatorRequestRow } from '@/server/queries/indicadores/objectives'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type IndicatorRequestActionsProps = {
  request: IndicatorRequestRow
  canApprove: boolean
  approveAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  rejectAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
}

const initialState: IndicatorObjectiveActionState = { ok: false }

export function IndicatorRequestActions({
  request,
  canApprove,
  approveAction,
  rejectAction,
}: IndicatorRequestActionsProps) {
  const [, approveFormAction] = useActionState(approveAction, initialState)
  const [, rejectFormAction] = useActionState(rejectAction, initialState)

  if (!canApprove || request.atendida !== null) return null

  return (
    <div className="flex gap-2">
      <form action={approveFormAction}>
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="action" value="approve" />
        <Button type="submit" size="sm" className="h-8 bg-[var(--sn-black)] text-white hover:bg-black/90">
          Aprovar
        </Button>
      </form>
      <form action={rejectFormAction}>
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="action" value="reject" />
        <Button type="submit" size="sm" variant="outline" className="h-8 text-[var(--sn-red)]">
          Rejeitar
        </Button>
      </form>
    </div>
  )
}
