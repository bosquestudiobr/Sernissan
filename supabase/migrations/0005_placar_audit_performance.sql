-- Fase 6C: auditoria simples de recalculo do placar (sem RLS production)

create table if not exists public.placar_recalculation_logs (
  id uuid primary key default gen_random_uuid(),
  placar_id uuid not null references public.placar(id) on delete cascade,
  profile_id uuid references auth.users(id) on delete set null,
  action text not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_placar_recalculation_logs_placar_id
  on public.placar_recalculation_logs (placar_id);

create index if not exists idx_placar_recalculation_logs_created_at
  on public.placar_recalculation_logs (created_at desc);