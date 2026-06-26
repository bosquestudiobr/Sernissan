import { describe, expect, it } from 'vitest'

import {
  canAccessHabitos,
  canDeleteHabito,
  canManageHabitos,
  canReopenHabito,
} from '@/lib/permissions/habitos'
import { computeHabitoProgress, deriveHabitoStatus, isHabitoLocked } from '@/lib/habitos/status'
import {
  HabitoCreateSchema,
  HabitoDateRangeSchema,
  HabitosFiltersSchema,
  HabitoProgressSchema,
} from '@/lib/validations/habitos'
import { parseHabitosParams } from '@/server/queries/habitos'

describe('habitos validations', () => {
  it('parses filters with defaults', () => {
    const parsed = HabitosFiltersSchema.parse({})
    expect(parsed.page).toBe(1)
    expect(parsed.pageSize).toBe(20)
  })

  it('rejects end before start', () => {
    const parsed = HabitoDateRangeSchema.safeParse({
      data_inicio: '2024-06-10T10:00',
      data_fim: '2024-06-09T10:00',
    })
    expect(parsed.success).toBe(false)
  })

  it('accepts valid create payload', () => {
    const parsed = HabitoCreateSchema.safeParse({
      titulo: 'Follow-up diario',
      concessionaria: '00000000-0000-4000-8000-000000000001',
    })
    expect(parsed.success).toBe(true)
  })

  it('accepts progress update', () => {
    const parsed = HabitoProgressSchema.safeParse({
      id: '00000000-0000-4000-8000-000000000099',
      execucoesRealizadas: 3,
    })
    expect(parsed.success).toBe(true)
  })
})

describe('habitos query params', () => {
  it('parseHabitosParams maps search params', () => {
    const params = parseHabitosParams({
      page: '2',
      status: 'atrasado',
      areaId: '00000000-0000-4000-8000-000000000010',
      q: 'teste',
    })
    expect(params.page).toBe(2)
    expect(params.status).toBe('atrasado')
    expect(params.areaId).toBe('00000000-0000-4000-8000-000000000010')
    expect(params.q).toBe('teste')
  })
})

describe('habitos permissions', () => {
  it('allows access up to nivel 6', () => {
    expect(canAccessHabitos(6)).toBe(true)
    expect(canAccessHabitos(7)).toBe(false)
  })

  it('allows manage up to nivel 6', () => {
    expect(canManageHabitos(6)).toBe(true)
    expect(canManageHabitos(7)).toBe(false)
  })

  it('restricts reopen/delete to structural admin', () => {
    expect(canReopenHabito(4)).toBe(true)
    expect(canReopenHabito(5)).toBe(false)
    expect(canDeleteHabito(4)).toBe(true)
  })
})

describe('habitos status', () => {
  it('derives concluido and inativo', () => {
    expect(deriveHabitoStatus({ ativo: true, concluido: true, dataFim: null })).toBe('concluido')
    expect(deriveHabitoStatus({ ativo: false, concluido: false, dataFim: null })).toBe('inativo')
  })

  it('derives atrasado from past end date', () => {
    const status = deriveHabitoStatus({
      ativo: true,
      concluido: false,
      dataFim: '2020-01-01T00:00:00Z',
      now: new Date('2024-01-01'),
    })
    expect(status).toBe('atrasado')
  })

  it('locks concluded items', () => {
    expect(isHabitoLocked({ concluido: true })).toBe(true)
    expect(isHabitoLocked({ concluido: false })).toBe(false)
  })

  it('computes progress', () => {
    expect(computeHabitoProgress(10, 5)).toEqual({ percent: 50, label: '5/10' })
    expect(computeHabitoProgress(null, 2).label).toBe('2 exec.')
  })
})
