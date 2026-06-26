import { describe, expect, it } from 'vitest'

import {
  canAccessAgenda,
  canDeleteAgendaItem,
  canManageAgenda,
  canReopenAgendaItem,
} from '@/lib/permissions/agenda'
import { deriveAgendaStatus, eventOccursOnDay, isAgendaLocked } from '@/lib/agenda/status'
import {
  AgendaDateRangeSchema,
  AgendaFiltersSchema,
  AgendaItemCreateSchema,
} from '@/lib/validations/agenda'

describe('agenda validations', () => {
  it('parses filters with defaults', () => {
    const parsed = AgendaFiltersSchema.parse({})
    expect(parsed.page).toBe(1)
    expect(parsed.view).toBe('list')
  })

  it('rejects end before start', () => {
    const parsed = AgendaDateRangeSchema.safeParse({
      data_inicio: '2024-06-10T10:00',
      data_fim: '2024-06-09T10:00',
    })
    expect(parsed.success).toBe(false)
  })

  it('accepts valid create payload', () => {
    const parsed = AgendaItemCreateSchema.safeParse({
      titulo: 'Reuniao semanal',
      data_inicio: '2024-06-10T10:00',
      data_fim: '2024-06-10T11:00',
      concessionaria: '00000000-0000-4000-8000-000000000001',
    })
    expect(parsed.success).toBe(true)
  })
})

describe('agenda permissions', () => {
  it('allows access up to nivel 6', () => {
    expect(canAccessAgenda(6)).toBe(true)
    expect(canAccessAgenda(7)).toBe(false)
  })

  it('allows manage up to nivel 6', () => {
    expect(canManageAgenda(6)).toBe(true)
    expect(canManageAgenda(7)).toBe(false)
  })

  it('restricts reopen/delete to structural admin', () => {
    expect(canReopenAgendaItem(4)).toBe(true)
    expect(canReopenAgendaItem(5)).toBe(false)
    expect(canDeleteAgendaItem(4)).toBe(true)
  })
})

describe('agenda status', () => {
  it('derives cancelado and concluido', () => {
    expect(deriveAgendaStatus({ concluido: false, cancelado: true, dataFim: null })).toBe('cancelado')
    expect(deriveAgendaStatus({ concluido: true, cancelado: false, dataFim: null })).toBe('concluido')
  })

  it('derives atrasado from past end date', () => {
    const status = deriveAgendaStatus({
      concluido: false,
      cancelado: false,
      dataFim: '2020-01-01T00:00:00Z',
      now: new Date('2024-01-01'),
    })
    expect(status).toBe('atrasado')
  })

  it('locks concluded or cancelled items', () => {
    expect(isAgendaLocked({ concluido: true, cancelado: false })).toBe(true)
    expect(isAgendaLocked({ concluido: false, cancelado: false })).toBe(false)
  })

  it('detects event on day', () => {
    const day = new Date(2024, 5, 15)
    expect(eventOccursOnDay('2024-06-15T10:00:00', '2024-06-15T12:00:00', day)).toBe(true)
    expect(eventOccursOnDay('2024-06-16T10:00:00', null, day)).toBe(false)
  })
})
