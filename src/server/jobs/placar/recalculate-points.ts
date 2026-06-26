import type { PlacarJobClient, PointsResult } from '@/server/jobs/placar/types'
import { round4 } from '@/server/jobs/placar/types'

export type IndicatorPointInput = {
  meta: number | null
  valor: number | null
  peso: number | null
}

/**
 * Funcao pura de calculo de pontos de um indicador.
 *
 * Regras (ver docs/20-regras-calculo-placar.md):
 * - peso ausente/<=0 => 0 pontos.
 * - meta valida (> 0): atingimento = clamp(valor / meta, 0, 1); pontos = peso * atingimento.
 * - meta ausente/0 (regra incerta, fallback documentado): valor positivo => peso integral; senao 0.
 * - valor ausente com meta valida => 0.
 *
 * Determinista e idempotente: depende apenas de (meta, valor, peso).
 */
export function computeIndicatorPoints(input: IndicatorPointInput): number {
  const peso = input.peso ?? 0
  if (peso <= 0) return 0

  const { meta, valor } = input

  if (meta == null || meta === 0) {
    return valor != null && valor > 0 ? round4(peso) : 0
  }

  if (valor == null) return 0

  const ratio = valor / meta
  const achievement = Math.max(0, Math.min(ratio, 1))
  return round4(peso * achievement)
}

/**
 * Recalcula pontos por indicador do placar.
 *
 * Performance (Fase 6C): atualizacoes em lote agrupadas por pontuacao distinta
 * (1 update por valor de pontos_ranking) em vez de update linha-a-linha.
 * Continua idempotente: pontos derivam apenas de (meta, valor, peso).
 */
export async function recalculatePoints(
  supabase: PlacarJobClient,
  placarId: string,
): Promise<PointsResult> {
  const { data, error } = await supabase
    .from('indicadores')
    .select('id, meta, valor, pontos')
    .eq('placar', placarId)
  if (error) throw error

  const rows = data ?? []
  let total = 0
  const idsByScore = new Map<number, string[]>()

  for (const row of rows) {
    const score = computeIndicatorPoints({ meta: row.meta, valor: row.valor, peso: row.pontos })
    total += score
    const ids = idsByScore.get(score) ?? []
    ids.push(row.id)
    idsByScore.set(score, ids)
  }

  for (const [score, ids] of idsByScore.entries()) {
    const { error: updateError } = await supabase
      .from('indicadores')
      .update({ pontos_ranking: score })
      .in('id', ids)
    if (updateError) throw updateError
  }

  return { processed: rows.length, totalPontos: round4(total) }
}
