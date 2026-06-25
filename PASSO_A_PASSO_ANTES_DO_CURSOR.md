# Passo a passo antes de executar o agente do Cursor em Plan Mode

Este é o roteiro operacional para preparar o projeto antes de pedir ao Cursor para criar o app.

## 1. Preparar máquina local

Instale ou confirme:

```bash
node -v
pnpm -v
git --version
npx supabase --version
```

Recomendado:

- Node.js LTS atual.
- pnpm como package manager.
- Git configurado.
- Supabase CLI instalado via `pnpm dlx`, `npx` ou globalmente.
- Cursor atualizado.

## 2. Criar repositório limpo

Crie uma pasta nova para o projeto:

```bash
mkdir sernissan-next
cd sernissan-next
git init
```

Copie este pacote de documentação para dentro do repositório, mantendo a estrutura:

```txt
AGENTS.md
README.md
.env.example
.cursor/
docs/
prompts/
supabase/
references/
cursor-tasks/
```

Faça o primeiro commit apenas com documentação:

```bash
git add .
git commit -m "docs: adicionar documentação inicial SerNissan"
```

## 3. Criar projeto Supabase de desenvolvimento

Crie um projeto Supabase novo, exclusivo para desenvolvimento/QA.

Não use produção nesta fase.

Anote:

- Project URL.
- Project Ref.
- Publishable key.
- Secret key ou service role key, somente para servidor/scripts.

## 4. Criar `.env.local`

Copie o exemplo:

```bash
cp .env.example .env.local
```

Preencha pelo menos:

```env
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_PROJECT_REF=seu_project_ref
SUPABASE_SECRET_KEY=sb_secret_xxx
```

Nunca commite `.env.local`.

## 5. Configurar Supabase CLI

Faça login:

```bash
npx supabase login
```

Inicialize/linke o projeto, se ainda não estiver linkado:

```bash
npx supabase init
npx supabase link --project-ref SEU_PROJECT_REF
```

Para testar localmente, use:

```bash
npx supabase start
```

## 6. Aplicar migrations em ambiente seguro

Primeiro rode local, se possível:

```bash
npx supabase db reset
```

Se for aplicar no projeto remoto de desenvolvimento:

```bash
npx supabase db push
```

Atenção:

- `0001_initial_schema.sql` é a base inicial proposta.
- `0002_dev_rls_draft_review_before_prod.sql` é draft de RLS para dev.
- Antes de produção, peça ao Cursor para revisar RLS e permissões por perfil.

## 7. Criar buckets privados no Supabase Storage

Crie estes buckets no Dashboard Supabase ou por migration futura:

- `avatars`
- `logos`
- `rv-anexos`
- `uploads`

Padrão: buckets privados. Usar signed URLs para acesso a arquivos sensíveis.

## 8. Gerar tipos TypeScript do Supabase

Depois das migrations aplicadas:

```bash
mkdir -p src/lib/supabase
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/lib/supabase/database.types.ts
```

Se estiver usando Supabase local:

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## 9. Configurar MCP do Supabase no Cursor

Comece em modo seguro.

Opção A: use a UI do Cursor:

1. Abra Cursor.
2. Vá em Settings.
3. Abra Tools & MCP.
4. Adicione o MCP do Supabase.
5. Use o servidor remoto oficial: `https://mcp.supabase.com/mcp`.
6. Autentique com sua conta Supabase.
7. Escopo: projeto de desenvolvimento.
8. Prefira read-only no começo.

Opção B: use o arquivo de exemplo:

```bash
cp .cursor/mcp.example.json .cursor/mcp.json
```

Depois ajuste conforme a UI atual do Cursor e autentique.

Checklist de validação do MCP:

- O Cursor mostra o servidor Supabase como conectado.
- O agente consegue listar tabelas do projeto dev.
- O agente não está conectado ao projeto de produção.
- O agente não recebeu secret key no prompt.

## 10. Criar app Next.js somente depois da documentação estar no repo

Peça ao Cursor para criar ou completar o app. Se preferir criar a base manualmente:

```bash
pnpm create next-app@latest . --ts --eslint --app --src-dir --tailwind --import-alias "@/*"
```

Depois instale bibliotecas esperadas:

```bash
pnpm add @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers @tanstack/react-table @tanstack/react-query lucide-react class-variance-authority clsx tailwind-merge
pnpm add -D vitest @testing-library/react @testing-library/jest-dom playwright
```

shadcn/ui pode ser inicializado pelo agente ou manualmente:

```bash
pnpm dlx shadcn@latest init
```

## 11. Antes de abrir o Plan Mode

Confirme:

- Docs estão dentro do repo.
- `.cursor/rules` está presente.
- `.env.local` está preenchido.
- Supabase dev existe.
- Migrations foram testadas localmente ou no dev.
- MCP está conectado ao projeto dev.
- Git tem commit limpo.
- Você sabe qual modelo usará no Cursor.

## 12. Rodar Cursor em Plan Mode

No chat do agente do Cursor:

1. Ative Plan Mode com `Shift+Tab`.
2. Cole o conteúdo de `prompts/cursor-plan-prompt-v2.md`.
3. Peça para o agente apenas planejar.
4. Revise o plano.
5. Salve o plano em `.cursor/plans/`.
6. Execute uma fase por vez.

## 13. Como aprovar a execução

Depois do plano aprovado, diga algo como:

```txt
Execute apenas a Fase 1. Não implemente fases futuras ainda. Ao terminar, rode typecheck/lint/test quando possível e me entregue o resumo de QA.
```

Repita fase por fase.

## 14. O que não fazer

- Não conectar o Cursor ao Supabase de produção.
- Não colar service role/secret key no chat.
- Não pedir “faça tudo de uma vez”.
- Não aceitar UI genérica diferente das referências.
- Não aceitar listagens sem paginação.
- Não aceitar permissões apenas no frontend.
- Não aplicar RLS final sem testar por perfil.
- Não fazer deploy antes do QA manual dos fluxos críticos.
