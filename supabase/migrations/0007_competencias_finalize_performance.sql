-- Fase 7C: unicidade segura de respostas + status de finalizacao (sem RLS production)
-- calibracao_resultado verificada vazia/sem duplicados antes do indice UNIQUE.

create unique index if not exists uq_calibracao_resultado_calibracao_habito
  on public.calibracao_resultado (calibracao, habito);

alter table public.competencia_calibracao
  add column if not exists finalizada boolean not null default false;

alter table public.competencia_calibracao
  add column if not exists data_finalizada timestamptz;