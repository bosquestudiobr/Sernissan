import { redirect } from 'next/navigation'

import type { CurrentUserView } from '@/lib/types/user'
import { getCurrentUserView } from '@/server/queries/auth'

import type { PermissionAction } from './actions'
import {
  canAccessConcessionaria,
  canAccessGrupo,
  canAccessOrganizationalContext,
  canAccessSetor,
} from './scopes'
import type { OrganizationalContextInput } from '@/lib/validations/context'
import type { UserScopes } from '@/lib/types/user'

export async function requireCurrentUser(): Promise<CurrentUserView> {
  const user = await getCurrentUserView()
  if (!user) redirect('/entrar')
  if (user.ativo === false || user.aprovado === false) redirect('/acesso-negado')
  return user
}

export function assertCan(
  user: CurrentUserView,
  action: PermissionAction,
  scopes?: UserScopes,
  context?: OrganizationalContextInput,
): void {
  if (user.ativo === false || user.aprovado === false) {
    throw new Error('FORBIDDEN')
  }

  if (action === 'context:set' && scopes && context) {
    if (!canAccessOrganizationalContext(scopes, context)) {
      throw new Error('FORBIDDEN')
    }
  }
}

export function canAccessRoute(user: CurrentUserView, route: string): boolean {
  if (user.ativo === false || user.aprovado === false) return false
  void route
  return true
}

export { canAccessSetor, canAccessGrupo, canAccessConcessionaria, canAccessOrganizationalContext }

