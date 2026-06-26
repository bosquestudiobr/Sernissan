import { afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

afterEach(() => cleanup())

import { responseColorClass, responseShortLabel } from '@/features/competencias/calibration-colors'
import { CalibrationLegend } from '@/features/competencias/CalibrationLegend'
import { CalibrationStatusBadge } from '@/features/competencias/CalibrationStatusBadge'
import { CalibrationMatrixTable } from '@/features/competencias/CalibrationMatrixTable'
import type { CalibrationMatrixGroup, CalibrationStageInfo } from '@/server/queries/competencias/calibration'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

const STAGES: CalibrationStageInfo[] = [
  { key: 'autocalibracao', label: 'Autocalibracao' },
  { key: 'lider', label: 'Lider' },
  { key: 'follow_up', label: 'Follow-up' },
]

const OPTIONS = [
  { value: 'sim', label: 'Sim' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'n_o', label: 'Nao' },
]

describe('calibration colors', () => {
  it('mapeia resposta para cor semantica', () => {
    expect(responseColorClass('sim')).toContain('sn-green-soft')
    expect(responseColorClass('parcial')).toContain('sn-yellow-soft')
    expect(responseColorClass('n_o')).toContain('sn-red-soft')
    expect(responseColorClass(null)).toContain('sn-field')
  })

  it('rotula respostas', () => {
    expect(responseShortLabel('sim')).toBe('Sim')
    expect(responseShortLabel(null)).toBe('—')
  })
})

describe('CalibrationLegend', () => {
  it('renderiza legenda de cores', () => {
    render(<CalibrationLegend />)
    expect(screen.getByText('Legenda:')).toBeInTheDocument()
    expect(screen.getByText('Parcial')).toBeInTheDocument()
    expect(screen.getByText('Nao avaliado')).toBeInTheDocument()
  })
})

describe('CalibrationStatusBadge', () => {
  it('mostra nao iniciada quando sem calibracao', () => {
    render(<CalibrationStatusBadge hasCalibration={false} lastUpdated={null} />)
    expect(screen.getByText('Nao iniciada')).toBeInTheDocument()
  })
  it('mostra em andamento quando ha atualizacao', () => {
    render(<CalibrationStatusBadge hasCalibration lastUpdated="2026-06-26T00:00:00Z" />)
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })
})

describe('CalibrationMatrixTable', () => {
  const groups: CalibrationMatrixGroup[] = [
    {
      mapaId: 'm1',
      mapaLabel: 'Mapa 2026.1',
      rows: [
        {
          habitoId: 'h1',
          pergunta: 'Atende o cliente?',
          descricao: 'Descricao do habito',
          mv: 'MV1',
          peso: 1,
          trilha: 1,
          responses: { autocalibracao: 'sim', lider: null, follow_up: 'n_o' },
        },
      ],
    },
  ]

  it('monta matriz com grupo, habito e etapas', () => {
    render(
      <CalibrationMatrixTable
        groups={groups}
        stages={STAGES}
        options={OPTIONS}
        canEdit
        getValue={(habitoId, stage) => groups[0].rows[0].responses[stage]}
        onChange={() => {}}
      />,
    )
    expect(screen.getByText('Mapa 2026.1')).toBeInTheDocument()
    expect(screen.getByText('Atende o cliente?')).toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(3)
  })

  it('mostra estado vazio sem habitos', () => {
    render(
      <CalibrationMatrixTable
        groups={[]}
        stages={STAGES}
        options={OPTIONS}
        canEdit
        getValue={() => null}
        onChange={() => {}}
      />,
    )
    expect(screen.getByText('Sem habitos para calibrar')).toBeInTheDocument()
  })

  it('modo leitura nao renderiza selects', () => {
    render(
      <CalibrationMatrixTable
        groups={groups}
        stages={STAGES}
        options={OPTIONS}
        canEdit={false}
        getValue={(habitoId, stage) => groups[0].rows[0].responses[stage]}
        onChange={() => {}}
      />,
    )
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.getByText('Sim')).toBeInTheDocument()
  })
})

