import { redirect } from 'next/navigation'

import { canAccessPlacar } from '@/lib/permissions/placar'
import { requireCurrentUser } from '@/lib/permissions'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildPlacarPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessPlacar(user.perfilNivel)) redirect('/acesso-negado')

  const [scopes, orgContext] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
  ])

  return {
    user,
    scopes,
    orgContext,
    canEdit: canAccessPlacar(user.perfilNivel),
  }
}

export type PlacarPageContext = {
  user: Awaited<ReturnType<typeof requireCurrentUser>>
  scopes: UserScopes
  orgContext: OrganizationalContextView
  canEdit: boolean
}
