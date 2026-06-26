import { Lock } from 'lucide-react'

type CalibrationReadOnlyBannerProps = {
  finalizada: boolean
}

export function CalibrationReadOnlyBanner({ finalizada }: CalibrationReadOnlyBannerProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-3 py-2 text-sm text-[var(--sn-muted)]">
      <Lock className="size-4" />
      {finalizada
        ? 'Calibracao finalizada. Edicao bloqueada ate reabertura por um administrador.'
        : 'Voce tem acesso somente leitura a esta calibracao.'}
    </div>
  )
}
