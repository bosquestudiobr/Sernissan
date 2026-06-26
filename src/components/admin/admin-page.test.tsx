import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('admin page smoke', () => {
  it('renderiza AdminPageShell', () => {
    render(
      <AdminPageShell title="Empresa" description="Teste">
        <p>Conteudo admin</p>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Empresa' })).toBeInTheDocument()
    expect(screen.getByText('Conteudo admin')).toBeInTheDocument()
  })
})
