import type { OrganizationalContextInput } from '@/lib/validations/context'
import type { UserScopes } from '@/lib/types/user'

export function canAccessSetor(scopes: UserScopes, setorId: string | null | undefined): boolean {
  if (!setorId) return true
  return scopes.setorIds.includes(setorId)
}

export function canAccessGrupo(scopes: UserScopes, grupoId: string | null | undefined): boolean {
  if (!grupoId) return true
  return scopes.grupoIds.includes(grupoId)
}

export function canAccessConcessionaria(
  scopes: UserScopes,
  concessionariaId: string | null | undefined,
): boolean {
  if (!concessionariaId) return true
  return scopes.concessionariaIds.includes(concessionariaId)
}

export function canAccessOrganizationalContext(
  scopes: UserScopes,
  context: OrganizationalContextInput,
): boolean {
  return (
    canAccessSetor(scopes, context.setorId) &&
    canAccessGrupo(scopes, context.grupoId) &&
    canAccessConcessionaria(scopes, context.concessionariaId)
  )
}

export function isHighPrivilegeScope(perfilNivel: number): boolean {
  return perfilNivel <= 3
}
