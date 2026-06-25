# Cursor Start Here - SerNissan

Este é o ponto de partida para o agente do Cursor.

## Objetivo do projeto

Reconstruir o SerNissan fora do Bubble com:

- Next.js App Router;
- TypeScript strict;
- Supabase Auth/Postgres/Storage;
- Supabase SSR;
- Tailwind + shadcn/ui;
- Zod + React Hook Form;
- TanStack Table;
- Vitest + Playwright.

## Processo obrigatório

1. Ler a documentação.
2. Validar ambiente.
3. Criar plano em Plan Mode.
4. Aguardar aprovação humana.
5. Executar uma fase por vez.
6. Rodar testes/lint/typecheck quando possível.
7. Registrar pendências e QA manual.

## Documentos mais importantes

- `PASSO_A_PASSO_ANTES_DO_CURSOR.md`
- `prompts/cursor-plan-prompt-v2.md`
- `docs/00-prd-funcional.md`
- `docs/01-inventario-tecnico-bubble.md`
- `docs/02-modelo-dados-supabase.md`
- `docs/04-mapa-telas-modulos.md`
- `docs/05-workflows-backend.md`
- `docs/13-guia-visual-ux-ui.md`
- `docs/14-design-system-componentes.md`
- `docs/15-arquitetura-codigo-nextjs.md`
- `docs/16-plano-implementacao-fases.md`
- `docs/17-supabase-seguranca-rls.md`

## O que preservar do Bubble

- Fluxos funcionais.
- Hierarquia organizacional.
- Perfis e permissões.
- Módulos principais.
- UX visual de header/sidebar/cards/tabelas/footer.
- Telas densas de operação.

## O que melhorar

- Performance.
- Segurança.
- RLS.
- Queries paginadas.
- Código modular.
- Testes.
- Jobs idempotentes.
- Menos cálculo na UI.

## Proibições técnicas

- Não implementar tudo em uma única fase.
- Não usar service role no frontend.
- Não fazer listagens sem paginação.
- Não filtrar listas grandes no client.
- Não ignorar RLS.
- Não criar UI genérica diferente das referências.
- Não aplicar migration destrutiva sem confirmação.
