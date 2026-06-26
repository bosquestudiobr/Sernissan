import type {
  PlacarJobClient,
  RankingInputEntry,
  RankingResult,
  RankingRow,
} from '@/server/jobs/placar/types'
import { NO_COLABORADOR_KEY, round4 } from '@/server/jobs/placar/types'

/**
 * Funcao pura de ranking.
 *
 * Regras (ver docs/20-regras-calculo-placar.md):
 * - agrega pontos por colaborador (colaborador nulo agrupado em um bucket unico de escopo).
 * - ordena por pontos total desc.
 * - desempate DETERMINISTICO: nome asc (pt-BR), depois id asc.
 * - posicao por "competition ranking": pontos iguais => mesma posicao (1,2,2,4).
 */
export function computeRanking(entries: RankingInputEntry[]): RankingRow[] {
  const grouped = new Map<string, RankingRow>()

  for (const entry of entries) {
    const key = entry.colaboradorId ?? NO_COLABORADOR_KEY
    const current = grouped.get(key)
    if (current) {
      current.pontosTotal = round4(current.pontosTotal + entry.pontos)
      if (!current.colaboradorNome && entry.colaboradorNome) {
        current.colaboradorNome = entry.colaboradorNome
      }
    } else {
      grouped.set(key, {
        colaboradorId: entry.colaboradorId,
        colaboradorNome: entry.colaboradorNome,
        pontosTotal: round4(entry.pontos),
        posicao: 0,
      })
    }
  }

  const rows = [...grouped.values()].sort((a, b) => {
    if (b.pontosTotal !== a.pontosTotal) return b.pontosTotal - a.pontosTotal
    const nomeA = (a.colaboradorNome ?? '').toLocaleLowerCase('pt-BR')
    const nomeB = (b.colaboradorNome ?? '').toLocaleLowerCase('pt-BR')
    if (nomeA !== nomeB) return nomeA < nomeB ? -1 : 1
    const idA = a.colaboradorId ?? ''
    const idB = b.colaboradorId ?? ''
    return idA < idB ? -1 : idA > idB ? 1 : 0
  })

  let lastPontos: number | null = null
  let lastPosicao = 0
  rows.forEach((row, index) => {
    if (lastPontos !== null && row.pontosTotal === lastPontos) {
      row.posicao = lastPosicao
    } else {
      row.posicao = index + 1
      lastPosicao = row.posicao
      lastPontos = row.pontosTotal
    }
  })

  return rows
}

export async function recalculateRanking(
  supabase: PlacarJobClient,
  placarId: string,
): Promise<RankingResult> {
  const { data, error } = await supabase
    .from('indicadores')
    .select('colaborador_user, pontos_ranking')
    .eq('placar', placarId)
  if (error) throw error

  const rows = data ?? []
  const colaboradorIds = [...new Set(rows.map((r) => r.colaborador_user).filter(Boolean) as string[])]

  const names = new Map<string, string>()
  if (colaboradorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome')
      .in('id', colaboradorIds)
    if (profilesError) throw profilesError
    for (const p of profiles ?? []) names.set(p.id, p.nome ?? p.id)
  }

  const entries: RankingInputEntry[] = rows.map((r) => ({
    colaboradorId: r.colaborador_user,
    colaboradorNome: r.colaborador_user ? names.get(r.colaborador_user) ?? null : null,
    pontos: r.pontos_ranking ?? 0,
  }))

  const ranking = computeRanking(entries)

  for (const row of ranking) {
    if (!row.colaboradorId) continue
    const { error: updateError } = await supabase
      .from('indicadores')
      .update({ placar_ranking: row.posicao })
      .eq('placar', placarId)
      .eq('colaborador_user', row.colaboradorId)
    if (updateError) throw updateError
  }

  const { error: placarError } = await supabase
    .from('placar')
    .update({ ranking_atualizado: true, updated_at: new Date().toISOString() })
    .eq('id', placarId)
  if (placarError) throw placarError

  return { colaboradores: ranking.length, ranking }
}
