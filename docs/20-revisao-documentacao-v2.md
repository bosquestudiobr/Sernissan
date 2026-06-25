# Revisão da documentação - versão 2

## O que foi revisado

Arquivos-base recebidos/analisados:

- `README.md`;
- `AGENTS.md`;
- `.env.example`;
- `Guia Visual de UX-UI — SerNissan.pdf`;
- pacote anterior `sernissan_cursor_docs`.

## Melhorias aplicadas

### 1. Orquestração para Cursor

Antes, o pacote já orientava a ler documentos e usar Plan Mode. Nesta versão, a execução foi reforçada com:

- prompt v2 mais rígido;
- plano por fases;
- checklist pré-execução;
- regras adicionais do Cursor;
- instrução para aprovar uma fase por vez.

### 2. UX visual

O guia visual foi convertido para Markdown e detalhado com:

- layout autenticado;
- header;
- sidebar;
- footer;
- tabelas densas;
- componentes obrigatórios;
- telas de indicadores, competências e solicitações.

### 3. Arquitetura de código

Adicionado documento específico para:

- estrutura de pastas Next.js;
- separação `app`, `features`, `server`, `lib`;
- queries paginadas;
- Server Actions;
- permissões centralizadas;
- jobs idempotentes.

### 4. Supabase/RLS

Adicionado documento específico para:

- princípios de RLS;
- helpers SQL sugeridos;
- índices;
- storage;
- MCP seguro;
- revisão antes de produção.

### 5. QA

Adicionado checklist de QA por módulo:

- autenticação;
- indicadores;
- placar;
- competências;
- visitas/RV;
- visual;
- permissões.

## Pontos ainda dependentes de validação humana

Mesmo com documentação melhorada, ainda exigem QA manual:

- regras finais de pontuação do placar;
- permissões exatas por perfil;
- regras finais de cada status de solicitação;
- equivalência visual pixel-perfect;
- dados reais de importação/API;
- nomenclaturas finais no banco;
- RLS de produção.

## Recomendação

Use este pacote para gerar a primeira versão completa com IA, mas trate o resultado como versão de homologação, não produção imediata.
