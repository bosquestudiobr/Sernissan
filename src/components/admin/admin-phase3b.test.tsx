import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('admin usuarios smoke', () => {
  it('renderiza shell de usuarios', () => {
    render(
      <AdminPageShell title="Usuarios" description="Gestao de profiles">
        <p>Lista de usuarios</p>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument()
  })
})

describe('admin areas-funcoes smoke', () => {
  it('renderiza shell de areas', () => {
    render(
      <AdminPageShell title="Areas e Funcoes" description="Cadastro">
        <p>Conteudo</p>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Areas e Funcoes' })).toBeInTheDocument()
  })
})
