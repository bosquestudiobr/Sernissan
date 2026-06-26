import { redirect } from 'next/navigation'

import { canAccessCompetencias, canManageCompetencias } from '@/lib/permissions/competencias'
import { requireCurrentUser } from '@/lib/permissions'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildCompetenciasPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessCompetencias(user.perfilNivel)) redirect('/acesso-negado')

  const [scopes, orgContext] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
  ])

  return {
    user,
    scopes,
    orgContext,
    canManage: canManageCompetencias(user.perfilNivel),
  }
}

export type CompetenciasPageContext = {
  user: Awaited<ReturnType<typeof requireCurrentUser>>
  scopes: UserScopes
  orgContext: OrganizationalContextView
  canManage: boolean
}
