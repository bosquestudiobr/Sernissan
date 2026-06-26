import { describe, expect, it } from 'vitest'

import {
  buildCalibrationValidationAlerts,
  computeCalibrationPerformance,
  type CalibrationResultRow,
} from '@/lib/competencias/calibration-performance'

describe('computeCalibrationPerformance', () => {
  const rows: CalibrationResultRow[] = [
    {
      opcao_colaborador: 'sim',
      opcao_lider: 'parcial',
      opcao_follow_up: null,
      pontos_autocalibracao: 1,
      pontos_lider: 0.3,
      pontos_follow_up: null,
    },
    {
      opcao_colaborador: 'n_o',
      opcao_lider: null,
      opcao_follow_up: 'sim',
      pontos_autocalibracao: 0,
      pontos_lider: null,
      pontos_follow_up: 1,
    },
  ]

  it('conta respostas e pontos por etapa', () => {
    const perf = computeCalibrationPerformance(rows, 2)
    expect(perf.perStage.autocalibracao).toMatchObject({ sim: 1, nao: 1, answered: 2, points: 1, percent: 100 })
    expect(perf.perStage.lider).toMatchObject({ parcial: 1, answered: 1, points: 0.3, percent: 50 })
    expect(perf.perStage.follow_up).toMatchObject({ sim: 1, answered: 1, points: 1, percent: 50 })
  })

  it('calcula conclusao geral', () => {
    const perf = computeCalibrationPerformance(rows, 2)
    expect(perf.totalCells).toBe(6)
    expect(perf.totalAnswered).toBe(4)
    expect(perf.percentComplete).toBe(66.67)
  })

  it('lida com matriz vazia', () => {
    const perf = computeCalibrationPerformance([], 0)
    expect(perf.percentComplete).toBe(0)
    expect(perf.perStage.lider.answered).toBe(0)
  })
})

describe('buildCalibrationValidationAlerts', () => {
  const emptyPerf = computeCalibrationPerformance([], 0)

  it('alerta quando nao ha mapas', () => {
    const alerts = buildCalibrationValidationAlerts({ hasMaps: false, totalHabitos: 0, performance: emptyPerf, finalizada: false })
    expect(alerts).toHaveLength(1)
    expect(alerts[0].level).toBe('warning')
  })

  it('alerta quando mapas sem habitos', () => {
    const alerts = buildCalibrationValidationAlerts({ hasMaps: true, totalHabitos: 0, performance: emptyPerf, finalizada: false })
    expect(alerts[0].message).toMatch(/nao possuem habitos/)
  })

  it('inclui aviso de finalizada e etapas nao iniciadas', () => {
    const perf = computeCalibrationPerformance([], 3)
    const alerts = buildCalibrationValidationAlerts({ hasMaps: true, totalHabitos: 3, performance: perf, finalizada: true })
    const messages = alerts.map((a) => a.message)
    expect(messages.some((m) => m.includes('finalizada'))).toBe(true)
    expect(messages.some((m) => m.includes('Autocalibracao'))).toBe(true)
  })
})
