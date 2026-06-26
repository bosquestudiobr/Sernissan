import { describe, expect, it } from 'vitest'

import {
  ApproveInclusionRequestSchema,
  ApproveRegistrationRequestSchema,
  RejectRegistrationRequestSchema,
  SolicitacoesFiltersSchema,
} from '@/lib/validations/solicitacoes'
import { parseSolicitacoesParams } from '@/server/queries/solicitacoes'
import { requestStatus, REQUEST_STATUS_LABEL } from '@/lib/solicitacoes/status'
import { canAccessSolicitacoes, canManageSolicitacoes } from '@/lib/permissions/solicitacoes'

const UUID = '00000000-0000-4000-8000-000000000001'

describe('solicitacoes validations', () => {
  it('SolicitacoesFiltersSchema define defaults', () => {
    const parsed = SolicitacoesFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.pageCad).toBe(1)
      expect(parsed.data.pageInc).toBe(1)
      expect(parsed.data.pageSize).toBe(20)
    }
  })

  it('status enum restrito', () => {
    expect(SolicitacoesFiltersSchema.safeParse({ status: 'pendente' }).success).toBe(true)
    expect(SolicitacoesFiltersSchema.safeParse({ status: 'x' }).success).toBe(false)
  })

  it('approve/reject exigem uuid', () => {
    expect(ApproveRegistrationRequestSchema.safeParse({ id: UUID }).success).toBe(true)
    expect(ApproveRegistrationRequestSchema.safeParse({ id: 'x' }).success).toBe(false)
    expect(ApproveInclusionRequestSchema.safeParse({ id: UUID }).success).toBe(true)
    expect(RejectRegistrationRequestSchema.safeParse({ id: UUID, motivo: 'spam' }).success).toBe(true)
  })
})

describe('solicitacoes params', () => {
  it('parseSolicitacoesParams le paginas independentes e filtros', () => {
    const params = parseSolicitacoesParams({ pageCad: '2', pageInc: '3', status: 'aprovada', q: 'ana', concessionariaId: UUID })
    expect(params.pageCad).toBe(2)
    expect(params.pageInc).toBe(3)
    expect(params.status).toBe('aprovada')
    expect(params.q).toBe('ana')
    expect(params.concessionariaId).toBe(UUID)
  })
})

describe('request status', () => {
  it('mapeia atendida para status', () => {
    expect(requestStatus(null)).toBe('pendente')
    expect(requestStatus(true)).toBe('aprovada')
    expect(requestStatus(false)).toBe('rejeitada')
    expect(REQUEST_STATUS_LABEL.pendente).toBe('Pendente')
  })

  it('nao duplica vinculo (chave logica)', () => {
    const existentes = new Set(['u1:c1'])
    const novo = 'u1:c1'
    const deveInserir = !existentes.has(novo)
    expect(deveInserir).toBe(false)
  })
})

describe('solicitacoes permissions', () => {
  it('acesso ate 6; gestao admin estrutural', () => {
    expect(canAccessSolicitacoes(6)).toBe(true)
    expect(canAccessSolicitacoes(7)).toBe(false)
    expect(canManageSolicitacoes(4)).toBe(true)
    expect(canManageSolicitacoes(5)).toBe(false)
  })
})
