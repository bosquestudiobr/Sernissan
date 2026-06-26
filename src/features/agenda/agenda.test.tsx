import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { AgendaStatusBadge } from '@/features/agenda/AgendaStatusBadge'
import { AgendaSummaryCards } from '@/features/agenda/AgendaSummaryCards'

describe('agenda UI smoke', () => {
  it('renders status badge', () => {
    render(<AgendaStatusBadge status="pendente" />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('renders summary cards', () => {
    render(<AgendaSummaryCards summary={{ hoje: 2, pendentes: 5, concluidos: 3, atrasados: 1 }} />)
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Atrasados')).toBeInTheDocument()
  })
})
