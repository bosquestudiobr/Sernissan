# Diagnóstico técnico — Competências (Fase 7A)

Fundação do módulo de Competências/Calibração. A matriz visual Sim/Parcial/Não fica para a Fase 7B.

## Tabelas usadas

| Tabela | Papel |
|--------|--------|
| `competencia_mapa` | Mapa de competência por função (versão, entrega, para_que + arrays de competências) |
| `competencia_mapa1`, `competencia_mapa2` | Duplicatas legadas idênticas — NÃO usadas (legado Bubble) |
| `competencia_habito` | Hábitos/itens de calibração (pergunta, peso, trilha, MV, essencial) |
| `competencia_mapa_habitos` | Join N:N mapa ↔ hábito |
| `competencia_calibracao` | Calibração por colaborador/concessionária (etapas em arrays) |
| `calibracao_resultado` | Resultado por hábito/competência e etapa (lider/auto/follow-up) |
| `competencia_calibracao_mapas` | Join calibração ↔ mapa |
| `competencia_calibracao_areas` | Join calibração ↔ setor_concessionaria |
| `competencia_calibracao_funcoes` | Join calibração ↔ função |
| `competencia_calibracao_resultados` | Join calibração ↔ resultado |
| `competencias` / `competencias_funcoes` | Catálogo legado de competências por função |
| `profiles` | Colaboradores elegíveis |
| `setor_concessionaria` | Área |
| `funcao_colaborador` | Função (FK do mapa) |
| `concessionaria` | Escopo |
| `app_options` | `competencia`, `calibracao_opcao`, `calibracao_cores`, `calibracao_resultado_tipo` |

## Campos principais

- `competencia_mapa`: `versao`, `entrega`, `para_que`, `funcao_mapa` (FK `funcao_colaborador`), `data`, arrays `atitudes`/`competencias_sernissan`/`ferramentas`/`habilidades`/`competencias_especificas`/`conhecimentos`/`treinamentos_e_learning`/`treinamentos_presenciais`. **Sem `nome`, sem `empresa`, sem `concessionaria`.**
- `competencia_habito`: `pergunta`, `descricao`, `mv`, `area` (TEXT livre), `peso`, `trilha`, `essencial`, `momento_de_verdade`. **Sem `empresa`.**
- `competencia_calibracao`: `colaborador` (FK auth.users), `concessionaria`, `data_calibracao`/`data_lider`/`data_follow_up`/`data_autocalibracao`, arrays `lider`/`followup`/`autocalibracao`.
- `calibracao_resultado`: `habito` (FK), `calibracao` (FK), `competencia` (text), `opcao_lider`/`opcao_colaborador`/`opcao_follow_up`, `pontos_*`, `tipo`.

## Relacionamentos

```mermaid
erDiagram
  funcao_colaborador ||--o{ competencia_mapa : funcao_mapa
  competencia_mapa ||--o{ competencia_mapa_habitos : tem
  competencia_habito ||--o{ competencia_mapa_habitos : vinculado
  competencia_calibracao ||--o{ calibracao_resultado : gera
  competencia_habito ||--o{ calibracao_resultado : avaliado
  competencia_calibracao ||--o{ competencia_calibracao_mapas : usa
  competencia_calibracao ||--o{ competencia_calibracao_areas : escopo
  competencia_calibracao ||--o{ competencia_calibracao_funcoes : escopo
  profiles ||--o{ competencia_calibracao : colaborador
```

## Fluxos prováveis (Bubble)

1. Admin define mapas por função e vincula hábitos (`competencia_mapa_habitos`).
2. Calibração é criada para um colaborador/concessionária, referenciando mapas/áreas/funções.
3. Cada hábito recebe respostas por etapa (autocalibração, líder, follow-up) → `calibracao_resultado` com `opcao_*` (Sim=1, Parcial=0.3, Não=0).
4. Pontuação agregada por etapa e cores por faixa (`calibracao_cores`).

## Lacunas do schema

- `competencia_mapa` e `competencia_habito` não têm `empresa`/`concessionaria` → escopo direto impossível. Mapa é escopado indiretamente via `funcao_mapa → funcao_colaborador.empresa/area`. Hábito é efetivamente global.
- `competencia_habito.area` é TEXT livre, não FK para `setor_concessionaria`.
- `competencia_mapa` sem `nome`; identificação por `versao`/`entrega`/função.
- `competencia_mapa1/2` são duplicatas legadas (ignoradas).
- Respostas/etapas ficam em arrays de texto em `competencia_calibracao` + `calibracao_resultado`; a matriz exigirá normalização/leitura cuidadosa na 7B.

