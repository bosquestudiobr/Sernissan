import { afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CalibrationProgressCards } from '@/features/competencias/CalibrationProgressCards'
import { CalibrationPerformanceSummary } from '@/features/competencias/CalibrationPerformanceSummary'
import { CalibrationReadOnlyBanner } from '@/features/competencias/CalibrationReadOnlyBanner'
import { CalibrationValidationAlerts } from '@/features/competencias/CalibrationValidationAlerts'
import { computeCalibrationPerformance } from '@/lib/competencias/calibration-performance'

afterEach(() => cleanup())

const perf = computeCalibrationPerformance(
  [
    {
      opcao_colaborador: 'sim',
      opcao_lider: 'parcial',
      opcao_follow_up: 'n_o',
      pontos_autocalibracao: 1,
      pontos_lider: 0.3,
      pontos_follow_up: 0,
    },
  ],
  1,
)

describe('CalibrationProgressCards', () => {
  it('mostra conclusao e contagens', () => {
    render(<CalibrationProgressCards performance={perf} />)
    expect(screen.getByText('Conclusao')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

describe('CalibrationPerformanceSummary', () => {
  it('renderiza linhas por etapa', () => {
    render(<CalibrationPerformanceSummary performance={perf} />)
    expect(screen.getByText('Autocalibracao')).toBeInTheDocument()
    expect(screen.getByText('Lider')).toBeInTheDocument()
    expect(screen.getByText('Follow-up')).toBeInTheDocument()
  })
})

describe('CalibrationReadOnlyBanner', () => {
  it('mensagem de finalizada', () => {
    render(<CalibrationReadOnlyBanner finalizada />)
    expect(screen.getByText(/finalizada/i)).toBeInTheDocument()
  })
  it('mensagem de somente leitura', () => {
    render(<CalibrationReadOnlyBanner finalizada={false} />)
    expect(screen.getByText(/somente leitura/i)).toBeInTheDocument()
  })
})

describe('CalibrationValidationAlerts', () => {
  it('renderiza alertas', () => {
    render(<CalibrationValidationAlerts alerts={[{ level: 'warning', message: 'Sem mapa' }]} />)
    expect(screen.getByText('Sem mapa')).toBeInTheDocument()
  })
  it('nada quando vazio', () => {
    const { container } = render(<CalibrationValidationAlerts alerts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
