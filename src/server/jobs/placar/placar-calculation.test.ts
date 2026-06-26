import { describe, expect, it } from 'vitest'

import { computeIndicatorPoints } from '@/server/jobs/placar/recalculate-points'
import { computeRanking } from '@/server/jobs/placar/recalculate-ranking'
import type { RankingInputEntry } from '@/server/jobs/placar/types'

describe('computeIndicatorPoints', () => {
  it('retorna 0 quando peso ausente ou <= 0', () => {
    expect(computeIndicatorPoints({ meta: 100, valor: 50, peso: 0 })).toBe(0)
    expect(computeIndicatorPoints({ meta: 100, valor: 50, peso: null })).toBe(0)
    expect(computeIndicatorPoints({ meta: 100, valor: 50, peso: -5 })).toBe(0)
  })

  it('calcula atingimento proporcional com meta valida', () => {
    expect(computeIndicatorPoints({ meta: 100, valor: 50, peso: 10 })).toBe(5)
    expect(computeIndicatorPoints({ meta: 200, valor: 50, peso: 8 })).toBe(2)
  })

  it('limita atingimento em 100%', () => {
    expect(computeIndicatorPoints({ meta: 100, valor: 150, peso: 10 })).toBe(10)
    expect(computeIndicatorPoints({ meta: 100, valor: 1000, peso: 10 })).toBe(10)
  })

  it('retorna 0 quando valor ausente e meta valida', () => {
    expect(computeIndicatorPoints({ meta: 100, valor: null, peso: 10 })).toBe(0)
  })

  it('fallback sem meta: valor positivo recebe peso integral', () => {
    expect(computeIndicatorPoints({ meta: null, valor: 5, peso: 10 })).toBe(10)
    expect(computeIndicatorPoints({ meta: 0, valor: 5, peso: 10 })).toBe(10)
    expect(computeIndicatorPoints({ meta: null, valor: 0, peso: 10 })).toBe(0)
    expect(computeIndicatorPoints({ meta: null, valor: null, peso: 10 })).toBe(0)
  })

  it('e idempotente: mesma entrada, mesma saida', () => {
    const input = { meta: 120, valor: 90, peso: 7 }
    const a = computeIndicatorPoints(input)
    const b = computeIndicatorPoints(input)
    expect(a).toBe(b)
  })
})

describe('computeRanking', () => {
  it('agrega pontos por colaborador', () => {
    const entries: RankingInputEntry[] = [
      { colaboradorId: 'a', colaboradorNome: 'Ana', pontos: 5 },
      { colaboradorId: 'a', colaboradorNome: 'Ana', pontos: 3 },
      { colaboradorId: 'b', colaboradorNome: 'Bruno', pontos: 4 },
    ]
    const ranking = computeRanking(entries)
    expect(ranking[0]).toMatchObject({ colaboradorId: 'a', pontosTotal: 8, posicao: 1 })
    expect(ranking[1]).toMatchObject({ colaboradorId: 'b', pontosTotal: 4, posicao: 2 })
  })

  it('trata empate com competition ranking e desempate deterministico', () => {
    const entries: RankingInputEntry[] = [
      { colaboradorId: 'b', colaboradorNome: 'Bruno', pontos: 10 },
      { colaboradorId: 'a', colaboradorNome: 'Ana', pontos: 10 },
      { colaboradorId: 'c', colaboradorNome: 'Carla', pontos: 5 },
    ]
    const ranking = computeRanking(entries)
    // empate em 10 -> ambos posicao 1, ordenados por nome (Ana antes de Bruno)
    expect(ranking[0]).toMatchObject({ colaboradorNome: 'Ana', posicao: 1 })
    expect(ranking[1]).toMatchObject({ colaboradorNome: 'Bruno', posicao: 1 })
    expect(ranking[2]).toMatchObject({ colaboradorNome: 'Carla', posicao: 3 })
  })

  it('e deterministico e idempotente', () => {
    const entries: RankingInputEntry[] = [
      { colaboradorId: 'a', colaboradorNome: 'Ana', pontos: 5 },
      { colaboradorId: 'b', colaboradorNome: 'Bruno', pontos: 5 },
    ]
    const first = computeRanking(entries)
    const second = computeRanking(entries)
    expect(first).toEqual(second)
  })

  it('agrupa colaborador nulo em bucket unico', () => {
    const entries: RankingInputEntry[] = [
      { colaboradorId: null, colaboradorNome: null, pontos: 3 },
      { colaboradorId: null, colaboradorNome: null, pontos: 2 },
    ]
    const ranking = computeRanking(entries)
    expect(ranking).toHaveLength(1)
    expect(ranking[0].pontosTotal).toBe(5)
  })
})
