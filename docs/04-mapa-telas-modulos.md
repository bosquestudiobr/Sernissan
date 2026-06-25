# Mapa de telas, módulos e reusable elements

O app atual é uma SPA centrada na página `index`, que carrega módulos por URL/state usando reusable elements. Na reconstrução, a recomendação é transformar cada reusable relevante em uma rota ou feature module do Next.js.

## Páginas Bubble

| Página | Elementos | Workflows | Ações | Função recomendada no novo app |
|---|---:|---:|---:|---|
| `reset_pw` | 69 | 5 | 9 | Reset de senha |
| `404` | 11 | 1 | 1 | Erro 404 |
| `index` | 316 | 19 | 24 | Shell autenticada/dashboard principal |
| `entrar` | 244 | 14 | 27 | Login/cadastro/convite |
| `updates` | 243 | 27 | 64 | Rotinas administrativas/migração/manutenção |
| `offline` | 12 | 0 | 0 | Tela offline/PWA |
| `termos` | 12 | 1 | 1 | Termos/cookies |
| `test` | 6 | 1 | 1 | Ambiente de teste |
| `rv-publico` | 135 | 0 | 0 | Página pública de assinatura/ciência de visita |
| `pilulas` | 4 | 1 | 1 | Pílulas de conhecimento |

## Reusable elements / módulos Bubble

| Reusable | Elementos | Workflows | Ações | Searches | filtered | Papel provável | Rota/feature sugerida |
|---|---:|---:|---:|---:|---:|---|---|
| `Cookies-Popup` | 16 | 4 | 8 | 0 | 0 | Consentimento de cookies | `componente interno` |
| `Seletor Calibracao` | 127 | 4 | 16 | 0 | 0 | Seletor de calibração | `componente interno` |
| `_header` | 248 | 34 | 50 | 6 | 0 | Header, navegação, troca de contexto hierárquico | `componente interno` |
| `agenda` | 371 | 29 | 54 | 8 | 1 | Agenda/calendário | `/app/agenda` |
| `ajuda` | 85 | 3 | 6 | 0 | 1 | FAQ/ajuda | `componente interno` |
| `areas-funcoes` | 205 | 15 | 36 | 3 | 0 | Gestão de áreas e funções | `/app/admin/areas-funcoes` |
| `calendario` | 95 | 8 | 12 | 0 | 3 | Componente de calendário customizado | `componente interno` |
| `competencias-calibracao` | 1313 | 40 | 85 | 8 | 84 | Calibração de competências | `/app/competencias` |
| `competencias-mapa` | 534 | 30 | 57 | 9 | 3 | Mapa de competências | `/app/competencias` |
| `concessionaria` | 354 | 22 | 48 | 5 | 0 | CRUD de concessionárias | `/app/admin/concessionaria` |
| `divisoes` | 235 | 16 | 38 | 5 | 0 | CRUD de divisões | `/app/admin/divisoes` |
| `empresa` | 115 | 9 | 17 | 7 | 0 | CRUD/configuração da empresa | `/app/admin/empresa` |
| `equipe` | 860 | 39 | 103 | 11 | 9 | Gestão da equipe e colaboradores | `/app/equipe` |
| `grupos` | 464 | 33 | 77 | 11 | 0 | CRUD de grupos | `/app/admin/grupos` |
| `habitos` | 100 | 5 | 10 | 1 | 0 | Gestão de hábitos | `/app/habitos` |
| `home` | 32 | 0 | 0 | 2 | 0 | Home/dashboard inicial | `componente interno` |
| `indicadores` | 658 | 40 | 82 | 26 | 10 | Gestão de indicadores por concessionária/placar | `/app/indicadores` |
| `indicadores-admin` | 365 | 27 | 49 | 8 | 5 | Biblioteca/admin de indicadores | `/app/admin/indicadores-admin` |
| `loading` | 3 | 0 | 0 | 0 | 0 | Loading global | `componente interno` |
| `paises` | 318 | 23 | 52 | 2 | 0 | CRUD de países | `/app/admin/paises` |
| `placar` | 2147 | 102 | 269 | 39 | 74 | Placar de performance, rankings e indicadores | `/app/placar` |
| `pp - reprodutor de videos` | 12 | 1 | 1 | 0 | 0 | Player de vídeos | `componente interno` |
| `pp hierarquia` | 135 | 16 | 32 | 1 | 0 | Popup de seleção de hierarquia | `componente interno` |
| `preferencias` | 134 | 10 | 19 | 0 | 0 | Preferências do usuário | `componente interno` |
| `setores` | 248 | 18 | 42 | 5 | 0 | CRUD de setores | `/app/admin/setores` |
| `solicitações` | 277 | 15 | 32 | 8 | 1 | Solicitações | `componente interno` |
| `usuarios` | 714 | 35 | 70 | 40 | 4 | Gestão de usuários | `/app/usuarios` |
| `visitas` | 808 | 35 | 61 | 4 | 14 | Relatórios de visita e assinaturas | `/app/visitas` |
| `xr_areas` | 143 | 9 | 22 | 1 | 0 | Áreas de reunião/resultados | `/app/reuniao-resultados` |
| `xr_indicadores` | 143 | 9 | 22 | 1 | 0 | Indicadores da reunião de resultados | `/app/reuniao-resultados` |
| `xr_indicadores` | 261 | 13 | 34 | 3 | 0 | Indicadores da reunião de resultados | `/app/reuniao-resultados` |
| `xr_reuniao_resultados` | 1181 | 36 | 87 | 10 | 21 | Reunião de resultados | `/app/reuniao-resultados` |


## Regras de migração UI

- Converter reusable elements grandes em rotas e componentes menores.
- Evitar uma SPA única com todos os módulos escondidos; usar rotas segmentadas do App Router.
- Dashboards e placares devem carregar dados agregados por views/materialized views ou RPCs no Supabase.
- Formulários devem usar Server Actions ou mutations controladas com validação Zod.
- Tabelas grandes devem usar paginação server-side, filtros por query params e índices no banco.
