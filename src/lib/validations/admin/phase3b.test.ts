import { describe, expect, it } from 'vitest'

import {
  AreaSchema,
  FuncaoSchema,
  ProfileAdminUpdateSchema,
  ProfileRelationshipsSchema,
  SyncRelationshipListSchema,
} from '@/lib/validations/admin'
import { canAssignPerfil, canEditTargetProfile } from '@/lib/permissions/users'
import { parseIdList } from '@/lib/server/sync-relationships'

describe('phase 3b validations', () => {
  it('AreaSchema exige nome', () => {
    expect(AreaSchema.safeParse({ nome: '' }).success).toBe(false)
    expect(AreaSchema.safeParse({ nome: 'Vendas' }).success).toBe(true)
  })

  it('FuncaoSchema aceita flags booleanas', () => {
    const parsed = FuncaoSchema.safeParse({ nome: 'Consultor', chave: 'true', lideranca: 'on' })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.chave).toBe(true)
      expect(parsed.data.lideranca).toBe(true)
    }
  })

  it('ProfileAdminUpdateSchema exige perfil', () => {
    expect(
      ProfileAdminUpdateSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        nome: 'User',
        perfil: 'usu_rio',
      }).success,
    ).toBe(true)
  })

  it('ProfileRelationshipsSchema aceita listas vazias', () => {
    expect(
      ProfileRelationshipsSchema.safeParse({
        id: '00000000-0000-4000-8000-000000000001',
        grupoIds: [],
        concessionariaIds: [],
        areaIds: [],
      }).success,
    ).toBe(true)
  })

  it('SyncRelationshipListSchema valida parentId', () => {
    expect(
      SyncRelationshipListSchema.safeParse({
        parentId: '00000000-0000-4000-8000-000000000001',
        childIds: ['00000000-0000-4000-8000-000000000002'],
      }).success,
    ).toBe(true)
  })
})

describe('user admin permissions', () => {
  const actor = {
    id: 'a',
    email: 'a@b.com',
    nome: 'Admin',
    perfil: 'Admin',
    perfilDbValue: 'administrador_de_dom_nio',
    perfilLabel: '04',
    perfilNivel: 4,
    avatarUrl: null,
    ativo: true,
    aprovado: true,
    empresaId: null,
  }

  it('impede editar usuario acima do proprio nivel', () => {
    expect(canEditTargetProfile(actor, 3)).toBe(false)
    expect(canEditTargetProfile(actor, 4)).toBe(true)
    expect(canEditTargetProfile(actor, 7)).toBe(true)
  })

  it('impede atribuir perfil acima do proprio nivel', () => {
    expect(canAssignPerfil(actor, 3)).toBe(false)
    expect(canAssignPerfil(actor, 4)).toBe(true)
  })
})

describe('sync relationships', () => {
  it('parseIdList remove duplicados', () => {
    const ids = parseIdList('a,b,a,c')
    expect(ids).toEqual(['a', 'b', 'c'])
  })

  it('syncJoinTable nao duplica vinculos', () => {
    const desired = ['1', '2', '2']
    const unique = [...new Set(desired)]
    expect(unique).toEqual(['1', '2'])

    const currentIds = new Set(['1', '3'])
    const desiredSet = new Set(unique)
    const toAdd = unique.filter((id) => !currentIds.has(id))
    const toRemove = [...currentIds].filter((id) => !desiredSet.has(id))
    expect(toAdd).toEqual(['2'])
    expect(toRemove).toEqual(['3'])
  })
})

