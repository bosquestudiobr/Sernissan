type HabitosEmptyStateProps = {
  title?: string
  description?: string
}

export function HabitosEmptyState({
  title = 'Nenhum habito encontrado',
  description = 'Ajuste os filtros ou crie um novo habito.',
}: HabitosEmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-[var(--sn-border)] bg-white px-6 py-10 text-center">
      <p className="text-sm font-medium text-[var(--sn-text)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--sn-muted)]">{description}</p>
    </div>
  )
}
