-- Fase 6B: views e RPC de resumo/ranking do placar (sem RLS production)
-- Camada de performance opcional. O codigo TS faz a agregacao como fonte primaria;
-- estas views/RPC servem para consultas SQL diretas e evolucao na Fase 6C.

create or replace view public.placar_indicator_summary as
select
  i.placar as placar_id,
  count(*) as indicador_count,
  count(i.valor) as indicadores_com_valor,
  coalesce(sum(i.pontos_ranking), 0) as total_pontos,
  count(distinct i.colaborador_user) filter (where i.colaborador_user is not null) as colaborador_count
from public.indicadores i
where i.placar is not null
group by i.placar;

create or replace view public.placar_ranking_summary as
select
  i.placar as placar_id,
  i.colaborador_user,
  p.nome as colaborador_nome,
  coalesce(sum(i.pontos_ranking), 0) as pontos_total
from public.indicadores i
left join public.profiles p on p.id = i.colaborador_user
where i.placar is not null
group by i.placar, i.colaborador_user, p.nome;

create or replace function public.get_placar_ranking(p_placar_id uuid)
returns table (
  colaborador_user uuid,
  colaborador_nome text,
  pontos_total numeric,
  posicao bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.colaborador_user,
    s.colaborador_nome,
    s.pontos_total,
    rank() over (order by s.pontos_total desc) as posicao
  from public.placar_ranking_summary s
  where s.placar_id = p_placar_id
  order by s.pontos_total desc, s.colaborador_nome asc nulls last, s.colaborador_user asc nulls last;
$$;
