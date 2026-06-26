import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppHeader } from '@/components/app-shell/AppHeader'

const user = {
  id: 'u1',
  email: 'user@test.com',
  nome: 'Usuario Teste',
  perfil: 'Colaborador',
  perfilDbValue: 'usu_rio',
  perfilLabel: '07 - Colaborador',
  perfilNivel: 7,
  avatarUrl: null,
  ativo: true,
  aprovado: true,
  empresaId: null,
}

const context = {
  setorId: 's1',
  grupoId: 'g1',
  concessionariaId: 'c1',
  setor: 'Setor A',
  grupo: 'Grupo A',
  concessionaria: 'Concessionaria A',
}

const options = {
  setores: [{ id: 's1', label: 'Setor A' }],
  grupos: [{ id: 'g1', label: 'Grupo A', setorId: 's1' }],
  concessionarias: [{ id: 'c1', label: 'Concessionaria A', grupoId: 'g1' }],
}

describe('AppHeader com contexto', () => {
  it('renderiza seletores e usuario', () => {
    render(<AppHeader user={user} context={context} options={options} />)
    expect(screen.getByText('SERNISSAN')).toBeInTheDocument()
    expect(screen.getByText('Usuario Teste')).toBeInTheDocument()
    expect(screen.getByText('Setor')).toBeInTheDocument()
    expect(screen.getByText('Grupo')).toBeInTheDocument()
    expect(screen.getByText('Concessionaria')).toBeInTheDocument()
  })
})
