import { describe, expect, it } from 'vitest'

import {
  CalibrationFinalizeSchema,
  CalibrationPerformanceParamsSchema,
  CalibrationReopenSchema,
  CalibrationValidationAlertSchema,
} from '@/lib/validations/competencias'
import { canEditCalibration, canManageCompetencias } from '@/lib/permissions/competencias'

const UUID = '00000000-0000-4000-8000-000000000001'

describe('calibration 7c validations', () => {
  it('finalize/reopen/performance exigem uuid', () => {
    expect(CalibrationFinalizeSchema.safeParse({ profileId: UUID }).success).toBe(true)
    expect(CalibrationFinalizeSchema.safeParse({ profileId: 'x' }).success).toBe(false)
    expect(CalibrationReopenSchema.safeParse({ profileId: UUID }).success).toBe(true)
    expect(CalibrationPerformanceParamsSchema.safeParse({ profileId: UUID }).success).toBe(true)
  })

  it('CalibrationValidationAlertSchema valida nivel', () => {
    expect(CalibrationValidationAlertSchema.safeParse({ level: 'warning', message: 'x' }).success).toBe(true)
    expect(CalibrationValidationAlertSchema.safeParse({ level: 'critico', message: 'x' }).success).toBe(false)
  })

  it('reabertura restrita a admin estrutural; edicao ate nivel 6', () => {
    expect(canEditCalibration(6)).toBe(true)
    expect(canManageCompetencias(4)).toBe(true)
    expect(canManageCompetencias(6)).toBe(false)
  })
})
