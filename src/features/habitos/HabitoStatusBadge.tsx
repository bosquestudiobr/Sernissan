import type { HabitoStatus } from '@/lib/habitos/status'

const LABELS: Record<HabitoStatus, string> = {
  pendente: 'Pendente',
  concluido: 'Concluido',
  inativo: 'Inativo',
  atrasado: 'Atrasado',
}

const STYLES: Record<HabitoStatus, string> = {
  pendente: 'bg-blue-50 text-blue-800',
  concluido: 'bg-emerald-50 text-emerald-800',
  inativo: 'bg-gray-100 text-gray-600',
  atrasado: 'bg-red-50 text-red-800',
}

export function HabitoStatusBadge({ status }: { status: HabitoStatus }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
