import { describe, expect, it } from 'vitest'

import {
  IndicatorObjectiveFiltersSchema,
  IndicatorObjectiveUpdateSchema,
  IndicatorRequestSchema,
  ReviewIndicatorRequestSchema,
  ToggleIndicatorObjectiveActiveSchema,
} from '@/lib/validations/indicadores/objectives'
import { formatIndicatorRequestText, parseIndicatorRequestText } from '@/lib/indicadores/request-text'
import { parseIndicatorObjectivesParams } from '@/server/queries/indicadores/objectives'
import {
  canAccessIndicatorObjectives,
  canApproveIndicatorRequest,
  canRequestIndicator,
} from '@/lib/permissions/indicadores'

describe('indicator objectives validations', () => {
  it('IndicatorRequestSchema exige nome e sigla', () => {
    expect(IndicatorRequestSchema.safeParse({ nome: 'Teste', sigla: 'T' }).success).toBe(true)
    expect(IndicatorRequestSchema.safeParse({ nome: '', sigla: 'T' }).success).toBe(false)
  })

  it('IndicatorObjectiveUpdateSchema valida id', () => {
    expect(
      IndicatorObjectiveUpdateSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        meta: 10,
      }).success,
    ).toBe(true)
  })

  it('ReviewIndicatorRequestSchema aceita approve/reject', () => {
    expect(
      ReviewIndicatorRequestSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        action: 'approve',
      }).success,
    ).toBe(true)
  })
})

describe('indicator objectives helpers', () => {
  it('parseIndicatorObjectivesParams usa q', () => {
    const params = parseIndicatorObjectivesParams({ q: 'vendas', page: '2' })
    expect(params.q).toBe('vendas')
    expect(params.page).toBe(2)
  })

  it('request text roundtrip', () => {
    const text = formatIndicatorRequestText('VD', 'Justificativa', ['a'], ['f'])
    const parsed = parseIndicatorRequestText(text)
    expect(parsed.sigla).toBe('VD')
    expect(parsed.observacao).toBe('Justificativa')
    expect(parsed.areaIds).toEqual(['a'])
    expect(parsed.funcaoIds).toEqual(['f'])
  })

  it('IndicatorObjectiveFiltersSchema defaults', () => {
    const parsed = IndicatorObjectiveFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
  })

  it('ToggleIndicatorObjectiveActiveSchema', () => {
    expect(
      ToggleIndicatorObjectiveActiveSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        ativo: false,
      }).success,
    ).toBe(true)
  })
})

describe('indicator objectives permissions', () => {
  it('area_adm pode acessar e solicitar', () => {
    expect(canAccessIndicatorObjectives(6)).toBe(true)
    expect(canRequestIndicator(6)).toBe(true)
    expect(canApproveIndicatorRequest(6)).toBe(false)
  })

  it('colaborador nao acessa', () => {
    expect(canAccessIndicatorObjectives(7)).toBe(false)
  })

  it('admin pode aprovar', () => {
    expect(canApproveIndicatorRequest(4)).toBe(true)
  })
})
