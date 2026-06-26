'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Eye } from 'lucide-react'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import type { SolicitacoesActionState } from '@/server/actions/solicitacoes'

type ActionFn = (prev: SolicitacoesActionState, formData: FormData) => Promise<SolicitacoesActionState>

type RequestActionsProps = {
  id: string
  atendida: boolean | null
  canManage: boolean
  approveAction: ActionFn
  rejectAction: ActionFn
  onReview: (id: string) => void
}

export function RequestActions({ id, atendida, canManage, approveAction, rejectAction, onReview }: RequestActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function run(action: ActionFn) {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const fd = new FormData()
        fd.set('id', id)
        const result = await action({ ok: false }, fd)
        if (result.ok) router.refresh()
        resolve()
      })
    })
  }

  const isPending = atendida === null

  return (
    <div className="flex items-center justify-end gap-1">
      <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => onReview(id)} title="Revisar">
        <Eye className="size-3.5" />
      </Button>
      {canManage && isPending ? (
        <>
          <ConfirmDialog
            title="Aprovar solicitacao"
            description="Confirma aprovar esta solicitacao?"
            confirmLabel="Aprovar"
            onConfirm={() => run(approveAction)}
            trigger={
              <Button type="button" size="sm" className="h-8 bg-[var(--sn-black)] px-2 text-white hover:bg-black/90" disabled={pending}>
                <Check className="size-3.5" />
              </Button>
            }
          />
          <ConfirmDialog
            title="Rejeitar solicitacao"
            description="Confirma rejeitar esta solicitacao?"
            confirmLabel="Rejeitar"
            onConfirm={() => run(rejectAction)}
            trigger={
              <Button type="button" size="sm" variant="outline" className="h-8 px-2 text-[var(--sn-red)]" disabled={pending}>
                <X className="size-3.5" />
              </Button>
            }
          />
        </>
      ) : null}
    </div>
  )
}
