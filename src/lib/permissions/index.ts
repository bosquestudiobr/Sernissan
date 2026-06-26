import { redirect } from 'next/navigation'

import type { CurrentUserView } from '@/lib/types/user'
import { getCurrentUserView } from '@/server/queries/auth'

import { canManageStructuralAdmin } from './admin'
import { canAccessIndicatorObjectives } from './indicadores'
import { canAccessPlacar } from './placar'
import { canAccessCompetencias } from './competencias'
import { canAccessSolicitacoes } from './solicitacoes'
import { canAccessVisitas } from './visitas'
import { canAccessReuniaoResultados } from './reuniao-resultados'
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

export async function requireAdminAccess(): Promise<CurrentUserView> {
  const user = await requireCurrentUser()
  if (!canManageStructuralAdmin(user.perfilNivel)) redirect('/acesso-negado')
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

  if (action === 'admin:manage' && !canManageStructuralAdmin(user.perfilNivel)) {
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
  if (route.startsWith('/placar') && !canAccessPlacar(user.perfilNivel)) return false
  if (route.startsWith('/competencias') && !canAccessCompetencias(user.perfilNivel)) return false
  if (route.startsWith('/solicitacoes') && !canAccessSolicitacoes(user.perfilNivel)) return false
  if (route.startsWith('/visitas') && !canAccessVisitas(user.perfilNivel)) return false
  if (route.startsWith('/reuniao-resultados') && !canAccessReuniaoResultados(user.perfilNivel)) return false
  if (route.startsWith('/indicadores') && !canAccessIndicatorObjectives(user.perfilNivel)) return false
  if (route.startsWith('/biblioteca-indicadores') && !canManageStructuralAdmin(user.perfilNivel)) return false
  if (route.startsWith('/admin') && !canManageStructuralAdmin(user.perfilNivel)) return false
  return true
}

export { canManageStructuralAdmin } from './admin'
export { canAccessSetor, canAccessGrupo, canAccessConcessionaria, canAccessOrganizationalContext }




