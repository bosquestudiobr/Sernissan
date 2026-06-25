# Fase 4 - Biblioteca de indicadores

Objetivo: reproduzir a tela de Biblioteca de indicadores com fidelidade visual e performance.

## Escopo

- Rota `/biblioteca-indicadores`.
- Filtros por área/função.
- Busca por nome/sigla.
- Tabela densa.
- Paginação server-side.
- Criar/editar/excluir/arquivar indicador.
- Ativar/desativar.
- Copy ID.
- Checar indicadores.

## Referências

- `docs/13-guia-visual-ux-ui.md`.
- `references/screenshots/biblioteca-indicadores.png`.

## Critério de aceite

- Visual próximo ao Bubble.
- Sem filtro client-side de lista grande.
- Sem `select('*')`.
- Mutations validadas com Zod.
- Ações por linha funcionam.
