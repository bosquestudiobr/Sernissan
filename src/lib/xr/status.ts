export type XrReuniaoStatus = 'rascunho' | 'em_andamento' | 'finalizada'

export function deriveXrReuniaoStatus(input: {
  finalizada: boolean
  indicatorCount: number
  resultCount: number
}): XrReuniaoStatus {
  if (input.finalizada) return 'finalizada'
  if (input.indicatorCount > 0 || input.resultCount > 0) return 'em_andamento'
  return 'rascunho'
}
