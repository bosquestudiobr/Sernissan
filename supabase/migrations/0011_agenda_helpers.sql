-- Fase 9C: status operacional de agenda + indices de listagem (sem RLS production)

alter table public.agendamentos
  add column if not exists concluido boolean not null default false;

alter table public.agendamentos
  add column if not exists cancelado boolean not null default false;

alter table public.agendamentos
  add column if not exists concluido_em timestamptz;

create index if not exists idx_agendamentos_empresa_data_inicio
  on public.agendamentos (empresa, data_inicio desc);

create index if not exists idx_agendamentos_concessionaria_data_inicio
  on public.agendamentos (concessionaria, data_inicio desc);

create index if not exists idx_agendamentos_data_inicio
  on public.agendamentos (data_inicio);

create index if not exists idx_agendamentos_concluido_cancelado
  on public.agendamentos (concluido, cancelado);
