import { redirect } from 'next/navigation'

import { canAccessAgenda, canDeleteAgendaItem, canManageAgenda, canReopenAgendaItem } from '@/lib/permissions/agenda'
import { requireCurrentUser } from '@/lib/permissions'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildAgendaPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessAgenda(user.perfilNivel)) redirect('/acesso-negado')
  const [scopes, orgContext] = await Promise.all([getUserScopes(user.id), getCurrentOrganizationalContext(user.id)])
  return {
    user,
    scopes,
    orgContext,
    canManage: canManageAgenda(user.perfilNivel),
    canReopen: canReopenAgendaItem(user.perfilNivel),
    canDelete: canDeleteAgendaItem(user.perfilNivel),
  }
}
