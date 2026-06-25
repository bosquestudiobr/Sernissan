# Setup Supabase para o SerNissan

## Ordem recomendada

1. Criar projeto Supabase de desenvolvimento.
2. Configurar `.env.local`.
3. Rodar `npx supabase login`.
4. Rodar `npx supabase init`.
5. Rodar `npx supabase link --project-ref SEU_PROJECT_REF`.
6. Testar migrations localmente com `npx supabase db reset`.
7. Aplicar no dev remoto com `npx supabase db push`.
8. Criar buckets privados.
9. Gerar tipos TypeScript.
10. Revisar RLS antes de homologação.

## Buckets

Criar:

- `avatars`
- `logos`
- `rv-anexos`
- `uploads`

Todos privados inicialmente.

## Tipos TypeScript

```bash
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/lib/supabase/database.types.ts
```

## Atenção

- A migration `0002_dev_rls_draft_review_before_prod.sql` é draft.
- Não usar Supabase de produção no início.
- Não alterar schema remoto manualmente sem migration.
