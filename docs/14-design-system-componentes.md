# Design system e componentes - SerNissan

Este documento transforma o guia visual em especificação prática para implementação com Tailwind + shadcn/ui.

## Tokens visuais sugeridos

Use tokens no Tailwind/CSS variables, não valores soltos espalhados pelo app.

```css
:root {
  --sn-bg: #f2f2f2;
  --sn-card: #ffffff;
  --sn-text: #111111;
  --sn-muted: #6f6f6f;
  --sn-border: #e5e5e5;
  --sn-field: #f5f5f5;
  --sn-black: #000000;
  --sn-red: #c3002f;
  --sn-red-dark: #990026;
  --sn-green-soft: #bdd8b4;
  --sn-yellow-soft: #f2f3c7;
  --sn-red-soft: #e9a9b6;
}
```

## Layout global

### `AppShell`

Responsável por:

- montar header, sidebar, main e footer;
- controlar largura da sidebar;
- preservar altura mínima da viewport;
- aplicar fundo cinza claro;
- garantir que o footer fique no final.

Props sugeridas:

```ts
type AppShellProps = {
  children: React.ReactNode
  user: CurrentUserView
  context: OrganizationalContext
  activeModule: AppModule
}
```

### `AppHeader`

Responsável por:

- logo;
- seletores de contexto;
- dados do usuário;
- avatar;
- menu de conta.

Não deve buscar dados no client. Receber dados já resolvidos por Server Component.

### `AppSidebar`

Responsável por:

- navegação de módulos;
- estado ativo;
- tooltips;
- permissão por perfil.

A lista de itens deve vir de um helper filtrado por perfil/escopo.

## Tabelas

### `ServerDataTable`

Obrigatório para listagens administrativas.

Características:

- recebe dados paginados do servidor;
- recebe `page`, `pageSize`, `total`, `sort`, `filters`;
- atualiza URL query params;
- não carrega todos os dados para filtrar no browser;
- renderiza células compactas;
- expõe slots para actions e cells customizadas.

Estrutura sugerida:

```ts
type PaginatedResult<T> = {
  data: T[]
  page: number
  pageSize: number
  total: number
  pageCount: number
}
```

### `InlineEditableCell`

Usada em telas como indicadores.

Regras:

- editar inline somente campos permitidos;
- salvar via Server Action validada por Zod;
- mostrar loading por célula/linha;
- reverter em erro;
- atualizar cache/rota após sucesso.

## Formulários

Padrão:

- React Hook Form;
- Zod schema no módulo da feature;
- Server Action validando novamente no servidor;
- mensagens de erro por campo;
- toast somente como complemento, nunca como única confirmação.

## Estados obrigatórios

Toda tela de dados deve ter:

- loading state;
- empty state;
- error state;
- unauthorized/forbidden state quando aplicável.

## Componentes por módulo

### Indicadores

- `IndicatorLibraryTable`
- `IndicatorObjectiveTable`
- `IndicatorFormDialog`
- `IndicatorRequestDialog`
- `IndicatorFilters`
- `IndicatorWeightSelect`
- `IndicatorUnitSelect`
- `IndicatorActiveSwitch`

### Placar

- `ScoreboardHeader`
- `ScoreboardRankingTable`
- `ScoreboardIndicatorTable`
- `ScoreboardCollaboratorFilter`
- `ScoreboardSummaryCards`
- `RecalculateScoreboardButton`

### Competências

- `CompetencyMatrix`
- `CompetencyCollaboratorCard`
- `CompetencyCell`
- `CompetencyStageHeader`
- `CompetencyPdfButton`

### Solicitações

- `RegistrationRequestsTable`
- `InclusionRequestsTable`
- `RequestReviewDialog`
- `ApproveRequestButton`

### RV/Visitas

- `VisitListTable`
- `VisitForm`
- `PublicRvSignaturePage`
- `VisitAttachmentsList`
- `NextStepsTable`

## Acessibilidade mínima

- Todo botão de ícone precisa de `aria-label`.
- Inputs devem ter label ou `aria-label`.
- Modais precisam de título acessível.
- Contraste de texto deve ser legível.
- Tabelas devem ter cabeçalhos semânticos.

## Não fazer

- Não criar 10 variações de botão sem necessidade.
- Não duplicar tabela manual em cada página.
- Não usar filtro client-side para dados grandes.
- Não depender de cor como única indicação de estado.
- Não esconder erros silenciosamente.
