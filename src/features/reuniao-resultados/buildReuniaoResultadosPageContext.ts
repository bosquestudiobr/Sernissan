import { redirect } from 'next/navigation'

import { canAccessReuniaoResultados, canManageReuniaoResultados } from '@/lib/permissions/reuniao-resultados'
import { requireCurrentUser } from '@/lib/permissions'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildReuniaoResultadosPageContext() {
  const user = await requireCurrentUser()
  if (!canAccessReuniaoResultados(user.perfilNivel)) redirect('/acesso-negado')
  const [scopes, orgContext] = await Promise.all([getUserScopes(user.id), getCurrentOrganizationalContext(user.id)])
  return {
    user,
    scopes,
    orgContext,
    canManage: canManageReuniaoResultados(user.perfilNivel),
    canFinalize: user.perfilNivel <= 4,
    canDelete: user.perfilNivel <= 4,
  }
}
