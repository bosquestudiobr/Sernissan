import { requireAdminAccess } from '@/lib/permissions'
import { getCurrentOrganizationalContext } from '@/server/queries/organizational-context'
import { getAdminFilterOptions } from '@/server/queries/admin/filter-options'
import type { ScopeContext } from '@/server/queries/admin/lists'
import { getUserScopes } from '@/server/queries/scopes'

export async function buildAdminPageContext() {
  const user = await requireAdminAccess()
  const [scopes, orgContext, filterOptions] = await Promise.all([
    getUserScopes(user.id),
    getCurrentOrganizationalContext(user.id),
    getAdminFilterOptions(user.empresaId),
  ])

  const scopeCtx: ScopeContext = {
    user,
    scopes,
    empresaId: user.empresaId,
    setorId: orgContext.setorId,
    grupoId: orgContext.grupoId,
  }

  return { user, scopeCtx, filterOptions }
}
