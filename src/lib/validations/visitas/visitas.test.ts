import { describe, expect, it } from 'vitest'

import {
  GeneratePublicLinkSchema,
  ParticipanteSchema,
  ProximoPassoSchema,
  PublicRvSignatureSchema,
  PublicRvTokenSchema,
  VisitaCreateSchema,
  VisitasFiltersSchema,
} from '@/lib/validations/visitas'
import { parseVisitasParams } from '@/server/queries/visitas'
import { canAccessVisitas, canDeleteVisita, canManageVisitas } from '@/lib/permissions/visitas'

const UUID = '00000000-0000-4000-8000-000000000001'

describe('visitas validations', () => {
  it('VisitaCreateSchema exige data e dealer', () => {
    expect(VisitaCreateSchema.safeParse({ data_visita: '', dealer: UUID }).success).toBe(false)
    expect(VisitaCreateSchema.safeParse({ data_visita: '2026-06-26T10:00', dealer: UUID }).success).toBe(true)
  })

  it('ParticipanteSchema e ProximoPassoSchema exigem campos', () => {
    expect(ParticipanteSchema.safeParse({ rv: UUID, nome: '' }).success).toBe(false)
    expect(ParticipanteSchema.safeParse({ rv: UUID, nome: 'Ana' }).success).toBe(true)
    expect(ProximoPassoSchema.safeParse({ rv: UUID, acao: 'Fazer' }).success).toBe(true)
  })

  it('GeneratePublicLinkSchema default 7 dias e limites', () => {
    const parsed = GeneratePublicLinkSchema.safeParse({ id: UUID })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.diasValidade).toBe(7)
    expect(GeneratePublicLinkSchema.safeParse({ id: UUID, diasValidade: 999 }).success).toBe(false)
  })

  it('PublicRvTokenSchema e PublicRvSignatureSchema validam', () => {
    expect(PublicRvTokenSchema.safeParse({ token: 'short' }).success).toBe(false)
    expect(PublicRvTokenSchema.safeParse({ token: 'x'.repeat(40) }).success).toBe(true)
    expect(PublicRvSignatureSchema.safeParse({ token: 'x'.repeat(40), assinanteNome: '' }).success).toBe(false)
    expect(PublicRvSignatureSchema.safeParse({ token: 'x'.repeat(40), assinanteNome: 'Ana' }).success).toBe(true)
  })

  it('VisitasFiltersSchema defaults', () => {
    const parsed = VisitasFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.page).toBe(1)
      expect(parsed.data.pageSize).toBe(20)
    }
  })
})

describe('visitas params', () => {
  it('parseVisitasParams le filtros', () => {
    const params = parseVisitasParams({ page: '2', status: 'assinada', concessionariaId: UUID, q: 'x' })
    expect(params.page).toBe(2)
    expect(params.status).toBe('assinada')
    expect(params.concessionariaId).toBe(UUID)
    expect(params.q).toBe('x')
  })
})

describe('visitas permissions', () => {
  it('acesso ate 6; exclusao admin estrutural', () => {
    expect(canAccessVisitas(6)).toBe(true)
    expect(canAccessVisitas(7)).toBe(false)
    expect(canManageVisitas(6)).toBe(true)
    expect(canDeleteVisita(4)).toBe(true)
    expect(canDeleteVisita(5)).toBe(false)
  })
})
