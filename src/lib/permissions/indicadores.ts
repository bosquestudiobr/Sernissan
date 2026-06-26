import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const INDICATOR_OBJECTIVES_MAX_NIVEL = 6

export function canAccessIndicatorObjectives(perfilNivel: number): boolean {
  return perfilNivel <= INDICATOR_OBJECTIVES_MAX_NIVEL
}

export function canRequestIndicator(perfilNivel: number): boolean {
  return perfilNivel <= INDICATOR_OBJECTIVES_MAX_NIVEL
}

export function canApproveIndicatorRequest(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}

export function canEditIndicatorObjective(perfilNivel: number): boolean {
  return perfilNivel <= INDICATOR_OBJECTIVES_MAX_NIVEL
}
