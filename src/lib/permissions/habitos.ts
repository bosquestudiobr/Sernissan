import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const HABITOS_MAX_NIVEL = 6

export function canAccessHabitos(perfilNivel: number): boolean {
  return perfilNivel <= HABITOS_MAX_NIVEL
}

export function canManageHabitos(perfilNivel: number): boolean {
  return perfilNivel <= HABITOS_MAX_NIVEL
}

export function canReopenHabito(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}

export function canDeleteHabito(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
