-- Fase 8: indices de performance para solicitacoes (sem RLS production)
create index if not exists idx_solicitacoes_tipo on public.solicitacoes (tipo);
create index if not exists idx_solicitacoes_atendida on public.solicitacoes (atendida);
create index if not exists idx_solicitacoes_concessionaria on public.solicitacoes (concessionaria);
create index if not exists idx_solicitacoes_user on public.solicitacoes ("user");