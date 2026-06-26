import { CALIBRATION_STAGES } from '@/lib/validations/competencias'

export type CalibrationStage = (typeof CALIBRATION_STAGES)[number]

export const STAGE_FIELDS: Record<
  CalibrationStage,
  { opcao: 'opcao_colaborador' | 'opcao_lider' | 'opcao_follow_up'; pontos: 'pontos_autocalibracao' | 'pontos_lider' | 'pontos_follow_up'; label: string }
> = {
  autocalibracao: { opcao: 'opcao_colaborador', pontos: 'pontos_autocalibracao', label: 'Autocalibracao' },
  lider: { opcao: 'opcao_lider', pontos: 'pontos_lider', label: 'Lider' },
  follow_up: { opcao: 'opcao_follow_up', pontos: 'pontos_follow_up', label: 'Follow-up' },
}

export type CalibrationResultRow = {
  opcao_colaborador?: string | null
  opcao_lider?: string | null
  opcao_follow_up?: string | null
  pontos_autocalibracao?: number | null
  pontos_lider?: number | null
  pontos_follow_up?: number | null
}

export type StagePerformance = {
  sim: number
  parcial: number
  nao: number
  answered: number
  points: number
  percent: number
}

export type CalibrationPerformance = {
  perStage: Record<CalibrationStage, StagePerformance>
  totalHabitos: number
  totalAnswered: number
  totalCells: number
  percentComplete: number
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function computeCalibrationPerformance(
  rows: CalibrationResultRow[],
  totalHabitos: number,
): CalibrationPerformance {
  const perStage = {} as Record<CalibrationStage, StagePerformance>

  for (const stage of CALIBRATION_STAGES) {
    const fields = STAGE_FIELDS[stage]
    let sim = 0
    let parcial = 0
    let nao = 0
    let points = 0
    for (const row of rows) {
      const opcao = row[fields.opcao]
      const pontos = row[fields.pontos]
      if (opcao === 'sim') sim += 1
      else if (opcao === 'parcial') parcial += 1
      else if (opcao === 'n_o') nao += 1
      if (typeof pontos === 'number') points += pontos
    }
    const answered = sim + parcial + nao
    perStage[stage] = {
      sim,
      parcial,
      nao,
      answered,
      points: round2(points),
      percent: totalHabitos > 0 ? round2((answered / totalHabitos) * 100) : 0,
    }
  }

  const totalCells = totalHabitos * CALIBRATION_STAGES.length
  const totalAnswered = CALIBRATION_STAGES.reduce((acc, s) => acc + perStage[s].answered, 0)

  return {
    perStage,
    totalHabitos,
    totalAnswered,
    totalCells,
    percentComplete: totalCells > 0 ? round2((totalAnswered / totalCells) * 100) : 0,
  }
}

export type CalibrationAlert = { level: 'info' | 'warning'; message: string }

export function buildCalibrationValidationAlerts(params: {
  hasMaps: boolean
  totalHabitos: number
  performance: CalibrationPerformance
  finalizada: boolean
}): CalibrationAlert[] {
  const alerts: CalibrationAlert[] = []
  if (!params.hasMaps) {
    alerts.push({ level: 'warning', message: 'Nenhum mapa de competencia vinculado a funcao deste colaborador.' })
    return alerts
  }
  if (params.totalHabitos === 0) {
    alerts.push({ level: 'warning', message: 'Os mapas deste colaborador nao possuem habitos vinculados.' })
    return alerts
  }
  if (params.finalizada) {
    alerts.push({ level: 'info', message: 'Calibracao finalizada: edicao bloqueada.' })
  }
  if (params.performance.percentComplete < 100) {
    const auto = params.performance.perStage.autocalibracao
    const lider = params.performance.perStage.lider
    if (auto.answered === 0) alerts.push({ level: 'info', message: 'Autocalibracao ainda nao iniciada.' })
    if (lider.answered === 0) alerts.push({ level: 'info', message: 'Avaliacao do lider ainda nao iniciada.' })
  }
  return alerts
}
