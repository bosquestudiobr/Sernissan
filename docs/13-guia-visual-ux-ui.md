# Guia visual de UX/UI - SerNissan

Este guia deve ser tratado como contrato visual inicial. O objetivo é reconstruir o app com tecnologia nova, mas preservando a experiência de uso do Bubble atual.

Referências incluídas no pacote:

- `references/design/guia-visual-ux-ui-sernissan-original.pdf`
- `references/screenshots/biblioteca-indicadores.png`

## Princípio central

Não criar uma interface SaaS genérica. A UI deve parecer uma evolução técnica do SerNissan atual:

- administrativa;
- densa;
- rápida;
- objetiva;
- com forte uso de tabelas;
- visual corporativo Nissan/SerNissan;
- foco em desktop.

## Layout autenticado padrão

Toda página autenticada deve usar o mesmo `AppShell`:

```txt
+-------------------------------------------------------------+
| Header fixo: logo, contexto organizacional, usuário/avatar  |
+------+------------------------------------------------------+
| Side | Conteúdo principal                                   |
| bar  | título, ações, filtros, cards, tabelas               |
+------+------------------------------------------------------+
| Footer preto                                                |
+-------------------------------------------------------------+
```

### Header

Elementos:

- logo SerNissan à esquerda;
- ícone/atalho de hierarquia;
- seletor de Setor;
- seletor de Grupo;
- seletor de Concessionária;
- nome do usuário;
- perfil/cargo;
- avatar circular.

Comportamento:

- deve ficar no topo;
- deve mostrar claramente o contexto atual;
- dropdowns devem ser discretos;
- trocar contexto deve atualizar a sessão/contexto do usuário e recarregar dados escopados.

### Sidebar

Características:

- compacta, entre 64px e 80px;
- vertical;
- fundo branco/cinza claro;
- ícones centralizados;
- item ativo em vermelho;
- botão de expandir/retrair em vermelho;
- tooltips em hover;
- não ocupar espaço excessivo porque as tabelas são largas.

### Footer

Características:

- preto;
- fixo no rodapé da viewport quando o conteúdo for curto;
- com copyright à esquerda;
- política de privacidade centralizada;
- ícones sociais à direita.

Texto base:

```txt
© 2026 NISSAN | SERNISSAN - INDIVIDUANDO
Política de Privacidade
```

## Padrão de página

Cada página deve iniciar com:

- título grande em negrito;
- ações principais ao lado do título;
- filtros dentro do card ou imediatamente abaixo do título;
- card branco com sombra leve;
- tabela/lista densa.

Exemplo de título:

```txt
Biblioteca de indicadores    [+ Indicador] [Checar indicadores]
```

## Botões

### Botão primário preto

Uso:

- adicionar;
- solicitar;
- confirmar;
- abrir módulos importantes.

Estilo:

- fundo preto;
- texto branco;
- altura de 36px a 44px;
- borda arredondada;
- ícone opcional à esquerda;
- fonte semibold.

### Botão vermelho Nissan

Uso:

- ação de destaque;
- refresh;
- navegação crítica;
- exclusão/alerta quando aplicável.

Estilo:

- vermelho Nissan;
- texto branco;
- borda arredondada;
- ícone branco.

### Botões de ícone

Uso em linhas de tabela:

- editar;
- excluir;
- copiar ID;
- visualizar;
- aprovar;
- abrir detalhes.

Estilo:

- discretos;
- cinza/preto;
- hover suave;
- acessíveis com `aria-label`.

## Tabelas administrativas

As tabelas são o coração do app. Elas devem manter a densidade do Bubble.

Regras:

- paginação server-side obrigatória;
- filtros server-side;
- busca server-side com debounce no client;
- altura de linha compacta;
- cabeçalhos negrito;
- inputs inline dentro das células quando a tela exigir edição rápida;
- campos editáveis com fundo cinza claro;
- actions fixas no lado direito quando possível;
- scroll horizontal em telas menores;
- estados de loading, empty e error.

## Biblioteca de indicadores

Colunas esperadas:

- drag/ordenação;
- Nome;
- Sigla;
- API;
- Áreas;
- Funções;
- Peso;
- Unidade;
- Meta;
- símbolo de unidade;
- Ativo;
- Excluir;
- Editar;
- Copy ID.

Filtros:

- Área;
- Função;
- busca por nome ou sigla.

Ações:

- `+ Indicador`;
- `Checar indicadores`;
- editar;
- excluir;
- copiar ID;
- ativar/desativar.

## Indicadores e Objetivos

Estrutura:

- título `Indicadores e Objetivos`;
- botão refresh vermelho;
- botão `Biblioteca` vermelho;
- botão preto `+ Solicitar Indicador`;
- card com filtros e tabela.

Deve mostrar contador de solicitações pendentes, por exemplo:

```txt
3 indicadores solicitados
```

## Calibração de competências

A tela deve preservar o aspecto de matriz.

Topo:

- título `Calibração de Competências`;
- botões: informação, baixar PDF, colaboradores, calibração, performance, excluir;
- card do colaborador com foto, nome, perfil, áreas, funções e última atualização.

Matriz:

- coluna de competência;
- coluna de descrição/pergunta;
- colunas de etapas/avaliadores;
- coluna de ações.

Cores:

- `Sim`: verde claro;
- `Parcial`: amarelo claro;
- `Não`: vermelho/rosa claro;
- cabeçalhos: preto/cinza escuro.

## Solicitações de cadastro

A tela tem duas seções:

1. Solicitações de cadastro.
2. Solicitações de inclusão.

Tabela de cadastro:

- avatar/ícone;
- Nome;
- Email;
- Área;
- Função;
- Concessionária;
- ação de editar/analisar.

Tabela de inclusão:

- Usuário;
- Concessionária;
- Tipo de inclusão;
- Data;
- Ações.

## Inputs e selects

- fundo cinza claro;
- borda discreta;
- cantos arredondados;
- altura compacta;
- placeholder cinza;
- selects com seta;
- inputs de tabela integrados à linha.

## Switches

Usados para booleanos como `Ativo`.

Ativo:

- fundo preto;
- bolinha branca.

Inativo:

- fundo cinza;
- bolinha clara.

## Responsividade

Prioridade inicial: desktop.

Regras:

- largura ideal mínima: 1280px;
- tabelas com scroll horizontal em telas menores;
- sidebar sempre compacta;
- header deve preservar contexto organizacional;
- não transformar tabelas densas em cards mobile na primeira versão.

## Componentes obrigatórios

O agente deve criar componentes reutilizáveis:

- `AppShell`;
- `AppHeader`;
- `AppSidebar`;
- `AppFooter`;
- `PageTitleActions`;
- `DataCard`;
- `ServerDataTable`;
- `SearchInput`;
- `FilterSelect`;
- `StatusSwitch`;
- `IconButton`;
- `UserAvatar`;
- `MetricWeightSelect`;
- `CompetencyMatrix`;
- `InlineEditableCell`;
- `ConfirmDialog`;
- `EmptyState`;
- `LoadingState`;
- `ErrorState`.
