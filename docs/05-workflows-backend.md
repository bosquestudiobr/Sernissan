# Backend workflows, triggers e jobs

Este documento resume os workflows server-side exportados do Bubble. Na migração, cada um deve virar Server Action, Supabase Edge Function, Postgres trigger/RPC ou job agendado.

| Nome | Tipo Bubble | Data trigger / wf name | Ações | Auth/privacidade | Destino recomendado |
|---|---|---|---:|---|---|
| Atualizar Pontos Indicador (Meta) | `DatabaseTriggerEvent` | `custom.indicadores` | 4 |  | Postgres trigger ou job assíncrono controlado |
| upload-csv-router | `APIEvent` | `upload-csv-router` | 1 |  | Edge Function/importador CSV |
| upload-csv-indicador | `APIEvent` | `upload-csv-indicador` | 2 |  | Edge Function/importador CSV |
| 0 - Novo placar | `DatabaseTriggerEvent` | `custom.placar` | 4 |  | Postgres trigger ou job assíncrono controlado |
| Deletar Indicador | `APIEvent` | `delete_indicador` | 2 |  | Server Action ou Edge Function |
| Atualizar Pontos Indicador (Peso) | `DatabaseTriggerEvent` | `custom.indicadores` | 4 |  | Postgres trigger ou job assíncrono controlado |
| Atualizar Pontos Indicador | `DatabaseTriggerEvent` | `custom.indicadores` | 6 |  | Postgres trigger ou job assíncrono controlado |
| Solicitacao Alterada | `DatabaseTriggerEvent` | `custom.solicitacoes` | 1 |  | Postgres trigger ou job assíncrono controlado |
| Inatividade | `RecurringEvent` | `Inatividade` | 1 |  | Supabase scheduled Edge Function / cron |
| enviar_emails_inatividade | `APIEvent` | `enviar_emails_inatividade` | 5 | sem auth, ignora privacy | Edge Function de e-mail + fila |
| reativar_offline | `APIEvent` | `reativar_offline` | 1 | sem auth, ignora privacy | Server Action ou Edge Function |
| Concessionaria Alterada | `DatabaseTriggerEvent` | `custom.concessionaria` | 2 |  | Postgres trigger ou job assíncrono controlado |
| 1 - Processar Indicadores  | `APIEvent` | `gerar_indicadores_placar` | 1 | ignora privacy | RPC/job de recálculo de placar |
| 2 - Processar Colaboradores  | `APIEvent` | `processar_indicador_por_colaborador` | 1 | ignora privacy | Server Action ou Edge Function |
| 3 - Criar Indicadores  | `APIEvent` | `criar_indicador_placar_v2` | 2 | ignora privacy | RPC/job de recálculo de placar |
| User Change Concessionaria (add) | `DatabaseTriggerEvent` | `user` | 11 |  | Postgres trigger ou job assíncrono controlado |
| 4 - Indicador Criado | `DatabaseTriggerEvent` | `custom.indicadores` | 1 |  | Postgres trigger ou job assíncrono controlado |
| Setar Ranking | `APIEvent` | `Setar Ranking` | 0 |  | RPC/job de recálculo de placar |
| Atualizar Ranking Indicador | `APIEvent` | `Atualizar Ranking Indicador` | 4 |  | RPC/job de recálculo de placar |
| Novo Agendamento | `DatabaseTriggerEvent` | `custom.agendamentos` | 1 |  | Postgres trigger ou job assíncrono controlado |
| Brevo Send Email | `APIEvent` | `Brevo Send Email` | 1 | ignora privacy | Edge Function de e-mail + fila |
| Agendamento Alterado | `DatabaseTriggerEvent` | `custom.agendamentos` | 1 |  | Postgres trigger ou job assíncrono controlado |
| Concessionaria | `DatabaseTriggerEvent` | `custom.concessionaria` | 2 |  | Postgres trigger ou job assíncrono controlado |
| Grupo | `DatabaseTriggerEvent` | `custom.grupo` | 2 |  | Postgres trigger ou job assíncrono controlado |
| Setor | `DatabaseTriggerEvent` | `custom.setores` | 2 |  | Postgres trigger ou job assíncrono controlado |
| Divisao | `DatabaseTriggerEvent` | `custom.divisao` | 2 |  | Postgres trigger ou job assíncrono controlado |
| restore_indicador | `APIEvent` | `restore_indicador` | 1 |  | Server Action ou Edge Function |
| update_indicadores | `APIEvent` | `update_indicadores` | 1 | ignora privacy | Server Action ou Edge Function |
| Calibracao Competencias | `APIEvent` | `Calibracao Competencias` | 4 |  | Server Action ou Edge Function |
| Calibracao Habitos | `APIEvent` | `Calibracao Habitos` | 4 |  | Server Action ou Edge Function |
| ajusta agendamento | `APIEvent` | `ajusta agendamento` | 2 |  | Server Action ou Edge Function |
| create-simulacao | `APIEvent` | `create-simulacao` | 1 | ignora privacy | Server Action ou Edge Function |
| create-indicador-simulacao | `APIEvent` | `create-indicador-simulacao` | 2 | ignora privacy | Server Action ou Edge Function |
| placar-xlsx | `APIEvent` | `placar-xlsx` | 2 | ignora privacy | RPC/job de recálculo de placar |
| teste | `CustomEvent` | `teste` | 0 |  | Server Action ou Edge Function |
| 01-add-registros-rv | `APIEvent` | `01-add-registros-rv` | 3 |  | Server Action ou Edge Function |
| 02-add-participante | `APIEvent` | `02-add-participante` | 1 |  | Server Action ou Edge Function |
| 03-add-prox-passos | `APIEvent` | `03-add-prox-passos` | 1 |  | Server Action ou Edge Function |
| 04-add-anexo | `APIEvent` | `04-add-anexo` | 1 |  | Server Action ou Edge Function |
| deletar arquivo | `APIEvent` | `deletar arquivo` | 1 |  | Server Action ou Edge Function |


## Padrão recomendado para jobs pesados

1. Criar tabela `job_queue` com tipo, payload, status, tentativa, erro e timestamps.
2. Server Action cria job pequeno e retorna para a UI rapidamente.
3. Edge Function processa em lotes, usando idempotência.
4. Logs ficam em `job_logs`.
5. Reprocessamento deve ser seguro: a mesma execução não pode duplicar pontos, e-mails, participantes ou resultados.

## Jobs prioritários a reimplementar

- Recálculo de pontos de indicador.
- Recálculo de ranking de placar.
- Criação de novo placar a partir de concessionária e indicadores ativos.
- Importação CSV de indicadores/dados administrativos.
- Envio de e-mails de inatividade, convite, assinatura de visita e lembretes.
- Expiração de tokens públicos de relatório de visita.
