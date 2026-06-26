export const MODULE_ROUTES: Record<string, string> = {
  inicio: '/',
  gerenciamento: '/modulos/gerenciamento',
  equipe: '/modulos/equipe',
  indicadores: '/indicadores',
  solicitacoes: '/solicitacoes',
  placar: '/placar',
  agenda: '/agenda',
  habitos: '/habitos',
  reuniao_resultados: '/reuniao-resultados',
  rr_reuniao: '/reuniao-resultados',
  xr_areas: '/modulos/xr_areas',
  rr_indicadores: '/modulos/rr_indicadores',
  rr_grupo_ndp: '/modulos/rr_grupo_ndp',
  rr_preliminares: '/modulos/rr_preliminares',
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
  status_report: '/modulos/status_report',
  dados_placar: '/modulos/dados_placar',
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




