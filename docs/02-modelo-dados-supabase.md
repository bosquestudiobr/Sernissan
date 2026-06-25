# Modelo de dados atual e proposta Supabase

Este documento lista todos os tipos de dados exportados do Bubble e a recomendação de modelagem no Supabase/Postgres.

## Decisões de modelagem

1. `User` do Bubble vira `auth.users` + tabela pública `profiles`.
2. Campos `custom.X` viram foreign keys UUID para `public.X`.
3. Campos `list.custom.X` e `list.user` viram tabelas de relacionamento, não arrays.
4. Campos `option.X` viram `text` referenciando valores de `app_options`.
5. Campos `image` e `file` guardam o path do Supabase Storage, não a URL pública definitiva.
6. Campos marcados como deletados no Bubble ficam documentados, mas foram omitidos da migration inicial.

## Tabelas recomendadas

| Bubble type | Display | Tabela Supabase | Campos | Campos deletados/legado |
|---|---|---|---:|---:|
| `rv` | RV | `rv` | 22 | 0 |
| `loh` | Log | `loh` | 4 | 0 |
| `pais` | 1-pais | `pais` | 5 | 0 |
| `user` | User | `profiles` | 32 | 2 |
| `debug` | debug | `debug` | 1 | 0 |
| `grupo` | 4-grupo | `grupo` | 7 | 0 |
| `placar` | 7-placar | `placar` | 14 | 4 |
| `divisao` | 2-divisao | `divisao` | 5 | 0 |
| `empresa` | 0-empresa | `empresa` | 12 | 1 |
| `habitos` | Habitos | `habitos` | 0 | 0 |
| `rv_foco` | RV Foco | `rv_foco` | 3 | 0 |
| `setores` | 3-setor | `setores` | 7 | 0 |
| `xr_acao` | xr_acao | `xr_acao` | 11 | 2 |
| `xr_meta` | xr_meta | `xr_meta` | 2 | 0 |
| `feedback` | Feedback | `feedback` | 4 | 0 |
| `rv_anexo` | RV Anexo | `rv_anexo` | 6 | 0 |
| `grupo_ndp` | xr_grupo_ndp | `grupo_ndp` | 5 | 0 |
| `xr_placar` | xr_preliminar | `xr_placar` | 6 | 0 |
| `instru__es` | Instruções | `instru_es` | 4 | 1 |
| `indicadores` | 6-indicador | `indicadores` | 31 | 0 |
| `agendamentos` | agendamento | `agendamentos` | 12 | 0 |
| `competencias` | Competencias | `competencias` | 1 | 0 |
| `faq_pergunta` | Dashboard FAQ | `faq_pergunta` | 4 | 0 |
| `rv_auditoria` | RV Auditoria | `rv_auditoria` | 6 | 0 |
| `solicitacoes` | Solicitacoes | `solicitacoes` | 7 | 0 |
| `xr_simulador` | Xr_simulacao | `xr_simulador` | 6 | 1 |
| `rv_assinatura` | RV Assinatura | `rv_assinatura` | 11 | 0 |
| `rv_modalidade` | RV Modalidade | `rv_modalidade` | 3 | 0 |
| `slide_options` | Dashboard Slide | `slide_options` | 4 | 0 |
| `xr_ano_fiscal` | xr_ano_fiscal | `xr_ano_fiscal` | 3 | 0 |
| `concessionaria` | 5-concessionaria | `concessionaria` | 21 | 0 |
| `rr_indicadores` | xr_indicador | `rr_indicadores` | 18 | 2 |
| `placar_exclus_o` | placar exclusão | `placar_exclus_o` | 7 | 0 |
| `rv_participante` | RV Participante | `rv_participante` | 4 | 0 |
| `competencia_mapa` | Competencia Mapa | `competencia_mapa` | 19 | 5 |
| `rv_proximo_passo` | RV Proximo Passo | `rv_proximo_passo` | 6 | 0 |
| `competencia_mapa1` | Competencia Mapa | `competencia_mapa1` | 16 | 3 |
| `competencia_mapa2` | Competencia Mapa | `competencia_mapa2` | 16 | 3 |
| `dashboard_options` | Dashboard Options | `dashboard_options` | 8 | 0 |
| `xr_tipo_indicador` | xr_area | `xr_tipo_indicador` | 4 | 1 |
| `competencia_habito` | Competencia Habito | `competencia_habito` | 10 | 1 |
| `funcao_colaborador` | funcao | `funcao_colaborador` | 5 | 0 |
| `xr_resultado_final` | xr_resultado_final | `xr_resultado_final` | 8 | 0 |
| `calibracao_resultado` | Calibracao Resultado | `calibracao_resultado` | 15 | 2 |
| `setor_concessionaria` | area | `setor_concessionaria` | 3 | 0 |
| `competencia_indicador` | Competencia Indicador | `competencia_indicador` | 0 | 0 |
| `competencia_calibracao` | Competencia Calibracao | `competencia_calibracao` | 19 | 6 |
| `xr_indicador_resultado` | xr_resultado | `xr_indicador_resultado` | 9 | 0 |

