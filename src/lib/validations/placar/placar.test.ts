import { describe, expect, it } from 'vitest'

import {
  DeletePlacarSchema,
  PlacarCreateSchema,
  PlacarFiltersSchema,
  PlacarIndicatorsSchema,
  PlacarUpdateSchema,
} from '@/lib/validations/placar'
import { parsePlacarParams } from '@/server/queries/placar'
import { canAccessPlacar, canManagePlacar } from '@/lib/permissions/placar'
import { parseIdList } from '@/lib/server/sync-relationships'

describe('placar validations', () => {
  it('PlacarCreateSchema exige data e concessionaria', () => {
    expect(
      PlacarCreateSchema.safeParse({
        data: '',
        concessionaria: '00000000-0000-4000-8000-000000000001',
      }).success,
    ).toBe(false)
    expect(
      PlacarCreateSchema.safeParse({
        data: '2026-06-25T10:00',
        concessionaria: '00000000-0000-4000-8000-000000000001',
      }).success,
    ).toBe(true)
  })

  it('PlacarUpdateSchema exige id', () => {
    expect(
      PlacarUpdateSchema.safeParse({
        id: 'invalid',
        data: '2026-06-25',
        concessionaria: '00000000-0000-4000-8000-000000000001',
      }).success,
    ).toBe(false)
  })

  it('PlacarIndicatorsSchema aceita lista vazia', () => {
    expect(
      PlacarIndicatorsSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        indicadorIds: [],
      }).success,
    ).toBe(true)
  })

  it('DeletePlacarSchema valida uuid', () => {
    expect(DeletePlacarSchema.safeParse({ id: 'x' }).success).toBe(false)
  })
})

describe('placar query helpers', () => {
  it('parsePlacarParams aplica filtros', () => {
    const params = parsePlacarParams({
      page: '2',
      concessionariaId: '00000000-0000-4000-8000-000000000099',
      finalizado: 'false',
      opcaoOrigem: 'colaborador',
    })
    expect(params.page).toBe(2)
    expect(params.concessionariaId).toBe('00000000-0000-4000-8000-000000000099')
    expect(params.finalizado).toBe('false')
    expect(params.opcaoOrigem).toBe('colaborador')
  })

  it('PlacarFiltersSchema define defaults', () => {
    const parsed = PlacarFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.page).toBe(1)
      expect(parsed.data.pageSize).toBe(20)
    }
  })

  it('sync indicadores evita duplicados', () => {
    const desired = parseIdList('a,b,b,c')
    expect(desired).toEqual(['a', 'b', 'c'])
  })
})

describe('placar permissions', () => {
  it('acesso ate nivel 6', () => {
    expect(canAccessPlacar(6)).toBe(true)
    expect(canAccessPlacar(7)).toBe(false)
    expect(canManagePlacar(6)).toBe(true)
  })
})

import {
  FinalizePlacarSchema,
  PlacarCalculationInputSchema,
  RankingParamsSchema,
  RecalculatePlacarSchema,
} from '@/lib/validations/placar'
import { canDeletePlacar } from '@/lib/permissions/placar'

describe('placar recalculo validations', () => {
  it('RecalculatePlacarSchema exige uuid', () => {
    expect(RecalculatePlacarSchema.safeParse({ id: 'x' }).success).toBe(false)
    expect(RecalculatePlacarSchema.safeParse({ id: '00000000-0000-4000-8000-000000000001' }).success).toBe(true)
  })

  it('FinalizePlacarSchema exige uuid', () => {
    expect(FinalizePlacarSchema.safeParse({ id: '00000000-0000-4000-8000-000000000001' }).success).toBe(true)
  })

  it('RankingParamsSchema aceita escopo opcional', () => {
    expect(
      RankingParamsSchema.safeParse({ placarId: '00000000-0000-4000-8000-000000000001' }).success,
    ).toBe(true)
    expect(
      RankingParamsSchema.safeParse({
        placarId: '00000000-0000-4000-8000-000000000001',
        escopo: 'colaborador',
      }).success,
    ).toBe(true)
    expect(
      RankingParamsSchema.safeParse({
        placarId: '00000000-0000-4000-8000-000000000001',
        escopo: 'invalido',
      }).success,
    ).toBe(false)
  })

  it('PlacarCalculationInputSchema coage numeros', () => {
    const parsed = PlacarCalculationInputSchema.safeParse({ meta: '100', valor: '50', peso: '10' })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.meta).toBe(100)
      expect(parsed.data.valor).toBe(50)
      expect(parsed.data.peso).toBe(10)
    }
  })

  it('permissao de exclusao respeita nivel', () => {
    expect(canDeletePlacar(6)).toBe(true)
    expect(canDeletePlacar(7)).toBe(false)
  })
})
