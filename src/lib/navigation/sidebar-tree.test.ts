import { describe, expect, it } from 'vitest'

import {
  buildSidebarTree,
  findExpandedParentIds,
  flattenSidebarItems,
} from '@/lib/navigation/sidebar-tree'

const pages = [
  { id: '1', dbValue: 'gerenciamento', label: 'Gerenciamento', href: '/modulos/gerenciamento', icon: 'LayoutGrid', sortOrder: 1 },
  { id: '2', dbValue: 'inicio', label: 'Inicio', href: '/', icon: 'Circle', sortOrder: 2, menuPai: 'gerenciamento' },
  { id: '3', dbValue: 'indicadores', label: 'Indicadores', href: '/indicadores', icon: 'Circle', sortOrder: 4, menuPai: 'gerenciamento' },
  { id: '4', dbValue: 'admin', label: 'Admin', href: '/admin/empresa', icon: 'Settings', sortOrder: 22 },
  { id: '5', dbValue: 'empresa', label: 'Empresa', href: '/admin/empresa', icon: 'Circle', sortOrder: 23, menuPai: 'admin' },
  { id: '6', dbValue: 'placar', label: 'Placar', href: '/placar', icon: 'Trophy', sortOrder: 6 },
]

describe('buildSidebarTree', () => {
  it('agrupa subpaginas sob menu pai', () => {
    const tree = buildSidebarTree(pages)
    const gerenciamento = tree.find((item) => item.dbValue === 'gerenciamento')
    expect(gerenciamento?.children).toHaveLength(2)
    expect(gerenciamento?.children?.[0].label).toBe('Inicio')
    expect(gerenciamento?.children?.[1].label).toBe('Indicadores')
  })

  it('mantem paginas raiz sem filhos', () => {
    const tree = buildSidebarTree(pages)
    const placar = tree.find((item) => item.dbValue === 'placar')
    expect(placar?.children).toBeUndefined()
  })

  it('ordena filhos por sortOrder', () => {
    const tree = buildSidebarTree(pages)
    const admin = tree.find((item) => item.dbValue === 'admin')
    expect(admin?.children?.[0].dbValue).toBe('empresa')
  })

  it('achata arvore para listagem', () => {
    const tree = buildSidebarTree(pages)
    expect(flattenSidebarItems(tree)).toHaveLength(6)
  })

  it('detecta pai expandido pela rota ativa', () => {
    const tree = buildSidebarTree(pages)
    expect(findExpandedParentIds(tree, '/indicadores')).toEqual(['1'])
    expect(findExpandedParentIds(tree, '/placar')).toEqual([])
  })
})