---

## `rv` — RV

Tabela recomendada: `rv`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| relato | `relato` | `text` | `text` | ativo |  |
| hora_fim | `hora_fim` | `date` | `timestamptz` | ativo |  |
| consultor | `consultor` | `user` | `uuid` | ativo | FK |
| enviado_em | `enviado_em` | `date` | `timestamptz` | ativo |  |
| assinado_em | `assinado_em` | `date` | `timestamptz` | ativo |  |
| data_visita | `data_visita` | `date` | `timestamptz` | ativo |  |
| hora_inicio | `hora_inicio` | `date` | `timestamptz` | ativo |  |
| ip_assinatura | `ip_assinatura` | `text` | `text` | ativo |  |
| token_ciencia | `token_ciencia` | `text` | `text` | ativo |  |
| foco | `foco` | `custom.rv_foco` | `uuid` | ativo | FK |
| hash_assinatura | `hash_assinatura` | `text` | `text` | ativo |  |
| pontos_destaque | `pontos_destaque` | `text` | `text` | ativo |  |
| comentario_ciencia | `comentario_ciencia` | `text` | `text` | ativo |  |
| operador_assinante | `operador_assinante` | `user` | `uuid` | ativo | FK |
| avaliacao_consultor | `avaliacao_consultor` | `text` | `text` | ativo |  |
| bloqueado_edicao | `bloqueado_edicao` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| gerentes_copia | `gerentes_copia` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| data_expiracao_token | `data_expiracao_token` | `date` | `timestamptz` | ativo |  |
| user_agent_assinatura | `user_agent_assinatura` | `text` | `text` | ativo |  |
| dealer | `dealer` | `custom.concessionaria` | `uuid` | ativo | FK |
| status | `status` | `option.status_de_visita` | `text` | ativo | usar app_options |
| modalidade | `modalidade` | `custom.rv_modalidade` | `uuid` | ativo | FK |

---

## `loh` — Log

Tabela recomendada: `loh`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| text | `text` | `text` | `text` | ativo |  |
| type | `type` | `option.log_type` | `text` | ativo | usar app_options |
| action | `action` | `option.log_action` | `text` | ativo | usar app_options |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `pais` — 1-pais

Tabela recomendada: `pais`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| id | `id` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| divisoes | `divisoes` | `list.custom.divisao` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| dashboard_options | `dashboard_options` | `custom.dashboard_options` | `uuid` | ativo | FK |

---

## `user` — User

Tabela recomendada: `profiles`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| cpf - deleted | `cpf_deleted` | `number` | `numeric` | legado/deletado |  |
| foto | `foto` | `image` | `text` | ativo | guardar path do Supabase Storage |
| changed | `changed` | `date` | `timestamptz` | ativo |  |
| dominio | `dominio` | `text` | `text` | ativo |  |
| ativo | `ativo` | `boolean` | `boolean` | ativo |  |
| cpf-text | `cpf_text` | `text` | `text` | ativo |  |
| aprovado | `aprovado` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| last_update | `last_update` | `date` | `timestamptz` | ativo |  |
| novo_acesso | `novo_acesso` | `date` | `timestamptz` | ativo |  |
| pais | `pais` | `custom.pais` | `uuid` | ativo | FK |
| responsavel | `responsavel` | `user` | `uuid` | ativo | FK |
| grupo | `grupo` | `custom.grupo` | `uuid` | ativo | FK |
| ultimo_acesso | `ultimo_acesso` | `date` | `timestamptz` | ativo |  |
| ativo_placar | `ativo_placar` | `boolean` | `boolean` | ativo |  |
| mover_equipe | `mover_equipe` | `boolean` | `boolean` | ativo |  |
| perfil | `perfil` | `option.perfil` | `text` | ativo | usar app_options |
| setor | `setor` | `custom.setores` | `uuid` | ativo | FK |
| videos_temp | `videos_temp` | `list.text` | `text[]` | ativo |  |
| divisao | `divisao` | `custom.divisao` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| convite_enviado | `convite_enviado` | `boolean` | `boolean` | ativo |  |
| last-placar - deleted | `last_placar_deleted` | `custom.placar` | `uuid` | legado/deletado | FK |
| ultimo_placar | `ultimo_placar` | `custom.placar` | `uuid` | ativo | FK |
| cookies-pp-displayed | `cookies_pp_displayed` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| area | `area` | `custom.setor_concessionaria` | `uuid` | ativo | FK |
| funcao | `funcao` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| grupos_disponiveis | `grupos_disponiveis` | `list.custom.grupo` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |
| ultima_funcao_placar | `ultima_funcao_placar` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| concessionarias_equipe | `concessionarias_equipe` | `list.custom.concessionaria` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| areas_disponiveis | `areas_disponiveis` | `list.custom.setor_concessionaria` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `debug` — debug

Tabela recomendada: `debug`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| conteudo | `conteudo` | `text` | `text` | ativo |  |

