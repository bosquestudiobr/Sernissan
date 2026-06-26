import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ContextSummary } from '@/features/organizational-context/ContextSummary'
import { HierarchyDialog } from '@/features/organizational-context/HierarchyDialog'

const context = {
  empresaId: 'e1',
  paisId: 'p1',
  divisaoId: 'd1',
  setorId: 's1',
  grupoId: 'g1',
  concessionariaId: 'c1',
  empresa: 'Empresa A',
  pais: 'Brasil',
  divisao: 'Divisao Sul',
  setor: 'Setor A',
  grupo: 'Grupo A',
  concessionaria: 'Concessionaria A',
}

const options = {
  empresas: [{ id: 'e1', label: 'Empresa A' }],
  paises: [{ id: 'p1', label: 'Brasil', empresaId: 'e1' }],
  divisoes: [{ id: 'd1', label: 'Divisao Sul', paisId: 'p1', empresaId: 'e1' }],
  setores: [{ id: 's1', label: 'Setor A', divisaoId: 'd1', empresaId: 'e1' }],
  grupos: [{ id: 'g1', label: 'Grupo A', setorId: 's1', empresaId: 'e1' }],
  concessionarias: [{ id: 'c1', label: 'Concessionaria A', grupoId: 'g1', empresaId: 'e1' }],
}

describe('organizational context UI', () => {
  it('renders context summary', () => {
    render(<ContextSummary context={context} />)
    expect(screen.getByText('Grupo A · Concessionaria A')).toBeInTheDocument()
  })

  it('renders hierarchy trigger button', () => {
    render(<HierarchyDialog context={context} options={options} />)
    expect(screen.getByTitle('Hierarquia organizacional')).toBeInTheDocument()
  })
})
