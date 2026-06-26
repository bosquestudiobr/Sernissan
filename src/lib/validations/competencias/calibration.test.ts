import { describe, expect, it } from 'vitest'

import {
  CalibrationCellSchema,
  CalibrationMatrixParamsSchema,
  CalibrationMatrixSaveSchema,
  CalibrationResetCellSchema,
  CalibrationResponseSchema,
  CalibrationStageSchema,
  CalibrationStatusSchema,
} from '@/lib/validations/competencias'
import { canEditCalibration } from '@/lib/permissions/competencias'

const UUID = '00000000-0000-4000-8000-000000000001'
const UUID2 = '00000000-0000-4000-8000-000000000002'

describe('calibration validations', () => {
  it('CalibrationStageSchema e CalibrationResponseSchema validam valores', () => {
    expect(CalibrationStageSchema.safeParse('lider').success).toBe(true)
    expect(CalibrationStageSchema.safeParse('x').success).toBe(false)
    expect(CalibrationResponseSchema.safeParse('parcial').success).toBe(true)
    expect(CalibrationResponseSchema.safeParse('talvez').success).toBe(false)
  })

  it('CalibrationCellSchema exige campos validos', () => {
    expect(
      CalibrationCellSchema.safeParse({ profileId: UUID, habitoId: UUID2, stage: 'lider', opcao: 'sim' }).success,
    ).toBe(true)
    expect(
      CalibrationCellSchema.safeParse({ profileId: 'x', habitoId: UUID2, stage: 'lider', opcao: 'sim' }).success,
    ).toBe(false)
  })

  it('CalibrationMatrixSaveSchema aceita opcao nula (limpar) e exige ao menos 1 celula', () => {
    expect(
      CalibrationMatrixSaveSchema.safeParse({
        profileId: UUID,
        cells: [{ habitoId: UUID2, stage: 'autocalibracao', opcao: null }],
      }).success,
    ).toBe(true)
    expect(CalibrationMatrixSaveSchema.safeParse({ profileId: UUID, cells: [] }).success).toBe(false)
  })

  it('CalibrationResetCellSchema valida', () => {
    expect(
      CalibrationResetCellSchema.safeParse({ profileId: UUID, habitoId: UUID2, stage: 'follow_up' }).success,
    ).toBe(true)
  })

  it('CalibrationMatrixParamsSchema aceita stage opcional', () => {
    expect(CalibrationMatrixParamsSchema.safeParse({}).success).toBe(true)
    expect(CalibrationMatrixParamsSchema.safeParse({ stage: 'lider' }).success).toBe(true)
  })

  it('CalibrationStatusSchema reservado valida enum', () => {
    expect(CalibrationStatusSchema.safeParse({ profileId: UUID, status: 'aberta' }).success).toBe(true)
    expect(CalibrationStatusSchema.safeParse({ profileId: UUID, status: 'x' }).success).toBe(false)
  })
})

describe('calibration permissions', () => {
  it('edicao ate nivel 6', () => {
    expect(canEditCalibration(6)).toBe(true)
    expect(canEditCalibration(7)).toBe(false)
  })
})
