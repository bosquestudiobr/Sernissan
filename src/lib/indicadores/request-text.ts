export function formatIndicatorRequestText(
  sigla: string,
  observacao?: string | null,
  areaIds: string[] = [],
  funcaoIds: string[] = [],
): string {
  const lines = [`Sigla: ${sigla}`]
  if (observacao?.trim()) lines.push('', observacao.trim())
  if (areaIds.length > 0) lines.push('', `areas:${areaIds.join(',')}`)
  if (funcaoIds.length > 0) lines.push(`funcoes:${funcaoIds.join(',')}`)
  return lines.join('\n')
}

export function parseIndicatorRequestText(text: string | null | undefined) {
  if (!text) return { sigla: '', observacao: '', areaIds: [] as string[], funcaoIds: [] as string[] }
  const siglaMatch = text.match(/^Sigla:\s*(.+)$/m)
  const areasMatch = text.match(/^areas:(.+)$/m)
  const funcoesMatch = text.match(/^funcoes:(.+)$/m)
  const sigla = siglaMatch?.[1]?.trim() ?? ''
  const body = text
    .replace(/^Sigla:.*$/m, '')
    .replace(/^areas:.*$/m, '')
    .replace(/^funcoes:.*$/m, '')
    .trim()
  return {
    sigla,
    observacao: body,
    areaIds: areasMatch?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
    funcaoIds: funcoesMatch?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
  }
}
