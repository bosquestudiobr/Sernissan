export type RvStatus = 'rascunho' | 'enviada' | 'assinada' | 'expirada'

export const RV_STATUS_LABEL: Record<RvStatus, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  assinada: 'Assinada',
  expirada: 'Expirada',
}

export function deriveRvStatus(input: {
  assinadoEm: string | null
  enviadoEm: string | null
  dataExpiracaoToken: string | null
  now?: Date
}): RvStatus {
  if (input.assinadoEm) return 'assinada'
  const now = input.now ?? new Date()
  if (input.dataExpiracaoToken) {
    const exp = new Date(input.dataExpiracaoToken)
    if (!Number.isNaN(exp.getTime()) && exp.getTime() < now.getTime()) return 'expirada'
  }
  if (input.enviadoEm) return 'enviada'
  return 'rascunho'
}

export function isTokenExpired(dataExpiracaoToken: string | null, now: Date = new Date()): boolean {
  if (!dataExpiracaoToken) return true
  const exp = new Date(dataExpiracaoToken)
  if (Number.isNaN(exp.getTime())) return true
  return exp.getTime() < now.getTime()
}
