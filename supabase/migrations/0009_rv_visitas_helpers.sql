-- Fase 9A: indices de performance para RV/Visitas (sem RLS production)
create index if not exists idx_rv_token_ciencia on public.rv (token_ciencia);
create index if not exists idx_rv_dealer on public.rv (dealer);
create index if not exists idx_rv_consultor on public.rv (consultor);
create index if not exists idx_rv_status on public.rv (status);
create index if not exists idx_rv_data_visita on public.rv (data_visita desc);
create index if not exists idx_rv_participante_rv on public.rv_participante (rv);
create index if not exists idx_rv_proximo_passo_rv on public.rv_proximo_passo (rv);
create index if not exists idx_rv_anexo_rv on public.rv_anexo (rv);
create index if not exists idx_rv_assinatura_rv on public.rv_assinatura (rv);
create index if not exists idx_rv_auditoria_rv on public.rv_auditoria (rv);