---

## `grupo` — 4-grupo

Tabela recomendada: `grupo`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| id | `id` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| admin-2 | `admin_2` | `user` | `uuid` | ativo | FK |
| setor | `setor` | `custom.setores` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| grupo_ndp | `grupo_ndp` | `custom.grupo_ndp` | `uuid` | ativo | FK |
| concessionarias | `concessionarias` | `list.custom.concessionaria` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `placar` — 7-placar

Tabela recomendada: `placar`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| finalizado | `finalizado` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| count-placar - deleted | `count_placar_deleted` | `number` | `numeric` | legado/deletado |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| indicadores_created_count-deletar - deleted | `indicadores_created_count_deletar_deleted` | `number` | `numeric` | legado/deletado |  |
| ranking-atualizado | `ranking_atualizado` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| colaboradores-start | `colaboradores_start` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| counter-deletar - deleted | `counter_deletar_deleted` | `number` | `numeric` | legado/deletado |  |
| indicadores_need_count-deletar - deleted | `indicadores_need_count_deletar_deleted` | `number` | `numeric` | legado/deletado |  |
| opcao-origem | `opcao_origem` | `option.opcoes_api` | `text` | ativo | usar app_options |
| opcao-acumulado | `opcao_acumulado` | `option.opcoes_api` | `text` | ativo | usar app_options |
| indicadores | `indicadores` | `list.custom.indicadores` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |
| indicadores-start | `indicadores_start` | `list.custom.indicadores` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `divisao` — 2-divisao

Tabela recomendada: `divisao`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| id | `id` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| pais | `pais` | `custom.pais` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| setores | `setores` | `list.custom.setores` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `empresa` — 0-empresa

Tabela recomendada: `empresa`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| fone | `fone` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| email | `email` | `text` | `text` | ativo |  |
| logo | `logo` | `image` | `text` | ativo | guardar path do Supabase Storage |
| logo_dark | `logo_dark` | `image` | `text` | ativo | guardar path do Supabase Storage |
| logo_white | `logo_white` | `image` | `text` | ativo | guardar path do Supabase Storage |
| logo_mobile | `logo_mobile` | `image` | `text` | ativo | guardar path do Supabase Storage |
| cor_principal | `cor_principal` | `text` | `text` | ativo |  |
| cor_secundaria | `cor_secundaria` | `text` | `text` | ativo |  |
| check_emails | `check_emails` | `boolean` | `boolean` | ativo |  |
| pais | `pais` | `list.custom.pais` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| gerente - deleted | `gerente_deleted` | `custom.colaborador` | `uuid` | legado/deletado | FK |

---

## `habitos` — Habitos

Tabela recomendada: `habitos`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|

---

## `rv_foco` — RV Foco

Tabela recomendada: `rv_foco`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| ordem | `ordem` | `number` | `numeric` | ativo |  |
| ativo? | `ativo_bool` | `boolean` | `boolean` | ativo | default Bubble: `True` |

---

## `setores` — 3-setor

Tabela recomendada: `setores`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| id | `id` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| admin-2 | `admin_2` | `user` | `uuid` | ativo | FK |
| divisao | `divisao` | `custom.divisao` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| grupos | `grupos` | `list.custom.grupo` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| grupos_ndp | `grupos_ndp` | `list.custom.grupo_ndp` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `xr_acao` — xr_acao

Tabela recomendada: `xr_acao`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| descricao | `descricao` | `text` | `text` | ativo |  |
| completa | `completa` | `boolean` | `boolean` | ativo |  |
| responsavel | `responsavel` | `text` | `text` | ativo |  |
| preliminar | `preliminar` | `number` | `numeric` | ativo |  |
| responsaveis - deleted | `responsaveis_deleted` | `text` | `text` | legado/deletado |  |
| colaborador-2 - deleted | `colaborador_2_deleted` | `user` | `uuid` | legado/deletado | FK |
| grupo | `grupo` | `custom.grupo` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| responsaveis | `responsaveis` | `list.text` | `text[]` | ativo |  |
| indicador | `indicador` | `custom.rr_indicadores` | `uuid` | ativo | FK |

---

## `xr_meta` — xr_meta

Tabela recomendada: `xr_meta`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| color | `color` | `text` | `text` | ativo |  |

---

## `feedback` — Feedback

Tabela recomendada: `feedback`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| colaborador-2 | `colaborador_2` | `user` | `uuid` | ativo | FK |
| texto | `texto` | `text` | `text` | ativo |  |
| placar | `placar` | `custom.placar` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |

---

## `rv_anexo` — RV Anexo

Tabela recomendada: `rv_anexo`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| tipo | `tipo` | `text` | `text` | ativo |  |
| arquivo | `arquivo` | `file` | `text` | ativo | guardar path do Supabase Storage |
| rv | `rv` | `custom.rv` | `uuid` | ativo | FK |
| uploaded_by | `uploaded_by` | `user` | `uuid` | ativo | FK |
| tamanho_mb | `tamanho_mb` | `number` | `numeric` | ativo |  |

