import { afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { RequestStatusBadge } from '@/features/solicitacoes/RequestStatusBadge'
import { RegistrationRequestsTable } from '@/features/solicitacoes/RegistrationRequestsTable'
import { InclusionRequestsTable } from '@/features/solicitacoes/InclusionRequestsTable'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

afterEach(() => cleanup())

const noop = async () => ({ ok: true })

describe('solicitacoes smoke', () => {
  it('renderiza shell de solicitacoes', () => {
    render(
      <AdminPageShell title="Solicitacoes" description="2 solicitacao(oes) pendente(s)">
        <div>conteudo</div>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Solicitacoes' })).toBeInTheDocument()
  })

  it('status badge reflete atendida', () => {
    const { rerender } = render(<RequestStatusBadge atendida={null} />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    rerender(<RequestStatusBadge atendida />)
    expect(screen.getByText('Aprovada')).toBeInTheDocument()
    rerender(<RequestStatusBadge atendida={false} />)
    expect(screen.getByText('Rejeitada')).toBeInTheDocument()
  })
})

describe('RegistrationRequestsTable', () => {
  it('lista cadastros', () => {
    render(
      <RegistrationRequestsTable
        canManage
        approveAction={noop}
        rejectAction={noop}
        onReview={() => {}}
        data={[
          {
            id: 'r1',
            requestNome: 'Ana',
            profileNome: 'Ana Souza',
            foto: null,
            areaNome: 'Vendas',
            funcaoNome: 'Consultor',
            concessionariaNome: 'Matriz',
            atendida: null,
            created_at: '2026-06-26T00:00:00Z',
            userId: 'u1',
          },
        ]}
      />,
    )
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByText('Vendas')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('estado vazio de cadastro', () => {
    render(<RegistrationRequestsTable canManage data={[]} approveAction={noop} rejectAction={noop} onReview={() => {}} />)
    expect(screen.getByText('Nenhuma solicitacao de cadastro')).toBeInTheDocument()
  })
})

describe('InclusionRequestsTable', () => {
  it('estado vazio de inclusao', () => {
    render(<InclusionRequestsTable canManage data={[]} approveAction={noop} rejectAction={noop} onReview={() => {}} />)
    expect(screen.getByText('Nenhuma solicitacao de inclusao')).toBeInTheDocument()
  })
})
