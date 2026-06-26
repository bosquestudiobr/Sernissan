import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('indicadores page smoke', () => {
  it('renderiza shell de indicadores e objetivos', () => {
    render(
      <AdminPageShell title="Indicadores e Objetivos" description="3 indicadores solicitados">
        <table>
          <tbody>
            <tr>
              <td>Vendas</td>
            </tr>
          </tbody>
        </table>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Indicadores e Objetivos' })).toBeInTheDocument()
    expect(screen.getByText('Vendas')).toBeInTheDocument()
  })
})
