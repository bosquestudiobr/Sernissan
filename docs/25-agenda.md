# Agenda — Fase 9C

## Visão geral

O módulo Bubble `agenda` persiste na tabela **`agendamentos`** (não existe tabela `agenda` ou `agenda_evento`).

**Rota Next.js:** `/agenda`

## Tabelas usadas

| Tabela | Papel |
|---|---|
| `agendamentos` | Compromisso principal |
| `agendamentos_users` | Participantes/responsáveis adicionais (N:N) |
| `agendamentos_convidados` | Convidados (N:N) |
| `profiles` | Responsável (`user`), gerente, participantes |
| `concessionaria` | Escopo organizacional |
| `placar` | Vínculo opcional (FK `placar`) |
| `empresa` | Escopo por empresa |

## Campos principais (`agendamentos`)

| Campo | Uso |
|---|---|
| `titulo` | Título do compromisso |
| `data_inicio`, `data_fim` | Período |
| `dia_todo` | Evento de dia inteiro |
| `user` | Responsável principal |
| `gerente` | Gerente associado |
| `concessionaria` | Concessionária |
| `empresa` | Empresa |
| `placar` | Vínculo leve com placar operacional |
| `concluido`, `cancelado`, `concluido_em` | Status operacional (migration `0011`) |

## Status

| Status | Regra |
|---|---|
| `pendente` | Não concluído/cancelado e dentro do prazo |
| `atrasado` | `data_fim` no passado e não concluído |
| `concluido` | `concluido = true` |
| `cancelado` | `cancelado = true` |

## Fluxo administrativo

1. Listagem paginada com filtros (período, status, concessionária, responsável, busca).
2. Cards de resumo: hoje, pendentes, concluídos, atrasados.
3. Alternância lista / calendário mensal simples (sem biblioteca externa).
4. CRUD via modal; participantes e convidados via join tables.
5. Ações: concluir, cancelar, reabrir (admin estrutural), excluir.

## Regras de data/período

- `data_fim` não pode ser anterior a `data_inicio` (validação Zod).
- Filtro de período aplica-se sobre `data_inicio`.
- Calendário mensal carrega itens do mês via `getAgendaCalendarItems`.

## Integrações

| Módulo | Status |
|---|---|
| **Placar** | FK `placar` — link leitura para `/placar/[id]` na tabela |
| **XR** | Sem FK no schema — adiado |
| **RV/Visitas** | Sem FK no schema — adiado |

## Permissões

| Ação | Perfil |
|---|---|
| Ver agenda | Nível ≤ 6 (`area_adm` no Bubble) |
| Criar/editar/concluir/cancelar | Nível ≤ 6 + escopo concessionária |
| Reabrir/excluir | Admin estrutural (nível ≤ 4) |

Escopo: `empresa` + `concessionaria` (contexto do header ou `concessionariaIds`).

## Migration 0011

- `concluido`, `cancelado`, `concluido_em`
- Índices em `empresa/data_inicio`, `concessionaria/data_inicio`, `data_inicio`, `concluido/cancelado`

## Limitações conhecidas

- Calendário mensal básico (sem drag-drop, sem semanal).
- Sem notificações/e-mail.
- Sem Google Calendar.
- Filtro `atrasado`/`pendente` com pós-processamento (limite 500) — aceitável para 9C.
- Edição de participantes via multi-select nativo (Ctrl+clique).

## Pronto para Fase 9D

**Sim** — fundação de agenda entregue; Hábitos permanece pendente.