---

## `grupo_ndp` — xr_grupo_ndp

Tabela recomendada: `grupo_ndp`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| id | `id` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| grupo | `grupo` | `custom.grupo` | `uuid` | ativo | FK |
| setor | `setor` | `custom.setores` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |

---

## `xr_placar` — xr_preliminar

Tabela recomendada: `xr_placar`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| id | `id` | `number` | `numeric` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| indicadores | `indicadores` | `list.custom.rr_indicadores` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| resultados | `resultados` | `list.custom.xr_indicador_resultado` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| resultados_finais | `resultados_finais` | `list.custom.xr_resultado_final` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `instru__es` — Instruções

Tabela recomendada: `instru_es`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| lista - deleted | `lista_deleted` | `text` | `text` | legado/deletado |  |
| titulo | `titulo` | `text` | `text` | ativo |  |
| lista | `lista` | `list.text` | `text[]` | ativo |  |
| Tipo | `tipo` | `option.tipo_de_instru__o` | `text` | ativo | usar app_options |

---

## `indicadores` — 6-indicador

Tabela recomendada: `indicadores`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| user | `user` | `user` | `uuid` | ativo | FK |
| sigla | `sigla` | `text` | `text` | ativo |  |
| api_id | `api_id` | `text` | `text` | ativo |  |
| meta | `meta` | `number` | `numeric` | ativo |  |
| ordem | `ordem` | `number` | `numeric` | ativo |  |
| valor | `valor` | `number` | `numeric` | ativo |  |
| ativo | `ativo` | `boolean` | `boolean` | ativo |  |
| pontos | `pontos` | `number` | `numeric` | ativo |  |
| pontos_ranking | `pontos_ranking` | `number` | `numeric` | ativo |  |
| colaborador-user | `colaborador_user` | `user` | `uuid` | ativo | FK |
| customizado | `customizado` | `boolean` | `boolean` | ativo |  |
| placar_count | `placar_count` | `number` | `numeric` | ativo |  |
| user-edicao | `user_edicao` | `user` | `uuid` | ativo | FK |
| ativo-placar | `ativo_placar` | `boolean` | `boolean` | ativo |  |
| placar | `placar` | `custom.placar` | `uuid` | ativo | FK |
| placar_ranking | `placar_ranking` | `number` | `numeric` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| unidade | `unidade` | `option.unidade` | `text` | ativo | usar app_options |
| feedback | `feedback` | `custom.feedback` | `uuid` | ativo | FK |
| meta_customizada | `meta_customizada` | `boolean` | `boolean` | ativo |  |
| classe | `classe` | `option.classe_indicador` | `text` | ativo | usar app_options |
| agendamento | `agendamento` | `custom.agendamentos` | `uuid` | ativo | FK |
| importancia | `importancia` | `option.importancias` | `text` | ativo | usar app_options |
| funcao | `funcao` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| area | `area` | `custom.setor_concessionaria` | `uuid` | ativo | FK |
| status_adm | `status_adm` | `option.toggle_ativo_inativo` | `text` | ativo | usar app_options; default Bubble: `inativo` |
| meta_customizada_justificativa | `meta_customizada_justificativa` | `text` | `text` | ativo |  |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |
| areas | `areas` | `list.custom.setor_concessionaria` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| funcoes | `funcoes` | `list.custom.funcao_colaborador` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `agendamentos` — agendamento

Tabela recomendada: `agendamentos`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data_inicio | `data_inicio` | `date` | `timestamptz` | ativo |  |
| titulo | `titulo` | `text` | `text` | ativo |  |
| user | `user` | `user` | `uuid` | ativo | FK |
| data_fim | `data_fim` | `date` | `timestamptz` | ativo |  |
| gerente | `gerente` | `user` | `uuid` | ativo | FK |
| users | `users` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| dia_todo | `dia_todo` | `boolean` | `boolean` | ativo |  |
| placar | `placar` | `custom.placar` | `uuid` | ativo | FK |
| data_range | `data_range` | `date_range` | `jsonb` | ativo |  |
| convidados | `convidados` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `competencias` — Competencias

Tabela recomendada: `competencias`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| funcoes | `funcoes` | `list.custom.funcao_colaborador` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `faq_pergunta` — Dashboard FAQ

Tabela recomendada: `faq_pergunta`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| pergunta | `pergunta` | `text` | `text` | ativo |  |
| resposta | `resposta` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| categoria | `categoria` | `option.faq_categorias` | `text` | ativo | usar app_options |

---

## `rv_auditoria` — RV Auditoria

Tabela recomendada: `rv_auditoria`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| acao | `acao` | `text` | `text` | ativo |  |
| data | `data` | `date` | `timestamptz` | ativo |  |
| user | `user` | `user` | `uuid` | ativo | FK |
| rv | `rv` | `custom.rv` | `uuid` | ativo | FK |
| descricao | `descricao` | `text` | `text` | ativo |  |
| snapshot_json | `snapshot_json` | `text` | `text` | ativo |  |

