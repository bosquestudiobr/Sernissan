export function PublicRvExpiredState() {
  return (
    <div className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--sn-text)]">Link expirado</h2>
      <p className="mt-2 text-sm text-[var(--sn-muted)]">Este link de ciencia da visita expirou ou nao e mais valido. Solicite um novo link ao consultor.</p>
    </div>
  )
}
