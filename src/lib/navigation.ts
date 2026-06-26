export const MODULE_ROUTES: Record<string, string> = {
  inicio: '/',
  gerenciamento: '/modulos/gerenciamento',
  equipe: '/modulos/equipe',
  indicadores: '/indicadores',
  solicitacoes: '/solicitacoes',
  placar: '/placar',
  agenda: '/modulos/agenda',
  reuniao_resultados: '/reuniao-resultados',
  visitas: '/visitas',
  admin: '/admin/empresa',
  empresa: '/admin/empresa',
  paises: '/admin/paises',
  divisoes: '/admin/divisoes',
  setores: '/admin/setores',
  grupos: '/admin/grupos',
  concessionarias: '/admin/concessionarias',
  usuarios: '/admin/usuarios',
  areas_funcoes: '/admin/areas-funcoes',
  biblioteca_indicadores: '/biblioteca-indicadores',
  relatorios: '/modulos/relatorios',
  mapa_competencias: '/competencias',
  mapa_competencias0: '/competencias',
  calibracao_competencias: '/competencias/calibracao',
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




