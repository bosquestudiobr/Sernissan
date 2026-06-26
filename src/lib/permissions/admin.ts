export const ADMIN_STRUCTURAL_MAX_NIVEL = 4

export function canManageStructuralAdmin(perfilNivel: number): boolean {
  return perfilNivel <= ADMIN_STRUCTURAL_MAX_NIVEL
}