## Riscos

- Escopo fraco de mapas/hábitos pode expor catálogo entre empresas; mitigado em mapas via função, documentado para hábitos.
- A matriz de calibração tem volume alto (hábitos × colaboradores × etapas) → cálculo/filtros devem ficar no servidor (7B).
- Estruturas legadas (`competencia_mapa1/2`, `competencias`) podem confundir; não misturar.

## Como evitar cálculos/filtros pesados no client

- Listagens paginadas no servidor com colunas explícitas (sem `select('*')`).
- Filtros por query params resolvidos no banco.
- Contagem de hábitos por mapa via query agregada, não loop no client.
- Matriz e pontuação (7B) deverão usar agregação no servidor / RPC, nunca no browser.

## O que foi implementado na 7A

- Rotas `/competencias` (abas Mapas/Hábitos) e `/competencias/calibracao` (colaboradores elegíveis).
- CRUD base de mapas e hábitos (Server Actions + Zod), vínculo de hábitos ao mapa via `syncJoinTable('competencia_mapa_habitos')`.
- Listagem de colaboradores elegíveis com escopo organizacional.
- Permissões: acesso a todos os perfis (`max_nivel: usuário`); gestão de catálogo restrita a admin estrutural (nível ≤ 4).

## Decisão sobre migration 0006

- **Não criada nesta fase.** A fundação usa agregação em TypeScript e as join tables já existentes; nenhum objeto SQL novo foi necessário. Views/RPC de matriz e pontuação ficam para a Fase 7B (`0006_competencias_helpers.sql` quando houver necessidade real).

## Proposta para Fase 7B

- Matriz visual Sim/Parcial/Não por hábito × colaborador × etapa.
- Leitura/normalização de `calibracao_resultado` e arrays de `competencia_calibracao`.
- Pontuação por etapa e cores via `calibracao_cores`.
- Provável migration `0006_competencias_helpers.sql` (views/RPC de agregação).
- Fluxo de criação de calibração e gravação de respostas idempotente.

## Pendências para produção

- Escopo/RLS de catálogo de competências.
- Tratamento das tabelas legadas.
- `competencia_habito.area` como FK (decisão de modelagem).

---

## Fase 7B - Matriz de calibracao

### Rota
- `/competencias/calibracao/[profileId]` (Server Component) abre a matriz do colaborador.
- Lista de colaboradores (`/competencias/calibracao`) agora tem acao "Abrir matriz".

### Tabelas efetivamente usadas
- `competencia_calibracao`: entidade de calibracao por colaborador (+ concessionaria). Criada sob demanda no primeiro save.
- `calibracao_resultado`: respostas por habito, com 3 etapas na MESMA linha:
  - autocalibracao -> `opcao_colaborador` + `pontos_autocalibracao`
  - lider -> `opcao_lider` + `pontos_lider`
  - follow_up -> `opcao_follow_up` + `pontos_follow_up`
- `competencia_mapa` (por `funcao_mapa`), `competencia_mapa_habitos`, `competencia_habito`: origem das linhas da matriz.
- `app_options.calibracao_opcao`: opcoes Sim(1) / Parcial(0.3) / Nao(0). Vazio = nao avaliado.
- `profiles`, `setor_concessionaria`, `funcao_colaborador`, `concessionaria`: card e escopo.

### Decisoes da matriz
- Linhas = habitos agrupados por mapa da funcao do colaborador; colunas = 3 etapas.
- Cores semanticas: verde (`--sn-green-soft`) Sim, amarelo (`--sn-yellow-soft`) Parcial, vermelho (`--sn-red-soft`) Nao, cinza (`--sn-field`) nao avaliado.
- Edicao em lote: alteracoes ficam em estado local e sao persistidas via `saveCalibrationMatrixAction` (upsert por celula). `opcao` aceita null (limpar).
- Pontos derivam de `app_options.calibracao_opcao.metadata.value`.