---

## `solicitacoes` — Solicitacoes

Tabela recomendada: `solicitacoes`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| text | `text` | `text` | `text` | ativo |  |
| user | `user` | `user` | `uuid` | ativo | FK |
| atendida | `atendida` | `boolean` | `boolean` | ativo |  |
| colaborador-2 | `colaborador_2` | `user` | `uuid` | ativo | FK |
| tipo | `tipo` | `option.solicitacoes_opcoes` | `text` | ativo | usar app_options |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `xr_simulador` — Xr_simulacao

Tabela recomendada: `xr_simulador`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| meta | `meta` | `text` | `text` | ativo |  |
| pontos - deleted | `pontos_deleted` | `number` | `numeric` | legado/deletado |  |
| ndp_competencia | `ndp_competencia` | `number` | `numeric` | ativo |  |
| acoes | `acoes` | `list.custom.xr_acao` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| xr_indicador | `xr_indicador` | `custom.rr_indicadores` | `uuid` | ativo | FK |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `rv_assinatura` — RV Assinatura

Tabela recomendada: `rv_assinatura`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| ip | `ip` | `text` | `text` | ativo |  |
| rv | `rv` | `custom.rv` | `uuid` | ativo | FK |
| comentario | `comentario` | `text` | `text` | ativo |  |
| user_agent | `user_agent` | `text` | `text` | ativo |  |
| hash_sha256 | `hash_sha256` | `text` | `text` | ativo |  |
| token_usado | `token_usado` | `text` | `text` | ativo |  |
| data_hora_utc | `data_hora_utc` | `date` | `timestamptz` | ativo |  |
| assinante_nome | `assinante_nome` | `text` | `text` | ativo |  |
| assinante_user | `assinante_user` | `user` | `uuid` | ativo | FK |
| assinante_cargo | `assinante_cargo` | `text` | `text` | ativo |  |
| dealer | `dealer` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `rv_modalidade` — RV Modalidade

Tabela recomendada: `rv_modalidade`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| ordem | `ordem` | `number` | `numeric` | ativo |  |
| ativo? | `ativo_bool` | `boolean` | `boolean` | ativo | default Bubble: `True` |

---

## `slide_options` — Dashboard Slide

Tabela recomendada: `slide_options`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| image | `image` | `image` | `text` | ativo | guardar path do Supabase Storage |
| titulo | `titulo` | `text` | `text` | ativo |  |
| descricao | `descricao` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |

---

## `xr_ano_fiscal` — xr_ano_fiscal

Tabela recomendada: `xr_ano_fiscal`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| end_date | `end_date` | `date` | `timestamptz` | ativo |  |
| start_date | `start_date` | `date` | `timestamptz` | ativo |  |
| preliminares | `preliminares` | `list.custom.xr_placar` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `concessionaria` — 5-concessionaria

Tabela recomendada: `concessionaria`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| bir | `bir` | `text` | `text` | ativo |  |
| uf | `uf` | `text` | `text` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| admin-2 | `admin_2` | `user` | `uuid` | ativo | FK |
| data_nomeacao | `data_nomeacao` | `date` | `timestamptz` | ativo |  |
| municipio | `municipio` | `text` | `text` | ativo |  |
| codigo_ndp | `codigo_ndp` | `text` | `text` | ativo |  |
| pais | `pais` | `custom.pais` | `uuid` | ativo | FK |
| dominios | `dominios` | `list.text` | `text[]` | ativo |  |
| grupo | `grupo` | `custom.grupo` | `uuid` | ativo | FK |
| lideres-2 | `lideres_2` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| setor | `setor` | `custom.setores` | `uuid` | ativo | FK |
| divisao | `divisao` | `custom.divisao` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| colaboradores-2 | `colaboradores_2` | `list.user` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| grupo_ndp | `grupo_ndp` | `custom.grupo_ndp` | `uuid` | ativo | FK |
| placars | `placars` | `list.custom.placar` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| indicadores | `indicadores` | `list.custom.indicadores` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| xr_simulacoes | `xr_simulacoes` | `list.custom.xr_simulador` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| categoria | `categoria` | `option.categoria_concessionaria` | `text` | ativo | usar app_options |
| estrutura | `estrutura` | `option.estrutura_concessionaria` | `text` | ativo | usar app_options |

---

## `rr_indicadores` — xr_indicador

