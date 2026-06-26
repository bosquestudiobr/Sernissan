export function AgendaEmptyState() {
  return (
    <div className="py-8 text-center">
      <p className="text-sm font-medium text-[var(--sn-text)]">Nenhum compromisso encontrado</p>
      <p className="mt-1 text-sm text-[var(--sn-muted)]">Ajuste os filtros ou crie um novo compromisso.</p>
    </div>
  )
}
