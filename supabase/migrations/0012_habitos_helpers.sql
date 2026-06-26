-- Fase 9D: campos operacionais de habitos + indices (sem RLS production)
-- Tabela habitos existia apenas com colunas de auditoria na migration 0001.

alter table public.habitos
  add column if not exists titulo text;

alter table public.habitos
  add column if not exists descricao text;

alter table public.habitos
  add column if not exists colaborador uuid;

alter table public.habitos
  add column if not exists concessionaria uuid;

alter table public.habitos
  add column if not exists empresa uuid;

alter table public.habitos
  add column if not exists funcao uuid;

alter table public.habitos
  add column if not exists area uuid;

alter table public.habitos
  add column if not exists competencia_habito uuid;

alter table public.habitos
  add column if not exists agendamento uuid;

alter table public.habitos
  add column if not exists ativo boolean not null default true;

alter table public.habitos
  add column if not exists concluido boolean not null default false;

alter table public.habitos
  add column if not exists data_inicio timestamptz;

alter table public.habitos
  add column if not exists data_fim timestamptz;

alter table public.habitos
  add column if not exists concluido_em timestamptz;

alter table public.habitos
  add column if not exists meta_execucoes numeric;

alter table public.habitos
  add column if not exists execucoes_realizadas numeric not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_colaborador_profiles_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_colaborador_profiles_id
      foreign key (colaborador) references public.profiles(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_concessionaria_concessionaria_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_concessionaria_concessionaria_id
      foreign key (concessionaria) references public.concessionaria(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_empresa_empresa_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_empresa_empresa_id
      foreign key (empresa) references public.empresa(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_funcao_funcao_colaborador_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_funcao_funcao_colaborador_id
      foreign key (funcao) references public.funcao_colaborador(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_area_setor_concessionaria_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_area_setor_concessionaria_id
      foreign key (area) references public.setor_concessionaria(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_competencia_habito_competencia_habito_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_competencia_habito_competencia_habito_id
      foreign key (competencia_habito) references public.competencia_habito(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'fk_habitos_agendamento_agendamentos_id'
  ) then
    alter table public.habitos
      add constraint fk_habitos_agendamento_agendamentos_id
      foreign key (agendamento) references public.agendamentos(id) on delete set null;
  end if;
end $$;

create index if not exists idx_habitos_empresa_data_inicio
  on public.habitos (empresa, data_inicio desc);

create index if not exists idx_habitos_concessionaria
  on public.habitos (concessionaria);

create index if not exists idx_habitos_colaborador
  on public.habitos (colaborador);

create index if not exists idx_habitos_ativo_concluido
  on public.habitos (ativo, concluido);

create index if not exists idx_habitos_competencia_habito
  on public.habitos (competencia_habito);