Tabela recomendada: `rr_indicadores`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| api_1 | `api_1` | `text` | `text` | ativo |  |
| api_2 | `api_2` | `text` | `text` | ativo |  |
| api_3 | `api_3` | `text` | `text` | ativo |  |
| api_4 | `api_4` | `text` | `text` | ativo |  |
| api_5 | `api_5` | `text` | `text` | ativo |  |
| api_6 | `api_6` | `text` | `text` | ativo |  |
| pontos | `pontos` | `text` | `text` | ativo |  |
| sort | `sort` | `number` | `numeric` | ativo | default Bubble: `1` |
| order - deleted | `order_deleted` | `number` | `numeric` | legado/deletado |  |
| ano_fiscal | `ano_fiscal` | `text` | `text` | ativo |  |
| metas | `metas` | `list.text` | `text[]` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| preliminar | `preliminar` | `custom.xr_placar` | `uuid` | ativo | FK |
| acoes - deleted | `acoes_deleted` | `list.custom.xr_acao` | `tabela de relacionamento N:N` | legado/deletado | não usar array; criar join table |
| xr_metas | `xr_metas` | `list.custom.xr_meta` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| area | `area` | `custom.xr_tipo_indicador` | `uuid` | ativo | FK |
| status | `status` | `option.toggle_ativo_inativo` | `text` | ativo | usar app_options; default Bubble: `inativo` |

---

## `placar_exclus_o` — placar exclusão

Tabela recomendada: `placar_exclus_o`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data-exclusao | `data_exclusao` | `date` | `timestamptz` | ativo |  |
| nome | `nome` | `text` | `text` | ativo |  |
| user-criacao | `user_criacao` | `user` | `uuid` | ativo | FK |
| data-criacao | `data_criacao` | `date` | `timestamptz` | ativo |  |
| user-exclusao | `user_exclusao` | `user` | `uuid` | ativo | FK |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `rv_participante` — RV Participante

Tabela recomendada: `rv_participante`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| cargo | `cargo` | `text` | `text` | ativo |  |
| ordem | `ordem` | `number` | `numeric` | ativo |  |
| rv | `rv` | `custom.rv` | `uuid` | ativo | FK |

---

## `competencia_mapa` — Competencia Mapa

Tabela recomendada: `competencia_mapa`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| versão | `versao` | `text` | `text` | ativo |  |
| entrega | `entrega` | `text` | `text` | ativo |  |
| para_que | `para_que` | `text` | `text` | ativo |  |
| hábitos - deleted | `habitos_deleted` | `list.custom.habitos` | `tabela de relacionamento N:N` | legado/deletado | não usar array; criar join table |
| funcoes - deleted | `funcoes_deleted` | `custom.funcao_colaborador` | `uuid` | legado/deletado | FK |
| funcao-mapa | `funcao_mapa` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| habitos_OS ❌ - deleted | `habitos_os_deleted` | `list.option.competencia_habito` | `text[]` | legado/deletado |  |
| atitudes | `atitudes` | `list.option.competencia_atitudes` | `text[]` | ativo |  |
| competencias-sernissan - deleted | `competencias_sernissan_deleted` | `option.competencia` | `text` | legado/deletado | usar app_options |
| habitos | `habitos` | `list.custom.competencia_habito` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| para_que - deleted | `para_que_deleted` | `list.option.competencia_para_que` | `text[]` | legado/deletado |  |
| competencias-sernissan | `competencias_sernissan` | `list.option.competencia` | `text[]` | ativo |  |
| ferramentas | `ferramentas` | `list.option.competencia_ferramenta` | `text[]` | ativo |  |
| habilidades | `habilidades` | `list.option.competencia_habilidade` | `text[]` | ativo |  |
| competencias-especificas | `competencias_especificas` | `list.option.competencia` | `text[]` | ativo |  |
| conhecimentos | `conhecimentos` | `list.option.competencia_conhecimentos` | `text[]` | ativo |  |
| treinamentos-e-learning | `treinamentos_e_learning` | `list.option.competencia_treinamento` | `text[]` | ativo |  |
| treinamentos-presenciais | `treinamentos_presenciais` | `list.option.competencia_treinamento` | `text[]` | ativo |  |

---

## `rv_proximo_passo` — RV Proximo Passo

Tabela recomendada: `rv_proximo_passo`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| acao | `acao` | `text` | `text` | ativo |  |
| prazo | `prazo` | `date` | `timestamptz` | ativo |  |
| ordem | `ordem` | `number` | `numeric` | ativo |  |
| rv | `rv` | `custom.rv` | `uuid` | ativo | FK |
| responsavel | `responsavel` | `text` | `text` | ativo |  |
| concluido? | `concluido_bool` | `boolean` | `boolean` | ativo |  |

---

## `competencia_mapa1` — Competencia Mapa

