import { canManageStructuralAdmin } from '@/lib/permissions/admin'

export const AGENDA_MAX_NIVEL = 6

export function canAccessAgenda(perfilNivel: number): boolean {
  return perfilNivel <= AGENDA_MAX_NIVEL
}

export function canManageAgenda(perfilNivel: number): boolean {
  return perfilNivel <= AGENDA_MAX_NIVEL
}

export function canReopenAgendaItem(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}

export function canDeleteAgendaItem(perfilNivel: number): boolean {
  return canManageStructuralAdmin(perfilNivel)
}
