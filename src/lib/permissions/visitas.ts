import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const VISITAS_MAX_NIVEL = 6

export function canAccessVisitas(perfilNivel: number): boolean {
  return perfilNivel <= VISITAS_MAX_NIVEL
}

export function canManageVisitas(perfilNivel: number): boolean {
  return perfilNivel <= VISITAS_MAX_NIVEL
}

export function canDeleteVisita(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
