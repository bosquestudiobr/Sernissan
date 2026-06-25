# Referências oficiais úteis

Use estas referências quando o agente precisar confirmar detalhes atuais.

## Cursor

- Cursor Agent Best Practices: https://cursor.com/blog/agent-best-practices
- Cursor MCP Docs: https://cursor.com/docs/mcp

Pontos importantes:

- Plan Mode deve ser usado antes da implementação.
- Regras persistentes devem ficar em `.cursor/rules/`.
- O plano deve ser revisado e salvo no workspace.

## Supabase

- Supabase MCP: https://supabase.com/docs/guides/ai-tools/mcp
- Supabase SSR client: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase Auth com Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase RLS performance: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
- Supabase migrations: https://supabase.com/docs/guides/deployment/database-migrations
- Supabase TypeScript types: https://supabase.com/docs/guides/api/rest/generating-types

Pontos importantes:

- Supabase SSR deve usar cookies.
- Projetos novos devem usar publishable key no client e secret key no server.
- RLS deve proteger tabelas públicas.
- Colunas usadas em RLS precisam de índice.
- Migrations devem ser a fonte da verdade do schema.
- Tipos TypeScript devem ser gerados do schema real.

## Next.js

- App Router: https://nextjs.org/docs/app
- Mutating data / Server Functions: https://nextjs.org/docs/app/getting-started/mutating-data

Pontos importantes:

- Server Components por padrão.
- Server Actions/Server Functions podem ser usadas para mutations, mas sempre validando autenticação e autorização.
