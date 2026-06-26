import { describe, expect, it } from 'vitest'

import { mapBubbleIconToLucide, resolveModuleHref } from '@/lib/navigation'
import type { CurrentUserView } from '@/lib/types/user'

function makeUser(nivel: number): CurrentUserView {
  return {
    id: 'u1',
    email: 'u@test.com',
    nome: 'U',
    perfil: 'Perfil',
    perfilDbValue: 'usu_rio',
    perfilLabel: 'Perfil',
    perfilNivel: nivel,
    avatarUrl: null,
    ativo: true,
    aprovado: true,
    empresaId: null,
  }
}

describe('sidebar dinamica (regras)', () => {
  it('resolve href de modulos conhecidos', () => {
    expect(resolveModuleHref('placar')).toBe('/placar')
    expect(resolveModuleHref('desconhecido')).toBe('/modulos/desconhecido')
  })

  it('mapeia icones bubble para lucide', () => {
    expect(mapBubbleIconToLucide('dados')).toBe('LayoutGrid')
    expect(mapBubbleIconToLucide('inexistente')).toBe('Circle')
  })

  it('simula filtro por nivel: usuario nivel 7 nao acessa pagina nivel 1', () => {
    const user = makeUser(7)
    const maxNivel = 1
    expect(user.perfilNivel <= maxNivel).toBe(false)
  })

  it('simula filtro por nivel: gerente nivel 1 acessa pagina nivel 7', () => {
    const user = makeUser(1)
    const maxNivel = 7
    expect(user.perfilNivel <= maxNivel).toBe(true)
  })
})

