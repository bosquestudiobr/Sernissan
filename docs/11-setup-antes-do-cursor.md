# Setup antes do Cursor

Este documento foi mantido para compatibilidade com o pacote anterior. O passo a passo completo está em `../PASSO_A_PASSO_ANTES_DO_CURSOR.md`.

## Resumo rápido

1. Criar repositório limpo.
2. Copiar docs, prompts, `.cursor`, `supabase` e referências.
3. Commitar documentação.
4. Criar projeto Supabase de desenvolvimento.
5. Preencher `.env.local` a partir de `.env.example`.
6. Configurar Supabase CLI.
7. Testar/applicar migrations.
8. Criar buckets privados.
9. Gerar tipos TypeScript.
10. Configurar MCP do Supabase no Cursor.
11. Abrir Cursor em Plan Mode.
12. Colar `prompts/cursor-plan-prompt-v2.md`.
13. Aprovar uma fase por vez.

## Variáveis mínimas

```env
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_REF=
SUPABASE_SECRET_KEY=
```

## Comandos úteis

```bash
npx supabase login
npx supabase init
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db reset
npx supabase db push
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/lib/supabase/database.types.ts
```

## Segurança

- Use projeto dev.
- MCP read-only no começo.
- Não cole secrets no chat.
- Não commite `.env.local`.
- Não aplique RLS draft em produção sem revisão.
