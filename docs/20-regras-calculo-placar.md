# Regras de cálculo do Placar (Fase 6B)

Base de cálculo do placar: geração idempotente de indicadores, pontos, ranking e camada SQL de resumo. Não cobre dashboard avançado (Fase 6C).

## Modelo de dados usado

- `placar`: `id`, `data`, `finalizado`, `ranking_atualizado`, `concessionaria`, `empresa`.
- `placar_indicadores` (join): configura quais indicadores da biblioteca pertencem ao placar.
- `indicadores` (instâncias do placar): linhas com `placar = placarId`. Campos de cálculo: `meta`, `valor`, `pontos` (peso), `pontos_ranking` (pontuação calculada), `colaborador_user`, `placar_ranking` (posição), `ativo_placar`.
- `profiles`: `nome` do colaborador para exibição do ranking.

Definição: **indicadores do placar = `indicadores WHERE placar = placarId`**. O join `placar_indicadores` é a configuração; a geração ativa esses indicadores no placar.

## Regras de cálculo implementadas

### Geração de indicadores (`recalculate-indicators.ts`)
- Lê vínculos de `placar_indicadores`.
- Atualiza as linhas de `indicadores` vinculadas: `placar = placarId`, `ativo_placar = true`.
- Não cria linhas novas (atualização in-place) → idempotente.

### Pontos (`computeIndicatorPoints`, função pura)
- `peso <= 0` ou ausente → `0`.
- `meta > 0`: `atingimento = clamp(valor / meta, 0, 1)`; `pontos = peso * atingimento`.
- `meta` ausente/`0` (regra incerta, fallback): `valor > 0` → peso integral; senão `0`.
- `valor` ausente com `meta` válida → `0`.
- Arredondamento a 4 casas. Depende apenas de `(meta, valor, peso)`.

### Ranking (`computeRanking`, função pura)
- Agrega `pontos_ranking` por `colaborador_user`.
- Colaborador nulo é agrupado em bucket único de escopo (fallback).
- Ordena por pontos total desc.
- **Empate**: desempate determinístico por nome (pt-BR) e depois `id`; posição por *competition ranking* (pontos iguais → mesma posição: 1, 2, 2, 4).
- Persiste `placar_ranking` (posição) por colaborador e marca `placar.ranking_atualizado = true`.

## Campos usados

- Entrada de pontos: `indicadores.meta`, `indicadores.valor`, `indicadores.pontos`.
- Saída de pontos: `indicadores.pontos_ranking`.
- Entrada de ranking: `indicadores.colaborador_user`, `indicadores.pontos_ranking`, `profiles.nome`.
- Saída de ranking: `indicadores.placar_ranking`, `placar.ranking_atualizado`.

## Estratégia de idempotência

- Geração: atualiza in-place o mesmo conjunto de vínculos; reexecução não duplica.
- Pontos: recalculados a partir de `(meta, valor, peso)` estáveis, não acumulam.
- Ranking: recalculado a partir do estado atual de `pontos_ranking`; determinístico.
- Rodar `recalculatePlacar` duas vezes produz o mesmo estado final.

## Estratégia de ranking

- Por colaborador quando `colaborador_user` presente.
- Fallback por escopo (bucket único) quando colaborador ausente.
- Camada SQL opcional: view `placar_ranking_summary` + RPC `get_placar_ranking(p_placar_id)` usando `rank()`.

## Regras ainda incertas / pendentes

- **Clonagem por colaborador**: o Bubble `criar_indicador_placar_v2` criava instâncias de indicador por colaborador. `indicadores.placar` é FK de valor único (um indicador da biblioteca só pode pertencer a um placar por vez); falta chave de idempotência estável `(placar, template, colaborador)`. Implementado fallback de ativação in-place; clonagem fica para a Fase 6C.
- **Origem de `valor` realizado**: assume-se `indicadores.valor` já preenchido (import CSV / API). Sem dados, pontos ficam 0.
- **Cap de atingimento em 100%**: adotado por segurança; o Bubble pode permitir superação (>100%). A confirmar.
- **Pesos por importância**: `importancia` não entra no cálculo ainda; usa-se `pontos` como peso direto.

## Auditoria / logs

- Não existe tabela de log de recálculo adequada no schema atual.
- Status mínimo via `placar.ranking_atualizado` + `placar.updated_at`.
- Tabela dedicada (`placar_recalculo_log`) fica como migration futura (Fase 6C), conforme padrão de `docs/05-workflows-backend.md`.

## Camada SQL (migration `0004_placar_views_jobs.sql`)

- View `placar_indicator_summary`: contagem/total de pontos/colaboradores por placar.
- View `placar_ranking_summary`: pontos por placar + colaborador.
- RPC `get_placar_ranking(p_placar_id uuid)`: ranking com `rank()`.
- Aplicada via Supabase CLI no projeto QA `hdydlpeyzaubpxtokalb`. Sem RLS production, sem drops.
- O código TS faz a agregação como fonte primária; as views/RPC são camada de performance para a Fase 6C.

## Riscos de performance

- Recálculo faz updates linha-a-linha em `indicadores` (volume QA baixo). Para volume alto, migrar para RPC/`update ... from` em lote (6C).
- Leituras de resumo agregam no servidor; com muitos placares, usar as views materializáveis.

## Próximos ajustes para Fase 6C

- Clonagem idempotente de indicadores por colaborador com chave estável.
- Recálculo em lote via RPC SQL.
- Tabela de auditoria de recálculo.
- Dashboard visual e gráficos.
- Confirmar regras de cap/superação e peso por importância.
