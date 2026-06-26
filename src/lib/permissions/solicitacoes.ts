import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const SOLICITACOES_MAX_NIVEL = 6

export function canAccessSolicitacoes(perfilNivel: number): boolean {
  return perfilNivel <= SOLICITACOES_MAX_NIVEL
}

export function canManageSolicitacoes(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
