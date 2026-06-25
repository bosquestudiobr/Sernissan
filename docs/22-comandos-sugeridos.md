# Comandos sugeridos do projeto

Quando o projeto Next.js existir, configure scripts parecidos em `package.json`.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "supabase:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_REF --schema public > src/lib/supabase/database.types.ts"
  }
}
```

## Comandos de validação por fase

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Para E2E:

```bash
pnpm test:e2e
```

## Comandos Supabase

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db reset
npx supabase db push
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/lib/supabase/database.types.ts
```
