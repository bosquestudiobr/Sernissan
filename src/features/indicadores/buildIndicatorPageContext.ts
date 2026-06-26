import { redirect } from 'next/navigation'

import {
  canAccessIndicatorObjectives,
  canApproveIndicatorRequest,
} from '@/lib/permissions/indicadores'
import { requireCurrentUser } from '@/lib/permissions'
import type { OrganizationalContextView } from '@/lib/types/user'
import type { UserScopes } from '@/lib/types/user'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildIndicatorPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessIndicatorObjectives(user.perfilNivel)) redirect('/acesso-negado')

  const [scopes, orgContext] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
  ])

  return {
    user,
    scopes,
    orgContext,
    canApprove: canApproveIndicatorRequest(user.perfilNivel),
    canEdit: canAccessIndicatorObjectives(user.perfilNivel),
  }
}

export type IndicatorPageContext = {
  user: Awaited<ReturnType<typeof requireCurrentUser>>
  scopes: UserScopes
  orgContext: OrganizationalContextView
  canApprove: boolean
  canEdit: boolean
}
