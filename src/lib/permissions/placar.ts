export const PLACAR_MAX_NIVEL = 6

export function canAccessPlacar(perfilNivel: number): boolean {
  return perfilNivel <= PLACAR_MAX_NIVEL
}

export function canManagePlacar(perfilNivel: number): boolean {
  return perfilNivel <= PLACAR_MAX_NIVEL
}

export function canDeletePlacar(perfilNivel: number): boolean {
  return perfilNivel <= PLACAR_MAX_NIVEL
}
