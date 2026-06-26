import type { AppModule } from '@/lib/types/user'

export const SIDEBAR_MODULES: AppModule[] = [
  { id: 'home', href: '/', label: 'Inicio', icon: 'Home' },
  { id: 'indicadores', href: '#', label: 'Indicadores', icon: 'BarChart3' },
  { id: 'placar', href: '#', label: 'Placar', icon: 'Trophy' },
  { id: 'competencias', href: '#', label: 'Competencias', icon: 'Grid3x3' },
  { id: 'rv', href: '#', label: 'RV', icon: 'FileText' },
  { id: 'admin', href: '#', label: 'Admin', icon: 'Settings' },
]
