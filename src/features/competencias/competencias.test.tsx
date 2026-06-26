import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { CalibrationCollaboratorsTable } from '@/features/competencias/CalibrationCollaboratorsTable'
import { CompetencyStatusBadge } from '@/features/competencias/CompetencyStatusBadge'

describe('competencias smoke', () => {
  it('renderiza shell de competencias', () => {
    render(
      <AdminPageShell title="Competencias" description="Mapas e habitos">
        <table>
          <tbody>
            <tr>
              <td>Mapa 2026.1</td>
            </tr>
          </tbody>
        </table>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Competencias' })).toBeInTheDocument()
    expect(screen.getByText('Mapa 2026.1')).toBeInTheDocument()
  })

  it('status badge diferencia essencial', () => {
    const { rerender } = render(<CompetencyStatusBadge essencial={false} />)
    expect(screen.getByText('Padrao')).toBeInTheDocument()
    rerender(<CompetencyStatusBadge essencial />)
    expect(screen.getByText('Essencial')).toBeInTheDocument()
  })
})

describe('CalibrationCollaboratorsTable', () => {
  it('lista colaboradores elegiveis', () => {
    render(
      <CalibrationCollaboratorsTable
        data={[
          {
            id: 'c1',
            nome: 'Ana Souza',
            foto: null,
            areaNome: 'Vendas',
            funcaoNome: 'Consultor',
            concessionariaNome: 'Matriz',
            ativo: true,
            aprovado: true,
          },
        ]}
      />,
    )
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByText('Vendas')).toBeInTheDocument()
    expect(screen.getByText('Abrir matriz')).toBeInTheDocument()
  })

  it('mostra estado vazio', () => {
    render(<CalibrationCollaboratorsTable data={[]} />)
    expect(screen.getByText('Nenhum colaborador elegivel')).toBeInTheDocument()
  })
})

