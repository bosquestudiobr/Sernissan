/**
 * Corrige texto UTF-8 lido/gravado como Latin-1 (mojibake comum em seeds Windows).
 * Ex.: "RelatÃ³rios" -> "Relatórios"
 */
export function fixUtf8Mojibake(value: string | null | undefined): string {
  if (!value) return value ?? ''
  if (!value.includes('Ã') && !value.includes('Â')) return value

  try {
    const fixed = Buffer.from(value, 'latin1').toString('utf8')
    if (fixed.includes('\uFFFD')) return value
    return fixed
  } catch {
    return value
  }
}
