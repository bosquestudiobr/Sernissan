-- SERNISSAN - schema inicial gerado a partir do export Bubble
-- Revisar antes de aplicar em produção. Campos legados/deletados do Bubble foram omitidos do schema ativo.
create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.app_options (
  option_set text not null,
  key text not null,
  label text not null,
  db_value text,
  sort_order numeric,
  metadata jsonb not null default '{}'::jsonb,
  is_deleted boolean not null default false,
  primary key (option_set, key)
);

create table if not exists public."rv" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "relato" text,
  "hora_fim" timestamptz,
  "consultor" uuid,
  "enviado_em" timestamptz,
  "assinado_em" timestamptz,
  "data_visita" timestamptz,
  "hora_inicio" timestamptz,
  "ip_assinatura" text,
  "token_ciencia" text,
  "foco" uuid,
  "hash_assinatura" text,
  "pontos_destaque" text,
  "comentario_ciencia" text,
  "operador_assinante" uuid,
  "avaliacao_consultor" text,
  "bloqueado_edicao" boolean default false,
  "data_expiracao_token" timestamptz,
  "user_agent_assinatura" text,
  "dealer" uuid,
  "status" text,
  "modalidade" uuid
);

create table if not exists public."loh" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "text" text,
  "type" text,
  "action" text,
  "concessionaria" uuid
);

create table if not exists public."pais" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "id_2" text,
  "empresa" uuid,
  "dashboard_options" uuid
);

create table if not exists public."profiles" (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "foto" text,
  "changed" timestamptz,
  "dominio" text,
  "ativo" boolean,
  "cpf_text" text,
  "aprovado" boolean default false,
  "last_update" timestamptz,
  "novo_acesso" timestamptz,
  "pais" uuid,
  "responsavel" uuid,
  "grupo" uuid,
  "ultimo_acesso" timestamptz,
  "ativo_placar" boolean,
  "mover_equipe" boolean,
  "perfil" text,
  "setor" uuid,
  "videos_temp" text[] not null default '{}'::text[],
  "divisao" uuid,
  "empresa" uuid,
  "convite_enviado" boolean,
  "ultimo_placar" uuid,
  "cookies_pp_displayed" boolean default false,
  "area" uuid,
  "funcao" uuid,
  "concessionaria" uuid,
  "ultima_funcao_placar" uuid
);

create table if not exists public."debug" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "conteudo" text
);

create table if not exists public."grupo" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "nome" text,
  "admin_2" uuid,
  "setor" uuid,
  "empresa" uuid,
  "grupo_ndp" uuid
);

create table if not exists public."placar" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "finalizado" boolean default false,
  "empresa" uuid,
  "ranking_atualizado" boolean default false,
  "opcao_origem" text,
  "opcao_acumulado" text,
  "concessionaria" uuid
);

create table if not exists public."divisao" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "nome" text,
  "pais" uuid,
  "empresa" uuid
);

create table if not exists public."empresa" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "fone" text,
  "nome" text,
  "email" text,
  "logo" text,
  "logo_dark" text,
  "logo_white" text,
  "logo_mobile" text,
  "cor_principal" text,
  "cor_secundaria" text,
  "check_emails" boolean
);

create table if not exists public."habitos" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."rv_foco" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "ordem" numeric,
  "ativo_bool" boolean default true
);

create table if not exists public."setores" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "nome" text,
  "admin_2" uuid,
  "divisao" uuid,
  "empresa" uuid
);

create table if not exists public."xr_acao" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "descricao" text,
  "completa" boolean,
  "responsavel" text,
  "preliminar" numeric,
  "grupo" uuid,
  "empresa" uuid,
  "responsaveis" text[] not null default '{}'::text[],
  "indicador" uuid
);

create table if not exists public."xr_meta" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "color" text
);

create table if not exists public."feedback" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "colaborador_2" uuid,
  "texto" text,
  "placar" uuid,
  "empresa" uuid
);

create table if not exists public."rv_anexo" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "tipo" text,
  "arquivo" text,
  "rv" uuid,
  "uploaded_by" uuid,
  "tamanho_mb" numeric
);

create table if not exists public."grupo_ndp" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "nome" text,
  "grupo" uuid,
  "setor" uuid,
  "empresa" uuid
);

create table if not exists public."xr_placar" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "id_2" numeric,
  "empresa" uuid
);

create table if not exists public."instru_es" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "titulo" text,
  "lista" text[] not null default '{}'::text[],
  "tipo" text
);

create table if not exists public."indicadores" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "user" uuid,
  "sigla" text,
  "api_id" text,
  "meta" numeric,
  "ordem" numeric,
  "valor" numeric,
  "ativo" boolean,
  "pontos" numeric,
  "pontos_ranking" numeric,
  "colaborador_user" uuid,
  "customizado" boolean,
  "placar_count" numeric,
  "user_edicao" uuid,
  "ativo_placar" boolean,
  "placar" uuid,
  "placar_ranking" numeric,
  "empresa" uuid,
  "unidade" text,
  "feedback" uuid,
  "meta_customizada" boolean,
  "classe" text,
  "agendamento" uuid,
  "importancia" text,
  "funcao" uuid,
  "area" uuid,
  "status_adm" text,
  "meta_customizada_justificativa" text,
  "concessionaria" uuid
);

create table if not exists public."agendamentos" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data_inicio" timestamptz,
  "titulo" text,
  "user" uuid,
  "data_fim" timestamptz,
  "gerente" uuid,
  "dia_todo" boolean,
  "placar" uuid,
  "data_range" jsonb,
  "empresa" uuid,
  "concessionaria" uuid
);

create table if not exists public."competencias" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."faq_pergunta" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "pergunta" text,
  "resposta" text,
  "empresa" uuid,
  "categoria" text
);

create table if not exists public."rv_auditoria" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "acao" text,
  "data" timestamptz,
  "user" uuid,
  "rv" uuid,
  "descricao" text,
  "snapshot_json" text
);

create table if not exists public."solicitacoes" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "text" text,
  "user" uuid,
  "atendida" boolean,
  "colaborador_2" uuid,
  "tipo" text,
  "concessionaria" uuid
);

create table if not exists public."xr_simulador" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "meta" text,
  "ndp_competencia" numeric,
  "xr_indicador" uuid,
  "concessionaria" uuid
);

create table if not exists public."rv_assinatura" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "ip" text,
  "rv" uuid,
  "comentario" text,
  "user_agent" text,
  "hash_sha256" text,
  "token_usado" text,
  "data_hora_utc" timestamptz,
  "assinante_nome" text,
  "assinante_user" uuid,
  "assinante_cargo" text,
  "dealer" uuid
);

create table if not exists public."rv_modalidade" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "ordem" numeric,
  "ativo_bool" boolean default true
);

create table if not exists public."slide_options" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "image" text,
  "titulo" text,
  "descricao" text,
  "empresa" uuid
);

create table if not exists public."xr_ano_fiscal" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "end_date" timestamptz,
  "start_date" timestamptz
);

create table if not exists public."concessionaria" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "bir" text,
  "uf" text,
  "nome" text,
  "admin_2" uuid,
  "data_nomeacao" timestamptz,
  "municipio" text,
  "codigo_ndp" text,
  "pais" uuid,
  "dominios" text[] not null default '{}'::text[],
  "grupo" uuid,
  "setor" uuid,
  "divisao" uuid,
  "empresa" uuid,
  "grupo_ndp" uuid,
  "categoria" text,
  "estrutura" text
);

create table if not exists public."rr_indicadores" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "api_1" text,
  "api_2" text,
  "api_3" text,
  "api_4" text,
  "api_5" text,
  "api_6" text,
  "pontos" text,
  "sort" numeric,
  "ano_fiscal" text,
  "metas" text[] not null default '{}'::text[],
  "empresa" uuid,
  "preliminar" uuid,
  "area" uuid,
  "status" text
);

create table if not exists public."placar_exclus_o" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data_exclusao" timestamptz,
  "nome" text,
  "user_criacao" uuid,
  "data_criacao" timestamptz,
  "user_exclusao" uuid,
  "empresa" uuid,
  "concessionaria" uuid
);

create table if not exists public."rv_participante" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "cargo" text,
  "ordem" numeric,
  "rv" uuid
);

create table if not exists public."competencia_mapa" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "versao" text,
  "entrega" text,
  "para_que" text,
  "funcao_mapa" uuid,
  "atitudes" text[] not null default '{}'::text[],
  "competencias_sernissan" text[] not null default '{}'::text[],
  "ferramentas" text[] not null default '{}'::text[],
  "habilidades" text[] not null default '{}'::text[],
  "competencias_especificas" text[] not null default '{}'::text[],
  "conhecimentos" text[] not null default '{}'::text[],
  "treinamentos_e_learning" text[] not null default '{}'::text[],
  "treinamentos_presenciais" text[] not null default '{}'::text[]
);

create table if not exists public."rv_proximo_passo" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "acao" text,
  "prazo" timestamptz,
  "ordem" numeric,
  "rv" uuid,
  "responsavel" text,
  "concluido_bool" boolean
);

create table if not exists public."competencia_mapa1" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "versao" text,
  "entrega" text,
  "para_que" text,
  "funcao_mapa" uuid,
  "atitudes" text[] not null default '{}'::text[],
  "competencias_sernissan" text[] not null default '{}'::text[],
  "ferramentas" text[] not null default '{}'::text[],
  "habilidades" text[] not null default '{}'::text[],
  "competencias_especificas" text[] not null default '{}'::text[],
  "conhecimentos" text[] not null default '{}'::text[],
  "treinamentos_e_learning" text[] not null default '{}'::text[],
  "treinamentos_presenciais" text[] not null default '{}'::text[]
);

create table if not exists public."competencia_mapa2" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data" timestamptz,
  "versao" text,
  "entrega" text,
  "para_que" text,
  "funcao_mapa" uuid,
  "atitudes" text[] not null default '{}'::text[],
  "competencias_sernissan" text[] not null default '{}'::text[],
  "ferramentas" text[] not null default '{}'::text[],
  "habilidades" text[] not null default '{}'::text[],
  "competencias_especificas" text[] not null default '{}'::text[],
  "conhecimentos" text[] not null default '{}'::text[],
  "treinamentos_e_learning" text[] not null default '{}'::text[],
  "treinamentos_presenciais" text[] not null default '{}'::text[]
);

create table if not exists public."dashboard_options" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "termos" text,
  "texto_home" text,
  "pais" uuid,
  "manutencao" boolean,
  "manutencao_ate" timestamptz,
  "empresa" uuid
);

create table if not exists public."xr_tipo_indicador" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "empresa" uuid,
  "ativo" text
);

create table if not exists public."competencia_habito" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "mv" text,
  "area" text,
  "peso" numeric,
  "pergunta" text,
  "trilha" numeric,
  "descricao" text,
  "essencial" boolean,
  "momento_de_verdade" text
);

create table if not exists public."funcao_colaborador" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "chave" boolean default false,
  "lideranca" boolean,
  "empresa" uuid,
  "area" uuid
);

create table if not exists public."xr_resultado_final" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "id_2" text,
  "meta" text,
  "year" numeric,
  "pontos" numeric,
  "classificacao" text,
  "empresa" uuid,
  "preliminar" uuid,
  "concessionaria" uuid
);

create table if not exists public."calibracao_resultado" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "acao" text,
  "acao_data" timestamptz,
  "pontos_lider" numeric,
  "pontos_follow_up" numeric,
  "acao_status" text,
  "pontos_autocalibracao" numeric,
  "competencia" text,
  "habito" uuid,
  "opcao_lider" text,
  "tipo" text,
  "opcao_follow_up" text,
  "calibracao" uuid,
  "opcao_colaborador" text
);

create table if not exists public."setor_concessionaria" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "nome" text,
  "empresa" uuid
);

create table if not exists public."competencia_indicador" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."competencia_calibracao" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "data_calibracao" timestamptz,
  "data_lider" timestamptz,
  "lider" text[] not null default '{}'::text[],
  "colaborador" uuid,
  "followup" text[] not null default '{}'::text[],
  "data_follow_up" timestamptz,
  "autocalibracao" text[] not null default '{}'::text[],
  "data_autocalibracao" timestamptz,
  "concessionaria" uuid
);

create table if not exists public."xr_indicador_resultado" (
  id uuid primary key default gen_random_uuid(),
  bubble_id text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  "meta" text,
  "pontos" text,
  "resultado" text,
  "percentual" text,
  "meta_simulador" text,
  "empresa" uuid,
  "preliminar" uuid,
  "indicador" uuid,
  "concessionaria" uuid
);

create table if not exists public."rv_gerentes_copia" (
  "rv_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("rv_id", "user_id")
);

create table if not exists public."pais_divisoes" (
  "pais_id" uuid not null,
  "divisao_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("pais_id", "divisao_id")
);

create table if not exists public."profiles_grupos_disponiveis" (
  "profiles_id" uuid not null,
  "grupo_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("profiles_id", "grupo_id")
);

create table if not exists public."profiles_concessionarias_equipe" (
  "profiles_id" uuid not null,
  "concessionaria_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("profiles_id", "concessionaria_id")
);

create table if not exists public."profiles_areas_disponiveis" (
  "profiles_id" uuid not null,
  "setor_concessionaria_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("profiles_id", "setor_concessionaria_id")
);

create table if not exists public."grupo_concessionarias" (
  "grupo_id" uuid not null,
  "concessionaria_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("grupo_id", "concessionaria_id")
);

create table if not exists public."placar_colaboradores_start" (
  "placar_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("placar_id", "user_id")
);

create table if not exists public."placar_indicadores" (
  "placar_id" uuid not null,
  "indicadores_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("placar_id", "indicadores_id")
);

create table if not exists public."placar_indicadores_start" (
  "placar_id" uuid not null,
  "indicadores_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("placar_id", "indicadores_id")
);

create table if not exists public."divisao_setores" (
  "divisao_id" uuid not null,
  "setores_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("divisao_id", "setores_id")
);

create table if not exists public."empresa_pais" (
  "empresa_id" uuid not null,
  "pais_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("empresa_id", "pais_id")
);

create table if not exists public."setores_grupos" (
  "setores_id" uuid not null,
  "grupo_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("setores_id", "grupo_id")
);

create table if not exists public."setores_grupos_ndp" (
  "setores_id" uuid not null,
  "grupo_ndp_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("setores_id", "grupo_ndp_id")
);

create table if not exists public."xr_placar_indicadores" (
  "xr_placar_id" uuid not null,
  "rr_indicadores_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("xr_placar_id", "rr_indicadores_id")
);

create table if not exists public."xr_placar_resultados" (
  "xr_placar_id" uuid not null,
  "xr_indicador_resultado_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("xr_placar_id", "xr_indicador_resultado_id")
);

create table if not exists public."xr_placar_resultados_finais" (
  "xr_placar_id" uuid not null,
  "xr_resultado_final_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("xr_placar_id", "xr_resultado_final_id")
);

create table if not exists public."indicadores_areas" (
  "indicadores_id" uuid not null,
  "setor_concessionaria_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("indicadores_id", "setor_concessionaria_id")
);

create table if not exists public."indicadores_funcoes" (
  "indicadores_id" uuid not null,
  "funcao_colaborador_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("indicadores_id", "funcao_colaborador_id")
);

create table if not exists public."agendamentos_users" (
  "agendamentos_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("agendamentos_id", "user_id")
);

create table if not exists public."agendamentos_convidados" (
  "agendamentos_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("agendamentos_id", "user_id")
);

create table if not exists public."competencias_funcoes" (
  "competencias_id" uuid not null,
  "funcao_colaborador_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencias_id", "funcao_colaborador_id")
);

create table if not exists public."xr_simulador_acoes" (
  "xr_simulador_id" uuid not null,
  "xr_acao_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("xr_simulador_id", "xr_acao_id")
);

create table if not exists public."xr_ano_fiscal_preliminares" (
  "xr_ano_fiscal_id" uuid not null,
  "xr_placar_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("xr_ano_fiscal_id", "xr_placar_id")
);

create table if not exists public."concessionaria_lideres_2" (
  "concessionaria_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("concessionaria_id", "user_id")
);

create table if not exists public."concessionaria_colaboradores_2" (
  "concessionaria_id" uuid not null,
  "user_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("concessionaria_id", "user_id")
);

create table if not exists public."concessionaria_placars" (
  "concessionaria_id" uuid not null,
  "placar_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("concessionaria_id", "placar_id")
);

create table if not exists public."concessionaria_indicadores" (
  "concessionaria_id" uuid not null,
  "indicadores_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("concessionaria_id", "indicadores_id")
);

create table if not exists public."concessionaria_xr_simulacoes" (
  "concessionaria_id" uuid not null,
  "xr_simulador_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("concessionaria_id", "xr_simulador_id")
);

create table if not exists public."rr_indicadores_xr_metas" (
  "rr_indicadores_id" uuid not null,
  "xr_meta_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("rr_indicadores_id", "xr_meta_id")
);

create table if not exists public."competencia_mapa_habitos" (
  "competencia_mapa_id" uuid not null,
  "competencia_habito_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencia_mapa_id", "competencia_habito_id")
);

create table if not exists public."dashboard_options_faqs" (
  "dashboard_options_id" uuid not null,
  "faq_pergunta_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("dashboard_options_id", "faq_pergunta_id")
);

create table if not exists public."dashboard_options_slides" (
  "dashboard_options_id" uuid not null,
  "slide_options_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("dashboard_options_id", "slide_options_id")
);

create table if not exists public."setor_concessionaria_funcoes" (
  "setor_concessionaria_id" uuid not null,
  "funcao_colaborador_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("setor_concessionaria_id", "funcao_colaborador_id")
);

create table if not exists public."competencia_calibracao_mapas" (
  "competencia_calibracao_id" uuid not null,
  "competencia_mapa_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencia_calibracao_id", "competencia_mapa_id")
);

create table if not exists public."competencia_calibracao_areas" (
  "competencia_calibracao_id" uuid not null,
  "setor_concessionaria_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencia_calibracao_id", "setor_concessionaria_id")
);

create table if not exists public."competencia_calibracao_funcoes" (
  "competencia_calibracao_id" uuid not null,
  "funcao_colaborador_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencia_calibracao_id", "funcao_colaborador_id")
);

