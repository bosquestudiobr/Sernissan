import { describe, expect, it } from 'vitest'

import { EmpresaSchema, PaisSchema, ConcessionariaSchema } from '@/lib/validations/admin'
import { parseListParams, buildPageCount, resolveSortColumn } from '@/server/queries/list-helpers'
import { canManageStructuralAdmin } from '@/lib/permissions/admin'
import { canAccessRoute } from '@/lib/permissions'

describe('admin validations', () => {
  it('EmpresaSchema exige nome', () => {
    expect(EmpresaSchema.safeParse({ nome: '' }).success).toBe(false)
    expect(EmpresaSchema.safeParse({ nome: 'SerNissan' }).success).toBe(true)
  })

  it('PaisSchema aceita empresa opcional', () => {
    expect(PaisSchema.safeParse({ nome: 'Brasil' }).success).toBe(true)
  })

  it('ConcessionariaSchema aceita dominios texto', () => {
    expect(ConcessionariaSchema.safeParse({ nome: 'Dealer', dominios: 'a.com, b.com' }).success).toBe(true)
  })
})

describe('list helpers', () => {
  it('parseListParams define pagina e busca', () => {
    const params = parseListParams({ page: '2', search: 'abc', empresa: 'x' })
    expect(params.page).toBe(2)
    expect(params.search).toBe('abc')
    expect(params.filters.empresa).toBe('x')
  })

  it('resolveSortColumn usa fallback seguro', () => {
    expect(resolveSortColumn('invalid', ['nome'], 'nome')).toBe('nome')
  })

  it('buildPageCount calcula paginas', () => {
    expect(buildPageCount(45, 20)).toBe(3)
  })
})

describe('admin permissions', () => {
  const user = {
    id: '1',
    email: 'a@b.com',
    nome: 'A',
    perfil: 'Admin',
    perfilDbValue: 'administrador_de_dom_nio',
    perfilLabel: '04 - Grupo Adm',
    perfilNivel: 4,
    avatarUrl: null,
    ativo: true,
    aprovado: true,
    empresaId: null,
  }

  it('permite admin estrutural para nivel 4', () => {
    expect(canManageStructuralAdmin(4)).toBe(true)
    expect(canManageStructuralAdmin(7)).toBe(false)
  })

  it('bloqueia rota admin para colaborador', () => {
    expect(canAccessRoute({ ...user, perfilNivel: 7 }, '/admin/empresa')).toBe(false)
    expect(canAccessRoute(user, '/admin/empresa')).toBe(true)
  })
})
