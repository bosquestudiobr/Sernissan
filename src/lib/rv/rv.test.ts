import { describe, expect, it } from 'vitest'

import { generateRvToken, hashRvToken, signatureIntegrityHash } from '@/lib/rv/token'
import { deriveRvStatus, isTokenExpired } from '@/lib/rv/status'

describe('rv token', () => {
  it('hashRvToken e deterministico', () => {
    expect(hashRvToken('abc')).toBe(hashRvToken('abc'))
    expect(hashRvToken('abc')).not.toBe(hashRvToken('abd'))
    expect(hashRvToken('abc')).toHaveLength(64)
  })

  it('generateRvToken retorna raw e hash coerente', () => {
    const a = generateRvToken()
    const b = generateRvToken()
    expect(a.raw).not.toBe(b.raw)
    expect(a.hash).toBe(hashRvToken(a.raw))
    expect(a.raw.length).toBeGreaterThanOrEqual(20)
  })

  it('signatureIntegrityHash muda com entrada', () => {
    const h1 = signatureIntegrityHash({ token: 't', nome: 'Ana', dataHoraUtc: '2026-01-01' })
    const h2 = signatureIntegrityHash({ token: 't', nome: 'Bia', dataHoraUtc: '2026-01-01' })
    expect(h1).not.toBe(h2)
  })
})

describe('rv status', () => {
  const future = new Date(Date.now() + 86400000).toISOString()
  const past = new Date(Date.now() - 86400000).toISOString()

  it('deriva status corretamente', () => {
    expect(deriveRvStatus({ assinadoEm: '2026-01-01', enviadoEm: null, dataExpiracaoToken: null })).toBe('assinada')
    expect(deriveRvStatus({ assinadoEm: null, enviadoEm: '2026-01-01', dataExpiracaoToken: past })).toBe('expirada')
    expect(deriveRvStatus({ assinadoEm: null, enviadoEm: '2026-01-01', dataExpiracaoToken: future })).toBe('enviada')
    expect(deriveRvStatus({ assinadoEm: null, enviadoEm: null, dataExpiracaoToken: null })).toBe('rascunho')
  })

  it('isTokenExpired valido/expirado/ausente', () => {
    expect(isTokenExpired(null)).toBe(true)
    expect(isTokenExpired(past)).toBe(true)
    expect(isTokenExpired(future)).toBe(false)
  })
})
