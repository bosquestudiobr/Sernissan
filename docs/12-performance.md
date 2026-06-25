# Performance, WU e melhorias estruturais na reconstrução

## Problemas do Bubble a evitar

- Muitos reusable elements carregados na SPA `index`.
- Muitos `Search` e `filtered` em componentes pesados.
- Uso de `ChangeListOfThings` em workflows grandes.
- Listas grandes armazenadas dentro de registros-pai.
- Cálculos de dashboard/placar em tempo real na UI.
- Triggers que podem causar cascata.

## Substituições no novo app

| Bubble | Novo app |
|---|---|
| `Do a search for` sem paginação | Query server-side paginada com índice |
| `:filtered` | WHERE no Postgres |
| Lista em campo pai | Join table / FK no filho |
| Cálculo na tela | View, materialized view ou RPC |
| Workflow client-side pesado | Server Action + job/Edge Function |
| Trigger Bubble em cascata | Job idempotente + fila |
| SPA com tudo escondido | Rotas segmentadas e lazy loading |

## Índices obrigatórios iniciais

- Todas as foreign keys.
- `profiles(perfil)`.
- `profiles(ativo, aprovado)`.
- `indicadores(placar_id)`.
- `indicadores(concessionaria_id)`.
- `indicadores(ativo, status_adm)`.
- `placar(concessionaria_id, data)`.
- `rv(dealer_id, status, data_visita)`.
- `agendamentos(concessionaria_id, data)` quando o campo existir.

## Dashboards e placar

Criar views/RPCs:

- `vw_placar_ranking_colaborador`
- `vw_placar_ranking_funcao`
- `vw_placar_indicadores_resumo`
- `vw_concessionaria_status_report`

## Cache

- Dados de menu e option sets podem ser cacheados.
- Dados sensíveis por usuário devem respeitar RLS e não devem ser cacheados globalmente.
- Invalidação por módulo após mutations.
