'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, ListChecks, Trophy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PlacarActionState } from '@/server/actions/placar'

type ActionFn = (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>

type PlacarRecalculationActionsProps = {
  placarId: string
  finalizado: boolean
  recalcAllAction: ActionFn
  recalcIndicatorsAction: ActionFn
  recalcRankingAction: ActionFn
}

export function PlacarRecalculationActions({
  placarId,
  finalizado,
  recalcAllAction,
  recalcIndicatorsAction,
  recalcRankingAction,
}: PlacarRecalculationActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [running, setRunning] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState(false)

  function run(key: string, action: ActionFn) {
    setRunning(key)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', placarId)
      const result = await action({ ok: false }, fd)
      setMessage(result.summary ?? result.message ?? null)
      setError(!result.ok)
      setRunning(null)
      if (result.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
          disabled={finalizado || pending}
          title={finalizado ? 'Placar finalizado: reabra para recalcular' : 'Gera indicadores, pontos e ranking'}
          onClick={() => run('all', recalcAllAction)}
        >
          <Calculator className={`mr-1 size-4 ${running === 'all' ? 'animate-pulse' : ''}`} /> Recalcular tudo
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-9"
          disabled={finalizado || pending}
          title="Ativa indicadores vinculados ao placar"
          onClick={() => run('indicators', recalcIndicatorsAction)}
        >
          <ListChecks className={`mr-1 size-4 ${running === 'indicators' ? 'animate-pulse' : ''}`} /> Indicadores
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-9"
          disabled={finalizado || pending}
          title="Recalcula pontos e ranking por colaborador"
          onClick={() => run('ranking', recalcRankingAction)}
        >
          <Trophy className={`mr-1 size-4 ${running === 'ranking' ? 'animate-pulse' : ''}`} /> Ranking
        </Button>
      </div>
      {message ? (
        <p className={`text-xs ${error ? 'text-[var(--sn-red)]' : 'text-[var(--sn-muted)]'}`}>{message}</p>
      ) : (
        <p className="text-xs text-[var(--sn-muted)]">
          O recalculo e idempotente: rodar novamente nao duplica pontos nem vinculos.
        </p>
      )}
    </div>
  )
}
