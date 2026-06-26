export type PermissionAction = 'route:view' | 'context:set' | 'module:access' | 'admin:manage'

export const ROUTE_PERMISSIONS: Record<string, PermissionAction> = {
  '/': 'route:view',
  '/acesso-negado': 'route:view',
  '/admin/empresa': 'admin:manage',
  '/admin/paises': 'admin:manage',
  '/admin/divisoes': 'admin:manage',
  '/admin/setores': 'admin:manage',
  '/admin/grupos': 'admin:manage',
  '/admin/concessionarias': 'admin:manage',
  '/admin/usuarios': 'admin:manage',
  '/admin/areas-funcoes': 'admin:manage',
}