Tabela recomendada: `competencia_mapa1`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| versão | `versao` | `text` | `text` | ativo |  |
| entrega | `entrega` | `text` | `text` | ativo |  |
| para_que | `para_que` | `text` | `text` | ativo |  |
| funcoes - deleted | `funcoes_deleted` | `custom.funcao_colaborador` | `uuid` | legado/deletado | FK |
| funcao-mapa | `funcao_mapa` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| atitudes | `atitudes` | `list.option.competencia_atitudes` | `text[]` | ativo |  |
| competencias-sernissan - deleted | `competencias_sernissan_deleted` | `option.competencia` | `text` | legado/deletado | usar app_options |
| para_que - deleted | `para_que_deleted` | `list.option.competencia_para_que` | `text[]` | legado/deletado |  |
| competencias-sernissan | `competencias_sernissan` | `list.option.competencia` | `text[]` | ativo |  |
| ferramentas | `ferramentas` | `list.option.competencia_ferramenta` | `text[]` | ativo |  |
| habilidades | `habilidades` | `list.option.competencia_habilidade` | `text[]` | ativo |  |
| competencias-especificas | `competencias_especificas` | `list.option.competencia` | `text[]` | ativo |  |
| conhecimentos | `conhecimentos` | `list.option.competencia_conhecimentos` | `text[]` | ativo |  |
| treinamentos-e-learning | `treinamentos_e_learning` | `list.option.competencia_treinamento` | `text[]` | ativo |  |
| treinamentos-presenciais | `treinamentos_presenciais` | `list.option.competencia_treinamento` | `text[]` | ativo |  |

---

## `competencia_mapa2` — Competencia Mapa

Tabela recomendada: `competencia_mapa2`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data | `data` | `date` | `timestamptz` | ativo |  |
| versão | `versao` | `text` | `text` | ativo |  |
| entrega | `entrega` | `text` | `text` | ativo |  |
| para_que | `para_que` | `text` | `text` | ativo |  |
| funcoes - deleted | `funcoes_deleted` | `custom.funcao_colaborador` | `uuid` | legado/deletado | FK |
| funcao-mapa | `funcao_mapa` | `custom.funcao_colaborador` | `uuid` | ativo | FK |
| atitudes | `atitudes` | `list.option.competencia_atitudes` | `text[]` | ativo |  |
| competencias-sernissan - deleted | `competencias_sernissan_deleted` | `option.competencia` | `text` | legado/deletado | usar app_options |
| para_que - deleted | `para_que_deleted` | `list.option.competencia_para_que` | `text[]` | legado/deletado |  |
| competencias-sernissan | `competencias_sernissan` | `list.option.competencia` | `text[]` | ativo |  |
| ferramentas | `ferramentas` | `list.option.competencia_ferramenta` | `text[]` | ativo |  |
| habilidades | `habilidades` | `list.option.competencia_habilidade` | `text[]` | ativo |  |
| competencias-especificas | `competencias_especificas` | `list.option.competencia` | `text[]` | ativo |  |
| conhecimentos | `conhecimentos` | `list.option.competencia_conhecimentos` | `text[]` | ativo |  |
| treinamentos-e-learning | `treinamentos_e_learning` | `list.option.competencia_treinamento` | `text[]` | ativo |  |
| treinamentos-presenciais | `treinamentos_presenciais` | `list.option.competencia_treinamento` | `text[]` | ativo |  |

---

## `dashboard_options` — Dashboard Options

Tabela recomendada: `dashboard_options`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| termos | `termos` | `text` | `text` | ativo |  |
| texto_home | `texto_home` | `text` | `text` | ativo |  |
| pais | `pais` | `custom.pais` | `uuid` | ativo | FK |
| manutencao | `manutencao` | `boolean` | `boolean` | ativo |  |
| manutencao_ate | `manutencao_ate` | `date` | `timestamptz` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| faqs | `faqs` | `list.custom.faq_pergunta` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| slides | `slides` | `list.custom.slide_options` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `xr_tipo_indicador` — xr_area

Tabela recomendada: `xr_tipo_indicador`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| sort - deleted | `sort_deleted` | `number` | `numeric` | legado/deletado |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| ativo | `ativo` | `option.toggle_ativo_inativo` | `text` | ativo | usar app_options |

---

## `competencia_habito` — Competencia Habito

Tabela recomendada: `competencia_habito`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| ID | `id` | `text` | `text` | ativo |  |
| MV | `mv` | `text` | `text` | ativo |  |
| Area | `area` | `text` | `text` | ativo |  |
| Peso | `peso` | `number` | `numeric` | ativo |  |
| Pergunta | `pergunta` | `text` | `text` | ativo |  |
| Trilha | `trilha` | `number` | `numeric` | ativo |  |
| Descricao | `descricao` | `text` | `text` | ativo |  |
| Essencial - deleted | `essencial_deleted` | `text` | `text` | legado/deletado |  |
| Essencial | `essencial` | `boolean` | `boolean` | ativo |  |
| Momento de Verdade | `momento_de_verdade` | `text` | `text` | ativo |  |

---

## `funcao_colaborador` — funcao

Tabela recomendada: `funcao_colaborador`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| chave | `chave` | `boolean` | `boolean` | ativo | default Bubble: `False` |
| lideranca | `lideranca` | `boolean` | `boolean` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| area | `area` | `custom.setor_concessionaria` | `uuid` | ativo | FK |

---

## `xr_resultado_final` — xr_resultado_final

Tabela recomendada: `xr_resultado_final`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| id | `id` | `text` | `text` | ativo |  |
| meta | `meta` | `text` | `text` | ativo |  |
| year | `year` | `number` | `numeric` | ativo |  |
| pontos | `pontos` | `number` | `numeric` | ativo |  |
| classificacao | `classificacao` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| preliminar | `preliminar` | `custom.xr_placar` | `uuid` | ativo | FK |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |

