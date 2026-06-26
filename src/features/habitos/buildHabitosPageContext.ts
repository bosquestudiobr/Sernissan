import { redirect } from 'next/navigation'

import {
  canAccessHabitos,
  canDeleteHabito,
  canManageHabitos,
  canReopenHabito,
} from '@/lib/permissions/habitos'
import { requireCurrentUser } from '@/lib/permissions'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildHabitosPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessHabitos(user.perfilNivel)) redirect('/acesso-negado')
  const [scopes, orgContext] = await Promise.all([getUserScopes(user.id), getCurrentOrganizationalContext(user.id)])
  return {
    user,
    scopes,
    orgContext,
    canManage: canManageHabitos(user.perfilNivel),
    canReopen: canReopenHabito(user.perfilNivel),
    canDelete: canDeleteHabito(user.perfilNivel),
  }
}
