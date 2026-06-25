Você é um agente de engenharia sênior trabalhando em Cursor Plan Mode.

Objetivo: reconstruir o app SerNissan originalmente feito no Bubble, usando Next.js App Router, TypeScript, Supabase, Tailwind, shadcn/ui, Zod, React Hook Form, TanStack Table, TanStack Query quando necessário, Vitest e Playwright.

Antes de escrever código, leia obrigatoriamente:

- docs/00-prd-funcional.md
- docs/01-inventario-tecnico-bubble.md
- docs/02-modelo-dados-supabase.md
- docs/03-option-sets.md
- docs/04-mapa-telas-modulos.md
- docs/05-workflows-backend.md
- docs/06-arquitetura-stack.md
- docs/08-regras-negocio.md
- docs/09-qa-testes.md
- supabase/migrations/0001_initial_schema.sql
- supabase/migrations/0002_dev_rls_draft_review_before_prod.sql
- .cursor/rules/*.mdc

Tarefa do Plan Mode:

1. Faça um plano de implementação por fases, com commits pequenos.
2. Identifique dependências técnicas e riscos.
3. Confirme que o banco Supabase está acessível via MCP antes de criar código dependente do banco.
4. Nunca exponha service role key no client.
5. Nunca implemente telas com listagens sem paginação server-side.
6. Não use `select('*')` em produção; selecione colunas necessárias.
7. Comece pela fundação: Next.js, Supabase SSR, auth, layout, permissões e CRUDs base.
8. Depois implemente placar/indicadores, visitas/RV, competências e reunião de resultados.
9. Para cada fase, gere checklist de QA manual e testes automatizados.
10. Se encontrar ambiguidade, crie TODOs explícitos no código e mantenha comportamento seguro.

Resultado esperado do plano:

- Árvore de arquivos proposta.
- Ordem de criação dos módulos.
- Migrations ou ajustes necessários.
- Componentes principais.
- Server Actions/queries.
- Estratégia de RLS.
- Estratégia de testes.
- Critérios de aceite por fase.

Depois de eu aprovar o plano, execute fase por fase.
