import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import type { CurrentUserView, UserScopes } from '@/lib/types/user'

export function canEditTargetProfile(actor: CurrentUserView, targetPerfilNivel: number): boolean {
  return targetPerfilNivel >= actor.perfilNivel
}

export function canAssignPerfil(actor: CurrentUserView, newPerfilNivel: number): boolean {
  return newPerfilNivel >= actor.perfilNivel
}

export function assertCanEditProfile(
  actor: CurrentUserView,
  targetId: string,
  targetPerfilNivel: number,
): void {
  if (!canEditTargetProfile(actor, targetPerfilNivel)) throw new Error('FORBIDDEN')
  if (actor.id === targetId && targetPerfilNivel < actor.perfilNivel) throw new Error('FORBIDDEN')
}

export function assertCanToggleProfileActive(
  actor: CurrentUserView,
  targetId: string,
  targetPerfilNivel: number,
  nextActive: boolean,
): void {
  assertCanEditProfile(actor, targetId, targetPerfilNivel)
  if (actor.id === targetId && !nextActive) throw new Error('FORBIDDEN')
}

export function assertCanAssignScopes(
  actor: CurrentUserView,
  scopes: UserScopes,
  payload: {
    grupoIds?: string[]
    concessionariaIds?: string[]
    setorId?: string | null
    grupoId?: string | null
    concessionariaId?: string | null
    empresaId?: string | null
  },
): void {
  if (isHighPrivilegeScope(actor.perfilNivel)) return

  if (payload.empresaId && scopes.empresaId && payload.empresaId !== scopes.empresaId) {
    throw new Error('FORBIDDEN')
  }

  payload.grupoIds?.forEach((id) => {
    if (!scopes.grupoIds.includes(id)) throw new Error('FORBIDDEN')
  })

  payload.concessionariaIds?.forEach((id) => {
    if (!scopes.concessionariaIds.includes(id)) throw new Error('FORBIDDEN')
  })

  if (payload.grupoId && !scopes.grupoIds.includes(payload.grupoId)) throw new Error('FORBIDDEN')
  if (payload.concessionariaId && !scopes.concessionariaIds.includes(payload.concessionariaId)) {
    throw new Error('FORBIDDEN')
  }
  if (payload.setorId && !scopes.setorIds.includes(payload.setorId)) throw new Error('FORBIDDEN')
}
