import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const COMPETENCIAS_MAX_NIVEL = 7

export function canAccessCompetencias(perfilNivel: number): boolean {
  return perfilNivel <= COMPETENCIAS_MAX_NIVEL
}

export function canManageCompetencias(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
