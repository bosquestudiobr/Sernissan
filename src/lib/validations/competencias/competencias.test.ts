import { describe, expect, it } from 'vitest'

import {
  CompetencyFiltersSchema,
  CompetencyHabitCreateSchema,
  CompetencyMapCreateSchema,
  CompetencyMapHabitsSchema,
  DeleteCompetencySchema,
} from '@/lib/validations/competencias'
import { parseCompetencyParams } from '@/server/queries/competencias'
import { canAccessCompetencias, canManageCompetencias } from '@/lib/permissions/competencias'
import { parseIdList } from '@/lib/server/sync-relationships'

describe('competencias validations', () => {
  it('CompetencyMapCreateSchema exige versao', () => {
    expect(CompetencyMapCreateSchema.safeParse({ versao: '' }).success).toBe(false)
    expect(CompetencyMapCreateSchema.safeParse({ versao: '2026.1' }).success).toBe(true)
  })

  it('CompetencyHabitCreateSchema exige pergunta e coage numeros', () => {
    expect(CompetencyHabitCreateSchema.safeParse({ pergunta: '' }).success).toBe(false)
    const parsed = CompetencyHabitCreateSchema.safeParse({ pergunta: 'Atende?', peso: '2', trilha: '1', essencial: 'on' })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.peso).toBe(2)
      expect(parsed.data.trilha).toBe(1)
      expect(parsed.data.essencial).toBe(true)
    }
  })

  it('CompetencyMapHabitsSchema aceita lista vazia', () => {
    expect(
      CompetencyMapHabitsSchema.safeParse({ id: '00000000-0000-4000-8000-000000000001', habitoIds: [] }).success,
    ).toBe(true)
  })

  it('DeleteCompetencySchema valida uuid', () => {
    expect(DeleteCompetencySchema.safeParse({ id: 'x' }).success).toBe(false)
  })
})

describe('competencias query params', () => {
  it('parseCompetencyParams default tab mapas', () => {
    const params = parseCompetencyParams({})
    expect(params.tab).toBe('mapas')
    expect(params.page).toBe(1)
  })

  it('parseCompetencyParams aplica tab e filtros', () => {
    const params = parseCompetencyParams({
      tab: 'habitos',
      page: '3',
      q: 'foco',
      areaId: '00000000-0000-4000-8000-000000000099',
    })
    expect(params.tab).toBe('habitos')
    expect(params.page).toBe(3)
    expect(params.q).toBe('foco')
    expect(params.areaId).toBe('00000000-0000-4000-8000-000000000099')
  })

  it('CompetencyFiltersSchema define defaults', () => {
    const parsed = CompetencyFiltersSchema.safeParse({})
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.page).toBe(1)
      expect(parsed.data.pageSize).toBe(20)
    }
  })

  it('sync de habitos evita duplicados', () => {
    expect(parseIdList('a,b,b,c')).toEqual(['a', 'b', 'c'])
  })
})

describe('competencias permissions', () => {
  it('acesso liberado ate nivel 7; gestao restrita a admin', () => {
    expect(canAccessCompetencias(7)).toBe(true)
    expect(canAccessCompetencias(1)).toBe(true)
    expect(canManageCompetencias(4)).toBe(true)
    expect(canManageCompetencias(5)).toBe(false)
  })
})
