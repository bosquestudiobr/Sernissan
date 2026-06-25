# Preparação antes do Cursor Plan Mode

Este documento resume a preparação técnica. A versão operacional completa está em `PASSO_A_PASSO_ANTES_DO_CURSOR.md`.

## Checklist obrigatório

| Etapa | Status esperado |
|---|---|
| Repositório limpo criado | Git inicializado, docs commitadas |
| Supabase dev criado | Project URL, project ref e keys anotadas |
| `.env.local` criado | Variáveis preenchidas sem commitar secrets |
| Supabase CLI logado | `npx supabase login` concluído |
| Projeto linkado | `npx supabase link --project-ref ...` |
| Migrations testadas | `db reset` local ou `db push` em dev |
| Buckets criados | `avatars`, `logos`, `rv-anexos`, `uploads` |
| MCP conectado | Supabase visível em Cursor Tools & MCP |
| MCP com escopo correto | Projeto dev, não produção |
| Rules carregadas | `.cursor/rules/*.mdc` presentes |
| Prompt pronto | `prompts/cursor-plan-prompt-v2.md` aberto |

## Validação mínima do ambiente

Peça ao agente do Cursor, ainda em Plan Mode:

```txt
Antes de planejar, valide o ambiente: liste os arquivos de documentação principais, confirme se há .cursor/rules, confirme se Supabase MCP está conectado ao projeto de desenvolvimento e diga quais migrations encontrou. Não escreva código ainda.
```

## Aprovação segura

Ao receber o plano, revise:

- Se ele começa pela fundação, não por telas avançadas.
- Se cria autenticação, layout e permissões antes de CRUDs.
- Se as tabelas têm paginação server-side.
- Se respeita o guia visual.
- Se não usa service role no frontend.
- Se prevê testes e QA a cada fase.

Só aprove a Fase 1.
