import { redirect } from 'next/navigation'

import { canAccessVisitas, canManageVisitas } from '@/lib/permissions/visitas'
import { requireCurrentUser } from '@/lib/permissions'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildVisitasPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessVisitas(user.perfilNivel)) redirect('/acesso-negado')
  const [scopes, orgContext] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
  ])
  return { user, scopes, orgContext, canManage: canManageVisitas(user.perfilNivel) }
}

export type VisitasPageContext = {
  user: Awaited<ReturnType<typeof requireCurrentUser>>
  scopes: UserScopes
  orgContext: OrganizationalContextView
  canManage: boolean
}
