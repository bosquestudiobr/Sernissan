import { PlacarStatusBadge } from '@/features/placar/PlacarStatusBadge'
import type { PlacarCalculationStatus as CalcStatus } from '@/server/queries/placar'

type PlacarCalculationStatusProps = {
  status: CalcStatus
}

function formatDateTime(value: string | null) {
  if (!value) return 'Nunca'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR')
}

export function PlacarCalculationStatus({ status }: PlacarCalculationStatusProps) {
  const semValor = status.indicadorCount - status.indicadoresComValor
  const incompleto = status.indicadorCount === 0 || semValor > 0

  return (
    <div className="space-y-3 rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[var(--sn-text)]">Status do calculo</p>
        <PlacarStatusBadge finalizado={status.finalizado} rankingAtualizado={status.rankingAtualizado} />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-[var(--sn-muted)]">Ranking</dt>
          <dd>{status.rankingAtualizado ? 'Atualizado' : 'Desatualizado'}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--sn-muted)]">Ultima atualizacao</dt>
          <dd>{formatDateTime(status.updatedAt)}</dd>
        </div>
      </dl>
      {incompleto ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {status.indicadorCount === 0
            ? 'Nenhum indicador vinculado a este placar. Vincule indicadores e recalcule.'
            : `${semValor} indicador(es) sem valor realizado: a pontuacao desses fica em 0 ate haver dados.`}
        </p>
      ) : null}
    </div>
  )
}
