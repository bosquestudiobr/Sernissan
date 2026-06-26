import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const COMPETENCIAS_MAX_NIVEL = 7

export function canAccessCompetencias(perfilNivel: number): boolean {
  return perfilNivel <= COMPETENCIAS_MAX_NIVEL
}

export function canManageCompetencias(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}

export const CALIBRATION_EDIT_MAX_NIVEL = 6

export function canEditCalibration(perfilNivel: number): boolean {
  return perfilNivel <= CALIBRATION_EDIT_MAX_NIVEL
}

