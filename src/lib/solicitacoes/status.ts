export type RequestStatus = 'pendente' | 'aprovada' | 'rejeitada'

export function requestStatus(atendida: boolean | null | undefined): RequestStatus {
  if (atendida === true) return 'aprovada'
  if (atendida === false) return 'rejeitada'
  return 'pendente'
}

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
}
