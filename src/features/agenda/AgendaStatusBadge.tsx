import type { AgendaStatus } from '@/lib/agenda/status'

const LABELS: Record<AgendaStatus, string> = {
  pendente: 'Pendente',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
  atrasado: 'Atrasado',
}

const STYLES: Record<AgendaStatus, string> = {
  pendente: 'bg-blue-50 text-blue-800',
  concluido: 'bg-emerald-50 text-emerald-800',
  cancelado: 'bg-gray-100 text-gray-600',
  atrasado: 'bg-red-50 text-red-800',
}

export function AgendaStatusBadge({ status }: { status: AgendaStatus }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
