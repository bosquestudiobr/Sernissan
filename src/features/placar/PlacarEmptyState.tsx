type PlacarEmptyStateProps = {
  title?: string
  description?: string
}

export function PlacarEmptyState({
  title = 'Nenhum placar encontrado',
  description = 'Ajuste os filtros ou crie um novo placar.',
}: PlacarEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm font-medium text-[var(--sn-text)]">{title}</p>
      <p className="mt-1 max-w-md text-sm text-[var(--sn-muted)]">{description}</p>
    </div>
  )
}