create table if not exists public."competencia_calibracao_resultados" (
  "competencia_calibracao_id" uuid not null,
  "calibracao_resultado_id" uuid not null,
  created_at timestamptz not null default now(),
  primary key ("competencia_calibracao_id", "calibracao_resultado_id")
);

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_id_users_id" FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_consultor_users_id" FOREIGN KEY ("consultor") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_foco_rv_foco_id" FOREIGN KEY ("foco") REFERENCES public."rv_foco"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_operador_assinante_users_id" FOREIGN KEY ("operador_assinante") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_dealer_concessionaria_id" FOREIGN KEY ("dealer") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv" ADD CONSTRAINT "fk_rv_modalidade_rv_modalidade_id" FOREIGN KEY ("modalidade") REFERENCES public."rv_modalidade"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."loh" ADD CONSTRAINT "fk_loh_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."loh" ADD CONSTRAINT "fk_loh_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."pais" ADD CONSTRAINT "fk_pais_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."pais" ADD CONSTRAINT "fk_pais_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."pais" ADD CONSTRAINT "fk_pais_dashboard_options_dashboard_options_id" FOREIGN KEY ("dashboard_options") REFERENCES public."dashboard_options"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_pais_pais_id" FOREIGN KEY ("pais") REFERENCES public."pais"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_responsavel_users_id" FOREIGN KEY ("responsavel") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_grupo_grupo_id" FOREIGN KEY ("grupo") REFERENCES public."grupo"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_setor_setores_id" FOREIGN KEY ("setor") REFERENCES public."setores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_divisao_divisao_id" FOREIGN KEY ("divisao") REFERENCES public."divisao"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_ultimo_placar_placar_id" FOREIGN KEY ("ultimo_placar") REFERENCES public."placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_area_setor_concessionaria_id" FOREIGN KEY ("area") REFERENCES public."setor_concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_funcao_funcao_colaborador_id" FOREIGN KEY ("funcao") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles" ADD CONSTRAINT "fk_profiles_ultima_funcao_placar_funcao_colaborador_id" FOREIGN KEY ("ultima_funcao_placar") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."debug" ADD CONSTRAINT "fk_debug_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo" ADD CONSTRAINT "fk_grupo_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo" ADD CONSTRAINT "fk_grupo_admin_2_users_id" FOREIGN KEY ("admin_2") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo" ADD CONSTRAINT "fk_grupo_setor_setores_id" FOREIGN KEY ("setor") REFERENCES public."setores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo" ADD CONSTRAINT "fk_grupo_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo" ADD CONSTRAINT "fk_grupo_grupo_ndp_grupo_ndp_id" FOREIGN KEY ("grupo_ndp") REFERENCES public."grupo_ndp"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar" ADD CONSTRAINT "fk_placar_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar" ADD CONSTRAINT "fk_placar_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar" ADD CONSTRAINT "fk_placar_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."divisao" ADD CONSTRAINT "fk_divisao_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."divisao" ADD CONSTRAINT "fk_divisao_pais_pais_id" FOREIGN KEY ("pais") REFERENCES public."pais"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."divisao" ADD CONSTRAINT "fk_divisao_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."empresa" ADD CONSTRAINT "fk_empresa_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."habitos" ADD CONSTRAINT "fk_habitos_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_foco" ADD CONSTRAINT "fk_rv_foco_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores" ADD CONSTRAINT "fk_setores_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores" ADD CONSTRAINT "fk_setores_admin_2_users_id" FOREIGN KEY ("admin_2") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores" ADD CONSTRAINT "fk_setores_divisao_divisao_id" FOREIGN KEY ("divisao") REFERENCES public."divisao"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores" ADD CONSTRAINT "fk_setores_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_acao" ADD CONSTRAINT "fk_xr_acao_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_acao" ADD CONSTRAINT "fk_xr_acao_grupo_grupo_id" FOREIGN KEY ("grupo") REFERENCES public."grupo"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_acao" ADD CONSTRAINT "fk_xr_acao_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_acao" ADD CONSTRAINT "fk_xr_acao_indicador_rr_indicadores_id" FOREIGN KEY ("indicador") REFERENCES public."rr_indicadores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_meta" ADD CONSTRAINT "fk_xr_meta_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."feedback" ADD CONSTRAINT "fk_feedback_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."feedback" ADD CONSTRAINT "fk_feedback_colaborador_2_users_id" FOREIGN KEY ("colaborador_2") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."feedback" ADD CONSTRAINT "fk_feedback_placar_placar_id" FOREIGN KEY ("placar") REFERENCES public."placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."feedback" ADD CONSTRAINT "fk_feedback_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_anexo" ADD CONSTRAINT "fk_rv_anexo_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_anexo" ADD CONSTRAINT "fk_rv_anexo_rv_rv_id" FOREIGN KEY ("rv") REFERENCES public."rv"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_anexo" ADD CONSTRAINT "fk_rv_anexo_uploaded_by_users_id" FOREIGN KEY ("uploaded_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_ndp" ADD CONSTRAINT "fk_grupo_ndp_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_ndp" ADD CONSTRAINT "fk_grupo_ndp_grupo_grupo_id" FOREIGN KEY ("grupo") REFERENCES public."grupo"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_ndp" ADD CONSTRAINT "fk_grupo_ndp_setor_setores_id" FOREIGN KEY ("setor") REFERENCES public."setores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_ndp" ADD CONSTRAINT "fk_grupo_ndp_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar" ADD CONSTRAINT "fk_xr_placar_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar" ADD CONSTRAINT "fk_xr_placar_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."instru_es" ADD CONSTRAINT "fk_instru_es_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_user_users_id" FOREIGN KEY ("user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_colaborador_user_users_id" FOREIGN KEY ("colaborador_user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_user_edicao_users_id" FOREIGN KEY ("user_edicao") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_placar_placar_id" FOREIGN KEY ("placar") REFERENCES public."placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_feedback_feedback_id" FOREIGN KEY ("feedback") REFERENCES public."feedback"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_agendamento_agendamentos_id" FOREIGN KEY ("agendamento") REFERENCES public."agendamentos"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_funcao_funcao_colaborador_id" FOREIGN KEY ("funcao") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_area_setor_concessionaria_id" FOREIGN KEY ("area") REFERENCES public."setor_concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores" ADD CONSTRAINT "fk_indicadores_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_user_users_id" FOREIGN KEY ("user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_gerente_users_id" FOREIGN KEY ("gerente") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_placar_placar_id" FOREIGN KEY ("placar") REFERENCES public."placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos" ADD CONSTRAINT "fk_agendamentos_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencias" ADD CONSTRAINT "fk_competencias_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."faq_pergunta" ADD CONSTRAINT "fk_faq_pergunta_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."faq_pergunta" ADD CONSTRAINT "fk_faq_pergunta_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_auditoria" ADD CONSTRAINT "fk_rv_auditoria_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_auditoria" ADD CONSTRAINT "fk_rv_auditoria_user_users_id" FOREIGN KEY ("user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_auditoria" ADD CONSTRAINT "fk_rv_auditoria_rv_rv_id" FOREIGN KEY ("rv") REFERENCES public."rv"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."solicitacoes" ADD CONSTRAINT "fk_solicitacoes_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."solicitacoes" ADD CONSTRAINT "fk_solicitacoes_user_users_id" FOREIGN KEY ("user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."solicitacoes" ADD CONSTRAINT "fk_solicitacoes_colaborador_2_users_id" FOREIGN KEY ("colaborador_2") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."solicitacoes" ADD CONSTRAINT "fk_solicitacoes_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_simulador" ADD CONSTRAINT "fk_xr_simulador_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_simulador" ADD CONSTRAINT "fk_xr_simulador_xr_indicador_rr_indicadores_id" FOREIGN KEY ("xr_indicador") REFERENCES public."rr_indicadores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_simulador" ADD CONSTRAINT "fk_xr_simulador_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_assinatura" ADD CONSTRAINT "fk_rv_assinatura_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_assinatura" ADD CONSTRAINT "fk_rv_assinatura_rv_rv_id" FOREIGN KEY ("rv") REFERENCES public."rv"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_assinatura" ADD CONSTRAINT "fk_rv_assinatura_assinante_user_users_id" FOREIGN KEY ("assinante_user") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_assinatura" ADD CONSTRAINT "fk_rv_assinatura_dealer_concessionaria_id" FOREIGN KEY ("dealer") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_modalidade" ADD CONSTRAINT "fk_rv_modalidade_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."slide_options" ADD CONSTRAINT "fk_slide_options_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."slide_options" ADD CONSTRAINT "fk_slide_options_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_ano_fiscal" ADD CONSTRAINT "fk_xr_ano_fiscal_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_admin_2_users_id" FOREIGN KEY ("admin_2") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_pais_pais_id" FOREIGN KEY ("pais") REFERENCES public."pais"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_grupo_grupo_id" FOREIGN KEY ("grupo") REFERENCES public."grupo"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_setor_setores_id" FOREIGN KEY ("setor") REFERENCES public."setores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_divisao_divisao_id" FOREIGN KEY ("divisao") REFERENCES public."divisao"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria" ADD CONSTRAINT "fk_concessionaria_grupo_ndp_grupo_ndp_id" FOREIGN KEY ("grupo_ndp") REFERENCES public."grupo_ndp"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores" ADD CONSTRAINT "fk_rr_indicadores_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores" ADD CONSTRAINT "fk_rr_indicadores_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores" ADD CONSTRAINT "fk_rr_indicadores_preliminar_xr_placar_id" FOREIGN KEY ("preliminar") REFERENCES public."xr_placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores" ADD CONSTRAINT "fk_rr_indicadores_area_xr_tipo_indicador_id" FOREIGN KEY ("area") REFERENCES public."xr_tipo_indicador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_exclus_o" ADD CONSTRAINT "fk_placar_exclus_o_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_exclus_o" ADD CONSTRAINT "fk_placar_exclus_o_user_criacao_users_id" FOREIGN KEY ("user_criacao") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_exclus_o" ADD CONSTRAINT "fk_placar_exclus_o_user_exclusao_users_id" FOREIGN KEY ("user_exclusao") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_exclus_o" ADD CONSTRAINT "fk_placar_exclus_o_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_exclus_o" ADD CONSTRAINT "fk_placar_exclus_o_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_participante" ADD CONSTRAINT "fk_rv_participante_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_participante" ADD CONSTRAINT "fk_rv_participante_rv_rv_id" FOREIGN KEY ("rv") REFERENCES public."rv"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa" ADD CONSTRAINT "fk_competencia_mapa_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa" ADD CONSTRAINT "fk_competencia_mapa_funcao_mapa_funcao_colaborador_id" FOREIGN KEY ("funcao_mapa") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_proximo_passo" ADD CONSTRAINT "fk_rv_proximo_passo_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_proximo_passo" ADD CONSTRAINT "fk_rv_proximo_passo_rv_rv_id" FOREIGN KEY ("rv") REFERENCES public."rv"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa1" ADD CONSTRAINT "fk_competencia_mapa1_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa1" ADD CONSTRAINT "fk_competencia_mapa1_funcao_mapa_funcao_colaborador_id" FOREIGN KEY ("funcao_mapa") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa2" ADD CONSTRAINT "fk_competencia_mapa2_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa2" ADD CONSTRAINT "fk_competencia_mapa2_funcao_mapa_funcao_colaborador_id" FOREIGN KEY ("funcao_mapa") REFERENCES public."funcao_colaborador"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options" ADD CONSTRAINT "fk_dashboard_options_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options" ADD CONSTRAINT "fk_dashboard_options_pais_pais_id" FOREIGN KEY ("pais") REFERENCES public."pais"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options" ADD CONSTRAINT "fk_dashboard_options_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_tipo_indicador" ADD CONSTRAINT "fk_xr_tipo_indicador_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_tipo_indicador" ADD CONSTRAINT "fk_xr_tipo_indicador_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_habito" ADD CONSTRAINT "fk_competencia_habito_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."funcao_colaborador" ADD CONSTRAINT "fk_funcao_colaborador_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."funcao_colaborador" ADD CONSTRAINT "fk_funcao_colaborador_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."funcao_colaborador" ADD CONSTRAINT "fk_funcao_colaborador_area_setor_concessionaria_id" FOREIGN KEY ("area") REFERENCES public."setor_concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_resultado_final" ADD CONSTRAINT "fk_xr_resultado_final_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_resultado_final" ADD CONSTRAINT "fk_xr_resultado_final_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_resultado_final" ADD CONSTRAINT "fk_xr_resultado_final_preliminar_xr_placar_id" FOREIGN KEY ("preliminar") REFERENCES public."xr_placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_resultado_final" ADD CONSTRAINT "fk_xr_resultado_final_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."calibracao_resultado" ADD CONSTRAINT "fk_calibracao_resultado_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."calibracao_resultado" ADD CONSTRAINT "fk_calibracao_resultado_habito_competencia_habito_id" FOREIGN KEY ("habito") REFERENCES public."competencia_habito"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."calibracao_resultado" ADD CONSTRAINT "fk_calibracao_resultado_calibracao_competencia_calibracao_id" FOREIGN KEY ("calibracao") REFERENCES public."competencia_calibracao"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setor_concessionaria" ADD CONSTRAINT "fk_setor_concessionaria_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setor_concessionaria" ADD CONSTRAINT "fk_setor_concessionaria_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_indicador" ADD CONSTRAINT "fk_competencia_indicador_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao" ADD CONSTRAINT "fk_competencia_calibracao_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao" ADD CONSTRAINT "fk_competencia_calibracao_colaborador_users_id" FOREIGN KEY ("colaborador") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao" ADD CONSTRAINT "fk_competencia_calibracao_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_indicador_resultado" ADD CONSTRAINT "fk_xr_indicador_resultado_created_by_users_id" FOREIGN KEY ("created_by") REFERENCES auth.users("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_indicador_resultado" ADD CONSTRAINT "fk_xr_indicador_resultado_empresa_empresa_id" FOREIGN KEY ("empresa") REFERENCES public."empresa"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_indicador_resultado" ADD CONSTRAINT "fk_xr_indicador_resultado_preliminar_xr_placar_id" FOREIGN KEY ("preliminar") REFERENCES public."xr_placar"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_indicador_resultado" ADD CONSTRAINT "fk_xr_indicador_resultado_indicador_rr_indicadores_id" FOREIGN KEY ("indicador") REFERENCES public."rr_indicadores"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_indicador_resultado" ADD CONSTRAINT "fk_xr_indicador_resultado_concessionaria_concessionaria_id" FOREIGN KEY ("concessionaria") REFERENCES public."concessionaria"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_gerentes_copia" ADD CONSTRAINT "fk_rv_gerentes_copia_rv_id_rv_id" FOREIGN KEY ("rv_id") REFERENCES public."rv"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rv_gerentes_copia" ADD CONSTRAINT "fk_rv_gerentes_copia_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."pais_divisoes" ADD CONSTRAINT "fk_pais_divisoes_pais_id_pais_id" FOREIGN KEY ("pais_id") REFERENCES public."pais"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."pais_divisoes" ADD CONSTRAINT "fk_pais_divisoes_divisao_id_divisao_id" FOREIGN KEY ("divisao_id") REFERENCES public."divisao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_grupos_disponiveis" ADD CONSTRAINT "fk_profiles_grupos_disponiveis_profiles_id_profiles_id" FOREIGN KEY ("profiles_id") REFERENCES public."profiles"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_grupos_disponiveis" ADD CONSTRAINT "fk_profiles_grupos_disponiveis_grupo_id_grupo_id" FOREIGN KEY ("grupo_id") REFERENCES public."grupo"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_concessionarias_equipe" ADD CONSTRAINT "fk_profiles_concessionarias_equipe_profiles_id_profiles_id" FOREIGN KEY ("profiles_id") REFERENCES public."profiles"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_concessionarias_equipe" ADD CONSTRAINT "fk_profiles_concessionarias_equipe_concessionaria_id_concess" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_areas_disponiveis" ADD CONSTRAINT "fk_profiles_areas_disponiveis_profiles_id_profiles_id" FOREIGN KEY ("profiles_id") REFERENCES public."profiles"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."profiles_areas_disponiveis" ADD CONSTRAINT "fk_profiles_areas_disponiveis_setor_concessionaria_id_setor_" FOREIGN KEY ("setor_concessionaria_id") REFERENCES public."setor_concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_concessionarias" ADD CONSTRAINT "fk_grupo_concessionarias_grupo_id_grupo_id" FOREIGN KEY ("grupo_id") REFERENCES public."grupo"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."grupo_concessionarias" ADD CONSTRAINT "fk_grupo_concessionarias_concessionaria_id_concessionaria_id" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_colaboradores_start" ADD CONSTRAINT "fk_placar_colaboradores_start_placar_id_placar_id" FOREIGN KEY ("placar_id") REFERENCES public."placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_colaboradores_start" ADD CONSTRAINT "fk_placar_colaboradores_start_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_indicadores" ADD CONSTRAINT "fk_placar_indicadores_placar_id_placar_id" FOREIGN KEY ("placar_id") REFERENCES public."placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_indicadores" ADD CONSTRAINT "fk_placar_indicadores_indicadores_id_indicadores_id" FOREIGN KEY ("indicadores_id") REFERENCES public."indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_indicadores_start" ADD CONSTRAINT "fk_placar_indicadores_start_placar_id_placar_id" FOREIGN KEY ("placar_id") REFERENCES public."placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."placar_indicadores_start" ADD CONSTRAINT "fk_placar_indicadores_start_indicadores_id_indicadores_id" FOREIGN KEY ("indicadores_id") REFERENCES public."indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."divisao_setores" ADD CONSTRAINT "fk_divisao_setores_divisao_id_divisao_id" FOREIGN KEY ("divisao_id") REFERENCES public."divisao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."divisao_setores" ADD CONSTRAINT "fk_divisao_setores_setores_id_setores_id" FOREIGN KEY ("setores_id") REFERENCES public."setores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."empresa_pais" ADD CONSTRAINT "fk_empresa_pais_empresa_id_empresa_id" FOREIGN KEY ("empresa_id") REFERENCES public."empresa"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."empresa_pais" ADD CONSTRAINT "fk_empresa_pais_pais_id_pais_id" FOREIGN KEY ("pais_id") REFERENCES public."pais"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores_grupos" ADD CONSTRAINT "fk_setores_grupos_setores_id_setores_id" FOREIGN KEY ("setores_id") REFERENCES public."setores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores_grupos" ADD CONSTRAINT "fk_setores_grupos_grupo_id_grupo_id" FOREIGN KEY ("grupo_id") REFERENCES public."grupo"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores_grupos_ndp" ADD CONSTRAINT "fk_setores_grupos_ndp_setores_id_setores_id" FOREIGN KEY ("setores_id") REFERENCES public."setores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setores_grupos_ndp" ADD CONSTRAINT "fk_setores_grupos_ndp_grupo_ndp_id_grupo_ndp_id" FOREIGN KEY ("grupo_ndp_id") REFERENCES public."grupo_ndp"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_indicadores" ADD CONSTRAINT "fk_xr_placar_indicadores_xr_placar_id_xr_placar_id" FOREIGN KEY ("xr_placar_id") REFERENCES public."xr_placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_indicadores" ADD CONSTRAINT "fk_xr_placar_indicadores_rr_indicadores_id_rr_indicadores_id" FOREIGN KEY ("rr_indicadores_id") REFERENCES public."rr_indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_resultados" ADD CONSTRAINT "fk_xr_placar_resultados_xr_placar_id_xr_placar_id" FOREIGN KEY ("xr_placar_id") REFERENCES public."xr_placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_resultados" ADD CONSTRAINT "fk_xr_placar_resultados_xr_indicador_resultado_id_xr_indicad" FOREIGN KEY ("xr_indicador_resultado_id") REFERENCES public."xr_indicador_resultado"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_resultados_finais" ADD CONSTRAINT "fk_xr_placar_resultados_finais_xr_placar_id_xr_placar_id" FOREIGN KEY ("xr_placar_id") REFERENCES public."xr_placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_placar_resultados_finais" ADD CONSTRAINT "fk_xr_placar_resultados_finais_xr_resultado_final_id_xr_resu" FOREIGN KEY ("xr_resultado_final_id") REFERENCES public."xr_resultado_final"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores_areas" ADD CONSTRAINT "fk_indicadores_areas_indicadores_id_indicadores_id" FOREIGN KEY ("indicadores_id") REFERENCES public."indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores_areas" ADD CONSTRAINT "fk_indicadores_areas_setor_concessionaria_id_setor_concessio" FOREIGN KEY ("setor_concessionaria_id") REFERENCES public."setor_concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores_funcoes" ADD CONSTRAINT "fk_indicadores_funcoes_indicadores_id_indicadores_id" FOREIGN KEY ("indicadores_id") REFERENCES public."indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."indicadores_funcoes" ADD CONSTRAINT "fk_indicadores_funcoes_funcao_colaborador_id_funcao_colabora" FOREIGN KEY ("funcao_colaborador_id") REFERENCES public."funcao_colaborador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos_users" ADD CONSTRAINT "fk_agendamentos_users_agendamentos_id_agendamentos_id" FOREIGN KEY ("agendamentos_id") REFERENCES public."agendamentos"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos_users" ADD CONSTRAINT "fk_agendamentos_users_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos_convidados" ADD CONSTRAINT "fk_agendamentos_convidados_agendamentos_id_agendamentos_id" FOREIGN KEY ("agendamentos_id") REFERENCES public."agendamentos"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."agendamentos_convidados" ADD CONSTRAINT "fk_agendamentos_convidados_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencias_funcoes" ADD CONSTRAINT "fk_competencias_funcoes_competencias_id_competencias_id" FOREIGN KEY ("competencias_id") REFERENCES public."competencias"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencias_funcoes" ADD CONSTRAINT "fk_competencias_funcoes_funcao_colaborador_id_funcao_colabor" FOREIGN KEY ("funcao_colaborador_id") REFERENCES public."funcao_colaborador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_simulador_acoes" ADD CONSTRAINT "fk_xr_simulador_acoes_xr_simulador_id_xr_simulador_id" FOREIGN KEY ("xr_simulador_id") REFERENCES public."xr_simulador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_simulador_acoes" ADD CONSTRAINT "fk_xr_simulador_acoes_xr_acao_id_xr_acao_id" FOREIGN KEY ("xr_acao_id") REFERENCES public."xr_acao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_ano_fiscal_preliminares" ADD CONSTRAINT "fk_xr_ano_fiscal_preliminares_xr_ano_fiscal_id_xr_ano_fiscal" FOREIGN KEY ("xr_ano_fiscal_id") REFERENCES public."xr_ano_fiscal"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."xr_ano_fiscal_preliminares" ADD CONSTRAINT "fk_xr_ano_fiscal_preliminares_xr_placar_id_xr_placar_id" FOREIGN KEY ("xr_placar_id") REFERENCES public."xr_placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_lideres_2" ADD CONSTRAINT "fk_concessionaria_lideres_2_concessionaria_id_concessionaria" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_lideres_2" ADD CONSTRAINT "fk_concessionaria_lideres_2_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_colaboradores_2" ADD CONSTRAINT "fk_concessionaria_colaboradores_2_concessionaria_id_concessi" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_colaboradores_2" ADD CONSTRAINT "fk_concessionaria_colaboradores_2_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_placars" ADD CONSTRAINT "fk_concessionaria_placars_concessionaria_id_concessionaria_i" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_placars" ADD CONSTRAINT "fk_concessionaria_placars_placar_id_placar_id" FOREIGN KEY ("placar_id") REFERENCES public."placar"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_indicadores" ADD CONSTRAINT "fk_concessionaria_indicadores_concessionaria_id_concessionar" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_indicadores" ADD CONSTRAINT "fk_concessionaria_indicadores_indicadores_id_indicadores_id" FOREIGN KEY ("indicadores_id") REFERENCES public."indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_xr_simulacoes" ADD CONSTRAINT "fk_concessionaria_xr_simulacoes_concessionaria_id_concession" FOREIGN KEY ("concessionaria_id") REFERENCES public."concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."concessionaria_xr_simulacoes" ADD CONSTRAINT "fk_concessionaria_xr_simulacoes_xr_simulador_id_xr_simulador" FOREIGN KEY ("xr_simulador_id") REFERENCES public."xr_simulador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores_xr_metas" ADD CONSTRAINT "fk_rr_indicadores_xr_metas_rr_indicadores_id_rr_indicadores_" FOREIGN KEY ("rr_indicadores_id") REFERENCES public."rr_indicadores"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."rr_indicadores_xr_metas" ADD CONSTRAINT "fk_rr_indicadores_xr_metas_xr_meta_id_xr_meta_id" FOREIGN KEY ("xr_meta_id") REFERENCES public."xr_meta"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa_habitos" ADD CONSTRAINT "fk_competencia_mapa_habitos_competencia_mapa_id_competencia_" FOREIGN KEY ("competencia_mapa_id") REFERENCES public."competencia_mapa"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_mapa_habitos" ADD CONSTRAINT "fk_competencia_mapa_habitos_competencia_habito_id_competenci" FOREIGN KEY ("competencia_habito_id") REFERENCES public."competencia_habito"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options_faqs" ADD CONSTRAINT "fk_dashboard_options_faqs_dashboard_options_id_dashboard_opt" FOREIGN KEY ("dashboard_options_id") REFERENCES public."dashboard_options"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options_faqs" ADD CONSTRAINT "fk_dashboard_options_faqs_faq_pergunta_id_faq_pergunta_id" FOREIGN KEY ("faq_pergunta_id") REFERENCES public."faq_pergunta"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options_slides" ADD CONSTRAINT "fk_dashboard_options_slides_dashboard_options_id_dashboard_o" FOREIGN KEY ("dashboard_options_id") REFERENCES public."dashboard_options"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."dashboard_options_slides" ADD CONSTRAINT "fk_dashboard_options_slides_slide_options_id_slide_options_i" FOREIGN KEY ("slide_options_id") REFERENCES public."slide_options"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setor_concessionaria_funcoes" ADD CONSTRAINT "fk_setor_concessionaria_funcoes_setor_concessionaria_id_seto" FOREIGN KEY ("setor_concessionaria_id") REFERENCES public."setor_concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."setor_concessionaria_funcoes" ADD CONSTRAINT "fk_setor_concessionaria_funcoes_funcao_colaborador_id_funcao" FOREIGN KEY ("funcao_colaborador_id") REFERENCES public."funcao_colaborador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_mapas" ADD CONSTRAINT "fk_competencia_calibracao_mapas_competencia_calibracao_id_co" FOREIGN KEY ("competencia_calibracao_id") REFERENCES public."competencia_calibracao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_mapas" ADD CONSTRAINT "fk_competencia_calibracao_mapas_competencia_mapa_id_competen" FOREIGN KEY ("competencia_mapa_id") REFERENCES public."competencia_mapa"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_areas" ADD CONSTRAINT "fk_competencia_calibracao_areas_competencia_calibracao_id_co" FOREIGN KEY ("competencia_calibracao_id") REFERENCES public."competencia_calibracao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_areas" ADD CONSTRAINT "fk_competencia_calibracao_areas_setor_concessionaria_id_seto" FOREIGN KEY ("setor_concessionaria_id") REFERENCES public."setor_concessionaria"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_funcoes" ADD CONSTRAINT "fk_competencia_calibracao_funcoes_competencia_calibracao_id_" FOREIGN KEY ("competencia_calibracao_id") REFERENCES public."competencia_calibracao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_funcoes" ADD CONSTRAINT "fk_competencia_calibracao_funcoes_funcao_colaborador_id_func" FOREIGN KEY ("funcao_colaborador_id") REFERENCES public."funcao_colaborador"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_resultados" ADD CONSTRAINT "fk_competencia_calibracao_resultados_competencia_calibracao_" FOREIGN KEY ("competencia_calibracao_id") REFERENCES public."competencia_calibracao"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public."competencia_calibracao_resultados" ADD CONSTRAINT "fk_competencia_calibracao_resultados_calibracao_resultado_id" FOREIGN KEY ("calibracao_resultado_id") REFERENCES public."calibracao_resultado"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUhd', 'guia', 'guia', 15, '{"icon": "livro", "label": "Guia SERNISSAN", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUhp', 'inicio', 'inicio', 2, '{"label": "Início", "menu_pai": "gerenciamento", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUht', 'equipe', 'equipe', 3, '{"label": "Equipe", "menu_pai": "gerenciamento", "max_nivel": "area_adm", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUhu', 'indicadores', 'indicadores', 4, '{"label": "Indicadores", "menu_pai": "gerenciamento", "max_nivel": "area_adm", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUhv', 'gerenciamento', 'gerenciamento', 1, '{"icon": "dados", "label": "Gerenciamento", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUhz', 'solicitacoes', 'solicitacoes', 5, '{"label": "Solicitacoes", "menu_pai": "gerenciamento", "max_nivel": "area_adm", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiA', 'placar', 'placar', 6, '{"icon": "trof_u", "label": "Placar de Perfomance", "max_nivel": "area_adm", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiB', 'agenda', 'agenda', 7, '{"icon": "calend_rio", "label": "Agenda", "max_nivel": "area_adm", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiF', 'reuniao-resultados', 'reuniao_resultados', 8, '{"icon": "resultado", "label": "Reunião de Resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiH', 'admin', 'admin', 22, '{"icon": "admin", "label": "Admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiL', 'empresa', 'empresa', 23, '{"label": "Empresa", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiM', 'paises', 'paises', 24, '{"label": "Países", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiN', 'divisoes', 'divisoes', 25, '{"label": "Divisões", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiR', 'setores', 'setores', 26, '{"label": "Setores", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiS', 'grupos', 'grupos', 28, '{"label": "Grupos", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiT', 'concessionarias', 'concessionarias', 29, '{"label": "Concessionárias", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiX', 'usuarios', 'usuarios', 30, '{"label": "Usuários", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiY', 'biblioteca-indicadores', 'biblioteca_indicadores', 31, '{"label": "Biblioteca Indicadores", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUiZ', 'areas-funcoes', 'areas_funcoes', 32, '{"label": "Áreas e funções", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUkR', 'ajuda', 'ajuda', 33, '{"show_melu_lateral": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTUkV', 'preferencias', 'preferencias', 34, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWJN', 'rr-areas', 'xr_areas', 11, '{"label": "Áreas", "menu_pai": "reuniao_resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWJO', 'rr-grupo-ndp', 'rr_grupo_ndp', 12, '{"label": "Grupo NDP", "menu_pai": "reuniao_resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWJP', 'rr-indicadores', 'rr_indicadores', 13, '{"label": "Indicadores", "menu_pai": "reuniao_resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWJT', 'rr-preliminares', 'rr_preliminares', 14, '{"label": "Preliminares", "menu_pai": "reuniao_resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWbz', 'rr-reuniao', 'rr_reuniao', 9, '{"label": "Resultados", "menu_pai": "reuniao_resultados", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWnr', 'relatorios', 'relatorios', 16, '{"icon": "relatorios", "label": "Relatórios", "max_nivel": "gerente_regional", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWns', 'status-report', 'status_report', 17, '{"label": "Status Report", "menu_pai": "relatorios", "max_nivel": "gerente_regional", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWnt', 'dados-placar', 'dados_placar', 18, '{"label": "Dados Placar", "menu_pai": "relatorios", "max_nivel": "gerente_regional", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWoh', 'competencias', 'mapa_competencias', 19, '{"icon": "competencias", "label": "Competências", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWoi', 'mapa-competencias', 'mapa_competencias0', 20, '{"label": "Mapa", "menu_pai": "mapa_competencias", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', 'bTWoj', 'calibracao-competencias', 'calibracao_competencias', 21, '{"label": "Calibração", "menu_pai": "mapa_competencias", "max_nivel": "usu_rio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', '1776670013487x202126442304030100', 'visitas', 'visitas', 36, '{"icon": "calend_rio", "label": "Visitas", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', '1777348564742x646318148635481500', 'visitas-v2', 'visitas_v2', 35, '{"label": "visitas-v2", "show_melu_lateral": false}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', '1778644117184x609648450205255400', 'habitos', 'habitos', 27, '{"label": "Hábitos", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('pages', '1782358392382x682639849522307500', 'pilulas', 'pilulas', 37, '{"icon": "livro", "label": "Pílulas de Conhecimento", "menu_pai": "admin", "max_nivel": "gerente_do_dom_nio", "show_melu_lateral": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('assunto_contato', 'bTODb', 'Suporte', 'suporte', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('assunto_contato', 'bTODc', 'Sugestão', 'sugest_o', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('assunto_contato', 'bTODd', 'Dúvida', 'd_vida', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('assunto_contato', 'bTODh', 'Ajuda', 'ajuda', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_cores', '1764663017856x672791111289683700', '>85', '_85', 1, '{"hex": "92d050"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_cores', '1764663023574x709978639612910400', '>75', '_75', 2, '{"hex": "FFC000"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_cores', '1764663027983x385091769987591740', '>50', '_50', 3, '{"hex": "C00000"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_cores', '1764663030199x192405687132070940', '<50', '_500', 4, '{"hex": "3F3F3F"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789950516x606443036899223800', '1', '1_', 1, '{"numero": 1}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789952556x623871428549074000', '2', '2_', 2, '{"numero": 2}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789954827x785173177019800200', '3', '3_', 3, '{"numero": 3}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789956685x177391623837941730', '4', '4_', 4, '{"numero": 4}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789958867x203085491252937630', '5', '5_', 5, '{"numero": 5}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789960789x438714107902575800', '6', '6_', 6, '{"numero": 6}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789962692x403545884240955600', '7', '7_', 7, '{"numero": 7}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789964599x126159378371172420', '8', '8_', 8, '{"numero": 8}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789966364x506172866951462340', '9', '9_', 9, '{"numero": 9}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789970988x772700787047504900', '10', '10_', 10, '{"numero": 10}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789974171x643821535142601600', '11', '11_', 11, '{"numero": 11}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789977252x828875382190977400', '12', '12_', 12, '{"numero": 12}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789981837x853134226178574600', '13', '13_', 13, '{"numero": 13}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789984507x952846684411829200', '14', '14_', 14, '{"numero": 14}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789987971x752748548739876400', '15', '15_', 15, '{"numero": 15}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789990611x509181450709064200', '16', '16_', 16, '{"numero": 16}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789994858x819238207564583400', '17', '17_', 17, '{"numero": 17}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777789999139x921077504997733800', '18', '18_', 18, '{"numero": 18}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790002715x788795370192219000', '19', '19_', 19, '{"numero": 19}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790005396x988148675757607200', '20', '20_', 20, '{"numero": 20}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790016908x919396139195899600', '21', '21_', 21, '{"numero": 21}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790020072x627789793610154400', '22', '22_', 22, '{"numero": 22}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790026934x915123218620397200', '23', '23_', 23, '{"numero": 23}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790030476x277700959746177820', '24', '24_', 24, '{"numero": 24}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790034219x270769021848562430', '25', '25_', 25, '{"numero": 25}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790037727x660294607335944700', '26', '26_', 26, '{"numero": 26}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790041580x195175698769994620', '27', '27_', 27, '{"numero": 27}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790046436x399968202244591040', '28', '28_', 28, '{"numero": 28}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790050093x982463956408524400', '29', '29_', 29, '{"numero": 29}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790053320x628053411825132800', '30', '30_', 30, '{"numero": 30}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790066894x238074907874434900', '31', '31_', 31, '{"numero": 31}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790071388x442746082307827100', '32', '32_', 32, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790074175x536791352170238800', '33', '33_', 33, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790076832x934759499659779500', '34', '34_', 34, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__dias_', '1777790082045x639241737311820500', '35', '35_', 35, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790266717x764602723222302200', 'Domingo', 'segunda', 1, '{"ordem": 1, "sigla": "Dom"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790271868x696187665155623300', 'Segunda', 'ter_a', 2, '{"ordem": 2, "sigla": "Seg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790278467x931290330296496800', 'Terça', 'quarta', 3, '{"ordem": 3, "sigla": "Ter"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790300652x804524583533005200', 'Quarta', 'quarta0', 4, '{"ordem": 4, "sigla": "Qua"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790306337x301213742630093160', 'Quinta', 'quinta', 5, '{"ordem": 5, "sigla": "Qui"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790310861x657184747994146800', 'Sexta', 'sexta', 6, '{"ordem": 6, "sigla": "Sex"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calendario__semana_', '1777790316692x268966797483646270', 'Sábado', 'sabado', 7, '{"ordem": 7, "sigla": "Sab"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_tipo', '1762659673459x616799882873424100', 'Lider', 'lider', 1, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_opcao', 'bTXfA', 'Sim', 'sim', 1, '{"value": 1}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_opcao', 'bTXfB', 'Não', 'n_o', 3, '{"value": 0}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_opcao', 'bTXfF', 'Parcial', 'parcial', 2, '{"value": 0.3}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('categoria_concessionaria', 'bTOie', 'F', 'f', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('categoria_concessionaria', 'bTOif', 'M', 'm', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_resultado_tipo', '1762659700169x517405941602266500', 'Líder', 'lider', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_resultado_tipo', '1762659709441x240155736156778340', 'Auto Calibração', 'auto_calibra__o', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('calibracao_resultado_tipo', '1762659717882x761623743870936000', 'Follow-Up', 'follow_up', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCI', 'Foco no Cliente', 'foco_no_cliente', 1, '{"id0": "C1", "peso": 1, "tipo": "sernissan", "numero": 1, "pergunta": "Identificou e entendeu as necessidades dos Clientes, permitindo o desenvolvimento de novas oportunidades e o fortalecimento das relações já existentes?", "descricao": "Identificar e entender as necessidades dos Clientes, permitindo o desenvolvimento de novas oportunidades e o fortalecimento das relações já existentes."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCJ', 'Excelência', 'excel_ncia', 2, '{"id0": "C2", "peso": 1, "tipo": "sernissan", "numero": 2, "pergunta": "Atingiu o potencial máximo de resultados com qualidade de forma consistente em qualquer tipo de ação, considerando os recursos disponíveis no momento?", "descricao": "Atingir o potencial máximo de resultados com qualidade de forma consistente em qualquer tipo de ação,  considerando os recursos disponíveis no momento."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCN', 'Foco no Resultado', 'foco_no_resultado', 3, '{"id0": "C3", "peso": 1, "tipo": "sernissan", "numero": 3, "pergunta": "Planejou e executou todas as ações tendo o resultado como objetivo, com o menor gasto de tempo e recursos, gerando satisfação para os Clientes?", "descricao": "Planejar e executar todas as ações tendo o resultado como objetivo, com o menor gasto de tempo e recursos, gerando satisfação para os Clientes. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCO', 'Visão Sistêmica', 'vis_o_sist_mica', 4, '{"id0": "C4", "peso": 1, "tipo": "sernissan", "numero": 4, "pergunta": "Enxergou o negócio como um todo e entendeu como funcionam as interações entre processos, serviços, produtos, Clientes internos e externos?", "descricao": "Capacidade de \"ver\" o negócio como um todo e entender como funcionam as interações entre processos, serviços, produtos, Clientes internos e externos. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCP', 'Disciplina', 'disciplina', 5, '{"id0": "C5", "peso": 1, "tipo": "sernissan", "numero": 5, "pergunta": "Planejou e executou com responsabilidade e qualidade qualquer tipo de ação, concentrando-se nas prioridades e no cumprimento dos prazos?", "descricao": "Planejar e executar com responsabilidade e qualidade qualquer tipo de ação, concentrando-se nas prioridades e no cumprimento dos prazos."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCT', 'Flexibilidade', 'flexibilidade', 6, '{"id0": "C6", "peso": 1, "tipo": "sernissan", "numero": 6, "pergunta": "Esteve aberto a novas ideias e possibilidades, lidou com várias demandas simultaneamente sem perder o foco e a energia?", "descricao": "Capacidade de estar aberto a novas ideias e possibilidades, lidando com várias demandas simultaneamente sem perder o foco e a energia."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCU', 'Proatividade', 'proatividade', 7, '{"id0": "C7", "peso": 1, "tipo": "sernissan", "numero": 7, "pergunta": "Teve iniciativa diante das situações de forma antecipada, assumindo a responsabilidade nas tomadas de decisão com agilidade e ponderação?", "descricao": "Ter iniciativa diante das situações de forma antecipada, assumindo a responsabilidade nas tomadas de decisão com agilidade e ponderação."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCV', 'Execução Operacional', 'execu__o_operacional', 8, '{"id0": "C8", "peso": 1, "tipo": "sernissan", "numero": 8, "pergunta": "Colocou em prática as estratégias e ações planejadas pela empresa, utilizando os conhecimentos técnicos e recursos de forma otimizada?", "descricao": "Capacidade de colocar em prática as estratégias e ações planejadas pela empresa, utilizando os conhecimentos técnicos e recursos de forma otimizada. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCZ', 'Comunicação Escrita e Falada', 'comunica__o_escrita_e_falada', 9, '{"id0": "C9", "peso": 1, "tipo": "espec_fica", "numero": 1, "pergunta": "Leu e ouviu com atenção e comunicou de forma clara, efetiva e correta as ideias para os Clientes internos e externos?", "descricao": "Capacidade de ler e ouvir com atenção e de comunicar de forma clara, efetiva e correta as ideias para os Clientes internos e externos.   "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCa', 'Gestão da Informação', 'gest_o_da_informa__o', 10, '{"id0": "C10", "peso": 1, "tipo": "espec_fica", "numero": 2, "pergunta": "Organizou os fluxos e garantiu a qualidade das informações estratégicas e operacionais do negócio, com o objetivo de apoiar a tomada de decisão?", "descricao": "Organizar os fluxos e garantir a qualidade das informações estratégicas e operacionais do negócio, com o objetivo de apoiar a tomada de decisão. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCb', 'Liderança', 'lideran_a', 11, '{"id0": "C11", "peso": 1, "tipo": "espec_fica", "numero": 3, "pergunta": "Inspirou pessoas influenciando de forma positiva comportamentos e modelos mentais, garantindo que objetivos da empresa fossem atingidos?", "descricao": "Inspirar pessoas influenciando de forma positiva comportamentos e modelos mentais, garantindo que objetivos da empresa sejam atingidos. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCf', 'Negociação', 'negocia__o', 12, '{"id0": "C12", "peso": 1, "tipo": "espec_fica", "numero": 4, "pergunta": "Chegou a um acordo proporcionando ganhos e vantagens para todos os envolvidos no processo?", "descricao": "Capacidade de chegar a um acordo proporcionando ganhos e vantagens para todos os envolvidos no processo. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCg', 'Organização e Planejamento', 'organiza__o_e_planejamento', 13, '{"id0": "C13", "peso": 1, "tipo": "espec_fica", "numero": 5, "pergunta": "Estruturou e projetou suas atividades e as de sua equipe, estabelecendo metas mensuráveis e atingíveis, cumprindo-as com êxito?", "descricao": "Capacidade de estruturar e projetar suas atividades e as de sua equipe, estabelecendo metas mensuráveis e atingíveis, cumprindo-as com êxito."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCh', 'Relacionamento Interpessoal', 'relacionamento_interpessoal', 14, '{"id0": "C14", "peso": 1, "tipo": "espec_fica", "numero": 6, "pergunta": "Lidou com outras pessoas de maneira empática se adequando às necessidades de cada um e de cada situação?", "descricao": "Capacidade de lidar com outras pessoas de maneira empática se adequando às necessidades de cada um e de cada situação."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCl', 'Trabalho em equipe', 'trabalho_em_equipe', 15, '{"id0": "C15", "peso": 1, "tipo": "espec_fica", "numero": 7, "pergunta": "Convivou com pessoas diferentes gerando cooperação e sinergia para atingir um propósito comum?", "descricao": "Capacidade de conviver com pessoas diferentes gerando cooperação e sinergia para atingir um propósito comum. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCm', 'Escuta Ativa', 'escuta_ativa', 16, '{"id0": "C16", "peso": 1, "tipo": "espec_fica", "numero": 8, "pergunta": "Ouviu atentamente a mensagem que outra pessoa esteja transmitindo, sem julgamentos e sem interrupções desnecessárias?", "descricao": "Capacidade de ouvir atentamente a mensagem que outra pessoa esteja transmitindo, sem julgamentos e sem interrupções desnecessárias."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCn', 'Capacidade de Transformar', 'capacidade_de_transformar', 17, '{"id0": "C17", "peso": 1, "tipo": "espec_fica", "numero": 9, "pergunta": "Provocou mudanças na forma de atuação dos envolvidos em ambientes e situações complexas e dinâmicas?", "descricao": "Capacidade de provocar mudanças na forma de atuação dos envolvidos em ambientes e situações complexas e dinâmicas."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCr', 'Desenvolvimento e Empoderamento', 'desenvolvimento_e_empoderamento', 18, '{"id0": "C18", "peso": 1, "tipo": "espec_fica", "numero": 10, "pergunta": "Delegou maior autonomia de decisão e responsabilidade às equipes, valorizando e aproveitando ao máximo os seus talentos?", "descricao": "Capacidade de delegar maior autonomia de decisão e responsabilidade às equipes, valorizando e aproveitando ao máximo os seus talentos."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCs', 'Inteligência Emocional', 'intelig_ncia_emocional', 19, '{"id0": "C19", "peso": 1, "tipo": "espec_fica", "numero": 11, "pergunta": "Identificou os nossos próprios sentimentos e os dos outros, motivou-se e geriu bem as emoções dentro de nós e nos nossos relacionamentos?", "descricao": "Capacidade de identificar os nossos próprios sentimentos e os dos outros, de nos motivarmos e de gerir bem as emoções dentro de nós e nos nossos relacionamentos. "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia', 'bTXCt', 'Análise de Resultados', 'an_lise_de_resultados', 20, '{"id0": "C20", "peso": 1, "tipo": "espec_fica", "numero": 12, "pergunta": "Analisou e interpretou os Indicadores e os impactos das ações realizadas, verificou tendências e planejou ações de melhoria?", "descricao": "Capacidade de analisar e interpretar os Indicadores e os impactos das ações realizadas, verificar tendências e planejar ações de melhoria."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('classe_indicador', 'bTTmp', 'Volume', 'volume', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('classe_indicador', 'bTTmq', 'Qualidade', 'qualidade', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFD', 'Cordialidade', 'cordialidade', 1, '{"id0": "CA1"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFH', 'Simpatia', 'simpatia', 2, '{"id0": "CA2"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFI', 'Atenção', 'aten__o', 3, '{"id0": "CA3"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFJ', 'Empatia', 'empatia', 4, '{"id0": "CA4"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFN', 'Iniciativa', 'iniciativa', 5, '{"id0": "CA5"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFO', 'Comprometimento', 'comprometimento', 6, '{"id0": "CA6"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFP', 'Entusiasmo', 'entusiasmo', 7, '{"id0": "CA7"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFT', 'Dedicação', 'dedica__o', 8, '{"id0": "CA8"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFU', 'Iniciativa', 'iniciativa0', 9, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFV', 'Detalhista', 'detalhista', 10, '{"id0": "CA9"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFZ', 'Paciente', 'paciente', 11, '{"id0": "CA10"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFa', 'Propositivo', 'propositivo', 12, '{"id0": "CA11"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFb', 'Respeito', 'respeito', 13, '{"id0": "CA12"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFf', 'Resiliência', 'resili_ncia', 14, '{"id0": "CA13"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFg', 'Autoconfiança', 'autoconfian_a', 15, '{"id0": "CA14"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFh', 'Seguir hábitos', 'seguir_h_bitos', 16, '{"id0": "CA15"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXFl', 'Pontualidade', 'pontualidade', 17, '{"id0": "CA16"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_atitudes', 'bTXIx', 'Aprendizado e Desenvolvimento Pessoal', 'aprendizado_e_desenvolvimento_pessoal', 18, '{"id0": "CA17"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXCz', 'Guia SERNISSAN', 'guia_sernissan', 1, '{"id0": "CF1"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDD', 'Agenda de Gestão', 'agenda_de_gest_o', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDE', 'Calibração de Competências e Hábitos', 'calibra__o_de_compet_ncias_e_h_bitos', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDF', 'Guia de Uniformes_Nissan do Brasil_rev.02', 'guia_de_uniformes_nissan_do_brasil_rev_02', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDJ', 'Guia SERNISSAN | Como realizar uma Autocalibração consciente', 'guia_sernissan___como_realizar_uma_autocalibra__o_consciente', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDK', 'Guia SERNISSAN | Plano de Transformação', 'guia_sernissan___plano_de_transforma__o', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDL', 'Guia SERNISSAN | Reunião de Resultados', 'guia_sernissan___reuni_o_de_resultados', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDP', 'Mapa de competências', 'mapa_de_compet_ncias', 8, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDQ', 'Pesquisa de Clima de Trabalho NISSAN_v2', 'pesquisa_de_clima_de_trabalho_nissan_v2', 9, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDR', 'Placar de Performance', 'placar_de_performance', 10, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDV', 'Guia SERNISSAN | Passos da Demonstração do Veículo', 'guia_sernissan___passos_da_demonstra__o_do_ve_culo', 11, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDW', 'Mapa de competências', 'mapa_de_compet_ncias0', 12, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDX', 'Trilha de integração e desenvolvimento', 'trilha_de_integra__o_e_desenvolvimento', 13, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDb', 'Check-in de Vendas', 'check_in_de_vendas', 14, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDc', 'Check-up de Vendas', 'check_up_de_vendas', 15, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDd', 'Guia Rápido para o Armazenamento e Manuseio de Veículos Zero Km', 'guia_r_pido_para_o_armazenamento_e_manuseio_de_ve_culos_zero_km', 16, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDh', 'Manual de Manuseio do Veículo Novo_NVHM_2019', 'manual_de_manuseio_do_ve_culo_novo_nvhm_2019', 18, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDi', 'Cartão de Apresentação do Pós-Venda', 'cart_o_de_apresenta__o_do_p_s_venda', 17, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDj', 'Cartão de Satisfação de Pós-Venda', 'cart_o_de_satisfa__o_de_p_s_venda', 19, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDn', 'Catálogo de Ferramentas e Equipamentos Nissan 05_2023', 'cat_logo_de_ferramentas_e_equipamentos_nissan_05_2023', 20, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDo', 'Exemplo de pesquisa VOC', 'exemplo_de_pesquisa_voc', 21, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDp', 'Guia de Uniformes_Nissan do Brasil_rev.02', 'guia_de_uniformes_nissan_do_brasil_rev_020', 22, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDt', 'Guia SERNISSAN | Roteiro para Entrevista de Desligamento', 'guia_sernissan___roteiro_para_entrevista_de_desligamento', 23, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDu', 'Guia SERNISSAN | Sessão Individual de Feedback e Planejamento de Performance', 'guia_sernissan___sess_o_individual_de_feedback_e_planejamento_de_performance', 24, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXDv', 'Guia SERNISSAN | PRC (Processo de Recuperação de Clientes)', 'guia_sernissan__prc__processo_de_recupera__o_de_clientes_', 25, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXHw', 'Guia SERNISSAN | Check-in de Vendas', 'guia_sernissan___check_in_de_vendas', 26, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXHx', 'Painel de Monitoramento de Vendas e VD', 'painel_de_monitoramento_de_vendas_e_vd', 27, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIB', 'Preferências para a Entrega', 'prefer_ncias_para_a_entrega', 28, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIC', 'Cartão Check-out de Serviço', 'cart_o_check_out_de_servi_o', 29, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXID', 'DPVN 110-23 Guia 2023 de Acessorização de Veículos para Showroom e Test Drive', 'dpvn_110_23_guia_2023_de_acessoriza__o_de_ve_culos_para_showroom_e_test_drive', 30, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIH', 'Guia SERNISSAN | Guia para Indicações', 'guia_sernissan___guia_para_indica__es', 31, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXII', 'Guia SERNISSAN | Negociação e Fechamento', 'guia_sernissan___negocia__o_e_fechamento', 32, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIJ', 'Guia SERNISSAN | Roteiro de Contato de Relacionamento e Indicação', 'guia_sernissan___roteiro_de_contato_de_relacionamento_e_indica__o', 33, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIN', 'Guia SERNISSAN | Roteiro de Recuperação de Negócios', 'guia_sernissan___roteiro_de_recupera__o_de_neg_cios', 34, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIO', 'Guia SERNISSAN | Test Drive', 'guia_sernissan___test_drive', 35, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIP', 'Check-list de Inspeção Final de Entrega', 'check_list_de_inspe__o_final_de_entrega', 36, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIT', 'Guia SERNISSAN | Passos da Inspeção Final de Entrega', 'guia_sernissan___passos_da_inspe__o_final_de_entrega', 37, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIU', 'Guia SERNISSAN | Roteiro de APE e APS', 'guia_sernissan___roteiro_de_ape_e_aps', 38, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIV', 'Guia SERNISSAN | Roteiro para Entrevista de Desligamento', 'guia_sernissan___roteiro_para_entrevista_de_desligamento0', 39, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIZ', 'Revisão de Entrega 0KM', 'revis_o_de_entrega_0km', 40, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIl', 'Check-in-up-out de Serviços', 'check_in_up_out_de_servi_os', 41, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIm', 'Guia SERNISSAN | Inventário e Estoque', 'guia_sernissan___invent_rio_e_estoque', 42, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIn', 'Guia SERNISSAN | Painel de Monitoramento de Peças Pendentes', 'guia_sernissan___painel_de_monitoramento_de_pe_as_pendentes', 43, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIr', 'Guia SERNISSAN | Passos da Coleta Antecipada de Peças', 'guia_sernissan___passos_da_coleta_antecipada_de_pe_as', 44, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIs', 'Painel de Monitoramento de Peças Pendentes', 'painel_de_monitoramento_de_pe_as_pendentes', 45, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXIt', 'Programação de Serviços', 'programa__o_de_servi_os', 46, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJn', 'Guia SERNISSAN | Agendamento', 'guia_sernissan___agendamento', 47, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJo', 'Guia SERNISSAN | Roteiro de Contato de  Relacionamento e Indicação', 'guia_sernissan___roteiro_de_contato_de__relacionamento_e_indica__o', 48, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJp', 'Menu de Revisões e Serviços', 'menu_de_revis_es_e_servi_os', 49, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJt', 'Checklist 5S NISSAN', 'checklist_5s_nissan', 50, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJu', 'Guia SERNISSAN | Certo na Primeira Vez (F1)', 'guia_sernissan___certo_na_primeira_vez__f1_', 51, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJv', 'Guia SERNISSAN | Identificação de Veículo De Serviço', 'guia_sernissan___identifica__o_de_ve_culo_de_servi_o', 52, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXJz', 'Guia SERNISSAN | Passos da Execução de Serviços', 'guia_sernissan___passos_da_execu__o_de_servi_os', 53, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKA', 'Guia SERNISSAN | Passos da Revisão de Serviços', 'guia_sernissan___passos_da_revis_o_de_servi_os', 54, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKB', 'Guia SERNISSAN | Passos do Teste de Rodagem', 'guia_sernissan___passos_do_teste_de_rodagem', 55, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKF', 'Guia SERNISSAN | Passos para o Controle de Qualidade', 'guia_sernissan___passos_para_o_controle_de_qualidade', 56, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKG', 'Guia SERNISSAN | Programação de Serviço', 'guia_sernissan___programa__o_de_servi_o', 57, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKH', 'Detalhes do Atendimento', 'detalhes_do_atendimento', 58, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKL', 'Guia SERNISSAN | Etiqueta de Serviço', 'guia_sernissan___etiqueta_de_servi_o', 59, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKM', 'Guia SERNISSAN | Passos do Check-in de Serviços', 'guia_sernissan___passos_do_check_in_de_servi_os', 60, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKN', 'Guia SERNISSAN | Passos do Check-out de Serviços', 'guia_sernissan___passos_do_check_out_de_servi_os', 61, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKR', 'DQGN 006-23 Nissan Dealer Plus – Processo de Garantia', 'dqgn_006_23_nissan_dealer_plus___processo_de_garantia', 62, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKS', 'DQGN 030-20 - Anexo - Guia de Bolso da Garantia Nissan - Atualizado', 'dqgn_030_20___anexo___guia_de_bolso_da_garantia_nissan___atualizado', 63, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKT', 'Guia SERNISSAN | Passos da Garantia', 'guia_sernissan___passos_da_garantia', 64, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKX', 'Cartão Check-in de Serviço', 'cart_o_check_in_de_servi_o', 65, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKY', 'Cartão Check-out de Serviço', 'cart_o_check_out_de_servi_o0', 66, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKZ', 'Detalhes do Atenidmento', 'detalhes_do_atenidmento', 67, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKd', 'Guia SERNISSAN | Retorno', 'guia_sernissan___retorno', 68, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKe', 'Guia SERNISSAN |PRC (Processo de Recuperação de Clientes)', 'guia_sernissan__prc__processo_de_recupera__o_de_clientes_0', 69, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKf', 'Lista de Equipamentos de Lavagem', 'lista_de_equipamentos_de_lavagem', 70, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_ferramenta', 'bTXKj', 'Guia SERNISSAN | Passos da Lavagem e Secagem', 'guia_sernissan___passos_da_lavagem_e_secagem', 71, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFm', 'Conhecimento dos processos chave de Vendas.', 'conhecimento_dos_processos_chave_de_vendas_', 1, '{"id0": "CC1"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFn', 'Desejável conhecimento de informática básica (Word e Excel).', 'desej_vel_conhecimento_de_inform_tica_b_sica__word_e_excel__', 2, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFr', 'Experiência na área comercial ou Administrativa.', 'experi_ncia_na__rea_comercial_ou_administrativa_', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFs', 'Conhecimento dos processos de Vendas.', 'conhecimento_dos_processos_de_vendas_', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFt', 'Conhecimento da área de geração de relatórios do sistema de gestão da concessionária.', 'conhecimento_da__rea_de_gera__o_de_relat_rios_do_sistema_de_gest_o_da_concession_ria_', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFx', 'Indicadores de Gestão.', 'indicadores_de_gest_o_', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFy', 'Conhecimento do SERNissan.', 'conhecimento_do_sernissan_', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXFz', 'Conhecimento em informática básica (Word, Exc).', 'conhecimento_em_inform_tica_b_sica__word__excel__', 8, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGD', 'Desejável conhecimento das operações financeiras.', 'desej_vel_conhecimento_das_opera__es_financeiras_', 9, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGE', 'Conhecimento dos processos de Vendas Diretas.', 'conhecimento_dos_processos_de_vendas_diretas_', 10, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGF', 'Conhecimento da área de geração de relatórios do sistema de gestão da concessionária.', 'conhecimento_da__rea_de_gera__o_de_relat_rios_do_sistema_de_gest_o_da_concession_ria_0', 11, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGJ', 'Conhecimento no mercado automobilístico.', 'conhecimento_no_mercado_automobil_stico_', 12, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGK', 'Conhecimento das principais marcas concorrentes.', 'conhecimento_das_principais_marcas_concorrentes_', 13, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGL', 'Vistoria de veículos.', 'vistoria_de_ve_culos_', 14, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGP', 'Conhecimento no mercado automotivo.', 'conhecimento_no_mercado_automotivo_', 15, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGQ', 'Conhecimento das principais marcas concorrentes.', 'conhecimento_das_principais_marcas_concorrentes_0', 16, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGR', 'Conhecimento de técnicas, acompanhamento e adminstração de redes sociais.', 'conhecimento_de_t_cnicas__acompanhamento_e_adminstra__o_de_redes_sociais_', 17, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGV', 'Conhecimento de técnicas de marketing digital e e-commerce.', 'conhecimento_de_t_cnicas_de_marketing_digital_e_e_commerce_', 18, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGW', 'Conhecimento dos processos internos de vendas da concessionária.', 'conhecimento_dos_processos_internos_de_vendas_da_concession_ria_', 19, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGX', 'Desejável conhecimento em matemática financeira.', 'desej_vel_conhecimento_em_matem_tica_financeira_', 20, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGb', 'Conhecimento dos principais produtos financeiros.', 'conhecimento_dos_principais_produtos_financeiros_', 21, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGc', 'Desejável conhecimento em matemática financeira.', 'desej_vel_conhecimento_em_matem_tica_financeira_0', 22, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGd', 'Mercado automotivo, principais marcas  e locadoras concorrentes.', 'mercado_automotivo__principais_marcas__e_locadoras_concorrentes_', 23, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGh', 'Técnicas de negociação e apresentação dos veículos Nissan (vantagens, características e atributos).', 't_cnicas_de_negocia__o_e_apresenta__o_dos_ve_culos_nissan__vantagens__caracter_sticas_e_atributos__', 24, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGi', 'Processos internos de vendas da Concessionária.', 'processos_internos_de_vendas_da_concession_ria_', 25, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGj', 'Conhecimento no mercado automobilístico, mais especificamente na legislação que beneficia o cliente PCD.', 'conhecimento_no_mercado_automobil_stico__mais_especificamente_na_legisla__o_que_beneficia_o_cliente_pdc_', 26, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGn', 'Conhecimento das principais marcas concorrentes.', 'conhecimento_das_principais_marcas_concorrentes_1', 27, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGo', 'Experiência em vendas diretas a empresas e órgãos oficiais no ramo automobilístico.', 'experi_ncia_em_vendas_diretas_a_empresas_e__rg_os_oficiais_no_ramo_automobil_stico_', 28, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGp', 'Conhecimento do Sistema de Gestão da Concessionária.', 'conhecimento_do_sistema_de_gest_o_da_concession_ria_', 29, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGt', 'Conhecimento dos diferenciais dos acessórios genuínos Nissan frente à concorrência (paralelo).', 'conhecimento_dos_diferenciais_dos_acess_rios_genu_nos_nissan_frente___concorr_ncia__paralelo__', 30, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGu', 'Conhecimento de todo o processo de Vendas.', 'conhecimento_de_todo_o_processo_de_vendas_', 31, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGv', 'Conhecimento da utilização dos atributos do carro.', 'conhecimento_da_utiliza__o_dos_atributos_do_carro_', 32, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXGz', 'Conhecimento em Vendas no segmento automobilístico.', 'conhecimento_em_vendas_no_segmento_automobil_stico_', 33, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHA', 'Conhecimentos em informática (Pacote Office e internet).', 'conhecimentos_em_inform_tica__pacote_office__', 34, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHB', 'Conhecimento em vendas diretas a empresas e órgãos oficiais no mercado automobilístico.', 'conhecimento_em_vendas_diretas_a_empresas_e__rg_os_oficiais_no_mercado_automobil_stico_', 35, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHF', 'Conhecimento de todo o processo digital de vendas da concessionária e da montadora.', 'conhecimento_de_todo_o_processo_digital_de_vendas_da_concession_ria_e_da_montadora_', 36, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHG', 'Conhecimento em controles de preparação de veículos e tempo de execução.', 'conhecimento_em_controles_de_prepara__o_de_ve_culos_e_tempo_de_execu__o_', 37, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHH', 'Desejável conhecimento de veículos.', 'desej_vel_conhecimento_de_ve_culos_', 38, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHL', 'Conhecimento em controles de recebimento e armazenamento de veículos e tempos de execução.', 'conhecimento_em_controles_de_recebimento_e_armazenamento_de_ve_culos_e_tempos_de_execu__o_', 39, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHM', 'Conhecimento dos serviços básicos da Concessionária e seus respectivos responsáveis.', 'conhecimento_dos_servi_os_b_sicos_da_concession_ria_e_seus_respectivos_respons_veis_', 40, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXHN', 'Desejável experiência anterior como telefonista', 'desej_vel_experi_ncia_anterior_como_telefonista', 41, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXIf', 'Conhecimento na área de peças de concessionárias.', 'conhecimento_na__rea_de_pe_as_de_concession_rias_', 42, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXIg', 'Conhecimento em gestão de estoque.', 'conhecimento_em_gest_o_de_estoque_', 43, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXIy', 'Conhecimento da área de agendamento do Sistema de Gestão da Concessionária.', 'conhecimento_da__rea_de_agendamento_do_sistema_de_gest_o_da_concession_ria_', 44, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXIz', 'Conhecimento dos serviços oferecidos pela concessionária .', 'conhecimento_dos_servi_os_oferecidos_pela_concession_ria__', 45, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJD', 'Desejável Experiência na área Administrativa.', 'desej_vel_experi_ncia_na__rea_administrativa_', 46, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJE', 'Conhecimento dos processo internos da área de Pós-Venda.', 'conhecimento_dos_processo_internos_da__rea_de_p_s_venda_', 47, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJF', 'Conhecimento técnico elevado em manutenção de veículos Nissan.', 'conhecimento_t_cnico_elevado_em_manuten__o_de_ve_culos_nissan_', 48, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJJ', 'Conhecimento dos processo de Pós-Venda.', 'conhecimento_dos_processo_de_p_s_venda_', 49, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJK', 'Conhecimentos administrativos da oficina.', 'conhecimentos_administrativos_da_oficina_', 50, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJL', 'Possuir CNH para realização de testes.', 'possuir_cnh_para_realiza__o_de_testes_', 51, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJP', 'Desejável conhecimento em mecânica.', 'desej_vel_conhecimento_em_mec_nica_', 52, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJQ', 'Conhecimento técnico em mecânica.', 'conhecimento_t_cnico_em_mec_nica_', 53, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJR', 'Conhecimento dos processo chave de Pós-Venda.', 'conhecimento_dos_processo_chave_de_p_s_venda_', 54, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJV', 'Conhecimento no mercado de reparo automobilístico.', 'conhecimento_no_mercado_de_reparo_automobil_stico_', 55, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJW', 'Conhecimento de técnicas de garantia automotiva.', 'conhecimento_de_t_cnicas_de_garantia_automotiva_', 56, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJX', 'Conhecimento em instalação de acessórios automotivos.', 'conhecimento_em_instala__o_de_acess_rios_automotivos_', 57, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJb', 'Métodos de lavagem de veículos', 'm_todos_de_lavagem_de_ve_culos', 58, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJc', 'Processos de Vendas e Pós-Venda relacionados à lavagem', 'processos_de_vendas_e_p_s_venda_relacionados___lavagem', 59, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJd', 'Conhecimento técnico em acessibilidade a equipamentos de diagnósticos.', 'conhecimento_t_cnico_em_acessibilidade_a_equipamentos_de_diagn_sticos_', 60, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXJh', 'Conhecimento elevado em manutenção de veículos Nissan.', 'conhecimento_elevado_em_manuten__o_de_ve_culos_nissan_', 61, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKp', 'Conhecimento da parte de entrada de produtos e serviços e de emissão de notas do Sistema de Gestão da Concessionária.', 'conhecimento_da_parte_de_entrada_de_produtos_e_servi_os_e_de_emiss_o_de_notas_do_sistema_de_gest_o_da_concession_ria_', 62, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKq', 'Conhecimento dos Produtos  serviços da Concessionária.', 'conhecimento_dos_produtos__servi_os_da_concession_ria_', 63, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKr', 'Relação de documentos e comprovantes para emissão da Nota Fiscal.', 'rela__o_de_documentos_e_comprovantes_para_emiss_o_da_nota_fiscal_', 64, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKv', 'Abrir e Fechar caixa.', 'abrir_e_fechar_caixa_', 65, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKw', 'Rotinas admistrativas da Concessionária.', 'rotinas_admistrativas_da_concession_ria_', 66, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXKx', 'Todos os indicadores contábeis da Concessionária.', 'todos_os_indicadores_cont_beis_da_concession_ria_', 67, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLB', 'Indicadores de Performance financeiros por área.', 'indicadores_de_performance_financeiros_por__rea_', 68, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLC', 'Conhecimento em Modelos de gestão de Marketing', 'conhecimento_em_modelos_de_gest_o_de_marketing', 69, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLD', 'Conhecimento dos processos chave de Vendas e Pós-venda.', 'conhecimento_dos_processos_chave_de_vendas_e_p_s_venda_', 70, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLH', 'Conhecimento dos métodos das pesquisas de satisfação.', 'conhecimento_dos_m_todos_das_pesquisas_de_satisfa__o_', 71, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLI', 'Conhecimento dos processos de recuperação de Clientes.', 'conhecimento_dos_processos_de_recupera__o_de_clientes_', 72, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLJ', 'Conhecimento em indicadores de performance.', 'conhecimento_em_indicadores_de_performance_', 73, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLN', 'Desejável conhecimento no segmento automobilístico.', 'desej_vel_conhecimento_no_segmento_automobil_stico_', 74, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLO', 'Conhecimento das principais marcas concorrentes.', 'conhecimento_das_principais_marcas_concorrentes_2', 75, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLP', 'Conhecimento dos processos de Vendas e Pós-venda.', 'conhecimento_dos_processos_de_vendas_e_p_s_venda_', 76, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLT', 'Conhecimento em Modelos de gestão.', 'conhecimento_em_modelos_de_gest_o_', 77, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLU', 'Conhecimento do Mapa de Competências Nissan.', 'conhecimento_do_mapa_de_compet_ncias_nissan_', 78, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLV', 'Conhecimento do mapa de competências da Concessionária.', 'conhecimento_do_mapa_de_compet_ncias_da_concession_ria_', 79, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLZ', 'Conhecimento de modelos de capacitação (técnica e comportamental).', 'conhecimento_de_modelos_de_capacita__o__t_cnica_e_comportamental__', 80, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLa', 'Experiência na elaboração e análise de demonstrativos contábeis.', 'experi_ncia_na_elabora__o_e_an_lise_de_demonstrativos_cont_beis_', 81, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLb', 'Conhecimento em legislação fiscal e tributária.', 'conhecimento_em_legisla__o_fiscal_e_tribut_ria_', 82, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLf', 'Experiência em implantação e controle de rotinas administrativas.', 'experi_ncia_em_implanta__o_e_controle_de_rotinas_administrativas_', 83, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLg', 'Desejável conhecimento em processos de ISO 9000.', 'desej_vel_conhecimento_em_processos_de_iso_9000_', 84, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLh', 'Conhecimento dos canais de contato com Clientes.', 'conhecimento_dos_canais_de_contato_com_clientes_', 85, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLl', 'Conhecimento dos processos e rotinas administrativas.', 'conhecimento_dos_processos_e_rotinas_administrativas_', 86, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLm', 'Conhecimento básico dos canais de contato com Clientes', 'conhecimento_b_sico_dos_canais_de_contato_com_clientes', 87, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLn', 'Experiência anterior em operações de telemarketing.', 'experi_ncia_anterior_em_opera__es_de_telemarketing_', 88, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLr', 'Desejável conhecimento da estrutura organizacional de uma concessionária.', 'desej_vel_conhecimento_da_estrutura_organizacional_de_uma_concession_ria_', 89, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLs', 'Conhecimento de modelos de gestão de pessoas.', 'conhecimento_de_modelos_de_gest_o_de_pessoas_', 90, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLt', 'Desejável experiência anterior na área de SAC.', 'desej_vel_experi_ncia_anterior_na__rea_de_sac_', 91, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLx', 'Conhecimento do sistema Salesforce e processo de Vendas e Pós-Venda.', 'conhecimento_do_sistema_salesforce_e_processo_de_vendas_e_p_s_venda_', 92, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLy', 'Conhecimento no Código de Defesa do Consumidor.', 'conhecimento_no_c_digo_de_defesa_do_consumidor_', 93, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXLz', 'Conhecimento em infraestrutura de TI.', 'conhecimento_em_infraestrutura_de_ti_', 94, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXMD', 'Conhecimento de implementação e manutenção de computadores em Redes.', 'conhecimento_de_implementa__o_e_manuten__o_de_computadores_em_redes_', 95, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXME', 'Conhecimento do sistema de gestão da Concessionária.', 'conhecimento_do_sistema_de_gest_o_da_concession_ria_0', 96, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXMF', 'Conhecimento do sistema de gestão da Concessionária.', 'conhecimento_do_sistema_de_gest_o_da_concession_ria_1', 97, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_conhecimentos', 'bTXMJ', 'Conhecimento de sistemas de indicadores de performance.', 'conhecimento_de_sistemas_de_indicadores_de_performance_', 98, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_tipo', 'bTWoX', 'Específica', 'espec_fica', 1, '{"divisor": 10}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_tipo', 'bTWob', 'SerNissan', 'sernissan', 2, '{"divisor": 20}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_tipo', '1763437206769x474919464966719360', 'Hábito', 'h_bito', 3, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_tipo', '1763437476610x679996466691551440', 'Hábito', 'h_bito0', 4, '{"divisor": 70}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXez', 'MV', 'mv', 1, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqb', 'Estrutura das Equipes', 'estrutura_das_equipes', 2, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqc', 'Seleção e Integração', 'sele__o_e_integra__o', 3, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqd', 'Recursos e Instalações', 'recursos_e_instala__es', 4, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqh', '1', '1_', 5, '{"mv": "MV 1", "id0": "CH1", "area": "I", "peso": 9, "trilha": 1, "pergunta": "Teve pessoas capacitadas para todas as Funções-Chave, direcionados ao Encantamento do Cliente?", "descricao": "Tenha pessoas capacitadas para todas as Funções-Chave, direcionados ao Encantamento do Cliente.", "essencial": true, "momento_de_verdade": "Estrutura das Equipes"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqi', '2', '2_', 6, '{"mv": "MV 2", "id0": "CH2", "area": "I", "peso": 1, "trilha": 1, "pergunta": "Realizou o recrutamento e seleção para contratar colaboradores adequados?", "descricao": "Realize o recrutamento e seleção para contratar colaboradores adequados.", "essencial": false, "momento_de_verdade": "Seleção e Integração"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqj', '3', '3_', 7, '{"mv": "MV 3", "id0": "CH3", "area": "I", "peso": 1, "trilha": 1, "pergunta": "Garantiu que todos os colaboradores utilizem os recursos necessários para o seu desempenho?", "descricao": "Garanta que todos os colaboradores utilizem os recursos necessários para o seu desempenho.", "essencial": false, "momento_de_verdade": "Recursos e Instalações"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqn', '4', '4_', 8, '{"mv": "MV 3", "id0": "CH4", "area": "PV", "peso": 6, "trilha": 1, "pergunta": "Teve box equipados e ferramentas adequadas para a execução dos serviços?", "descricao": "Possui boxes equipados e ferramentas adequadas para a execução dos serviços.", "essencial": true, "momento_de_verdade": "Recursos e Instalações"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqo', '5', '5_', 9, '{"mv": "MV 3", "id0": "CH5", "area": "I", "peso": 3, "trilha": 1, "pergunta": "Manteve as instalações da Concessionária em perfeitas condições?", "descricao": "Mantenha as instalações da Concessionária em perfeitas condições.", "essencial": false, "momento_de_verdade": "Recursos e Instalações"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqp', '6', '6_', 10, '{"mv": "MV 4", "id0": "CH6", "area": "I", "peso": 6, "trilha": 1, "pergunta": "Capacitou e desenvolveu continuamente a equipe?", "descricao": "Capacite e desenvolva continuamente a equipe.", "essencial": true, "momento_de_verdade": "Treinamento e Desenvolvimento"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqt', '7', '7_', 11, '{"mv": "MV 4", "id0": "CH7", "area": "I", "peso": 6, "trilha": 1, "pergunta": "Desenvolveu continuamente os colaboradores com foco na alta performance?", "descricao": "Desenvolve e reconhece os colaboradores, por mérito ou bonificação, com foco em alta performance.", "essencial": true, "momento_de_verdade": "Treinamento e Desenvolvimento"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqu', '8', '8_', 12, '{"mv": "MV 5", "id0": "CH8", "area": "I", "peso": 1, "trilha": 1, "pergunta": "Reconheceu e bonificou todos os colaboradores com foco na redução da rotatividade?", "descricao": "Realize ações de melhoria continua.", "essencial": false, "momento_de_verdade": "Performance e Reconhecimento"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqv', '9', '9_', 13, '{"mv": "MV 6", "id0": "CH9", "area": "I", "peso": 6, "trilha": 1, "pergunta": "Realizou ações de melhoria contínua?", "descricao": "Realize ações de relacionamento e marketing.", "essencial": true, "momento_de_verdade": "Cultura Kaizen"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXqz', '10', '10_', 14, '{"mv": "MV 7", "id0": "CH10", "area": "I", "peso": 1, "trilha": 2, "pergunta": "Realizou ações de relacionamento e marketing?", "descricao": "Realize campanhas e ações de prospecção de Clientes.", "essencial": false, "momento_de_verdade": "Ações de Relacionamento e Marketing"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrA', '11', '11_', 15, '{"mv": "MV 8", "id0": "CH11", "area": "I", "peso": 6, "trilha": 2, "pergunta": "Realizou campanhas e ações de prospecção de Clientes?", "descricao": "Posicione os veículos no showroom conforme recomendação da Nissan.", "essencial": true, "momento_de_verdade": "Ações de Prospecção"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrB', '12', '12_', 16, '{"mv": "MV 9", "id0": "CH12", "area": "V", "peso": 1, "trilha": 2, "pergunta": "Posicionou os veículos no showroom conforme recomendação da Nissan?", "descricao": "Posicione os veículos no showroom conforme recomendação da Nissan.", "essencial": false, "momento_de_verdade": "Preparação para receber o Cliente de Vendas"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrF', '13', '13_', 17, '{"mv": "MV 10", "id0": "CH13", "area": "PV", "peso": 9, "trilha": 2, "pergunta": "Teve Operadores dedicados ao Agendamento Ativo e Receptivo para atendimentos e campanhas?", "descricao": "Tenha Operadores dedicados ao Agendamento Ativo e Receptivo para atendimentos e campanhas.", "essencial": true, "momento_de_verdade": "Agendamento ativo e receptivo"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrG', '14', '14_', 18, '{"mv": "MV 11", "id0": "CH14", "area": "PV", "peso": 3, "trilha": 2, "pergunta": "Revisou a programação do dia seguinte e assegurou a disponibilidade do Consultor de Serviços para receber os Clientes agendados?", "descricao": "Revise a programação do dia seguinte e assegure a disponibilidade do Consultor de Serviços para receber os Clientes agendados.", "essencial": false, "momento_de_verdade": "Preparação para receber o Cliente de Pós-Vendas"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrH', '15', '15_', 19, '{"mv": "MV 12", "id0": "CH15", "area": "V", "peso": 3, "trilha": 3, "pergunta": "Teve uma pessoa ou central responsável pelo atendimento e registro dos Clientes Digitais?", "descricao": "Tenha uma pessoa ou central responsável pelo atendimento e registro dos Clientes Digitais.", "essencial": false, "momento_de_verdade": "Atendimento Clientes Digitais"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrL', '16', '16_', 20, '{"mv": "MV 13", "id0": "CH16", "area": "I", "peso": 1, "trilha": 3, "pergunta": "Teve um sistema efetivo de atendimento telefônico e de distribuição das ligações?", "descricao": "Tenha um sistema efetivo de atendimento telefônico e de distribuição das ligações.", "essencial": false, "momento_de_verdade": "Atendimento Telefônico"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrM', '17', '17_', 21, '{"mv": "MV 14", "id0": "CH17", "area": "I", "peso": 1, "trilha": 3, "pergunta": "Atendeu de forma ágil, cumprimentou pelo nome, confirmou a finalidade da visita e compartilhou os próximos passos do atendimento?", "descricao": "Atenda de forma ágil, cumprimente pelo nome, confirme a finalidade da visita e compartilhe os próximos passos do atendimento.", "essencial": false, "momento_de_verdade": "Atendimento Presencial"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrN', '18', '18_', 22, '{"mv": "MV 15", "id0": "CH18", "area": "V", "peso": 1, "trilha": 3, "pergunta": "Utilizou perguntas abertas, identificou o perfil do Cliente e explicou as características e benefícios do veículo?", "descricao": "Utilize perguntas abertas, identifique o perfil do Cliente e explique as características e benefícios do veículo.", "essencial": false, "momento_de_verdade": "Qualificação e Apresentação do Veículo"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrR', '19', '19_', 23, '{"mv": "MV 16", "id0": "CH19", "area": "V", "peso": 6, "trilha": 3, "pergunta": "Teve um processo estruturado de Test Drive visando que o Cliente experimente completamente os recursos dos veículos?", "descricao": "Tenha um processo estruturado de Test Drive visando que o Cliente experimente completamente os recursos dos veículos?", "essencial": true, "momento_de_verdade": "Test Drive"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrS', '20', '20_', 24, '{"mv": "MV 17", "id0": "CH20", "area": "V", "peso": 1, "trilha": 3, "pergunta": "Manteve o processo ágil e transparente de avaliação e captação de veículos Seminovos?", "descricao": "Mantenha o processo ágil e transparente de avaliação e captação de veículos Seminovos.", "essencial": false, "momento_de_verdade": "Avaliação do Seminovo"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrT', '21', '21_', 25, '{"mv": "MV 18", "id0": "CH21", "area": "V", "peso": 3, "trilha": 3, "pergunta": "Registrou imediatamente a negociação no CRM/Sistema ao finalizar cada atendimento e garantiu a medição da taxa de conversão?", "descricao": "Registre imediatamente a negociação no CRM/Sistema ao finalizar cada atendimento e garanta a medição da taxa de conversão.", "essencial": false, "momento_de_verdade": "Negociação"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrX', '22', '22_', 26, '{"mv": "MV 19", "id0": "CH22", "area": "V", "peso": 1, "trilha": 3, "pergunta": "Teve um processo estruturado de recuperação de negócios e acompanhamento dos Clientes que não compraram?", "descricao": "Tenha um processo estruturado de recuperação de negócios e acompanhamento dos Clientes que não compraram.", "essencial": false, "momento_de_verdade": "Recuperação de negócios e acompanhamento do Cliente"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrY', '23', '23_', 27, '{"mv": "MV 20", "id0": "CH23", "area": "V", "peso": 9, "trilha": 3, "pergunta": "Realizou o Check-in de Vendas para 100% dos Clientes presenciais e digitais, entendendo suas necessidades, gerando transparência no processo?", "descricao": "Realize o Check-in de Vendas para 100% dos Clientes presenciais e digitais, entendendo suas necessidades, gerando transparência no processo.", "essencial": true, "momento_de_verdade": "Fechamento e Check-in de Vendas"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrZ', '24', '24_', 28, '{"mv": "MV 21", "id0": "CH24", "area": "PV", "peso": 9, "trilha": 3, "pergunta": "Realizou o Check-in de Serviços com 100% dos Clientes no ND+ (Tablet de Serviços), registrando as suas necessidades e gerando transparência no processo?", "descricao": "Realize o Check-in de Serviços com 100% dos Clientes no ND+ (Tablet de Serviços), registrando as suas necessidades e gerando transparência no processo.", "essencial": true, "momento_de_verdade": "Recepção e Check-in de Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrd', '25', '25_', 29, '{"mv": "MV 22", "id0": "CH25", "area": "I", "peso": 1, "trilha": 3, "pergunta": "Teve um processo estruturado para a Venda de Acessórios?", "descricao": "Tenha um processo estruturado para a Venda de Acessórios.", "essencial": false, "momento_de_verdade": "Vendas de Acessórios, Nissan Protect e Agregados"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXre', '26', '26_', 30, '{"mv": "MV 23", "id0": "CH26", "area": "V", "peso": 3, "trilha": 4, "pergunta": "Teve um processo estruturado para garantir a transparência da negociação e o contato com o Cliente?", "descricao": "Tenha um processo estruturado para garantir a transparência da negociação e o contato com o Cliente?", "essencial": false, "momento_de_verdade": "Gestão de Vendas"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrf', '27', '27_', 31, '{"mv": "MV 24", "id0": "CH27", "area": "V", "peso": 1, "trilha": 4, "pergunta": "Acompanhou a localização dos veículos, disponibilidade, tempo estimado de chegada e estoque atual?", "descricao": "Acompanhe a localização dos veículos, disponibilidade, tempo estimado de chegada e estoque atual.", "essencial": false, "momento_de_verdade": "Preparação para Entrega de Veículos Novos"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrj', '28', '28_', 32, '{"mv": "MV 24", "id0": "CH28", "area": "I", "peso": 9, "trilha": 4, "pergunta": "Realizou a revisão do 0km e a instalação acessórios, garantindo que o veículo esteja em perfeitas condições?", "descricao": "Realize a revisão do 0km e a instalação acessórios, garantindo que o veículo esteja em perfeitas condições.", "essencial": true, "momento_de_verdade": "Preparação para Entrega de Veículos Novos"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrk', '29', '29_', 33, '{"mv": "MV 25", "id0": "CH29", "area": "PV", "peso": 1, "trilha": 4, "pergunta": "Atualizou e compartilhou com os colaboradores envolvidos o Menu de Revisões e Serviços (TMO) e a Programação de Serviços?", "descricao": "Atualize e compartilhe com os colaboradores envolvidos o Menu de Revisões e Serviços (TMO) e a Programação de Serviços.", "essencial": false, "momento_de_verdade": "Planejamento e Controle dos Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrl', '30', '30_', 34, '{"mv": "MV 25", "id0": "CH30", "area": "PV", "peso": 1, "trilha": 4, "pergunta": "Localizou e identificou os veículos nas vagas operacionais e a etapa de serviço em que se encontram?", "descricao": "Localize e identifique os veículos nas vagas operacionais e a etapa de serviço em que se encontram.", "essencial": false, "momento_de_verdade": "Planejamento e Controle dos Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrp', '31', '31_', 35, '{"mv": "MV 26", "id0": "CH31", "area": "PV", "peso": 1, "trilha": 4, "pergunta": "Garantiu um estoque de peças eficiente e organizado, acompanhando giro e disponibilidade?", "descricao": "Garanta um estoque de peças eficiente e organizado, acompanhando giro e disponibilidade:", "essencial": false, "momento_de_verdade": "Estoque de Peças e Acessórios"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrq', '32', '32_', 36, '{"mv": "MV 26", "id0": "CH32", "area": "PV", "peso": 3, "trilha": 4, "pergunta": "Realizou gestão efetiva e comunicação assertiva com os Clientes em todas as etapas do monitoramento dos pedidos de peças?", "descricao": "Realiza gestão efetiva e comunicação assertiva com os Clientes em todas as etapas do monitoramento dos pedidos de peças?", "essencial": false, "momento_de_verdade": "Estoque de Peças e Acessórios"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrr', '33', '33_', 37, '{"mv": "MV 27", "id0": "CH33", "area": "PV", "peso": 1, "trilha": 4, "pergunta": "Garantiu que todos os Técnicos utilizem os recursos necessários para a execução do serviço?", "descricao": "Garanta que todos os Técnicos utilizem os recursos necessários para a execução do serviço.", "essencial": false, "momento_de_verdade": "Execução dos Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrv', '34', '34_', 38, '{"mv": "MV 27", "id0": "CH34", "area": "PV", "peso": 9, "trilha": 4, "pergunta": "Executou corretamente o Serviço, preenchendo com qualidade o Check-up de Serviços no ND+ (Tablet de Serviços)?", "descricao": "Execute corretamente o Serviço, preenchendo com qualidade o Check-up de Serviços no ND+ (Tablet de Serviços).", "essencial": true, "momento_de_verdade": "Execução dos Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrw', '35', '35_', 39, '{"mv": "MV 28", "id0": "CH35", "area": "PV", "peso": 3, "trilha": 4, "pergunta": "Garantiu a excelência na explicação da necessidade de Serviço Adicional, utilizando o ND+ (Tablet de Serviços)?", "descricao": "Garanta a excelência na explicação da necessidade de Serviço Adicional, utilizando o ND+ (Tablet de Serviços).", "essencial": false, "momento_de_verdade": "Gestão do Serviço Adicional "}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXrx', '36', '36_', 40, '{"mv": "MV 29", "id0": "CH36", "area": "PV", "peso": 6, "trilha": 4, "pergunta": "Garantiu que 100% dos serviços tenham Controle de Qualidade?", "descricao": "Garanta que 100% dos serviços tenham Controle de Qualidade.", "essencial": true, "momento_de_verdade": "Controle de Qualidade"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsB', '37', '37_', 41, '{"mv": "MV 30", "id0": "CH37", "area": "I", "peso": 6, "trilha": 4, "pergunta": "Agendou e lavou com excelência os veículos em uma área exclusiva e adequada ao fluxo?", "descricao": "Agende e lave com excelência os veículos em uma área exclusiva e adequada ao fluxo.", "essencial": true, "momento_de_verdade": "Área de Lavagem"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsC', '38', '38_', 42, '{"mv": "MV 31", "id0": "CH38", "area": "PV", "peso": 1, "trilha": 4, "pergunta": "Realizou corretamente e no prazo as Garantias?", "descricao": "Realize corretamente e no prazo as Garantias.", "essencial": false, "momento_de_verdade": "Gestão de Garantia"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsD', '39', '39_', 43, '{"mv": "MV 32", "id0": "CH39", "area": "V", "peso": 6, "trilha": 5, "pergunta": "Teve um Preparador de Entrega que acompanhou todas as etapas e um Programador de Entrega que realizou o agendamento apenas quando o veículo estava pronto?", "descricao": "Tenha um Preparador de Entrega que acompanhe todas as etapas e um Programador de Entrega que realize o agendamento apenas quando o veículo está pronto.", "essencial": true, "momento_de_verdade": "Programação de Entrega"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsH', '40', '40_', 44, '{"mv": "MV 33", "id0": "CH40", "area": "V", "peso": 3, "trilha": 5, "pergunta": "Realizou a inspeção final de entrega em até 2 horas antes do horário agendado e garantiu que estivesse em perfeitas condições?", "descricao": "Realize a inspeção final de entrega em até 2 horas antes do horário agendado e garanta que esteja em perfeitas condições.", "essencial": false, "momento_de_verdade": "Inspeção Final de Vendas"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsI', '41', '41_', 45, '{"mv": "MV 34", "id0": "CH41", "area": "V", "peso": 9, "trilha": 5, "pergunta": "Criou uma experiência personalizada para o Cliente durante a Entrega do veículo (Check-out)?", "descricao": "Crie uma experiência personalizada para o Cliente durante a Entrega do veículo (Check-out).", "essencial": true, "momento_de_verdade": "Entrega do Veículo Novo (Check-out)"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsJ', '42', '42_', 46, '{"mv": "MV 34", "id0": "CH42", "area": "V", "peso": 1, "trilha": 5, "pergunta": "Realizou a Entrega do veículo novo dentro do prazo acordado com o Cliente, e cadastrou no GNB em até 24 horas?", "descricao": "Realize a Entrega do veículo novo dentro do prazo acordado com o Cliente, e cadastre no GNB em até 24 horas.", "essencial": false, "momento_de_verdade": "Entrega do Veículo Novo (Check-out)"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsN', '43', '43_', 47, '{"mv": "MV 35", "id0": "CH43", "area": "PV", "peso": 3, "trilha": 5, "pergunta": "Realizou a Inspeção final de serviços para garantir que o veículo fosse entregue em perfeitas condições?", "descricao": "Realize a Inspeção final de serviços para garantir que o veículo seja entregue em perfeitas condições.", "essencial": false, "momento_de_verdade": "Inspeção Final de Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsO', '44', '44_', 48, '{"mv": "MV 36", "id0": "CH44", "area": "PV", "peso": 6, "trilha": 5, "pergunta": "Recebeu e direcionou o Cliente ao veículo utilizando o ND+ (Tablet de Serviços) e demonstrou visualmente os serviços executados e as peças substituídas?", "descricao": "Receba e direcione o Cliente ao veículo utilizando o ND+ (Tablet de Serviços) e demonstre visualmente os serviços executados e as peças substituídas.", "essencial": true, "momento_de_verdade": "Início do Check-out de Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsP', '45', '45_', 49, '{"mv": "MV 36", "id0": "CH45", "area": "PV", "peso": 1, "trilha": 5, "pergunta": "Garantiu o prazo de Check-out combinado com o Cliente e realizou o Teste de Rodagem Final (quando necessário)?", "descricao": "Garanta o prazo de Check-out combinado com o Cliente e realize o Teste de Rodagem Final (quando necessário).", "essencial": false, "momento_de_verdade": "Início do Check-out de Serviços"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsT', '46', '46_', 50, '{"mv": "MV 37", "id0": "CH46", "area": "PV", "peso": 9, "trilha": 5, "pergunta": "Explicou os serviços realizados, valores cobrados e obteve a assinatura do Cliente no Check-out no ND+ (Tablet de Serviços)?", "descricao": "Explique os serviços realizados, valores cobrados e obtenha a assinatura do Cliente no Check-out no ND+ (Tablet de Serviços).", "essencial": true, "momento_de_verdade": "Explicação da OS, valores e Check-out"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsU', '47', '47_', 51, '{"mv": "MV 38", "id0": "CH47", "area": "I", "peso": 3, "trilha": 6, "pergunta": "Garantiu a satisfação do Cliente ainda na Concessionária e informou sobre a Pesquisa Nissan?", "descricao": "Garanta a satisfação do Cliente ainda na Concessionária e informe sobre a Pesquisa Nissan.", "essencial": false, "momento_de_verdade": "Início do acompanhamento da Satisfação (Check-out)"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsV', '48', '48_', 52, '{"mv": "MV 39", "id0": "CH48", "area": "I", "peso": 6, "trilha": 6, "pergunta": "Acompanhou o VOC diariamente, garantiu as tratativas, compartilhando resultados e melhorias?", "descricao": "Acompanhe o VOC diariamente, garanta as tratativas, compartilhando resultados e melhorias.", "essencial": true, "momento_de_verdade": "Acompanhamento VOC"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsZ', '49', '49_', 53, '{"mv": "MV 40", "id0": "CH49", "area": "I", "peso": 1, "trilha": 6, "pergunta": "Realizou APE/APS e monitorou o Portal VOC, garantindo o Encantamento do Cliente?", "descricao": "Realize APE/APS e monitore o Portal VOC, garantindo o Encantamento do Cliente.", "essencial": false, "momento_de_verdade": "Contato de acompanhamento (APE/APS)"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habito', 'bTXsa', '50', '50_', 54, '{"mv": "MV 41", "id0": "CH50", "area": "I", "peso": 3, "trilha": 6, "pergunta": "Realizou o PRC (Processo de recuperação de Clientes) dentro de 24 horas em todos os canais?", "descricao": "Realize o PRC (Processo de recuperação de Clientes) dentro de 24 horas em todos os canais.", "essencial": false, "momento_de_verdade": "Processo de Recuperação de Cliente (PRC)"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXDz', 'Ser responsável pela gestão do fluxo de loja da concessionária e excelência na recepção dos Clientes. Realizar o primeiro atendimento na área de vendas, registrando os dados dos clientes e direcionando-os aos Consultores de Vendas, Entregadores e outros setores.', 'ser_respons_vel_pela_gest_o_do_fluxo_de_loja_da_concession_ria_e_excel_ncia_na_recep__o_dos_clientes__realizar_o_primeiro_atendimento_na__rea_de_vendas__registrando_os_dados_dos_clientes_e_direcionando_os_aos_consultores_de_vendas__entregadores_e_outros_setores_', 1, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEA', 'Responsável por dar suporte à liderança e aos Consultores de Vendas.', 'respons_vel_por_dar_suporte___lideran_a_e_aos_consultores_de_vendas_', 2, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEB', 'Organizar e acompanhar os processos da área, sendo o ponto focal de comunicação com o Cliente para o faturamento dos pedidos.', 'organizar_e_acompanhar_os_processos_da__rea__sendo_o_ponto_focal_de_comunica__o_com_o_cliente_para_o_faturamento_dos_pedidos_', 3, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEF', 'Responsável por dar suporte à equipe de Vendas Diretas, auxiliar na organização e andamento dos processos da área, acompanhamento dos pedidos de veículos junto a montadora e documentação necessária (cartas de isenção / prazos de validade) para faturamento.', 'respons_vel_por_dar_suporte___equipe_de_vendas_diretas__auxiliar_na_organiza__o_e_andamento_dos_processos_da__rea__acompanhamento_dos_pedidos_de_ve_culos_junto_a_montadora_e_documenta__o_necess_ria__cartas_de_isen__o___prazos_de_validade__para_faturamento_', 4, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEG', 'Avaliar os veículos usados oferecidos em troca por veículos novos ou usados da concessionária.', 'avaliar_os_ve_culos_usados_oferecidos_em_troca_por_ve_culos_novos_ou_usados_da_concession_ria_', 5, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEH', 'Ser o responsável pelo recebimento do veículo seminovo avaliado no momento da entrega do veículo adquirido pelo cliente.', 'ser_o_respons_vel_pelo_recebimento_do_ve_culo_seminovo_avaliado_no_momento_da_entrega_do_ve_culo_adquirido_pelo_cliente_', 6, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEL', 'Atender aos objetivos de vendas de veículos, realizando o atendimento, acompanhamento e conversão de Clientes Digitais (leads), garantindo 100% deles respondidos com foco na experiência do Cliente e qualificados com agilidade e clareza, contribuindo para a lucratividade, satisfação e recomendações.', 'atender_aos_objetivos_de_vendas_de_ve_culos__realizando_o_atendimento__acompanhamento_e_convers_o_de_clientes_digitais__leads___garantindo_100__deles_respondidos_com_foco_na_experi_ncia_do_cliente_e_qualificados_com_agilidade_e_clareza__contribuindo_para_a_lucratividade__satisfa__o_e_recomenda__es_', 7, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEM', 'Conhecer e utilizar técnicas de marketing digital, rede sociais e e-commerce. Acompanhar e analisar os resultados dessas ações através das métricas, visando refinar e ajustar as ações de forma ágil.', 'conhecer_e_utilizar_t_cnicas_de_marketing_digital__rede_sociais_e_e_commerce__acompanhar_e_analisar_os_resultados_dessas_a__es_atrav_s_das_m_tricas__visando_refinar_e_ajustar_as_a__es_de_forma__gil_', 8, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEN', 'Oferecer a melhor solução financeira e produtos adicionais aos clientes, contribuindo para a lucratividade e efetivação dos negócios.', 'oferecer_a_melhor_solu__o_financeira_e_produtos_adicionais_aos_clientes__contribuindo_para_a_lucratividade_e_efetiva__o_dos_neg_cios_', 9, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXER', 'Atender aos objetivos de vendas de veículos seminovos, dos produtos e agregados (acessórios, financiamento, seguro e documentação), contribuindo para a lucratividade e garantindo a satisfação total do Cliente.', 'atender_aos_objetivos_de_vendas_de_ve_culos_seminovos__dos_produtos_e_agregados__acess_rios__financiamento__seguro_e_documenta__o___contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_do_cliente_', 10, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXES', 'Contribuir com os objetivos do Nissan Move e para a lucratividade da operação.', 'contribuir_com_os_objetivos_do_nissan_move_e_para_a_lucratividade_da_opera__o_', 11, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXET', 'Realizar atendimentos no showroom, visitas externas e ações de prospecção para captação de novas oportunidades.', 'realizar_atendimentos_no_showroom__visitas_externas_e_a__es_de_prospec__o_para_capta__o_de_novas_oportunidades_', 12, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEX', 'Dominar todos os processos específicos de atendimento e negociação do Nissan Move.', 'dominar_todos_os_processos_espec_ficos_de_atendimento_e_negocia__o_do_nissan_move_', 13, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEY', 'Proporcionar excelente experiência no acompanhamento de todas as etapas, principalmente a Entrega (Check-out), garantindo a total satisfação dos Clientes.', 'proporcionar_excelente_experi_ncia_no_acompanhamento_de_todas_as_etapas__principalmente_a_entrega__check_out___garantindo_a_total_satisfa__o_dos_clientes_', 14, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEZ', 'Atender aos objetivos de vendas de veículos e agregados (acessórios originais, financiamentos, seguros e consórcio), contribuindo para a lucratividade e garantindo a satisfação total dos Clientes. Dominar todos os processos de atendimento (fluxo de loja, telefone e leads), negociação e processo de entrega dos veículos.', 'atender_aos_objetivos_de_vendas_de_ve_culos_e_agregados__acess_rios_originais__financiamentos__seguros_e_cons_rcio___contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_dos_clientes__dominar_todos_os_processos_de_atendimento__fluxo_de_loja__telefone_e_leads___negocia__o_e_processo_de_entrega_dos_ve_culos_', 15, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEd', 'Atender aos objetivos de Vendas PCD e agregados e satisfação do Cliente, contribuindo para o aumento do retorno, indicação e lucratividade. Conhecimento sobre a legislação pertinente, adaptações de veículos, Entrega e Venda Direta. Realizar visitas externas para captação de novas oportunidades.', 'atender_aos_objetivos_de_vendas_pcd_e_agregados_e_satisfa__o_do_cliente__contribuindo_para_o_aumento_do_retorno__indica__o_e_lucratividade__conhecimento_sobre_a_legisla__o_pertinente__adapta__es_de_ve_culos__entrega_e_venda_direta__realizar_visitas_externas_para_capta__o_de_novas_oportunidades_', 16, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEe', 'Atender aos objetivos de Vendas Direta, agregados, contribuindo para a lucratividade e garantindo a satisfação total dos Clientes.', 'atender_aos_objetivos_de_vendas_direta__agregados__contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_dos_clientes_', 17, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEf', 'Realizar visitas externas para captação de novas oportunidades e dominar todos os processos específicos de atendimento para Venda Direta (Licitações, Frotas, Locadoras, Táxis, PCD e Produtor Rural), negociação e entrega dos veículos.', 'realizar_visitas_externas_para_capta__o_de_novas_oportunidades_e_dominar_todos_os_processos_espec_ficos_de_atendimento_para_venda_direta__licita__es__frotas__locadoras__t_xis__pcd_e_produtor_rural___negocia__o_e_entrega_dos_ve_culos_', 18, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEj', 'Atender aos objetivos de vendas de acessórios originais nas áreas de vendas de novos, usados e assistência técnica. Contribuindo para a lucratividade, garantindo a satisfação total dos Clientes e acompanhando a disponibilidade e instalação dos produtos.', 'atender_aos_objetivos_de_vendas_de_acess_rios_originais_nas__reas_de_vendas_de_novos__usados_e_assist_ncia_t_cnica__contribuindo_para_a_lucratividade__garantindo_a_satisfa__o_total_dos_clientes_e_acompanhando_a_disponibilidade_e_instala__o_dos_produtos_', 19, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEk', 'Realizar a entrega Técnica dos veículos, garantido que os clientes recebam todas as explicações relacionadas ao Veículo, acessórios instalados, Manual de Garantia e documentos.', 'realizar_a_entrega_t_cnica_dos_ve_culos__garantido_que_os_clientes_recebam_todas_as_explica__es_relacionadas_ao_ve_culo__acess_rios_instalados__manual_de_garantia_e_documentos_', 20, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEl', 'Garantir os objetivos de venda de veículos seminovos e usados, com rentabilidade e venda de agregados (acessórios, financiamento, seguro e documentação), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes, suportando e facilitando à venda dos veículos novos.', 'garantir_os_objetivos_de_venda_de_ve_culos_seminovos_e_usados__com_rentabilidade_e_venda_de_agregados__acess_rios__financiamento__seguro_e_documenta__o___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes__suportando_e_facilitando___venda_dos_ve_culos_novos_', 21, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEp', 'Promover a gestão da equipe de Vendas garantindo os objetivos de venda de veículos novos, seminovos e usados em relação ao volume, rentabilidade, e venda de agregados (acessórios, financiamento, seguro e emplacamento), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes.', 'promover_a_gest_o_da_equipe_de_vendas_garantindo_os_objetivos_de_venda_de_ve_culos_novos__seminovos_e_usados_em_rela__o_ao_volume__rentabilidade__e_venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_', 22, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEq', 'Promover a gestão da equipe de Vendas Diretas buscando atingir os objetivos de volume da área, venda de agregados (acessórios, financiamento, seguro e emplacamento) e rentabilidade,  garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes de Vendas Diretas.', 'promover_a_gest_o_da_equipe_de_vendas_diretas_buscando_atingir_os_objetivos_de_volume_da__rea__venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento__e_rentabilidade___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_de_vendas_diretas_', 23, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEr', 'Acompanhar todo processo de recebimento, tratamento e conversão de Clientes Digitais (leads), garantindo que 100% deles sejam avaliados e devidamente distribuídos à força de vendas.', 'acompanhar_todo_processo_de_recebimento__tratamento_e_convers_o_de_clientes_digitais__leads___garantindo_que_100__deles_sejam_avaliados_e_devidamente_distribu_dos___for_a_de_vendas_', 24, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEv', 'Realizar, checar e acompanhar todo o processo de recebimento, preparação e deslocamento dos veículos até o momento da entrega, garantindo com que estejam em perfeitas condições.', 'realizar__checar_e_acompanhar_todo_o_processo_de_recebimento__prepara__o_e_deslocamento_dos_ve_culos_at__o_momento_da_entrega__garantindo_com_que_estejam_em_perfeitas_condi__es_', 25, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEw', 'Coordenar a agenda de entregas e acompanhar a preparação dos veículos de acordo com a data acordada com o cliente.', 'coordenar_a_agenda_de_entregas_e_acompanhar_a_prepara__o_dos_ve_culos_de_acordo_com_a_data_acordada_com_o_cliente_', 26, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXEx', 'Suportar a gestão da equipe de Vendas garantindo os objetivos de venda de veículos novos, seminovos e usados em relação ao volume, rentabilidade, e venda de agregados (acessórios, financiamento, seguro e emplacamento), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes.', 'suportar_a_gest_o_da_equipe_de_vendas_garantindo_os_objetivos_de_venda_de_ve_culos_novos__seminovos_e_usados_em_rela__o_ao_volume__rentabilidade__e_venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_', 27, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXFB', 'Realizar o recebimento de veículos 0Km, armazenamento e a organização do Pátio, garantido os procedimentos conforme recomendações da Nissan.', 'realizar_o_recebimento_de_ve_culos_0km__armazenamento_e_a_organiza__o_do_p_tio__garantido_os_procedimentos_conforme_recomenda__es_da_nissan_', 28, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXFC', 'Atender 100% das chamadas recebidas com excelência (rapidez e qualidade),  direcionando para as áreas e/ou pessoas solicitadas, organizando e controlando o fluxo de ligações.', 'atender_100__das_chamadas_recebidas_com_excel_ncia__rapidez_e_qualidade____direcionando_para_as__reas_e_ou_pessoas_solicitadas__organizando_e_controlando_o_fluxo_de_liga__es_', 29, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXIa', 'Atender as solicitações de peças realizadas pela oficina e balcão público além de contribuir com formação dos pedidos junto à montadora.', 'atender_as_solicita__es_de_pe_as_realizadas_pela_oficina_e_balc_o_p_blico_al_m_de_contribuir_com_forma__o_dos_pedidos_junto___montadora_', 30, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_para_que', 'bTXIb', 'Receber, armazenar e disponibilizar as peças com agilidade. Manter o estoque organizado e sistema atualizado com a quantidade correta de itens físicos.', 'receber__armazenar_e_disponibilizar_as_pe_as_com_agilidade__manter_o_estoque_organizado_e_sistema_atualizado_com_a_quantidade_correta_de_itens_f_sicos_', 31, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHR', 'Excelência no Atendimento ao Cliente', 'excel_ncia_no_atendimento_ao_cliente', 1, '{"id0": "CH1"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHS', 'Gestão de Conflitos', 'gest_o_de_conflitos', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHT', 'Construção de relatórios gerenciais', 'constru__o_de_relat_rios_gerenciais', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHX', 'Gestão de Processos', 'gest_o_de_processos', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHY', 'Gestão do Tempo', 'gest_o_do_tempo', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHZ', 'Saber dirigir (possuir CNH válida)', 'saber_dirigir__possuir_cnh_v_lida_', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHd', 'Executar com velocidade e qualidade', 'executar_com_velocidade_e_qualidade', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHe', 'Vendas', 'vendas', 8, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHf', 'Excelência no Atendimento ao Cliente', 'excel_ncia_no_atendimento_ao_cliente0', 9, '{}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHj', 'Persuasão', 'persuas_o', 10, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHk', 'Gestão Financeira e de Indicadores', 'gest_o_financeira_e_de_indicadores', 11, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHl', 'Vendas para Clientes PCD', 'vendas_para_clientes_pcd', 12, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHp', 'Análise de Cenários', 'an_lise_de_cen_rios', 13, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHq', 'Delegar', 'delegar', 14, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXHr', 'Gestão de Recursos', 'gest_o_de_recursos', 15, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXIh', 'Construção de Campanhas', 'constru__o_de_campanhas', 16, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXJi', 'Gestão de Pessoas', 'gest_o_de_pessoas', 17, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXJj', 'Negociação', 'negocia__o', 18, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXMK', 'Criar e Inovar', 'criar_e_inovar', 19, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXML', 'Implantação e manutenção de Redes de computadores', 'implanta__o_e_manuten__o_de_redes_de_computadores', 20, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXMP', 'Implantação e manutenção de infraestrutura de TI', 'implanta__o_e_manuten__o_de_infraestrutura_de_ti', 21, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXMQ', 'Implantação de Sistemas', 'implanta__o_de_sistemas', 22, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_habilidade', 'bTXMR', 'Integração de Sistemas', 'integra__o_de_sistemas', 23, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_treinamento', 'bTXCx', 'Consultar trilha de desenvolvimento no portal da Academia SERNISSAN.', 'consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_', 1, '{"id0": "CT1", "tipo": "e_learning"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_treinamento', 'bTXCy', 'Consultar trilha de desenvolvimento no portal da Academia SERNISSAN.', 'consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_0', 2, '{"tipo": "presencial"}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_treinamento', 'bTXHv', 'Consultar trilha de desenvolvimento no portal da Academia SERNISSAN.', 'consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_1', 3, '{"tipo": "presencial"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_treinamento_tipo', 'bTWoc', 'E-Learning', 'e_learning', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('competencia_treinamento_tipo', 'bTWod', 'Presencial', 'presencial', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAD', 'dados', 'dados', 1, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719346961257x581158097397277400/Dados.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAH', 'troféu', 'trof_u', 2, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719346988675x747924339874472300/Placar.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAI', 'comentário', 'coment_rio', 3, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347027164x177137820345139500/Comment.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAJ', 'olho fechado', 'olho_fechado', 4, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347071052x376350558859630500/View%20Not.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAN', 'olho aberto', 'olho_aberto', 5, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347091056x875260540102825700/View.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAO', 'grupo', 'grupo', 6, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347117353x508627711273238900/Group.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAP', 'calendário', 'calend_rio', 7, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347143994x569714672135760640/Captions.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAT', 'editar', 'editar', 8, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347174036x719188520815560000/edit.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAU', 'lixeira', 'lixeira', 9, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347196821x820576195182167900/trash.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAV', 'camera', 'camera', 10, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347260061x948785346433962400/camera.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAZ', 'seta esq', '_', 12, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347293930x619340360814001500/Seta%20Esq.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAa', 'seta dir', 'seta_dir', 13, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347329481x249639812086393180/Seta%20Dir.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAb', 'mais', 'mais', 15, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347373313x911151682870333400/Plus.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAf', 'x', 'x', 16, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347414044x931446785328205200/X.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAg', 'admin', 'admin', 17, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347436788x533908429438484800/admin.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAh', 'usuário', 'usu_rio', 18, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347466002x336525260699362940/user.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAl', 'envelope', 'envelope', 19, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347485242x696393676734479900/envelope%201.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAm', 'lupa', 'lupa', 20, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347502949x405919008430887700/search.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHAn', 'resultado', 'resultado', 21, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347533807x729355414654817400/results.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHIf', 'seta baixo', 'seta_baixo', 14, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719543444511x432359007789133700/Vector%201.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTHYT', 'seta cima', 'seta_cima', 11, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719506625778x459315814469473540/Vector%201.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTJRj', 'fechar', 'fechar', 22, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719886681300x791419301644328700/Frame.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTJcz', 'check', 'check', 23, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719896925943x808916248639669900/Frame.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTJoP', 'drop seta baixo', 'drop_seta_baixo', 24, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1720645130016x571445749791472600/chevron-down-svgrepo-com%20%281%29.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTJoT', 'drop seta up', 'drop_seta_up', 25, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1720645166678x251306770362024640/chevron-up-svgrepo-com%20%281%29.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTUkp', 'livro', 'livro', 26, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1746402416305x585602722730239100/book-open-svgrepo-com%20%282%29.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTXpz', 'relatorios', 'relatorios', 27, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1762288488593x767029633601585800/bar-chart%20%281%29%20%281%29-converted.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('icones', 'bTXqD', 'competencias', 'competencias', 28, '{"svg": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1762288495460x824831203798772600/profile%20%282%29%20%281%29-converted.svg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('foooter_menu', 'bTVTb', 'Política de Privacidade', 'pol_tica_de_privacidade', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('faq_categorias', 'bTTAU', 'Acesso', 'acesso', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('faq_categorias', 'bTTAV', 'Ajuda (Suporte)', 'ajuda__suporte_', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('faq_categorias', 'bTTAZ', 'Equipe', 'equipe', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('faq_categorias', 'bTTAa', 'Placar de Performance', 'placar_de_performance', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('destacar_opcoes', 'bTQdZ', 'Zerou', 'zerou', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('destacar_opcoes', 'bTQdd', 'Não atingiu', 'n_o_atingiu', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('destacar_opcoes', 'bTQde', 'Atingiu', 'atingiu', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('estrutura_concessionaria', 'bTOij', '1S', '1s', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('estrutura_concessionaria', 'bTOik', '2S', '2s', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('estrutura_concessionaria', 'bTOil', '3S', '3s', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUK', 'Janeiro', 'janeiro', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUL', 'Fevereiro', 'fevereiro', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUP', 'Março', 'mar_o', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUQ', 'Abril', 'abril', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUR', 'Maio', 'maio', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUV', 'Junho', 'junho', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUW', 'Julho', 'julho', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUX', 'Agosto', 'agosto', 8, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUb', 'Setembro', 'setembro', 9, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUc', 'Outubro', 'outubro', 10, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUd', 'Novembro', 'novembro', 11, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('meses', 'bTMUh', 'Dezembro', 'dezembro', 12, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVpt', 'Usuário', 'user', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVpu', 'Placar', 'placar', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqR', 'Concessionária', 'concession_ria', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqS', 'Divisão', 'divis_o', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqT', 'País', 'pa_s', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqX', 'Grupo', 'grupo', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqY', 'Indicador', 'indicador', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVqx', 'Feedback', 'feedback', 8, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_type', 'bTVrD', 'Solicitação', 'solicita__o', 9, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('medalhas', 'bTRJE', 'Sem Classificacao', 'sem_classificacao', 1, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856978220x970370333508810800/imagem%20%281%29.png"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('medalhas', 'bTRJF', 'Bronze', 'bronze', 2, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856982995x661822829249319800/imagem%20%281%29.jpeg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('medalhas', 'bTRJJ', 'Prata', 'prata', 3, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856990318x447531328461124200/imagem.jpeg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('medalhas', 'bTRJK', 'Ouro', 'ouro', 4, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856995048x741650248734915100/imagem.png"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('medalhas', 'bTRJL', 'Novo', 'novo', 5, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736857000032x495143330536301600/imagem%20%282%29.jpeg"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVqZ', 'Deletou', 'delete', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVqd', 'Criou', 'create', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVqe', 'Aceitou', 'aceitou', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVqf', 'Rejeitou', 'rejeitou', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVtd', 'Alterou', 'alterou', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVtj', 'Adicionou', 'adicionou', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTVtk', 'Removeu', 'removeu', 7, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('log_action', 'bTWGf', 'Erro', 'erro', 8, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('importancias', 'bTLth', 'Baixo', 'baixa', 3, '{"pontos": 10}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('importancias', 'bTLti', 'Médio', 'media', 2, '{"pontos": 20}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('importancias', 'bTLtj', 'Alto', 'alta', 1, '{"pontos": 30}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTOiS', '07 - Colaborador', 'usu_rio', 9, '{"nivel": 7}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTOiT', '05 - Dealer Adm', 'marketing_admin', 7, '{"nivel": 5}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTOiX', '04 - Grupo Adm', 'administrador_de_dom_nio', 6, '{"nivel": 4}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTOiZ', '02 - Nissan', 'gerente_regional', 4, '{"nivel": 2}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTOid', '01 - Individuando', 'gerente_do_dom_nio', 3, '{"nivel": 1}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTPRt', '03 - Nissan Setor', 'setor_adm', 5, '{"nivel": 3}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('perfil', 'bTPpu', '06 - Area Adm', 'area_adm', 8, '{"nivel": 6}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436674308x836139676720640800', '01', '01_', 1, '{"m_s": "Janeiro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436674924x758951685950750600', '02', '02_', 2, '{"m_s": "Fevereiro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436676197x596566327589985500', '03', '03_', 3, '{"m_s": "Março"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436677237x584279117511126000', '04', '04_', 4, '{"m_s": "Abril"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436677671x924141793476140900', '05', '15_', 5, '{"m_s": "Maio"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436683833x563365462224866200', '06', '06_', 6, '{"m_s": "Junho"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436684725x139059328209793500', '07', '07_', 7, '{"m_s": "Julho"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436686328x904010541797519400', '08', '08_', 8, '{"m_s": "Agosto"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436687283x756670709889365200', '09', '09_', 9, '{"m_s": "Setembro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436687997x604063988146092800', '10', '10_', 10, '{"m_s": "Outubro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436688700x901578897447342300', '11', '11_', 11, '{"m_s": "Novembro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ndp_data', '1769436689448x772339489602258000', '12', '12_', 12, '{"m_s": "Dezembro"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ordena__o', 'bTQaY', 'Nome', 'alfab_tica', 1, '{"campo": "nome", "crescente": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ordena__o', 'bTQad', 'Pontos', 'pontos', 2, '{"campo": "pontos_ranking", "crescente": true}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('opcoes_api', '1766989748309x148396749902407040', '3M', '3m', 1, '{"tipo": "acumulado"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('opcoes_api', '1766989749400x418199603421146200', '1M', '1m', 2, '{"tipo": "acumulado"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('opcoes_api', '1766989751508x929260175438108200', 'Colaborador', 'colaborador', 3, '{"tipo": "origem"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('opcoes_api', '1766989756112x872928058316297500', 'Concessionária', 'bir', 4, '{"tipo": "origem"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ordenar_equipe', 'bTRHZ', 'Nome', 'nome', 1, '{"campo": "nome", "crescente": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ordenar_equipe', 'bTRHd', 'Área', 'area', 2, '{"campo": "area", "crescente": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('ordenar_equipe', 'bTRHe', 'Função', 'fun__o', 3, '{"campo": "funcao", "crescente": false}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status', '1762659082440x297677605605256800', 'A fazer', 'a_fazer', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status', '1762659086972x385529209728181500', 'Em andamento', 'em_andamento', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status', '1762659088253x548740363979742900', 'Feito', 'feito', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('videos', '1778096343952x295103212340576100', 'Integrações VOC', 'titulo', 1, '{"link": "https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092553359x452338741727707840/Integra%C3%A7%C3%B5es_VOC.mp4?_gl=1*1lm1obu*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNTg5JGo2MCRsMCRoMA.."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('videos', '1778096347017x835959978701977600', 'Integrações Dados de Vendas Nissan', 'link', 2, '{"link": "https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092569574x242797240994396380/Integra%C3%A7%C3%B5es%20Dados%20de%20Vendas%20Nissan.mp4?_gl=1*15q5kv5*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNjIzJGoyNiRsMCRoMA.."}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('unidade', 'bTLwz', 'Moeda', 'dinheiro', 1, '{"simbolo": "R$ "}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('unidade', 'bTLxA', 'Porcento', 'porcentagem', 2, '{"simbolo": "%"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('unidade', 'bTLxF', 'Número', 'numero0', 4, '{"simbolo": "#"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('unidade', 'bTMiT', 'S/N', 'v_ou_f', 5, '{"simbolo": "✓"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', 'bTGyP', 'nome', 'nome', 1, '{"text": "SERNISSAN"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', 'bTGyQ', 'email', 'email', 2, '{"text": "placar.sernissan.dev@gmail.com"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', 'bTGyR', 'logo fundo branco', 'logo', 3, '{"text": "iVBORw0KGgoAAAANSUhEUgAAAqUAAABwCAYAAAAntAmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NiwgMjAyNC8wMy8xMi0wNzo0ODoyMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNi0xOVQyMjoyNzozMS0wMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMTlUMjI6Mjk6MjItMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDYtMTlUMjI6Mjk6MjItMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmJhZjQzYjIyLTk4ODMtMWY0Ny1hZjkwLTc0NjkyNzNkNTUzYiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpiYWY0M2IyMi05ODgzLTFmNDctYWY5MC03NDY5MjczZDU1M2IiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYWY0M2IyMi05ODgzLTFmNDctYWY5MC03NDY5MjczZDU1M2IiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJhZjQzYjIyLTk4ODMtMWY0Ny1hZjkwLTc0NjkyNzNkNTUzYiIgc3RFdnQ6d2hlbj0iMjAyNC0wNi0xOVQyMjoyNzozMS0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsOS5SYAABT5SURBVHic7d3PcdtI3sbxx2/tfbERDCaCAap4NxXB0BGYisDSoc+yzjiIjkByBJYjMOfOKmIiMDYDbAR+D90c0TJFNEA0GhC/nyqW/xAkWqAIPGh0//Dmx48fAgAAAGL6v9gNAAAAAAilAAAAiI5QCgAAgOgIpQAAAIiOUAoAAIDoCKUAAACIjlAKAACA6AilAAAAiI5QCgAAgOgIpQAAAIiOUAoAAIDoCKUAAACIjlAKAACA6AilAAAAiI5QCgAAgOgIpQAAAIiOUAoAAIDoCKUAAACIjlAKAACA6AilAAAAiI5QCgAAgOgIpQAAAIiOUAoAAIDoCKUAAACIjlAKAACA6AilAAAAiI5QCgAAgOgIpQAAAIiOUAoAAIDoCKUAAACIjlAKAACA6AilAAAAiI5QCgAAgOgIpQAAAIjuX0Ot6M2bN97LbtI8k5RImrv/+rek7MCif+39fS2pnlXbsn3rAAAApsUYk0pK9/6rLoqi7Ov9f/z40ddbeXkz1AqPhdJNmieSlpLeygbR5MTVle7xt6T10EF1k+YfJd0Muc5nLmbVdh1yBZs0D/GLU7mHZE84StnPrw6wLgDAmTLGJLJ5461sp1eqn8Od9HRMKmWPSeuiKOoBmneQC6AL/dzml9R6avdj16B6VqF0k+apbHhbBl59LelhVm2vA69HEqE0gFLSJ0mPMQOqMeZOh3vsD7nu82zVhzFmKen9kUV6bdPQ63uhDansTvo3+X82gyiK4mKodRlj5rIH2D90+kl9n8qiKAbZ77ZhjMkk3Xks+i5mCHmuRbsl6XNRFA/hWnOYMebbkaejtGmfMWYhu99adHyLR0lfh/o5XHheyrY5O+GtKkmfJa3a/E4PHUoHu3z/3MDBLdHIDlhoJZN0L+luk+a3s2q7itiOueey34wxFwMH01TH25dMfH3/cCHspmH9r547MbjR8R4T/OpefseEO0mXYZvSSiL/3/m5MUYRQuD8yHN/HXkuqB6/KwtJC2PMjaTbUNvXhdErSR/Uz740lf35PxhjPqllOB1KlIlOmzS/V9yeRExTIhtMv7khH2OWyAbTLHI7Xh3XY/1NZxxIjTGpMWYrG67SyM2ZFGPMlfw7KZbuBGiq7l0YO1vGmMz13vb9XUllt++27/286839LpuTkj7f273fjaTtGH+3Bw+lmzS/U/jL9Xjd5pIIpmfIGHMv23twttzv01Zc/WnNDfdo2yFyH6ApQzrbYOp+7tAnsJlswFue+kbGmMTt474o/DCcVPb49DHweloZNJRu0nyuMz+goDeZ7Bd37BIRTHvhekiXsdsRk7ukd69xjRudkju133bp2A7cHZxdMHX7iyG/K/cuUHbivtvfNPw+7uaUdvdt6J5SLtmjT/NNml/FboSHRATTk7jLTFeRmzEGN6KHtBN3SXTR8eU3rpd1ys4mmEa8orLsEvD2AmnWd4M8dWp3CIOFUjfTfj7U+nA2pnKik4hgeoqpfM7BuFB0FbkZk+QO+r6z1l8yioP2iV59MHW92suITWgV8EYQSHeWY7giMOTs+0XL5dey5QuqY+WN3JAAyX6giZ7qdyUt1xfDWmFmI1YB3rOrW8/l3upwnbgmySbNl7Nq+9DydTEkijMrf9JcGJs3LFbLlg1by5YhqkO2KZKFxzKl7HaoiqJYh2zMxPjMuq51/LgxN8YsY5c06sF9pFn5wbne8DGcwC7dNj5auWFEgXTnxhizjrnvGDKU/tZi2UvfkLEXWNf7/7/XM/uHxttD+9es2n6M3YiQ2v587m5eN2p3EvNW0kOb9QRSqnnnksgG07woiipwe16LecPztaRzCPp/Njz/0HQQPEfu6sRVw2KVpHeyASE5stydMeZxxCc9D/LrJXx1wXRvvHWTWnZfLT11Cr11f857bNLRYDrCQLpz745PdYyVDzmmNPNc7qGPXq9Zta1m1fZhVm2vZ9U2n1XbwQpZo7tZtS1n1fad2tUGzAI1p60LPe3sjkkkfXE7JTT7o+H5wW9UEMn8yHO1pNEVqR8Jn6Cy+x361LBcotOHAYT0Wf77ztd2Kf/YpKZK9qrdSj93YNzIFqUvZW+U8EZ2P75SP1ccD17KH3EglewVhatYK49Sp7TBf2M3APG5E5O15+JZsIa04M4sfYNpJttjmoRr0auRHXvyNfX2nGDMvXfReNYkXRdF8ShJRVF8VHMYGXXtUvd9OKtg6j6PxYGn1rJhtJQNoFfuMXePtaTLoiiud9+foijW7t+/y27H6sTmLY0x/3RCjDyQ7nyIdWwaYyh927wIzsTn2A1oi2CKSDiZf8Z9r5rGF9b6NcD5BLpRT3o6w2D6/HOuZXs7d88tDrzmuiiKi2PjJ4uieHDh1HduxEsWetrXf1E/gXQte3XkoiiKN66X9z966umtT3jvRJEmiw0ZSkvP5eabNP/ixoTivFWxG9AFwbR39bEnX0Gpnj5wMv8rnxqVn56P7XYh5aHhdaOvXXouwfTARMhSdhjGUi8PebksimLluw7Xg36h04JeJttDenvi+5SyQfSiKIrVfqguiqLe6+n9j2xo7bqu9ye0sbMhQ+nfLZZdSPq+SfP7TZovCaiYGoJpr5r2HcshGjEC9ZHn5pQbe3Lkcu6+0oWNQ3wO5qOvXXomwfTD3t9L2Stsx27Pueoy5MeFv1z+HWyHZLJjkt+pW1hcFUWR+86Od8G7a5uzGMekIUPpusNrlrJnu983ab7dpPndJs0XE7i9JPoxj92AUxBMe1M2PH/jxg6+duuG5+8Jpq1mYb84Mcx9d30mjo36Mr50FsF04f4sZQPpsYloVVEUnScEul513336SzJ1C6aXXdp+YpuzDq85yWAloWbVttqk+aO631Ejc48rSdqkeSnpq6T1sTqmI3ezSfM+a6pdTHhbHOJ7+aAM2YhTFEVRG2Mu5DewPdNTHdM6cNMmoyiKR2NMreZSPR8kPUr63wDN2illD3TlAOv6quP7z0z2Htxrhal/fMxadjtUA6/3kCs11yRdNfU2FUXxYIx5r+Mnx5OoXep+FskvRE+mXJTrqU5lw92tmm89ferY0Lb79JdkegqmPve5vzzl83Btfidp67GufXN161DsbMg6pZI981z09F6Ze9xs0lyyG24XUsue1oFINml+L/9C+utwLTkdwbQXn9Q8aSVVpFImLjQ/SLoN9bm5YOFTBH6u4a8y3EiSMaaUHaf5MPD65dafyW9yk284uZT0vWGZsdculfRqg2nm/ryVX6muxz5WGiCYHjvenRRId4qiqIwxPvvRqAadfT+rtpXC1dKby37A202af9+k+RWX+afHjSHeqt04wdHP0udS/slWOm1yQGiJbCD+Hvjy58k9PYFlsoFmG2m8pU8wufQNkK7nt2mbJ57rje4VXsrPZDslEjWfrK37PHFouU9/SSb7u/PS+/QSSHfcGOq6r/cLYfCSULNqu9JTqYZQUtkP+vsmza8CrwtHbNL8o8fjyybNv23S/IfsGWPWYhWT6RknmHbntt0U7laUKODB3B2gHkK8d88y2aEE2VArdOOK5w2L/VOTtIWVJl67dJ/7HVp5Lj72YPqb7EnDh6YFFWBIS4/B9Itsj+n++/QaSPeEeM/eRKlTOqu217IHmDrwqhJJd26SVBJ4XTjsxuOxUPfLjZO6iw3BtDsXJqYQTCV7MF8Eeu9rjXzIipNooDuXnVCTtFGLE6LRT3racRNmHjwXvxv5BLpU7cZJ9ipQMA0VSKV24bwM1IYXRSue7+7Yk2uY1J5J+kYwfXUup9JLuo9g2p3bUV9oGjVs70N8bq4W4YXGfylfsoFhiDFsnWqS+nKToh4bFht97dJ97p7sDx6LJrL7oCxkezq61Qhq9PYcTC8Cj+WtWixbB2rDi6Le0cndn/5S9i4E1+ppEPILMtlByXgdVu7EZpIIpt3t1Qu81rjDaaKAE6/c+LDfZYNFHWo9PbgKOb7UsyZpdaQmqS+fq3ujr126b+rB1J1kzD0X/y1cSyTZk69rnR5Mg+7rW1QKqeQ/2bg3Q8++P2hWbWvZMS4rSdqk+Vz2F+2t+p1Fmm3SfDnlMAPVkq5fw2fIrPzu3DZYSVrtlYXJNNxlvH/LBqG0YbkPkj6GaoQ7KF9KunSBIdGwM+//kF9FlQ8KMNSmRU3Sk4d9uO+rzyzve9kTzkkoiuLSzcpfNiya6GkfVAZuVhup53LzUA0wxtzLbr+l7CX4O502K/97qO3c4qTps2xZxoe+23DMKELpc67W5nr3755D6o3GM9D3dlZtP8ZuxISsZS/ZV5Hb0RuC6elcMKs0/DjL672D0UsSY8zc9w4sp9g7gAVf1z53kGu6n/dCYcZ/X6k5lDz0tf2LolgZY/7UK6hdum+qwbTl5LLUGJP13e5n+4BET2NDb9Q9ryQKt51Tz+Uq+U0g61XUy/e+ZtV2Pau2H2fV9mJWbd/InoWu1O3SXbpJ86zH5iGsSvazzt3nX0VtTQBcyp8ud/nzsWGxefiWxONOCpruTpP2fVm7RU3SvsOwz/vdTe07OvVL+Z56DVkvnJQmssG0zWSyQxKF2c5zj2V2FQ3KntfdaJQ9pU32elKvXS9q267yuUZ8FyD8JJH0eYoTmtqgx3TSbnX8EvYfA7UjGleY+0HHx9Cm6ncMsE9t0Fq2AkCPq/3nfZMjzyey7ZtKtQhJ0+0xbWFpjPncR895w1WSRHZfvhvG8dJyTRL1v53/bHi+lB2elCl8+c5fTKKn9BjXi9p2Fn8SpjV4ppY9eTj08JVI+nIOlRPoMZ0mj4NFMkAzxmCwW5t61iSVbBCeB3gkHuueTO3SfRPrMS07vObkqhgew3akp2D6SSPpMXW/j8fep5Y9Pl+5fw/2nd6ZfCjdcbP4q9jtwE9Kd8n9l4fa9SCkOpOSXgRT4DjPmqRjMZnapfumEkzd/rJu+bJUHfebxpjEM5DuJBpJMPWYFFjLDjlY7v7d4UYTJ3s1odSpYjcAftzs+TbBNNNEd/BtEUynxeNAUQ/QjDFouizYF5+apGMxqdql+6YSTNVtYl8mO8N97vsC9/N9U/tL8Yn6DaaLjq+/08uTnGrZtu1/tx47ruckg4ZSdzvJq4ATjdJA74sAXDB9aPGSxSbNJ3GP6VN1Caay44AwvKbfyb8HaUVEbhLTomGxqof1zD3WMzaTql26byLB9GvH1yWybT4a9Iwxmesd3ap7madE/QXTL8aYVhPpGnp317IB9OrZ/39u27g+DD3RaeEe2qS5ZDfGX7IH3rLrzOpNmqc6fhbw3LrLetC/WbW9dJ/f3PMlV5s0//s11Clt0mHyU9My6JE7KNzJ437rodsSkwsiTb2XVde7Ke2tJ9F0r5ZMqnbpvraTn0K357miKB6MMTfq3ik1ly3jJf36Xc3UX698Jfs98N2ex1xJWhhjbo+VHnMnQ/c6vI9auzbNDzy/HqKM3SGxZ9/PtbcxNmleywbUStJ/3d/rF16bukeX2qVly+VDeb9J8xC3SCtn1XZK94R/J+m7/L/8d5s0L1/7jHypdTB9tVwP2TxyM/b9JnuCnTQsV/e5cx/hpWDf4vmPPazrSs3Bo1T3nrNTvNfxtk2udum+lsE0hk/yq8bQZN7DexxSyt4+tJZabc9jUtlJWzeyP//j7sTPnSh+OPD+pWy+qnU4jO5Eyw+xQ+lzicIfeB7dHaTGIBVDDjSrtvUmzd/J/yw7kXS/SfOLEX2Wwbhgeim7fZLIzYllrulMbtn3qef3m+I2kE7cDp41SSXpMkaJImNMKVub8pg7Y8zjVMu49RSkgnA3NXivcZ64l9oLpDs9bs9UNpDfud/Dcu//b2U77qSnXtFFw/utYpb5em0TnXz0fZBAD1zt2dsWL8nUz5nxJLidxIXOZ9LMa1ArQp2/EVqdeuleft/121gHUzdL+bFhsUQT32e1GGMawxhrwpY6EEh3AmzPTE+3O53r6a5Sc/d/acPrS7U7Dvfu3ELpyoUfjJC75WrZ4iXLTZovgzRmhAimk3M51V6xHpU68SDnWZO0UvwTgGs1fzcnWbt031iDqds/jimYljoSSHdGtD1rjWCfdU6htFTkMwB4abtTuTun28YSTCfjMkaNv5GpdeJBrkVN0ugHU9cb7HOMmepkrX+MKEj9xI3ZfYjcDMkzkO647RlzHkgt294yYhsknU8oXUs6i/GHU+cmL7U5eUj0CnbybRBMR62W9G6qE1p6tJb0ew8HOZ+apI+xZgo/VxTFSs1XeyZbu3TfiINp7HY9qkUg3XG/OzF6emuNJJBK5xFKb91dhOrYDYGfDpfxs02afwzSmJEimI5OJXsy9fuZ95A+yh7gWh+Un/OsSVprXJdsJb8erw9TrV26bwQB8CDXrhi/F6uiKN51/d13J7OXGm6/XmpEgVQafvb9pZ5KOKUB11PL7hxvu9Y+RXTXalfz7maT5o+By0R9VoR7Ab+kKIrSlYtaeL6k6rkJ6wHX17SuWErZ2oPlQOsb4xCkWq7WdM+X0FM1/7x9r/NkRVGsXbWMtGHRVO2/I5WOb5O273cyN4v8b/lVBlmHbc0TV7+0ku1tTwOvrlZPQ3Zcu0vZdmenvt8RK9nJgXXAdbT25sePH8Os6M2bn/7tCqZn7vFWp5dHKt3j66zaPp7wPidzk2/eR2xC8DqlmzT3CYwntcP1frap4/qX62UFAGB/XPJVoFU8SLoOEe6MMUvZtqc9vu1aNoyufRYeKiPuRAulL3FhNXX/3P/7c5V71OdQRB0AAHTjhkvcyO+mF01quauxPZQ7a+TC6Qed1nP6KOlT2/HXZx9KAQAAQnA9pwtJf8oOJUw8X1rL9jJ+lZ1cV/fctEbuJhJz2bZnari1r55u5d65vYRSAACAAbigl+rlXsi17O2Cy0Ea1NKBure9tvXVhlIAAADgJedQEgoAAAAjRygFAABAdIRSAAAAREcoBQAAQHSEUgAAAERHKAUAAEB0hFIAAABERygFAABAdIRSAAAAREcoBQAAQHSEUgAAAERHKAUAAEB0hFIAAABERygFAABAdIRSAAAAREcoBQAAQHSEUgAAAERHKAUAAEB0hFIAAABERygFAABAdIRSAAAAREcoBQAAQHSEUgAAAERHKAUAAEB0hFIAAABERygFAABAdIRSAAAAREcoBQAAQHSEUgAAAERHKAUAAEB0hFIAAABE9/+U4YUdtKaABAAAAABJRU5ErkJggg==", "image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719345421514x986045590354050200/10e3c5c0b67dda6bac6606a9f281d1df.png"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', '1777624956566x961950507366158200', 'ilustração PDF', 'ilustra__o_pdf', 4, '{"image": "//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1777657499799x531644167384926600/pdf-ilustration.png"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', '1778091213582x841785304842359000', 'Video Integrações VOC', 'video_integra__es_voc', 5, '{"text": "https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092553359x452338741727707840/Integra%C3%A7%C3%B5es_VOC.mp4?_gl=1*1lm1obu*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNTg5JGo2MCRsMCRoMA.."}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('site_options', '1778091248023x383685634982068300', 'Video Integrações Dados de vendas', 'video_integra__es_dados_de_vendas', 6, '{"text": "https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092569574x242797240994396380/Integra%C3%A7%C3%B5es%20Dados%20de%20Vendas%20Nissan.mp4?_gl=1*15q5kv5*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNjIzJGoyNiRsMCRoMA.."}'::jsonb, true) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239309898x614321615391328900', 'Rascunho', 'rascunho', 1, '{"cor_claro": "#eeeeee", "cor_escuro": "#616161"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239318613x398954120019566400', 'Enviado', 'enviado', 2, '{"cor_claro": "#e3f2fd", "cor_escuro": "#1976d2"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239329015x426535725520629100', 'Lembrete 1', 'lembrete_1', 3, '{"cor_claro": "#fff3e0", "cor_escuro": "#f57c00"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239339517x672131354498422800', 'Lembrete 2', 'lembrete_2', 4, '{"cor_claro": "#fff3e0", "cor_escuro": "#e65100"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239349680x592379673579840300', 'Assinado', 'assinado', 5, '{"cor_claro": "#e8f5e9", "cor_escuro": "#388e3c"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('status_de_visita', '1777239357329x426662735772113100', 'Expirado', 'expirado', 6, '{"cor_claro": "#ffebee", "cor_escuro": "#d32f2f"}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('tipo_de_instru__o', '1779741919378x518647753238956600', 'Mapa de Competências', 'mapa_de_compet_ncias', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtp', 'Indicador', 'indicador', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtq', 'País', 'pa_s', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtr', 'Setor', 'setor', 3, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtv', 'Divisão', 'divis_o', 4, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtw', 'Concessionária', 'concession_ria', 5, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('solicitacoes_opcoes', 'bTPtx', 'Grupo', 'grupo', 6, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('toggle_ativo_inativo', 'bTLTF', 'Ativo', 'ativo', 1, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
insert into public.app_options (option_set, key, label, db_value, sort_order, metadata, is_deleted) values ('toggle_ativo_inativo', 'bTLTG', 'Inativo', 'inativo', 2, '{}'::jsonb, false) on conflict (option_set, key) do update set label=excluded.label, db_value=excluded.db_value, sort_order=excluded.sort_order, metadata=excluded.metadata, is_deleted=excluded.is_deleted;
create index if not exists idx_rv_consultor on public."rv" ("consultor");
create index if not exists idx_rv_foco on public."rv" ("foco");
create index if not exists idx_rv_operador_assinante on public."rv" ("operador_assinante");
create index if not exists idx_rv_dealer on public."rv" ("dealer");
create index if not exists idx_rv_status on public."rv" ("status");
create index if not exists idx_rv_modalidade on public."rv" ("modalidade");
create index if not exists idx_loh_type on public."loh" ("type");
create index if not exists idx_loh_action on public."loh" ("action");
create index if not exists idx_loh_concessionaria on public."loh" ("concessionaria");
create index if not exists idx_pais_empresa on public."pais" ("empresa");
create index if not exists idx_pais_dashboard_options on public."pais" ("dashboard_options");
create index if not exists idx_profiles_ativo on public."profiles" ("ativo");
create index if not exists idx_profiles_pais on public."profiles" ("pais");
create index if not exists idx_profiles_responsavel on public."profiles" ("responsavel");
create index if not exists idx_profiles_grupo on public."profiles" ("grupo");
create index if not exists idx_profiles_perfil on public."profiles" ("perfil");
create index if not exists idx_profiles_setor on public."profiles" ("setor");
create index if not exists idx_profiles_divisao on public."profiles" ("divisao");
create index if not exists idx_profiles_empresa on public."profiles" ("empresa");
create index if not exists idx_profiles_ultimo_placar on public."profiles" ("ultimo_placar");
create index if not exists idx_profiles_area on public."profiles" ("area");
create index if not exists idx_profiles_funcao on public."profiles" ("funcao");
create index if not exists idx_profiles_concessionaria on public."profiles" ("concessionaria");
create index if not exists idx_profiles_ultima_funcao_placar on public."profiles" ("ultima_funcao_placar");
create index if not exists idx_grupo_admin_2 on public."grupo" ("admin_2");
create index if not exists idx_grupo_setor on public."grupo" ("setor");
create index if not exists idx_grupo_empresa on public."grupo" ("empresa");
create index if not exists idx_grupo_grupo_ndp on public."grupo" ("grupo_ndp");
create index if not exists idx_placar_empresa on public."placar" ("empresa");
create index if not exists idx_placar_opcao_origem on public."placar" ("opcao_origem");
create index if not exists idx_placar_opcao_acumulado on public."placar" ("opcao_acumulado");
create index if not exists idx_placar_concessionaria on public."placar" ("concessionaria");
create index if not exists idx_divisao_pais on public."divisao" ("pais");
create index if not exists idx_divisao_empresa on public."divisao" ("empresa");
create index if not exists idx_empresa_pais on public."empresa" ("pais");
create index if not exists idx_setores_admin_2 on public."setores" ("admin_2");
create index if not exists idx_setores_divisao on public."setores" ("divisao");
create index if not exists idx_setores_empresa on public."setores" ("empresa");
create index if not exists idx_xr_acao_grupo on public."xr_acao" ("grupo");
create index if not exists idx_xr_acao_empresa on public."xr_acao" ("empresa");
create index if not exists idx_xr_acao_indicador on public."xr_acao" ("indicador");
create index if not exists idx_feedback_colaborador_2 on public."feedback" ("colaborador_2");
create index if not exists idx_feedback_placar on public."feedback" ("placar");
create index if not exists idx_feedback_empresa on public."feedback" ("empresa");
create index if not exists idx_rv_anexo_rv on public."rv_anexo" ("rv");
create index if not exists idx_rv_anexo_uploaded_by on public."rv_anexo" ("uploaded_by");
create index if not exists idx_grupo_ndp_grupo on public."grupo_ndp" ("grupo");
create index if not exists idx_grupo_ndp_setor on public."grupo_ndp" ("setor");
create index if not exists idx_grupo_ndp_empresa on public."grupo_ndp" ("empresa");
create index if not exists idx_xr_placar_empresa on public."xr_placar" ("empresa");
create index if not exists idx_instru_es_tipo on public."instru_es" ("tipo");
create index if not exists idx_indicadores_user on public."indicadores" ("user");
create index if not exists idx_indicadores_ativo on public."indicadores" ("ativo");
create index if not exists idx_indicadores_colaborador_user on public."indicadores" ("colaborador_user");
create index if not exists idx_indicadores_user_edicao on public."indicadores" ("user_edicao");
create index if not exists idx_indicadores_placar on public."indicadores" ("placar");
create index if not exists idx_indicadores_empresa on public."indicadores" ("empresa");
create index if not exists idx_indicadores_unidade on public."indicadores" ("unidade");
create index if not exists idx_indicadores_feedback on public."indicadores" ("feedback");
create index if not exists idx_indicadores_classe on public."indicadores" ("classe");
create index if not exists idx_indicadores_agendamento on public."indicadores" ("agendamento");
create index if not exists idx_indicadores_importancia on public."indicadores" ("importancia");
create index if not exists idx_indicadores_funcao on public."indicadores" ("funcao");
create index if not exists idx_indicadores_area on public."indicadores" ("area");
create index if not exists idx_indicadores_status_adm on public."indicadores" ("status_adm");
create index if not exists idx_indicadores_concessionaria on public."indicadores" ("concessionaria");
create index if not exists idx_agendamentos_user on public."agendamentos" ("user");
create index if not exists idx_agendamentos_gerente on public."agendamentos" ("gerente");
create index if not exists idx_agendamentos_placar on public."agendamentos" ("placar");
create index if not exists idx_agendamentos_empresa on public."agendamentos" ("empresa");
create index if not exists idx_agendamentos_concessionaria on public."agendamentos" ("concessionaria");
create index if not exists idx_faq_pergunta_empresa on public."faq_pergunta" ("empresa");
create index if not exists idx_faq_pergunta_categoria on public."faq_pergunta" ("categoria");
create index if not exists idx_rv_auditoria_user on public."rv_auditoria" ("user");
create index if not exists idx_rv_auditoria_rv on public."rv_auditoria" ("rv");
create index if not exists idx_solicitacoes_user on public."solicitacoes" ("user");
create index if not exists idx_solicitacoes_colaborador_2 on public."solicitacoes" ("colaborador_2");
create index if not exists idx_solicitacoes_tipo on public."solicitacoes" ("tipo");
create index if not exists idx_solicitacoes_concessionaria on public."solicitacoes" ("concessionaria");
create index if not exists idx_xr_simulador_xr_indicador on public."xr_simulador" ("xr_indicador");
create index if not exists idx_xr_simulador_concessionaria on public."xr_simulador" ("concessionaria");
create index if not exists idx_rv_assinatura_rv on public."rv_assinatura" ("rv");
create index if not exists idx_rv_assinatura_assinante_user on public."rv_assinatura" ("assinante_user");
create index if not exists idx_rv_assinatura_dealer on public."rv_assinatura" ("dealer");
create index if not exists idx_slide_options_empresa on public."slide_options" ("empresa");
create index if not exists idx_concessionaria_admin_2 on public."concessionaria" ("admin_2");
create index if not exists idx_concessionaria_pais on public."concessionaria" ("pais");
create index if not exists idx_concessionaria_grupo on public."concessionaria" ("grupo");
create index if not exists idx_concessionaria_setor on public."concessionaria" ("setor");
create index if not exists idx_concessionaria_divisao on public."concessionaria" ("divisao");
create index if not exists idx_concessionaria_empresa on public."concessionaria" ("empresa");
create index if not exists idx_concessionaria_grupo_ndp on public."concessionaria" ("grupo_ndp");
create index if not exists idx_concessionaria_categoria on public."concessionaria" ("categoria");
create index if not exists idx_concessionaria_estrutura on public."concessionaria" ("estrutura");
create index if not exists idx_rr_indicadores_empresa on public."rr_indicadores" ("empresa");
create index if not exists idx_rr_indicadores_preliminar on public."rr_indicadores" ("preliminar");
create index if not exists idx_rr_indicadores_area on public."rr_indicadores" ("area");
create index if not exists idx_rr_indicadores_status on public."rr_indicadores" ("status");
create index if not exists idx_placar_exclus_o_user_criacao on public."placar_exclus_o" ("user_criacao");
create index if not exists idx_placar_exclus_o_user_exclusao on public."placar_exclus_o" ("user_exclusao");
create index if not exists idx_placar_exclus_o_empresa on public."placar_exclus_o" ("empresa");
create index if not exists idx_placar_exclus_o_concessionaria on public."placar_exclus_o" ("concessionaria");
create index if not exists idx_rv_participante_rv on public."rv_participante" ("rv");
create index if not exists idx_competencia_mapa_funcao_mapa on public."competencia_mapa" ("funcao_mapa");
create index if not exists idx_rv_proximo_passo_rv on public."rv_proximo_passo" ("rv");
create index if not exists idx_competencia_mapa1_funcao_mapa on public."competencia_mapa1" ("funcao_mapa");
create index if not exists idx_competencia_mapa2_funcao_mapa on public."competencia_mapa2" ("funcao_mapa");
create index if not exists idx_dashboard_options_pais on public."dashboard_options" ("pais");
create index if not exists idx_dashboard_options_empresa on public."dashboard_options" ("empresa");
create index if not exists idx_xr_tipo_indicador_empresa on public."xr_tipo_indicador" ("empresa");
create index if not exists idx_xr_tipo_indicador_ativo on public."xr_tipo_indicador" ("ativo");
create index if not exists idx_funcao_colaborador_empresa on public."funcao_colaborador" ("empresa");
create index if not exists idx_funcao_colaborador_area on public."funcao_colaborador" ("area");
create index if not exists idx_xr_resultado_final_empresa on public."xr_resultado_final" ("empresa");
create index if not exists idx_xr_resultado_final_preliminar on public."xr_resultado_final" ("preliminar");
create index if not exists idx_xr_resultado_final_concessionaria on public."xr_resultado_final" ("concessionaria");
create index if not exists idx_calibracao_resultado_acao_status on public."calibracao_resultado" ("acao_status");
create index if not exists idx_calibracao_resultado_competencia on public."calibracao_resultado" ("competencia");
create index if not exists idx_calibracao_resultado_habito on public."calibracao_resultado" ("habito");
create index if not exists idx_calibracao_resultado_opcao_lider on public."calibracao_resultado" ("opcao_lider");
create index if not exists idx_calibracao_resultado_tipo on public."calibracao_resultado" ("tipo");
create index if not exists idx_calibracao_resultado_opcao_follow_up on public."calibracao_resultado" ("opcao_follow_up");
create index if not exists idx_calibracao_resultado_calibracao on public."calibracao_resultado" ("calibracao");
create index if not exists idx_calibracao_resultado_opcao_colaborador on public."calibracao_resultado" ("opcao_colaborador");
create index if not exists idx_setor_concessionaria_empresa on public."setor_concessionaria" ("empresa");
create index if not exists idx_competencia_calibracao_colaborador on public."competencia_calibracao" ("colaborador");
create index if not exists idx_competencia_calibracao_concessionaria on public."competencia_calibracao" ("concessionaria");
create index if not exists idx_xr_indicador_resultado_empresa on public."xr_indicador_resultado" ("empresa");
create index if not exists idx_xr_indicador_resultado_preliminar on public."xr_indicador_resultado" ("preliminar");
create index if not exists idx_xr_indicador_resultado_indicador on public."xr_indicador_resultado" ("indicador");
create index if not exists idx_xr_indicador_resultado_concessionaria on public."xr_indicador_resultado" ("concessionaria");
create index if not exists idx_rv_gerentes_copia_user_id on public."rv_gerentes_copia" ("user_id");
create index if not exists idx_pais_divisoes_divisao_id on public."pais_divisoes" ("divisao_id");
create index if not exists idx_profiles_grupos_disponiveis_grupo_id on public."profiles_grupos_disponiveis" ("grupo_id");
create index if not exists idx_profiles_concessionarias_equipe_concessionaria_id on public."profiles_concessionarias_equipe" ("concessionaria_id");
create index if not exists idx_profiles_areas_disponiveis_setor_concessionaria_id on public."profiles_areas_disponiveis" ("setor_concessionaria_id");
create index if not exists idx_grupo_concessionarias_concessionaria_id on public."grupo_concessionarias" ("concessionaria_id");
create index if not exists idx_placar_colaboradores_start_user_id on public."placar_colaboradores_start" ("user_id");
create index if not exists idx_placar_indicadores_indicadores_id on public."placar_indicadores" ("indicadores_id");
create index if not exists idx_placar_indicadores_start_indicadores_id on public."placar_indicadores_start" ("indicadores_id");
create index if not exists idx_divisao_setores_setores_id on public."divisao_setores" ("setores_id");
create index if not exists idx_empresa_pais_pais_id on public."empresa_pais" ("pais_id");
create index if not exists idx_setores_grupos_grupo_id on public."setores_grupos" ("grupo_id");
create index if not exists idx_setores_grupos_ndp_grupo_ndp_id on public."setores_grupos_ndp" ("grupo_ndp_id");
create index if not exists idx_xr_placar_indicadores_rr_indicadores_id on public."xr_placar_indicadores" ("rr_indicadores_id");
create index if not exists idx_xr_placar_resultados_xr_indicador_resultado_id on public."xr_placar_resultados" ("xr_indicador_resultado_id");
create index if not exists idx_xr_placar_resultados_finais_xr_resultado_final_id on public."xr_placar_resultados_finais" ("xr_resultado_final_id");
create index if not exists idx_indicadores_areas_setor_concessionaria_id on public."indicadores_areas" ("setor_concessionaria_id");
create index if not exists idx_indicadores_funcoes_funcao_colaborador_id on public."indicadores_funcoes" ("funcao_colaborador_id");
create index if not exists idx_agendamentos_users_user_id on public."agendamentos_users" ("user_id");
create index if not exists idx_agendamentos_convidados_user_id on public."agendamentos_convidados" ("user_id");
create index if not exists idx_competencias_funcoes_funcao_colaborador_id on public."competencias_funcoes" ("funcao_colaborador_id");
create index if not exists idx_xr_simulador_acoes_xr_acao_id on public."xr_simulador_acoes" ("xr_acao_id");
create index if not exists idx_xr_ano_fiscal_preliminares_xr_placar_id on public."xr_ano_fiscal_preliminares" ("xr_placar_id");
create index if not exists idx_concessionaria_lideres_2_user_id on public."concessionaria_lideres_2" ("user_id");
create index if not exists idx_concessionaria_colaboradores_2_user_id on public."concessionaria_colaboradores_2" ("user_id");
create index if not exists idx_concessionaria_placars_placar_id on public."concessionaria_placars" ("placar_id");
create index if not exists idx_concessionaria_indicadores_indicadores_id on public."concessionaria_indicadores" ("indicadores_id");
create index if not exists idx_concessionaria_xr_simulacoes_xr_simulador_id on public."concessionaria_xr_simulacoes" ("xr_simulador_id");
create index if not exists idx_rr_indicadores_xr_metas_xr_meta_id on public."rr_indicadores_xr_metas" ("xr_meta_id");
create index if not exists idx_competencia_mapa_habitos_competencia_habito_id on public."competencia_mapa_habitos" ("competencia_habito_id");
create index if not exists idx_dashboard_options_faqs_faq_pergunta_id on public."dashboard_options_faqs" ("faq_pergunta_id");
create index if not exists idx_dashboard_options_slides_slide_options_id on public."dashboard_options_slides" ("slide_options_id");
create index if not exists idx_setor_concessionaria_funcoes_funcao_colaborador_id on public."setor_concessionaria_funcoes" ("funcao_colaborador_id");
create index if not exists idx_competencia_calibracao_mapas_competencia_mapa_id on public."competencia_calibracao_mapas" ("competencia_mapa_id");
create index if not exists idx_competencia_calibracao_areas_setor_concessionaria_id on public."competencia_calibracao_areas" ("setor_concessionaria_id");
create index if not exists idx_competencia_calibracao_funcoes_funcao_colaborador_id on public."competencia_calibracao_funcoes" ("funcao_colaborador_id");
create index if not exists idx_competencia_calibracao_resultados_calibracao_resultado_id on public."competencia_calibracao_resultados" ("calibracao_resultado_id");
