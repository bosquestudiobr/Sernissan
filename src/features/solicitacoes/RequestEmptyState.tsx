type RequestEmptyStateProps = {
  title?: string
  description?: string
}

export function RequestEmptyState({
  title = 'Nenhuma solicitacao',
  description = 'Nao ha solicitacoes para os filtros atuais.',
}: RequestEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm font-medium text-[var(--sn-text)]">{title}</p>
      <p className="mt-1 max-w-md text-sm text-[var(--sn-muted)]">{description}</p>
    </div>
  )
}
