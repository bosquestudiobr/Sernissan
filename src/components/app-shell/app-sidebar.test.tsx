import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { AppSidebar } from '@/components/app-shell/AppSidebar'

const items = [
  {
    id: 'g1',
    dbValue: 'gerenciamento',
    label: 'Gerenciamento',
    href: '/modulos/gerenciamento',
    icon: 'LayoutGrid',
    sortOrder: 1,
    children: [
      { id: 'g2', dbValue: 'inicio', label: 'Inicio', href: '/', icon: 'Circle', sortOrder: 2 },
      { id: 'g3', dbValue: 'indicadores', label: 'Indicadores', href: '/indicadores', icon: 'Circle', sortOrder: 4 },
    ],
  },
  {
    id: 'p1',
    dbValue: 'placar',
    label: 'Placar',
    href: '/placar',
    icon: 'Trophy',
    sortOrder: 6,
  },
]

describe('AppSidebar com subpaginas', () => {
  it('renderiza links raiz e controle de expansao', () => {
    render(<AppSidebar items={items} />)
    expect(screen.getByLabelText('Expandir menu')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '' }) || document.querySelector('a[href="/placar"]')).toBeTruthy()
    expect(document.querySelector('a[href="/placar"]')).toBeInTheDocument()
  })
})
