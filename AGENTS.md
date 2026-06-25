# Instruções para agentes de IA neste projeto

Antes de implementar qualquer código, leia:

1. `docs/07-cursor-start-here.md`
2. `docs/19-passo-a-passo-preparacao.md`
3. `prompts/cursor-plan-prompt-v2.md`
4. `docs/00-prd-funcional.md`
5. `docs/13-guia-visual-ux-ui.md`
6. `docs/14-design-system-componentes.md`
7. `docs/15-arquitetura-codigo-nextjs.md`
8. `docs/16-plano-implementacao-fases.md`
9. `docs/17-supabase-seguranca-rls.md`
10. `.cursor/rules/*.mdc`

## Regras obrigatórias

- Trabalhe em fases pequenas e revisáveis.
- Não implemente tudo em uma única etapa.
- Use Next.js App Router, TypeScript strict e Supabase SSR.
- Server Components por padrão; `use client` apenas quando houver interação real no browser.
- Mutations devem usar Server Actions ou Edge Functions com validação Zod.
- Toda tabela/listagem deve ter paginação server-side.
- Filtros devem acontecer no banco, não no client.
- Nunca exponha `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ou qualquer secret no client.
- Respeite RLS e permissões por perfil/escopo organizacional.
- Não use `select('*')` em telas de produção.
- Preserve a UX visual do app Bubble conforme `docs/13-guia-visual-ux-ui.md`.
- Crie componentes reutilizáveis; não duplique layouts complexos por página.
- Ao concluir uma fase, atualize testes e documentação.
- Antes de mexer no banco remoto, confirme ambiente, projeto Supabase e permissões disponíveis.
