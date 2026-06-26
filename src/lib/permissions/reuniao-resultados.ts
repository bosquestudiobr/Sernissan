import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const REUNIAO_MAX_NIVEL = 6

export function canAccessReuniaoResultados(perfilNivel: number): boolean {
  return perfilNivel <= REUNIAO_MAX_NIVEL
}

export function canManageReuniaoResultados(perfilNivel: number): boolean {
  return perfilNivel <= REUNIAO_MAX_NIVEL
}

export function canFinalizeReuniaoResultado(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}

export function canDeleteReuniaoResultado(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
