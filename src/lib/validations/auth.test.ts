import { describe, expect, it } from 'vitest'

import { ResetPasswordSchema, SignInSchema } from './auth'

describe('SignInSchema', () => {
  it('aceita credenciais validas', () => {
    const result = SignInSchema.safeParse({
      email: 'user@sernissan.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail invalido', () => {
    const result = SignInSchema.safeParse({
      email: 'invalido',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita senha curta', () => {
    const result = SignInSchema.safeParse({
      email: 'user@sernissan.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })
})

describe('ResetPasswordSchema', () => {
  it('aceita e-mail valido', () => {
    const result = ResetPasswordSchema.safeParse({ email: 'user@sernissan.com' })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail invalido', () => {
    const result = ResetPasswordSchema.safeParse({ email: 'foo' })
    expect(result.success).toBe(false)
  })
})
