-- Fase 7B: indices de performance para a matriz de calibracao (sem RLS production)
-- Apenas indices aditivos; sem drops, sem alteracao de dados.

create index if not exists idx_calibracao_resultado_calibracao
  on public.calibracao_resultado (calibracao);

create index if not exists idx_calibracao_resultado_habito
  on public.calibracao_resultado (habito);

create index if not exists idx_competencia_calibracao_colaborador
  on public.competencia_calibracao (colaborador);

create index if not exists idx_competencia_calibracao_concessionaria
  on public.competencia_calibracao (concessionaria);