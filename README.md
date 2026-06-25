# SerNissan — documentação v2 para reconstrução no Cursor + Supabase

Este pacote é a versão revisada e enriquecida da documentação para reconstruir o SerNissan fora do Bubble, usando Cursor Plan Mode, Next.js App Router, TypeScript, Supabase, Tailwind, shadcn/ui, Zod, React Hook Form, TanStack Table, Vitest e Playwright.

A documentação foi organizada para que o agente do Cursor consiga primeiro planejar, depois executar por fases pequenas, sem tentar criar o app inteiro em uma única resposta.

## Como usar este pacote

1. Leia `PASSO_A_PASSO_ANTES_DO_CURSOR.md`.
2. Prepare o Supabase, MCP, variáveis de ambiente e repositório.
3. Abra o Cursor no projeto.
4. Ative o Plan Mode.
5. Cole o prompt de `prompts/cursor-plan-prompt-v2.md`.
6. Revise o plano gerado pelo Cursor.
7. Só depois mande executar fase por fase.

## Leitura obrigatória para o agente

Ordem recomendada:

1. `docs/07-cursor-start-here.md`
2. `docs/19-passo-a-passo-preparacao.md`
3. `prompts/cursor-plan-prompt-v2.md`
4. `docs/00-prd-funcional.md`
5. `docs/01-inventario-tecnico-bubble.md`
6. `docs/02-modelo-dados-supabase.md`
7. `docs/03-option-sets.md`
8. `docs/04-mapa-telas-modulos.md`
9. `docs/05-workflows-backend.md`
10. `docs/06-arquitetura-stack.md`
11. `docs/13-guia-visual-ux-ui.md`
12. `docs/14-design-system-componentes.md`
13. `docs/15-arquitetura-codigo-nextjs.md`
14. `docs/16-plano-implementacao-fases.md`
15. `docs/17-supabase-seguranca-rls.md`
16. `docs/18-checklist-qa-release.md`
17. `.cursor/rules/*.mdc`

## Arquivos críticos

- `PASSO_A_PASSO_ANTES_DO_CURSOR.md`: checklist operacional antes de rodar o agente.
- `prompts/cursor-plan-prompt-v2.md`: prompt principal para Plan Mode.
- `AGENTS.md`: instruções persistentes para agentes.
- `.cursor/rules/*.mdc`: regras do Cursor.
- `.cursor/mcp.example.json`: exemplo de configuração do MCP do Supabase.
- `.env.example`: variáveis de ambiente esperadas.
- `supabase/migrations/0001_initial_schema.sql`: schema inicial proposto.
- `supabase/migrations/0002_dev_rls_draft_review_before_prod.sql`: RLS draft de desenvolvimento.
- `references/design/guia-visual-ux-ui-sernissan-original.pdf`: referência visual original.
- `references/screenshots/biblioteca-indicadores.png`: screenshot de referência de UX.

## Principais melhorias desta versão

- Adicionado guia visual em Markdown, baseado nas telas e no PDF de UX.
- Adicionado design system com tokens, componentes e comportamento esperado.
- Adicionada arquitetura de código Next.js mais detalhada.
- Adicionado plano de implementação por fases para o agente.
- Adicionado checklist pré-Cursor completo.
- Adicionadas regras novas do Cursor para UX, banco, segurança e Plan Mode.
- Melhorado o prompt principal para forçar plano revisável antes de execução.
- Adicionada documentação de RLS, MCP, migrations, tipos e QA.

## Avisos importantes

- O schema SQL foi inferido a partir do Bubble e deve ser tratado como base inicial, não como contrato final imutável.
- A migration de RLS é um rascunho para desenvolvimento; revise antes de produção.
- Não conecte o agente diretamente ao Supabase de produção.
- Comece com MCP em modo somente leitura quando possível.
- Não commite `.env.local`, service role, secret key, tokens ou export Bubble com segredos.
- A UX visual deve seguir as referências do pacote; não aceitar uma UI SaaS genérica.
