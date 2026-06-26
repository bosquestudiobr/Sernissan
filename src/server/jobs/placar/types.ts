import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/database.types'

export type PlacarJobClient = SupabaseClient<Database>

export type IndicatorGenerationResult = {
  linked: number
  activated: number
}

export type PointsResult = {
  processed: number
  totalPontos: number
}

export type RankingInputEntry = {
  colaboradorId: string | null
  colaboradorNome: string | null
  pontos: number
}

export type RankingRow = {
  colaboradorId: string | null
  colaboradorNome: string | null
  pontosTotal: number
  posicao: number
}

export type RankingResult = {
  colaboradores: number
  ranking: RankingRow[]
}

export type RecalculationSummary = {
  placarId: string
  indicators: IndicatorGenerationResult
  points: PointsResult
  ranking: RankingResult
  finishedAt: string
}

export const NO_COLABORADOR_KEY = '__sem_colaborador__'

export function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000
}
