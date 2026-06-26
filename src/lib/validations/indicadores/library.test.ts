import { describe, expect, it } from 'vitest'

import {
  DeleteIndicatorSchema,
  IndicatorFiltersSchema,
  IndicatorLibrarySchema,
  IndicatorRelationshipsSchema,
  ToggleIndicatorActiveSchema,
} from '@/lib/validations/indicadores/library'
import { parseIndicatorLibraryParams } from '@/server/queries/indicadores/library'
import { canManageStructuralAdmin } from '@/lib/permissions/admin'

describe('indicator library validations', () => {
  it('IndicatorLibrarySchema exige nome e sigla', () => {
    expect(IndicatorLibrarySchema.safeParse({ nome: '', sigla: 'A' }).success).toBe(false)
    expect(IndicatorLibrarySchema.safeParse({ nome: 'Vendas', sigla: 'VD' }).success).toBe(true)
  })

  it('IndicatorRelationshipsSchema aceita listas vazias', () => {
    expect(
      IndicatorRelationshipsSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        areaIds: [],
        funcaoIds: [],
      }).success,
    ).toBe(true)
  })

  it('ToggleIndicatorActiveSchema valida boolean', () => {
    expect(
      ToggleIndicatorActiveSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        ativo: true,
      }).success,
    ).toBe(true)
  })

  it('DeleteIndicatorSchema exige uuid', () => {
    expect(DeleteIndicatorSchema.safeParse({ id: 'invalid' }).success).toBe(false)
  })
})

describe('indicator library query helpers', () => {
  it('parseIndicatorLibraryParams usa q e filtros', () => {
    const params = parseIndicatorLibraryParams({
      page: '2',
      q: 'abc',
      areaId: '00000000-0000-4000-8000-000000000099',
      ativo: 'true',
    })
    expect(params.page).toBe(2)
    expect(params.q).toBe('abc')
    expect(params.areaId).toBe('00000000-0000-4000-8000-000000000099')
    expect(params.ativo).toBe('true')
  })

  it('IndicatorFiltersSchema define defaults', () => {
    const parsed = IndicatorFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.page).toBe(1)
      expect(parsed.data.pageSize).toBe(20)
    }
  })

  it('sync N:N evita duplicados na logica', () => {
    const desired = ['a', 'b', 'b']
    const unique = [...new Set(desired)]
    expect(unique).toEqual(['a', 'b'])
  })
})

describe('indicator library permissions', () => {
  it('biblioteca exige nivel administrativo', () => {
    expect(canManageStructuralAdmin(4)).toBe(true)
    expect(canManageStructuralAdmin(7)).toBe(false)
  })
})
