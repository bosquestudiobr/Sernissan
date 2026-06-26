export type HabitoStatus = 'pendente' | 'concluido' | 'atrasado' | 'inativo'

export function deriveHabitoStatus(input: {
  ativo: boolean
  concluido: boolean
  dataFim: string | null
  now?: Date
}): HabitoStatus {
  if (!input.ativo) return 'inativo'
  if (input.concluido) return 'concluido'
  const now = input.now ?? new Date()
  if (input.dataFim) {
    const end = new Date(input.dataFim)
    if (!Number.isNaN(end.getTime()) && end < now) return 'atrasado'
  }
  return 'pendente'
}

export function isHabitoLocked(input: { concluido: boolean }) {
  return input.concluido
}

export function computeHabitoProgress(meta: number | null, realizadas: number | null) {
  const target = meta ?? 0
  const done = realizadas ?? 0
  if (target <= 0) return { percent: 0, label: `${done} exec.` }
  const percent = Math.min(100, Math.round((done / target) * 100))
  return { percent, label: `${done}/${target}` }
}
