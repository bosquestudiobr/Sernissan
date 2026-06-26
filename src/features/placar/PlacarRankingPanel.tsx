'use client'

import { useEffect, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import type { RankingRow } from '@/server/jobs/placar/types'
import type { PlacarActionState } from '@/server/actions/placar'

type PlacarRankingPanelProps = {
  placarId: string
  loadAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  recalcAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  disabled?: boolean
}

export function PlacarRankingPanel({ placarId, loadAction, recalcAction, disabled }: PlacarRankingPanelProps) {
  const [ranking, setRanking] = useState<RankingRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    const fd = new FormData()
    fd.set('id', placarId)
    loadAction({ ok: false }, fd).then((result) => {
      if (!active) return
      setRanking(result.ranking ?? [])
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [placarId, loadAction])

  function onRecalc() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', placarId)
      const result = await recalcAction({ ok: false }, fd)
      setMessage(result.summary ?? result.message ?? null)
      if (result.ranking) setRanking(result.ranking)
    })
  }

  return (
    <div className="space-y-3 rounded-md border border-[var(--sn-border)] p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Ranking do placar</p>
          <p className="text-xs text-[var(--sn-muted)]">Pontos agregados por colaborador.</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="bg-[var(--sn-red)] text-white hover:bg-[var(--sn-red-dark)]"
          disabled={disabled || pending}
          onClick={onRecalc}
        >
          Recalcular ranking
        </Button>
      </div>

      {message ? <p className="text-xs text-[var(--sn-muted)]">{message}</p> : null}

      {!loaded ? (
        <p className="text-xs text-[var(--sn-muted)]">Carregando ranking...</p>
      ) : ranking.length === 0 ? (
        <p className="text-xs text-[var(--sn-muted)]">Sem ranking calculado. Recalcule o placar.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--sn-muted)]">
              <th className="w-10 py-1">#</th>
              <th className="py-1">Colaborador</th>
              <th className="w-20 py-1 text-right">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((row) => (
              <tr key={row.colaboradorId ?? 'sem-colaborador'} className="border-t border-[var(--sn-border)]">
                <td className="py-1">{row.posicao}</td>
                <td className="py-1">{row.colaboradorNome ?? 'Sem colaborador'}</td>
                <td className="py-1 text-right">{row.pontosTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
