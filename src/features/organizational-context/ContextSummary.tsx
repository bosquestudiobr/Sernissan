import type { OrganizationalContextView } from '@/lib/types/user'
import { formatContextSummary } from '@/lib/organizational-context/hierarchy'

type ContextSummaryProps = {
  context: OrganizationalContextView
  className?: string
}

export function ContextSummary({ context, className }: ContextSummaryProps) {
  const summary = formatContextSummary(context)
  const detail = [context.setor, context.grupo, context.concessionaria]
    .filter((v) => v && v !== 'Nao definido')
    .join(' · ')

  return (
    <div className={className} title={detail || summary}>
      <p className="truncate text-xs font-medium text-[var(--sn-text)]">{summary}</p>
      <p className="hidden truncate text-[10px] text-[var(--sn-muted)] sm:block">{detail}</p>
    </div>
  )
}
