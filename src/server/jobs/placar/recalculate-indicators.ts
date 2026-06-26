import type { PlacarJobClient, IndicatorGenerationResult } from '@/server/jobs/placar/types'

/**
 * Geracao idempotente de indicadores do placar.
 *
 * Modelo (ver docs/20-regras-calculo-placar.md):
 * - `placar_indicadores` define quais indicadores da biblioteca pertencem ao placar.
 * - A geracao "ativa" esses indicadores no placar setando `placar` e `ativo_placar`.
 * - E idempotente: rodar novamente atualiza para o mesmo estado, sem duplicar linhas.
 *
 * Limitacao conhecida: `indicadores.placar` e FK de valor unico; um indicador da
 * biblioteca so pode pertencer a um placar por vez. A clonagem por colaborador
 * (Bubble `criar_indicador_placar_v2`) fica para a Fase 6C por falta de chave de
 * idempotencia estavel no schema atual.
 */
export async function recalculateIndicators(
  supabase: PlacarJobClient,
  placarId: string,
): Promise<IndicatorGenerationResult> {
  const { data: links, error: linkError } = await supabase
    .from('placar_indicadores')
    .select('indicadores_id')
    .eq('placar_id', placarId)
  if (linkError) throw linkError

  const ids = [...new Set((links ?? []).map((row) => row.indicadores_id).filter(Boolean))]
  if (ids.length === 0) return { linked: 0, activated: 0 }

  const { data: updated, error } = await supabase
    .from('indicadores')
    .update({ placar: placarId, ativo_placar: true, updated_at: new Date().toISOString() })
    .in('id', ids)
    .select('id')
  if (error) throw error

  return { linked: ids.length, activated: updated?.length ?? 0 }
}