### Persistencia e lacuna de unicidade
- `calibracao_resultado` NAO possui constraint unica `(calibracao, habito)`. O upsert e feito por select-then-update/insert na Server Action.
- Migration `0006_competencias_matrix_helpers.sql`: indices em `calibracao_resultado(calibracao)`, `(habito)` e `competencia_calibracao(colaborador)`, `(concessionaria)` (ja existiam; aplicacao idempotente). Indices nao alteram `database.types.ts`.
- Recomendacao para 7C/producao: dedupe + indice UNIQUE `(calibracao, habito)` para upsert nativo.

### Permissoes
- Edicao: nivel <= 6 dentro do escopo (empresa + concessionaria).
- Visualizacao: dentro do escopo, ou o proprio colaborador (somente leitura).
- Fora do escopo (e nao-self): redirect para `/acesso-negado`.
- `competencia_calibracao` nao tem coluna de status -> sem trava de finalizacao nesta fase (`CalibrationStatusSchema` reservado para 7C; `updateCalibrationStatusAction` nao implementado).

### Pendencias para 7C
- Status/finalizacao de calibracao (exige coluna nova).
- Pontuacao agregada/performance e cores por faixa (`calibracao_cores`).
- Selecao de mapas por calibracao (`competencia_calibracao_mapas`) — hoje a matriz deriva da funcao.
- Exportacao PDF e dashboard.
- Indice UNIQUE para upsert nativo.

---

## Fase 7C - Refinamento, performance e finalizacao

### Unicidade (resolvida)
- `calibracao_resultado` verificada via MCP (read-only): 0 linhas, 0 duplicados por `(calibracao, habito)`.
- Migration `0007_competencias_finalize_performance.sql` cria indice UNIQUE `(calibracao, habito)`.
- Upsert da aplicacao migrado para `upsert(..., { onConflict: 'calibracao,habito' })`, agrupando celulas por habito (1 linha por habito, multiplas etapas no mesmo payload). Idempotente e seguro contra duplicidade.

### Status / finalizacao (implementado)
- Colunas novas em `competencia_calibracao`: `finalizada boolean default false`, `data_finalizada timestamptz` (migration 0007). Justificado: o schema Bubble nao tinha status.
- `finalizeCalibrationAction` (nivel <= 6, no escopo) e `reopenCalibrationAction` (somente admin estrutural, nivel <= 4).
- Edicao bloqueada quando finalizada: `saveCalibrationCellAction`, `saveCalibrationMatrixAction` e `resetCalibrationCellAction` lancam `FINALIZED`.
- `canEdit = escopo && nivel<=6 && !finalizada`.

### Performance / resumo (implementado)
- Lib pura `src/lib/competencias/calibration-performance.ts`: `computeCalibrationPerformance` (Sim/Parcial/Nao, respondidos, pontos e % por etapa; % de conclusao geral) e `buildCalibrationValidationAlerts`.
- Queries: `getCalibrationPerformanceSummary`, `getCalibrationProgress`, `getCalibrationStatus`, `countMatrixHabitos`.
- Componentes: `CalibrationProgressCards`, `CalibrationPerformanceSummary`, `CalibrationStageProgress`, `CalibrationValidationAlerts`, `CalibrationReadOnlyBanner`, `CalibrationMatrixToolbar`, `CalibrationFinalizeActions`, `CalibrationPdfPlaceholderButton`.

### PDF (placeholder)
- Botao "PDF" desabilitado (`CalibrationPdfPlaceholderButton`) na toolbar. Sem dependencia pesada.
- Plano para PDF real (fase futura): rota imprimivel server-side (CSS print) ou geracao via Edge Function; evitar bundlar libs pesadas no client.

### UX
- Card do colaborador no topo, cards de resumo, alertas de validacao, banner de somente leitura, toolbar compacta (legenda + PDF + finalizar/reabrir), matriz densa com scroll horizontal, resumo por etapa e barras de progresso. Cores suaves e botoes pretos/vermelhos preservados.

### Permissoes
- Visualizacao: escopo ou self (somente leitura). Edicao: nivel <= 6 no escopo e nao finalizada. Reabertura: admin estrutural. Inativo/nao aprovado bloqueado. Fora do escopo (nao-self): `/acesso-negado`.

### Limitacoes restantes / pendencias para producao
- PDF real e dashboard grafico avancado.
- Performance final ponderada por `peso`/`calibracao_cores` (faixas) ainda nao calculada (apenas contagens/pontos por etapa).
- Selecao de mapas por calibracao (`competencia_calibracao_mapas`) ainda nao usada; matriz deriva da funcao.
- RLS production.
