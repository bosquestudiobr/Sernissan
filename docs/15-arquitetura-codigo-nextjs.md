# Arquitetura de código Next.js recomendada

Stack alvo:

- Next.js App Router;
- TypeScript strict;
- Supabase SSR;
- Tailwind CSS;
- shadcn/ui;
- Zod;
- React Hook Form;
- TanStack Table;
- TanStack Query somente quando houver interação client-side que justifique cache;
- Vitest e Playwright.

## Estrutura de pastas sugerida

```txt
src/
  app/
    (auth)/
      entrar/page.tsx
      resetar-senha/page.tsx
    (app)/
      layout.tsx
      page.tsx
      indicadores/page.tsx
      biblioteca-indicadores/page.tsx
      placar/page.tsx
      competencias/page.tsx
      solicitacoes/page.tsx
      usuarios/page.tsx
      equipe/page.tsx
      visitas/page.tsx
      reuniao-resultados/page.tsx
      admin/
        grupos/page.tsx
        concessionarias/page.tsx
        setores/page.tsx
        areas-funcoes/page.tsx
    rv-publico/[token]/page.tsx
    api/
      webhooks/
        route.ts
  components/
    app-shell/
    data-table/
    forms/
    ui/
  features/
    auth/
    organizational-context/
    indicadores/
    placar/
    competencias/
    solicitacoes/
    usuarios/
    visitas/
    reuniao-resultados/
    admin/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
      database.types.ts
    permissions/
    validations/
    utils/
  server/
    queries/
    actions/
    jobs/
    rpc/
  tests/
    unit/
    e2e/
```

## Regra de separação

- `app/`: composição de rotas, layouts e Server Components.
- `components/`: componentes reutilizáveis visuais.
- `features/`: componentes, schemas e lógica de cada domínio.
- `server/queries`: leituras de dados.
- `server/actions`: mutations chamadas por UI.
- `server/jobs`: rotinas pesadas/idempotentes.
- `lib/permissions`: autorização e escopo.
- `lib/supabase`: clientes SSR/browser e tipos.

## Supabase clients

Criar clientes separados:

- `createBrowserClient`: apenas para Client Components quando necessário.
- `createServerClient`: para Server Components, Server Actions e Route Handlers.
- `createAdminClient`: somente para jobs server-only que realmente precisem secret/service role.

Regras:

- Nunca importar admin client em componente client.
- Preferir RLS e client server autenticado para operações do usuário.
- Admin client apenas para tarefas administrativas controladas.

## Queries

Toda listagem deve aceitar parâmetros:

```ts
type ListParams = {
  page: number
  pageSize: number
  search?: string
  sort?: string
  filters?: Record<string, string | number | boolean | null>
}
```

Toda query deve:

- selecionar colunas explícitas;
- aplicar escopo por perfil/contexto;
- aplicar paginação;
- retornar `PaginatedResult<T>`;
- tratar erro de Supabase de forma previsível.

## Mutations

Toda mutation deve:

1. Validar input com Zod.
2. Buscar usuário atual.
3. Validar permissão no servidor.
4. Executar alteração.
5. Registrar log/auditoria quando relevante.
6. Revalidar path/cache.
7. Retornar resultado tipado.

Modelo:

```ts
export async function updateIndicatorAction(input: unknown) {
  'use server'
  const parsed = UpdateIndicatorSchema.safeParse(input)
  if (!parsed.success) return actionError(parsed.error)
  const user = await requireCurrentUser()
  await assertCan(user, 'indicator:update', parsed.data)
  // update...
  revalidatePath('/biblioteca-indicadores')
  return { ok: true }
}
```

## Permissões

Centralizar em `lib/permissions`:

- `requireCurrentUser()`;
- `getCurrentOrganizationalContext()`;
- `assertCan(user, action, resource)`;
- `getAllowedScopes(user)`;
- `canAccessConcessionaria(user, concessionariaId)`.

Não espalhar `if perfil === ...` por componentes.

## Rotas principais

| Bubble/reusable | Nova rota sugerida |
|---|---|
| `home` | `/` |
| `indicadores` | `/indicadores` |
| `indicadores-admin` | `/biblioteca-indicadores` |
| `placar` | `/placar` |
| `competencias-calibracao` | `/competencias` |
| `solicitações` | `/solicitacoes` |
| `usuarios` | `/usuarios` |
| `equipe` | `/equipe` |
| `visitas` | `/visitas` |
| `xr_reuniao_resultados` | `/reuniao-resultados` |
| `rv-publico` | `/rv-publico/[token]` |

## Jobs e rotinas pesadas

Usar `server/jobs` ou Supabase Edge Functions para:

- recalcular ranking de placar;
- importar indicadores via CSV/API;
- checar indicadores;
- gerar PDFs;
- expirar tokens públicos;
- processar updates em lote.

Jobs devem ser:

- idempotentes;
- logados;
- reexecutáveis;
- protegidos por `CRON_SECRET` ou permissão administrativa.

## Testes

Criar pelo menos:

- unit tests para cálculo de pontos/ranking;
- unit tests para permissões;
- tests de schemas Zod;
- Playwright para login, indicadores, solicitações e competências;
- smoke test de navegação autenticada.
