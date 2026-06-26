# Hábitos — Fase 9D

## Visão geral

O módulo Bubble `habitos` persistia na tabela **`habitos`** apenas com colunas de auditoria na migration `0001` (export Bubble sem campos). A Fase 9D estende essa tabela com campos operacionais via migration `0012`.

**Rota Next.js:** `/habitos`

**Separado de:** `competencia_habito` (catálogo de calibração de competências — Fases 7A–7C). O vínculo é opcional por FK `competencia_habito` em `habitos`, sem alterar matriz de calibração.

## Tabelas usadas

| Tabela | Papel |
|---|---|
| `habitos` | Hábito operacional (acompanhamento) |
| `competencia_habito` | Catálogo de competências — integração leve (FK opcional) |
| `competencia_mapa_habitos` | **Não usada** neste módulo (calibração) |
| `profiles` | Responsável (`colaborador`) |
| `concessionaria` | Escopo organizacional |
| `empresa` | Escopo por empresa |
| `setor_concessionaria` | Área (`area`) |
| `funcao_colaborador` | Função (`funcao`) |
| `agendamentos` | Vínculo opcional (`agendamento`) — link leve, sem criação automática |

**Não existem no schema:** `habitos_users`, `acompanhamento_habitos`.

## Campos principais (`habitos` após migration 0012)

| Campo | Uso |
|---|---|
| `titulo`, `descricao` | Identificação |
| `colaborador` | Responsável (profile) |
| `concessionaria`, `empresa` | Escopo |
| `area`, `funcao` | Contexto organizacional |
| `competencia_habito` | FK opcional ao catálogo de competências |
| `agendamento` | FK opcional a compromisso na agenda |
| `data_inicio`, `data_fim` | Período/prazo |
| `ativo`, `concluido`, `concluido_em` | Status operacional |
| `meta_execucoes`, `execucoes_realizadas` | Progresso de execução |

## Status

| Status | Regra |
|---|---|
| `pendente` | Ativo, não concluído, dentro do prazo |
| `atrasado` | `data_fim` no passado, não concluído, ativo |
| `concluido` | `concluido = true` |
| `inativo` | `ativo = false` |

## Fluxo administrativo

1. Listagem paginada com filtros (status, área, função, concessionária, responsável, busca, período).
2. Cards de resumo: total, pendentes, concluídos, atrasados.
3. CRUD via modal.
4. Ações: concluir, ativar/inativar, registrar execuções (progresso), reabrir (admin estrutural), excluir.

## Relação com Competências

- `competencia_habito` permanece no módulo `/competencias` (mapas e calibração).
- Em `/habitos`, é possível vincular um hábito operacional a um item do catálogo via FK `competencia_habito`.
- Link read-only para `/competencias?tab=habitos` na tabela.
- **Não** altera `competencia_mapa_habitos` nem fluxos de calibração.

## Relação com Agenda

- FK opcional `agendamento` → `agendamentos`.
- Link leve para `/agenda` quando preenchido.
- **Não** cria agendamentos automaticamente nesta fase.

## Permissões

| Ação | Perfil |
|---|---|
| Ver /habitos | Nível ≤ 6 |
| Criar/editar/concluir/inativar/progresso | Nível ≤ 6 + escopo concessionária |
| Reabrir/excluir | Admin estrutural (nível ≤ 4) |

Escopo: `empresa` + `concessionaria` (contexto do header ou `concessionariaIds`).

Usuário inativo ou não aprovado é bloqueado via `requireCurrentUser`.

## Migration 0012

Adiciona colunas operacionais, FKs e índices em `habitos`. Sem RLS production.

## Limitações conhecidas

- Tabela `habitos` original vazia no Bubble — campos operacionais são extensão justificada.
- Sem `habitos_users` — um responsável por registro (`colaborador`).
- Sem notificações, cron ou Google Calendar.
- Filtro `pendente`/`atrasado` com pós-processamento (limite 500).
- Sem exportação PDF ou dashboard gráfico.
- RLS production pendente para fase futura.

## Pronto para Fase 10

**Sim** — módulo Hábitos entregue conforme escopo 9D.
