import { afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VisitaStatusBadge } from '@/features/visitas/VisitaStatusBadge'
import { PublicRvExpiredState } from '@/features/visitas/public/PublicRvExpiredState'
import { PublicRvSignedState } from '@/features/visitas/public/PublicRvSignedState'
import { PublicRvViewComponent } from '@/features/visitas/public/PublicRvView'
import type { PublicRvView } from '@/server/queries/visitas/public'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

afterEach(() => cleanup())

const noop = async () => ({ ok: false })

describe('VisitaStatusBadge', () => {
  it('mostra rotulos por status', () => {
    const { rerender } = render(<VisitaStatusBadge status="assinada" />)
    expect(screen.getByText('Assinada')).toBeInTheDocument()
    rerender(<VisitaStatusBadge status="expirada" />)
    expect(screen.getByText('Expirada')).toBeInTheDocument()
  })
})

describe('PublicRvView token states', () => {
  it('link invalido/expirado mostra estado expirado', () => {
    const data: PublicRvView = { found: false, expired: true, signed: false, visita: null }
    render(<PublicRvViewComponent token="t" data={data} signAction={noop} />)
    expect(screen.getByText('Link expirado')).toBeInTheDocument()
  })

  it('ja assinado mostra estado assinado', () => {
    const data: PublicRvView = { found: true, expired: false, signed: true, visita: null }
    render(<PublicRvViewComponent token="t" data={data} signAction={noop} />)
    expect(screen.getByText('Visita ja assinada')).toBeInTheDocument()
  })

  it('valido nao assinado mostra resumo e formulario', () => {
    const data: PublicRvView = {
      found: true,
      expired: false,
      signed: false,
      visita: {
        dataVisita: '2026-06-26',
        dealerNome: 'Matriz',
        consultorNome: 'Ana',
        modalidadeNome: 'Presencial',
        focoNome: null,
        relato: 'Tudo certo',
        pontosDestaque: null,
        participantes: [{ nome: 'Cliente', cargo: 'Gerente' }],
        proximosPassos: [{ acao: 'Retornar', responsavel: 'Ana', prazo: null }],
      },
    }
    render(<PublicRvViewComponent token="t" data={data} signAction={noop} />)
    expect(screen.getByText('Matriz')).toBeInTheDocument()
    expect(screen.getByText('Assinatura')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
  })
})

describe('public states', () => {
  it('expired e signed renderizam', () => {
    const { rerender } = render(<PublicRvExpiredState />)
    expect(screen.getByText('Link expirado')).toBeInTheDocument()
    rerender(<PublicRvSignedState />)
    expect(screen.getByText('Visita ja assinada')).toBeInTheDocument()
  })
})
