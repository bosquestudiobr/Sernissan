-- Fase 2: helpers SQL pequenos para escopo (sem RLS production)

create or replace function public.current_profile_level()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((ao.metadata->>'nivel')::integer, 7)
  from public.profiles p
  left join public.app_options ao
    on ao.option_set = 'perfil'
    and ao.db_value = p.perfil
    and ao.is_deleted = false
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.can_access_setor(p_setor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_setor_id is null
    or public.current_profile_level() <= 3
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.setor = p_setor_id
    );
$$;

create or replace function public.can_access_grupo(p_grupo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_grupo_id is null
    or public.current_profile_level() <= 3
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.grupo = p_grupo_id
    )
    or exists (
      select 1
      from public.profiles_grupos_disponiveis pg
      where pg.profiles_id = auth.uid()
        and pg.grupo_id = p_grupo_id
    );
$$;

create or replace function public.can_access_concessionaria(p_concessionaria_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_concessionaria_id is null
    or public.current_profile_level() <= 3
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.concessionaria = p_concessionaria_id
    )
    or exists (
      select 1
      from public.profiles_concessionarias_equipe pc
      where pc.profiles_id = auth.uid()
        and pc.concessionaria_id = p_concessionaria_id
    );
$$;
