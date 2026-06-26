import type { PlacarJobClient } from '@/server/jobs/placar/types'
import type { Json } from '@/lib/supabase/database.types'

export type PlacarRecalcAction =
  | 'recalculate_all'
  | 'recalculate_indicators'
  | 'recalculate_ranking'
  | 'finalize'
  | 'reopen'

/**
 * Registro best-effort de auditoria de recalculo/finalizacao do placar.
 * Nao deve quebrar a operacao principal: falhas sao silenciadas e retornam false.
 */
export async function recordPlacarRecalculation(
  supabase: PlacarJobClient,
  params: {
    placarId: string
    profileId: string | null
    action: PlacarRecalcAction
    summary: Record<string, unknown>
  },
): Promise<boolean> {
  try {
    const { error } = await supabase.from('placar_recalculation_logs').insert({
      placar_id: params.placarId,
      profile_id: params.profileId,
      action: params.action,
      summary: params.summary as Json,
    })
    return !error
  } catch {
    return false
  }
}

