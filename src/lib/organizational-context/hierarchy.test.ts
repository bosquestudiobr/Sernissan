import { describe, expect, it } from 'vitest'

import {
  enrichOrganizationalContext,
  filterConcessionarias,
  filterGrupos,
  formatContextSummary,
  resolveChainFromConcessionaria,
} from '@/lib/organizational-context/hierarchy'
import type { OrganizationalContextOptions } from '@/lib/types/user'

const options: OrganizationalContextOptions = {
  empresas: [{ id: 'e1', label: 'Empresa A' }],
  paises: [{ id: 'p1', label: 'Brasil', empresaId: 'e1' }],
  divisoes: [{ id: 'd1', label: 'Divisao Sul', paisId: 'p1', empresaId: 'e1' }],
  setores: [{ id: 's1', label: 'Setor A', divisaoId: 'd1', empresaId: 'e1' }],
  grupos: [{ id: 'g1', label: 'Grupo A', setorId: 's1', empresaId: 'e1' }],
  concessionarias: [{ id: 'c1', label: 'Concessionaria A', grupoId: 'g1', empresaId: 'e1' }],
}

describe('organizational hierarchy helpers', () => {
  it('resolve chain from concessionaria', () => {
    const chain = resolveChainFromConcessionaria('c1', options)
    expect(chain).toEqual({
      empresaId: 'e1',
      paisId: 'p1',
      divisaoId: 'd1',
      setorId: 's1',
      grupoId: 'g1',
      concessionariaId: 'c1',
    })
  })

  it('enriches partial context from setor', () => {
    const enriched = enrichOrganizationalContext(
      { empresaId: null, paisId: null, divisaoId: null, setorId: 's1', grupoId: null, concessionariaId: null },
      options,
    )
    expect(enriched.divisaoId).toBe('d1')
    expect(enriched.paisId).toBe('p1')
    expect(enriched.empresaId).toBe('e1')
  })

  it('filters grupos by setor', () => {
    expect(filterGrupos(options, 's1')).toHaveLength(1)
    expect(filterGrupos(options, 's9')).toHaveLength(0)
  })

  it('filters concessionarias by grupo', () => {
    expect(filterConcessionarias(options, 'g1')).toHaveLength(1)
    expect(filterConcessionarias(options, 'g9')).toHaveLength(0)
  })

  it('formats context summary', () => {
    expect(
      formatContextSummary({ grupo: 'Grupo A', concessionaria: 'Concessionaria A', setor: 'Setor A' }),
    ).toBe('Grupo A · Concessionaria A')
  })
})
