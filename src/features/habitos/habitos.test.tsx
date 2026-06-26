import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { HabitoStatusBadge } from '@/features/habitos/HabitoStatusBadge'
import { HabitosSummaryCards } from '@/features/habitos/HabitosSummaryCards'

describe('habitos UI smoke', () => {
  it('renders status badge', () => {
    render(<HabitoStatusBadge status="pendente" />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('renders summary cards', () => {
    render(<HabitosSummaryCards summary={{ total: 10, pendentes: 5, concluidos: 3, atrasados: 2 }} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Atrasados')).toBeInTheDocument()
  })
})
