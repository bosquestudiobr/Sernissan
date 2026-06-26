import { redirect } from 'next/navigation'

import { canAccessSolicitacoes, canManageSolicitacoes } from '@/lib/permissions/solicitacoes'
import { requireCurrentUser } from '@/lib/permissions'
import type { OrganizationalContextView, UserScopes } from '@/lib/types/user'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildSolicitacoesPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessSolicitacoes(user.perfilNivel)) redirect('/acesso-negado')
  const [scopes, orgContext] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
  ])
  return { user, scopes, orgContext, canManage: canManageSolicitacoes(user.perfilNivel) }
}

export type SolicitacoesPageContext = {
  user: Awaited<ReturnType<typeof requireCurrentUser>>
  scopes: UserScopes
  orgContext: OrganizationalContextView
  canManage: boolean
}
