import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('biblioteca indicadores smoke', () => {
  it('renderiza shell da biblioteca', () => {
    render(
      <AdminPageShell title="Biblioteca de indicadores" description="Cadastro">
        <p>Tabela de indicadores</p>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Biblioteca de indicadores' })).toBeInTheDocument()
  })
})
