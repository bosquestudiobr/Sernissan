export const MODULE_ROUTES: Record<string, string> = {
  inicio: '/',
  gerenciamento: '/modulos/gerenciamento',
  equipe: '/modulos/equipe',
  indicadores: '/modulos/indicadores',
  solicitacoes: '/modulos/solicitacoes',
  placar: '/modulos/placar',
  agenda: '/modulos/agenda',
  reuniao_resultados: '/modulos/reuniao-resultados',
  admin: '/modulos/admin',
  relatorios: '/modulos/relatorios',
  mapa_competencias: '/modulos/competencias',
  guia: '/modulos/guia',
}

export function resolveModuleHref(dbValue: string): string {
  return MODULE_ROUTES[dbValue] ?? `/modulos/${dbValue}`
}

export const BUBBLE_ICON_TO_LUCIDE: Record<string, string> = {
  dados: 'LayoutGrid',
  trof_u: 'Trophy',
  calend_rio: 'Calendar',
  resultado: 'BarChart3',
  admin: 'Settings',
  relatorios: 'FileText',
  competencias: 'Grid3x3',
  livro: 'BookOpen',
}

export function mapBubbleIconToLucide(iconKey?: string | null): string {
  if (!iconKey) return 'Circle'
  return BUBBLE_ICON_TO_LUCIDE[iconKey] ?? 'Circle'
}
