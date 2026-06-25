# Arquitetura e stack recomendada

## Stack escolhida

- **Next.js App Router + TypeScript**: frontend, rotas, Server Components, Server Actions e SSR.
- **Supabase**: Postgres, Auth, Storage, Edge Functions, Realtime quando necessário e MCP para apoio no Cursor.
- **Tailwind CSS + shadcn/ui + Radix UI**: design system produtivo, acessível e consistente.
- **TanStack Table**: tabelas administrativas com paginação/filtros server-side.
- **TanStack Query**: cache client-side apenas para estados interativos/realtime; dados principais devem vir de Server Components ou queries server-side.
- **Zod**: validação de formulários, payloads de Server Actions e Edge Functions.
- **React Hook Form**: formulários grandes com validação integrada.
- **Recharts ou Tremor**: dashboards, gráficos e placares.
- **FullCalendar React**: substituir plugin de calendário do Bubble.
- **date-fns**: datas e formatação pt-BR.
- **Vitest + Testing Library + Playwright**: testes unitários, integração e e2e.
- **ESLint + Prettier + TypeScript strict**: qualidade mínima automática.

## Estrutura de pastas recomendada

```txt
sernissan/
  app/
    (auth)/login/
    (auth)/reset-password/
    app/
      layout.tsx
      page.tsx
      admin/
        empresas/
        paises/
        divisoes/
        setores/
        grupos/
        concessionarias/
        usuarios/
        areas-funcoes/
        indicadores/
        habitos/
      placar/
      indicadores/
      equipe/
      agenda/
      reuniao-resultados/
      competencias/
      visitas/
      relatorios/
      preferencias/
    publico/
      rv/[token]/
  components/
    ui/
    layout/
    forms/
    data-table/
    charts/
  features/
    auth/
    hierarchy/
    admin/
    placar/
    indicadores/
    equipe/
    agenda/
    competencias/
    visitas/
    reuniao-resultados/
  lib/
    supabase/
    validations/
    permissions/
    utils/
  server/
    actions/
    queries/
    jobs/
  supabase/
    migrations/
    functions/
  tests/
```

## Convenções de código

- Server Components por padrão; usar `use client` apenas quando houver interação real.
- Queries de leitura em `server/queries/*`.
- Mutations em Server Actions com validação Zod.
- Componentes visuais sem acesso direto ao banco.
- Regras de permissão centralizadas em `lib/permissions`.
- Tipos gerados pelo Supabase em `lib/database.types.ts`.
- Nada de `select('*')` em telas críticas; selecionar colunas necessárias.
- Soft delete apenas onde o negócio exigir; caso contrário, usar delete transacional.
- Auditoria para alterações em placar, indicadores, usuários e relatórios de visita.

## Performance

- Índices para `empresa_id`, `concessionaria_id`, `grupo_id`, `setor_id`, `area_id`, `funcao_id`, `placar_id`, `status`, `ativo` e datas.
- Views/RPCs para rankings e dashboards.
- Paginação server-side em todas as tabelas.
- Evitar filtros client-side como substituto de SQL.
- Cache com revalidate tags por módulo quando fizer sentido.

## Segurança

- RLS em todas as tabelas públicas.
- Service role key apenas em ambiente server/Edge Function; nunca no client.
- Storage privado por padrão, usando signed URLs quando necessário.
- Tokens públicos de RV devem ser aleatórios, expiráveis e não devem revelar IDs sequenciais.
- Logs de auditoria para assinatura, envio de e-mail, alteração de ranking e alteração de perfil.
