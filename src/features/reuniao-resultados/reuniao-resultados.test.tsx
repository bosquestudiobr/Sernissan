import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ReuniaoParticipantsPanel } from '@/features/reuniao-resultados/ReuniaoParticipantsPanel'
import { ReuniaoStatusBadge } from '@/features/reuniao-resultados/ReuniaoStatusBadge'

describe('reuniao-resultados UI smoke', () => {
  it('renders status badge', () => {
    render(<ReuniaoStatusBadge status="em_andamento" />)
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('renders participants empty state message', () => {
    render(<ReuniaoParticipantsPanel />)
    expect(screen.getByText(/nao possui tabela formal de participantes/i)).toBeInTheDocument()
  })
})
