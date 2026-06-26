import { describe, expect, it } from 'vitest'

import {
  canAccessReuniaoResultados,
  canDeleteReuniaoResultado,
  canFinalizeReuniaoResultado,
  canManageReuniaoResultados,
} from '@/lib/permissions/reuniao-resultados'
import { deriveXrReuniaoStatus } from '@/lib/xr/status'
import {
  ReuniaoAgendaItemSchema,
  ReuniaoNextStepSchema,
  ReuniaoResultadoCreateSchema,
  ReuniaoResultadosFiltersSchema,
} from '@/lib/validations/reuniao-resultados'

describe('reuniao-resultados validations', () => {
  it('parses filters with defaults', () => {
    const parsed = ReuniaoResultadosFiltersSchema.parse({})
    expect(parsed.page).toBe(1)
    expect(parsed.pageSize).toBe(20)
  })

  it('validates create schema', () => {
    const parsed = ReuniaoResultadoCreateSchema.safeParse({ data: '2024-06-01T10:00' })
    expect(parsed.success).toBe(true)
  })

  it('validates agenda item', () => {
    const parsed = ReuniaoAgendaItemSchema.safeParse({
      reuniaoId: '00000000-0000-4000-8000-000000000001',
      indicadorId: '00000000-0000-4000-8000-000000000002',
    })
    expect(parsed.success).toBe(true)
  })

  it('validates next step', () => {
    const parsed = ReuniaoNextStepSchema.safeParse({
      reuniaoId: '00000000-0000-4000-8000-000000000001',
      descricao: 'Acao teste',
    })
    expect(parsed.success).toBe(true)
  })
})

describe('reuniao-resultados permissions', () => {
  it('allows access up to nivel 6', () => {
    expect(canAccessReuniaoResultados(6)).toBe(true)
    expect(canAccessReuniaoResultados(7)).toBe(false)
  })

  it('allows manage up to nivel 6', () => {
    expect(canManageReuniaoResultados(6)).toBe(true)
    expect(canManageReuniaoResultados(7)).toBe(false)
  })

  it('restricts finalize/delete to structural admin', () => {
    expect(canFinalizeReuniaoResultado(4)).toBe(true)
    expect(canFinalizeReuniaoResultado(5)).toBe(false)
    expect(canDeleteReuniaoResultado(4)).toBe(true)
    expect(canDeleteReuniaoResultado(5)).toBe(false)
  })
})

describe('xr status', () => {
  it('derives finalizada', () => {
    expect(deriveXrReuniaoStatus({ finalizada: true, indicatorCount: 0, resultCount: 0 })).toBe('finalizada')
  })

  it('derives em_andamento', () => {
    expect(deriveXrReuniaoStatus({ finalizada: false, indicatorCount: 2, resultCount: 0 })).toBe('em_andamento')
  })

  it('derives rascunho', () => {
    expect(deriveXrReuniaoStatus({ finalizada: false, indicatorCount: 0, resultCount: 0 })).toBe('rascunho')
  })
})

describe('agenda dedup', () => {
  it('agenda schema rejects invalid uuid', () => {
    const parsed = ReuniaoAgendaItemSchema.safeParse({ reuniaoId: 'x', indicadorId: 'y' })
    expect(parsed.success).toBe(false)
  })
})
