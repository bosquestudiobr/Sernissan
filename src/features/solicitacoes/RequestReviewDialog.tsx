'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RequestStatusBadge } from '@/features/solicitacoes/RequestStatusBadge'
import type { RequestDetail } from '@/server/queries/solicitacoes'
import type { SolicitacoesActionState } from '@/server/actions/solicitacoes'

type ActionFn = (prev: SolicitacoesActionState, formData: FormData) => Promise<SolicitacoesActionState>

type RequestReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string | null
  canManage: boolean
  reviewAction: ActionFn
  approveAction: ActionFn
  rejectAction: ActionFn
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-[var(--sn-muted)]">{label}</p>
      <p className="text-sm text-[var(--sn-text)]">{value ?? '—'}</p>
    </div>
  )
}

export function RequestReviewDialog({
  open,
  onOpenChange,
  requestId,
  canManage,
  reviewAction,
  approveAction,
  rejectAction,
}: RequestReviewDialogProps) {
  const router = useRouter()
  const [detail, setDetail] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !requestId) return
    let active = true
    const load = async () => {
      setLoading(true)
      setMessage(null)
      const fd = new FormData()
      fd.set('id', requestId)
      const result = await reviewAction({ ok: false }, fd)
      if (!active) return
      setDetail(result.detail ?? null)
      setLoading(false)
      if (!result.ok) setMessage(result.message ?? 'Erro ao carregar.')
    }
    void load()
    return () => {
      active = false
    }
  }, [open, requestId, reviewAction])

  function run(action: ActionFn) {
    if (!requestId) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', requestId)
      const result = await action({ ok: false }, fd)
      setMessage(result.message ?? null)
      if (result.ok) {
        router.refresh()
        setTimeout(() => onOpenChange(false), 0)
      }
    })
  }

  const isPending = detail?.atendida === null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar solicitacao</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="py-6 text-center text-sm text-[var(--sn-muted)]">Carregando...</p>
        ) : detail ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{detail.tipo ?? 'Solicitacao'}</span>
              <RequestStatusBadge atendida={detail.atendida} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Usuario" value={detail.usuarioNome} />
              <Field label="Concessionaria" value={detail.concessionariaNome} />
            </div>
            <Field label="Descricao" value={detail.text} />
            {message ? <p className="text-xs text-[var(--sn-muted)]">{message}</p> : null}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-[var(--sn-muted)]">{message ?? 'Solicitacao nao encontrada.'}</p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {canManage && isPending ? (
            <>
              <Button type="button" variant="outline" className="text-[var(--sn-red)]" disabled={pending} onClick={() => run(rejectAction)}>
                Rejeitar
              </Button>
              <Button type="button" className="bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending} onClick={() => run(approveAction)}>
                Aprovar
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
