export type CalibrationResponseValue = 'sim' | 'parcial' | 'n_o' | null | undefined

export function responseColorClass(value: CalibrationResponseValue): string {
  switch (value) {
    case 'sim':
      return 'bg-[var(--sn-green-soft)]'
    case 'parcial':
      return 'bg-[var(--sn-yellow-soft)]'
    case 'n_o':
      return 'bg-[var(--sn-red-soft)]'
    default:
      return 'bg-[var(--sn-field)]'
  }
}

export const RESPONSE_SHORT_LABEL: Record<string, string> = {
  sim: 'Sim',
  parcial: 'Parcial',
  n_o: 'Nao',
}

export function responseShortLabel(value: CalibrationResponseValue): string {
  if (!value) return '—'
  return RESPONSE_SHORT_LABEL[value] ?? value
}
