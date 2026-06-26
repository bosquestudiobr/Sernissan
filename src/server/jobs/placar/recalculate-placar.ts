import type { PlacarJobClient, RecalculationSummary } from '@/server/jobs/placar/types'
import { recalculateIndicators } from '@/server/jobs/placar/recalculate-indicators'
import { recalculatePoints } from '@/server/jobs/placar/recalculate-points'
import { recalculateRanking } from '@/server/jobs/placar/recalculate-ranking'

/**
 * Orquestra o recalculo completo do placar de forma idempotente:
 * 1. ativa indicadores vinculados (placar_indicadores).
 * 2. recalcula pontos por indicador.
 * 3. recalcula ranking por colaborador e marca ranking_atualizado.
 *
 * Rodar duas vezes produz o mesmo estado final (sem duplicar vinculos/pontos/ranking).
 */
export async function recalculatePlacar(
  supabase: PlacarJobClient,
  placarId: string,
): Promise<RecalculationSummary> {
  const indicators = await recalculateIndicators(supabase, placarId)
  const points = await recalculatePoints(supabase, placarId)
  const ranking = await recalculateRanking(supabase, placarId)

  return {
    placarId,
    indicators,
    points,
    ranking,
    finishedAt: new Date().toISOString(),
  }
}
