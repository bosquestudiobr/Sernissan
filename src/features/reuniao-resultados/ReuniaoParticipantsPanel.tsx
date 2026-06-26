export function ReuniaoParticipantsPanel() {
  return (
    <div className="rounded-md border border-dashed border-[var(--sn-border)] bg-[var(--sn-field)]/40 p-4">
      <p className="text-sm font-medium text-[var(--sn-text)]">Participantes</p>
      <p className="mt-2 text-sm text-[var(--sn-muted)]">
        Este schema nao possui tabela formal de participantes para Reuniao de Resultados/XR. Participantes
        poderao ser implementados futuramente quando houver estrutura propria. Responsaveis por acoes devem
        aparecer apenas nos proximos passos/acoes, nao como participantes da reuniao.
      </p>
    </div>
  )
}
