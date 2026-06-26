import { describe, expect, it } from 'vitest'

import {
  canAccessConcessionaria,
  canAccessGrupo,
  canAccessOrganizationalContext,
  canAccessSetor,
  isHighPrivilegeScope,
} from './scopes'

const scopes = {
  setorIds: ['s1'],
  grupoIds: ['g1'],
  concessionariaIds: ['c1'],
  empresaId: 'e1',
  perfilNivel: 7,
}

describe('permission scopes', () => {
  it('permite setor no escopo', () => {
    expect(canAccessSetor(scopes, 's1')).toBe(true)
    expect(canAccessSetor(scopes, 's2')).toBe(false)
  })

  it('permite grupo no escopo', () => {
    expect(canAccessGrupo(scopes, 'g1')).toBe(true)
    expect(canAccessGrupo(scopes, null)).toBe(true)
  })

  it('permite concessionaria no escopo', () => {
    expect(canAccessConcessionaria(scopes, 'c1')).toBe(true)
    expect(canAccessConcessionaria(scopes, 'c2')).toBe(false)
  })

  it('valida contexto completo', () => {
    expect(
      canAccessOrganizationalContext(scopes, {
        setorId: 's1',
        grupoId: 'g1',
        concessionariaId: 'c1',
      }),
    ).toBe(true)

    expect(
      canAccessOrganizationalContext(scopes, {
        setorId: 's2',
        grupoId: 'g1',
        concessionariaId: 'c1',
      }),
    ).toBe(false)
  })

  it('identifica perfil de alto privilegio', () => {
    expect(isHighPrivilegeScope(2)).toBe(true)
    expect(isHighPrivilegeScope(4)).toBe(false)
  })
})
