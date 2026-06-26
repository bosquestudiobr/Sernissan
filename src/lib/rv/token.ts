import { createHash, randomBytes } from 'crypto'

export function hashRvToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

export function generateRvToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('base64url')
  return { raw, hash: hashRvToken(raw) }
}

export function signatureIntegrityHash(parts: { token: string; nome: string; dataHoraUtc: string }): string {
  return createHash('sha256')
    .update(`${parts.token}|${parts.nome}|${parts.dataHoraUtc}`)
    .digest('hex')
}
