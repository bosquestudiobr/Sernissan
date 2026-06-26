export type PermissionAction =
  | 'route:view'
  | 'context:set'
  | 'module:access'

export const ROUTE_PERMISSIONS: Record<string, PermissionAction> = {
  '/': 'route:view',
  '/acesso-negado': 'route:view',
}
