import { describe, expect, it } from 'vitest'

import { OrganizationalContextSchema } from './context'

const uuid = '550e8400-e29b-41d4-a716-446655440000'

describe('OrganizationalContextSchema', () => {
  it('aceita contexto com uuids validos', () => {
    const result = OrganizationalContextSchema.safeParse({
      setorId: uuid,
      grupoId: uuid,
      concessionariaId: uuid,
    })
    expect(result.success).toBe(true)
  })

  it('aceita valores nulos', () => {
    const result = OrganizationalContextSchema.safeParse({
      setorId: null,
      grupoId: null,
      concessionariaId: null,
    })
    expect(result.success).toBe(true)
  })
})
