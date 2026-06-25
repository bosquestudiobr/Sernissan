Você é um agente de engenharia sênior trabalhando no Cursor em Plan Mode.

Sua missão é reconstruir o app SerNissan, originalmente feito no Bubble, usando Next.js App Router, TypeScript strict, Supabase, Supabase SSR, Tailwind, shadcn/ui, Zod, React Hook Form, TanStack Table, TanStack Query quando necessário, Vitest e Playwright.

## Regra mais importante

Não escreva código ainda. Primeiro leia a documentação, valide o ambiente e gere um plano detalhado por fases. Aguarde minha aprovação antes de executar qualquer fase.

## Documentos obrigatórios para ler antes do plano

Leia nesta ordem:

1. `README.md`
2. `AGENTS.md`
3. `docs/07-cursor-start-here.md`
4. `docs/19-passo-a-passo-preparacao.md`
5. `docs/00-prd-funcional.md`
6. `docs/01-inventario-tecnico-bubble.md`
7. `docs/02-modelo-dados-supabase.md`
8. `docs/03-option-sets.md`
9. `docs/04-mapa-telas-modulos.md`
10. `docs/05-workflows-backend.md`
11. `docs/06-arquitetura-stack.md`
12. `docs/08-regras-negocio.md`
13. `docs/09-qa-testes.md`
14. `docs/10-migracao-bubble-supabase.md`
15. `docs/12-performance.md`
16. `docs/13-guia-visual-ux-ui.md`
17. `docs/14-design-system-componentes.md`
18. `docs/15-arquitetura-codigo-nextjs.md`
19. `docs/16-plano-implementacao-fases.md`
20. `docs/17-supabase-seguranca-rls.md`
21. `docs/18-checklist-qa-release.md`
22. `supabase/migrations/0001_initial_schema.sql`
23. `supabase/migrations/0002_dev_rls_draft_review_before_prod.sql`
24. `.cursor/rules/*.mdc`

Também consulte as referências visuais:

- `references/design/guia-visual-ux-ui-sernissan-original.pdf`
- `references/screenshots/biblioteca-indicadores.png`

## Validação inicial obrigatória

Antes de planejar, responda com:

1. Quais documentos encontrou.
2. Se o projeto já tem Next.js ou está vazio.
3. Se encontrou `.env.example` e `.env.local`.
4. Se o MCP do Supabase parece estar conectado.
5. Quais migrations encontrou.
6. Quais riscos ou ambiguidades existem.

Não use secrets no output.

## Regras técnicas obrigatórias

- Use App Router.
- Server Components por padrão.
- `use client` só quando necessário.
- Supabase SSR com cookies.
- Mutations via Server Actions ou Route Handlers/Edge Functions.
- Validar toda mutation com Zod.
- Validar autenticação e autorização em toda Server Action.
- Não usar `select('*')` em telas de produção.
- Todas as listagens precisam de paginação server-side.
- Filtros e busca devem rodar no banco.
- Não armazenar listas grandes como arrays quando FK/join table for melhor.
- Jobs pesados devem ser idempotentes.
- Nunca expor secret/service role no client.
- RLS deve ser respeitado e revisado.
- Criar testes para regras críticas.

## Regras de UX obrigatórias

- Preservar a UX do app Bubble atual.
- Não criar UI SaaS genérica.
- Header, sidebar, cards, tabelas, botões e footer devem seguir `docs/13-guia-visual-ux-ui.md`.
- A tela de Biblioteca de indicadores deve ser usada como referência de fidelidade visual.
- Criar componentes reutilizáveis do design system.
- Tabelas devem ser densas, compactas e rápidas.

## Plano esperado

Crie um plano com:

- visão geral;
- árvore de arquivos proposta;
- fases de implementação;
- arquivos que cada fase vai criar/alterar;
- riscos;
- perguntas objetivas, se houver ambiguidade bloqueante;
- critérios de aceite por fase;
- comandos que pretende executar;
- estratégia de testes;
- estratégia de Supabase/RLS;
- estratégia de QA visual.

## Ordem de implementação esperada

1. Fundação Next.js/Supabase/Auth/Layout.
2. Perfil/contexto/permissões.
3. CRUDs base administrativos.
4. Biblioteca de indicadores.
5. Indicadores e Objetivos.
6. Placar/rankings.
7. Competências.
8. Visitas/RV público.
9. Reunião de resultados/agenda/hábitos.
10. QA, hardening, deploy.

## Como executar após aprovação

Quando eu aprovar, execute apenas uma fase por vez.

Ao concluir cada fase, entregue:

- arquivos criados/alterados;
- comandos executados;
- decisões tomadas;
- testes/lint/typecheck;
- pontos pendentes;
- checklist de QA manual.

Não continue para a próxima fase sem aprovação.