---

## `calibracao_resultado` — Calibracao Resultado

Tabela recomendada: `calibracao_resultado`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| acao | `acao` | `text` | `text` | ativo |  |
| acao-data | `acao_data` | `date` | `timestamptz` | ativo |  |
| pontos-lider | `pontos_lider` | `number` | `numeric` | ativo |  |
| pontos-follow-up | `pontos_follow_up` | `number` | `numeric` | ativo |  |
| acao-status | `acao_status` | `option.status` | `text` | ativo | usar app_options |
| pontos-autocalibracao | `pontos_autocalibracao` | `number` | `numeric` | ativo |  |
| opcao - deleted | `opcao_deleted` | `option.calibracao_opcao` | `text` | legado/deletado | usar app_options |
| competencia | `competencia` | `option.competencia` | `text` | ativo | usar app_options |
| habito_OS ❌ - deleted | `habito_os_deleted` | `option.competencia_habito` | `text` | legado/deletado | usar app_options |
| habito | `habito` | `custom.competencia_habito` | `uuid` | ativo | FK |
| opcao-lider | `opcao_lider` | `option.calibracao_opcao` | `text` | ativo | usar app_options |
| tipo | `tipo` | `option.calibracao_resultado_tipo` | `text` | ativo | usar app_options |
| opcao-follow-up | `opcao_follow_up` | `option.calibracao_opcao` | `text` | ativo | usar app_options |
| calibracao | `calibracao` | `custom.competencia_calibracao` | `uuid` | ativo | FK |
| opcao-colaborador | `opcao_colaborador` | `option.calibracao_opcao` | `text` | ativo | usar app_options |

---

## `setor_concessionaria` — area

Tabela recomendada: `setor_concessionaria`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| nome | `nome` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| funcoes | `funcoes` | `list.custom.funcao_colaborador` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |

---

## `competencia_indicador` — Competencia Indicador

Tabela recomendada: `competencia_indicador`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|

---

## `competencia_calibracao` — Competencia Calibracao

Tabela recomendada: `competencia_calibracao`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| data-calibracao | `data_calibracao` | `date` | `timestamptz` | ativo |  |
| data-lider | `data_lider` | `date` | `timestamptz` | ativo |  |
| lider | `lider` | `list.text` | `text[]` | ativo |  |
| colaborador | `colaborador` | `user` | `uuid` | ativo | FK |
| followup | `followup` | `list.text` | `text[]` | ativo |  |
| data-follow-up | `data_follow_up` | `date` | `timestamptz` | ativo |  |
| resultados - deleted | `resultados_deleted` | `list.text` | `text[]` | legado/deletado |  |
| autocalibracao | `autocalibracao` | `list.text` | `text[]` | ativo |  |
| data-autocalibracao | `data_autocalibracao` | `date` | `timestamptz` | ativo |  |
| habitos - deleted | `habitos_deleted` | `list.custom.habitos` | `tabela de relacionamento N:N` | legado/deletado | não usar array; criar join table |
| mapa - deleted | `mapa_deleted` | `custom.competencia_mapa` | `uuid` | legado/deletado | FK |
| funcao - deleted | `funcao_deleted` | `custom.funcao_colaborador` | `uuid` | legado/deletado | FK |
| mapas | `mapas` | `list.custom.competencia_mapa` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |
| areas | `areas` | `list.custom.setor_concessionaria` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| funcoes | `funcoes` | `list.custom.funcao_colaborador` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| competencias-sernissan - deleted | `competencias_sernissan_deleted` | `option.competencia` | `text` | legado/deletado | usar app_options |
| resultados | `resultados` | `list.custom.calibracao_resultado` | `tabela de relacionamento N:N` | ativo | não usar array; criar join table |
| competencias-especificas - deleted | `competencias_especificas_deleted` | `list.option.competencia` | `text[]` | legado/deletado |  |

---

## `xr_indicador_resultado` — xr_resultado

Tabela recomendada: `xr_indicador_resultado`

| Campo Bubble | Coluna recomendada | Tipo Bubble | Tipo Supabase recomendado | Status | Observações |
|---|---|---|---|---|---|
| meta | `meta` | `text` | `text` | ativo |  |
| pontos | `pontos` | `text` | `text` | ativo |  |
| resultado | `resultado` | `text` | `text` | ativo |  |
| percentual | `percentual` | `text` | `text` | ativo |  |
| meta_simulador | `meta_simulador` | `text` | `text` | ativo |  |
| empresa | `empresa` | `custom.empresa` | `uuid` | ativo | FK |
| preliminar | `preliminar` | `custom.xr_placar` | `uuid` | ativo | FK |
| indicador | `indicador` | `custom.rr_indicadores` | `uuid` | ativo | FK |
| concessionaria | `concessionaria` | `custom.concessionaria` | `uuid` | ativo | FK |
