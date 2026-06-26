-- Fase 9B: status de finalizacao XR + indices de listagem (sem RLS production)

alter table public.xr_placar
  add column if not exists finalizada boolean not null default false;

alter table public.xr_placar
  add column if not exists data_finalizada timestamptz;

create index if not exists idx_xr_placar_empresa_data
  on public.xr_placar (empresa, data desc);

create index if not exists idx_xr_acao_empresa_preliminar
  on public.xr_acao (empresa, preliminar);

create index if not exists idx_xr_indicador_resultado_preliminar_concessionaria
  on public.xr_indicador_resultado (preliminar, concessionaria);
