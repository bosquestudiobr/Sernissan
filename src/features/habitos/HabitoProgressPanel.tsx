'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { HabitoRow } from '@/server/queries/habitos'
import type { HabitoActionState } from '@/server/actions/habitos'

type ActionFn = (prev: HabitoActionState, formData: FormData) => Promise<HabitoActionState>

type HabitoProgressPanelProps = {
  row: HabitoRow
  canManage: boolean
  markDoneAction: ActionFn
}

export function HabitoProgressPanel({ row, canManage, markDoneAction }: HabitoProgressPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  if (row.metaExecucoes == null || row.metaExecucoes <= 0) return null

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set('id', row.id)
    startTransition(async () => {
      const result = await markDoneAction({ ok: false }, formData)
      if (result.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-2 rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] p-3">
      <div className="flex items-center justify-between text-xs text-[var(--sn-muted)]">
        <span>Progresso</span>
        <span>{row.progressLabel}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-[var(--sn-black)]" style={{ width: `${row.progressPercent}%` }} />
      </div>
      {canManage && !row.concluido && row.ativo ? (
        <form onSubmit={submit} className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor={`exec-${row.id}`} className="text-xs">Execucoes realizadas</Label>
            <Input
              id={`exec-${row.id}`}
              name="execucoesRealizadas"
              type="number"
              min={0}
              defaultValue={row.execucoesRealizadas}
              className="h-8 bg-white"
            />
          </div>
          <Button type="submit" size="sm" className="h-8 bg-[var(--sn-black)] text-white" disabled={pending}>
            Salvar
          </Button>
        </form>
      ) : null}
    </div>
  )
}
