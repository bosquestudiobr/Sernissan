# Reunião de Resultados / XR — Fase 9B

## Visão geral

O módulo Bubble `xr_reuniao_resultados` **não possui tabela única** no Supabase. A Fase 9B implementa o fluxo administrativo mapeando o schema real migrado do Bubble.

**Rota Next.js:** `/reuniao-resultados` (substitui placeholder `/modulos/reuniao-resultados`).

## Mapeamento Bubble → Supabase

| Conceito | Tabela Supabase | Observação |
|---|---|---|
| Reunião / sessão | `xr_placar` | Entidade principal; `data`, `id_2`, `empresa` |
| Pauta (indicadores) | `rr_indicadores` + `xr_placar_indicadores` | N:N |
| Próximos passos | `xr_acao` | `preliminar` (numeric) = `xr_placar.id_2` |
| Resultados (snapshot) | `xr_indicador_resultado`, `xr_resultado_final` | Leitura; junctions `xr_placar_resultados*` |
| Áreas (filtros) | `xr_tipo_indicador` | Via `rr_indicadores.area` |
| Participantes | **Não existe** | Empty state documentado na UI |
| Anexos XR | **Não existe** | Fora de escopo 9B |
| Vínculo RV | **Sem FK** | Adiado |
| Placar operacional | `placar` | Sem FK para `xr_placar`; sem recálculo |

## Campos principais

### `xr_placar`

- `id`, `data`, `id_2`, `empresa`, `created_by`
- `finalizada`, `data_finalizada` (migration `0010`)

### `xr_acao` (próximos passos)

- `descricao`, `data`, `responsavel`, `completa`
- `preliminar` → **numeric legacy** = `xr_placar.id_2`
- `indicador` → `rr_indicadores`, `grupo` → `grupo`

### `xr_indicador_resultado` (snapshot)

- `meta`, `resultado`, `percentual`, `pontos`
- `preliminar` → UUID `xr_placar.id`
- `concessionaria`, `indicador`

## Fluxo administrativo

1. Listagem paginada de reuniões (`xr_placar`) com filtros por status, concessionária (via resultados), área, período e código.
2. Criação/edição da reunião (data + código `id_2` auto-incrementado por empresa).
3. Detalhe com cards de resumo, participantes (empty state), pauta, próximos passos e snapshot de resultados.
4. Finalização/reabertura bloqueia edição de pauta e ações (admin estrutural, nível ≤ 4).

## Status derivado

| Status | Regra |
|---|---|
| `finalizada` | `xr_placar.finalizada = true` |
| `em_andamento` | Possui indicadores na pauta ou resultados registrados |
| `rascunho` | Default |

## Permissões

| Ação | Perfil |
|---|---|
| Ver listagem/detalhe | Nível ≤ 6 (`gerente_do_dom_nio` … `area_adm`) |
| Criar/editar pauta e ações | Nível ≤ 6 + escopo `empresa` |
| Finalizar/reabrir | Admin estrutural (nível ≤ 4) |
| Excluir | Admin estrutural (nível ≤ 4), somente não finalizada |

Escopo organizacional: primário por `empresa`; filtro de concessionária via `xr_indicador_resultado.concessionaria`.

## Integração Placar (Fase 6)

- **Implementado:** snapshot read-only de `xr_indicador_resultado` no detalhe.
- **Não implementado:** recálculo, ranking, vínculo com tabela `placar`.

## Integração RV/Visitas (Fase 9A)

- **Adiado:** schema sem FK entre `rv` e `xr_placar`.
- Sem fluxo público, token ou reaproveitamento de assinatura RV.

## Participantes — limitação conhecida

Texto exibido no painel:

> Este schema não possui tabela formal de participantes para Reunião de Resultados/XR. Participantes poderão ser implementados futuramente quando houver estrutura própria. Responsáveis por ações devem aparecer apenas nos próximos passos/ações, não como participantes da reunião.

## Migration 0010

- `xr_placar.finalizada`, `data_finalizada`
- Índices: `xr_placar(empresa, data)`, `xr_acao(empresa, preliminar)`, `xr_indicador_resultado(preliminar, concessionaria)`

## Pendências (Fase 9C+)

- Sub-rotas Bubble: `xr_areas`, `rr_indicadores` (admin biblioteca), simulador, ano fiscal.
- Agenda (`agendamentos`) e Hábitos — fases separadas.
- Participantes formais (requer tabela/migration futura).
- RLS production.

## Pronto para Fase 9C

**Sim** — fundação operacional de reuniões (`xr_placar` + filhos) entregue; sub-módulos XR permanecem pendentes.
