# Plano de implementação por fases

Este é o plano recomendado para o Cursor executar após aprovação. Não execute todas as fases de uma vez.

## Fase 0 - Auditoria do pacote e ambiente

Objetivo: confirmar que o agente entendeu os documentos, o Supabase e o escopo.

Entregáveis:

- resumo do que será construído;
- árvore de arquivos proposta;
- riscos/ambiguidade;
- confirmação de MCP/Supabase;
- plano salvo em `.cursor/plans/`.

Critério de aceite:

- nenhum código de produto criado antes do plano ser aprovado.

## Fase 1 - Fundação do projeto

Objetivo: criar base Next.js.

Entregáveis:

- Next.js App Router com TypeScript strict;
- Tailwind/shadcn configurados;
- estrutura de pastas;
- Supabase SSR clients;
- middleware de sessão;
- layout público e autenticado;
- página de login/reset.

Critério de aceite:

- app roda localmente;
- lint/typecheck passam;
- login básico conectado ao Supabase Auth.

## Fase 2 - Modelo de auth, perfil e contexto organizacional

Objetivo: permitir usuário autenticado navegar com escopo correto.

Entregáveis:

- `profiles` conectado a `auth.users`;
- helper de usuário atual;
- contexto empresa/grupo/concessionária/área/função;
- header com seletores;
- sidebar com permissões;
- seeds mínimos para dev.

Critério de aceite:

- usuário vê apenas módulos permitidos;
- troca de contexto altera queries.

## Fase 3 - CRUDs administrativos base

Objetivo: construir cadastros de estrutura.

Entregáveis:

- empresas;
- países;
- divisões;
- setores;
- grupos;
- concessionárias;
- áreas e funções;
- usuários.

Critério de aceite:

- tabelas paginadas;
- forms validados;
- permissões aplicadas;
- sem `select('*')`.

## Fase 4 - Biblioteca de indicadores

Objetivo: reproduzir tela de Biblioteca de indicadores.

Entregáveis:

- tabela com UX similar ao Bubble;
- filtros por área/função;
- busca por nome/sigla;
- criar/editar/excluir/copy ID;
- ativar/desativar;
- pesos, unidades, metas e API;
- checagem de indicadores como job/server action.

Critério de aceite:

- visual comparável ao screenshot;
- filtros no banco;
- paginação server-side;
- ações por linha funcionando.

## Fase 5 - Indicadores e Objetivos

Objetivo: indicadores ativos e solicitações.

Entregáveis:

- tela de Indicadores e Objetivos;
- contador de solicitações;
- solicitar indicador;
- aprovar/rejeitar solicitações conforme perfil;
- editar metas/peso/ativo.

Critério de aceite:

- fluxo de solicitação completo;
- solicitações aparecem para perfil correto.

## Fase 6 - Placar e rankings

Objetivo: substituir cálculos pesados do Bubble por banco/jobs.

Entregáveis:

- placares por concessionária/data;
- indicadores por placar;
- colaboradores vinculados;
- cálculo de pontos;
- ranking por colaborador/função/área;
- views ou RPCs para resumo;
- job idempotente de recalcular.

Critério de aceite:

- teste unitário do cálculo;
- recomputação não duplica dados;
- telas rápidas com dados grandes.

## Fase 7 - Competências

Objetivo: matriz de calibração.

Entregáveis:

- seleção de colaborador;
- matriz visual de competências;
- etapas/avaliadores;
- status Sim/Parcial/Não;
- PDF ou export inicial;
- performance/colaboradores/calibração como abas/botões.

Critério de aceite:

- matriz preserva densidade e cores;
- edição segue permissão;
- dados persistem corretamente.

## Fase 8 - Visitas/RV e público por token

Objetivo: fluxo de reuniões/visitas e assinatura pública.

Entregáveis:

- listagem de visitas;
- formulário de visita/RV;
- anexos;
- próximos passos;
- token público expirável;
- assinatura com hash/IP/user agent/data;
- bloqueio pós-assinatura.

Critério de aceite:

- link público não expõe IDs internos;
- assinatura é auditável;
- token expirado bloqueia acesso.

## Fase 9 - Reunião de resultados, agenda e hábitos

Objetivo: módulos complementares.

Entregáveis:

- agenda/calendário;
- reunião de resultados;
- hábitos;
- indicadores do dashboard.

Critério de aceite:

- funcionalidades essenciais mapeadas;
- performance aceitável.

## Fase 10 - QA, hardening e deploy

Objetivo: preparar para homologação.

Entregáveis:

- testes Playwright críticos;
- revisão RLS;
- logs/auditoria;
- Sentry opcional;
- Vercel deploy preview;
- checklist de QA manual;
- documentação atualizada.

Critério de aceite:

- QA manual aprovado;
- erros críticos corrigidos;
- permissões testadas por perfil.
