export type AgendaStatus = 'pendente' | 'concluido' | 'cancelado' | 'atrasado'

export function deriveAgendaStatus(input: {
  concluido: boolean
  cancelado: boolean
  dataFim: string | null
  now?: Date
}): AgendaStatus {
  if (input.cancelado) return 'cancelado'
  if (input.concluido) return 'concluido'
  const now = input.now ?? new Date()
  if (input.dataFim) {
    const end = new Date(input.dataFim)
    if (!Number.isNaN(end.getTime()) && end < now) return 'atrasado'
  }
  return 'pendente'
}

export function isAgendaLocked(input: { concluido: boolean; cancelado: boolean }) {
  return input.concluido || input.cancelado
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function eventOccursOnDay(dataInicio: string | null, dataFim: string | null, day: Date) {
  if (!dataInicio) return false
  const start = new Date(dataInicio)
  if (Number.isNaN(start.getTime())) return false
  const end = dataFim ? new Date(dataFim) : start
  if (Number.isNaN(end.getTime())) return isSameDay(start, day)

  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
  const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999)
  return start <= dayEnd && end >= dayStart
}
