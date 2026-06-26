import type { XrReuniaoStatus } from '@/lib/xr/status'

const LABELS: Record<XrReuniaoStatus, string> = {
  rascunho: 'Rascunho',
  em_andamento: 'Em andamento',
  finalizada: 'Finalizada',
}

const STYLES: Record<XrReuniaoStatus, string> = {
  rascunho: 'bg-gray-100 text-gray-700',
  em_andamento: 'bg-amber-50 text-amber-800',
  finalizada: 'bg-emerald-50 text-emerald-800',
}

export function ReuniaoStatusBadge({ status }: { status: XrReuniaoStatus }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
