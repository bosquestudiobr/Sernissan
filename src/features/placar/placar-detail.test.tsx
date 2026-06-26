import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PlacarSummaryCards } from '@/features/placar/PlacarSummaryCards'
import { PlacarCalculationStatus } from '@/features/placar/PlacarCalculationStatus'
import { PlacarRankingTable } from '@/features/placar/PlacarRankingTable'
import { PlacarAuditPanel } from '@/features/placar/PlacarAuditPanel'

describe('PlacarSummaryCards', () => {
  it('exibe contadores do resumo', () => {
    render(
      <PlacarSummaryCards
        summary={{
          placarId: 'p1',
          indicadorCount: 10,
          indicadoresComValor: 7,
          totalPontos: 42,
          colaboradorCount: 3,
          rankingAtualizado: true,
          finalizado: false,
        }}
      />,
    )
    expect(screen.getByText('Indicadores')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('3 sem valor')).toBeInTheDocument()
  })
})

describe('PlacarCalculationStatus', () => {
  it('mostra alerta quando ha indicadores sem valor', () => {
    render(
      <PlacarCalculationStatus
        status={{
          placarId: 'p1',
          rankingAtualizado: false,
          finalizado: false,
          updatedAt: null,
          indicadorCount: 5,
          indicadoresComValor: 2,
        }}
      />,
    )
    expect(screen.getByText(/3 indicador/)).toBeInTheDocument()
    expect(screen.getByText('Desatualizado')).toBeInTheDocument()
  })

  it('mostra alerta quando nao ha indicadores vinculados', () => {
    render(
      <PlacarCalculationStatus
        status={{
          placarId: 'p1',
          rankingAtualizado: false,
          finalizado: false,
          updatedAt: null,
          indicadorCount: 0,
          indicadoresComValor: 0,
        }}
      />,
    )
    expect(screen.getByText(/Nenhum indicador vinculado/)).toBeInTheDocument()
  })
})

describe('PlacarRankingTable', () => {
  it('renderiza linhas de ranking', () => {
    render(
      <PlacarRankingTable
        ranking={[
          { colaboradorId: 'a', colaboradorNome: 'Ana', pontosTotal: 8, posicao: 1 },
          { colaboradorId: 'b', colaboradorNome: 'Bruno', pontosTotal: 4, posicao: 2 },
        ]}
      />,
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('mostra estado vazio sem ranking', () => {
    render(<PlacarRankingTable ranking={[]} />)
    expect(screen.getByText('Sem ranking calculado')).toBeInTheDocument()
  })
})

describe('PlacarAuditPanel', () => {
  it('exibe registros de auditoria', () => {
    render(
      <PlacarAuditPanel
        logs={[
          {
            id: 'l1',
            action: 'recalculate_all',
            summary: {},
            createdAt: '2026-06-26T00:00:00.000Z',
            profileNome: 'QA Admin',
          },
        ]}
      />,
    )
    expect(screen.getByText('Recalculo completo')).toBeInTheDocument()
    expect(screen.getByText(/QA Admin/)).toBeInTheDocument()
  })

  it('mostra vazio sem registros', () => {
    render(<PlacarAuditPanel logs={[]} />)
    expect(screen.getByText(/Sem registros de recalculo/)).toBeInTheDocument()
  })
})
