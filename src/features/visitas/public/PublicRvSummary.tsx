import type { PublicRvView } from '@/server/queries/visitas/public'

type PublicRvSummaryProps = {
  visita: NonNullable<PublicRvView['visita']>
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

export function PublicRvSummary({ visita }: PublicRvSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xs text-[var(--sn-muted)]">Data</p><p className="text-sm">{formatDate(visita.dataVisita)}</p></div>
        <div><p className="text-xs text-[var(--sn-muted)]">Concessionaria</p><p className="text-sm">{visita.dealerNome ?? '—'}</p></div>
        <div><p className="text-xs text-[var(--sn-muted)]">Consultor</p><p className="text-sm">{visita.consultorNome ?? '—'}</p></div>
        <div><p className="text-xs text-[var(--sn-muted)]">Modalidade</p><p className="text-sm">{visita.modalidadeNome ?? '—'}</p></div>
      </div>
      {visita.relato ? (
        <div><p className="text-xs text-[var(--sn-muted)]">Relato</p><p className="whitespace-pre-line text-sm">{visita.relato}</p></div>
      ) : null}
      {visita.participantes.length > 0 ? (
        <div>
          <p className="text-xs text-[var(--sn-muted)]">Participantes</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {visita.participantes.map((p, i) => (
              <li key={i}>{p.nome}{p.cargo ? ` — ${p.cargo}` : ''}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {visita.proximosPassos.length > 0 ? (
        <div>
          <p className="text-xs text-[var(--sn-muted)]">Proximos passos</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {visita.proximosPassos.map((p, i) => (
              <li key={i}>{p.acao}{p.responsavel ? ` — ${p.responsavel}` : ''}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
