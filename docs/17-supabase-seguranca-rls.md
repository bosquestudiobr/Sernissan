# Supabase, segurança e RLS

Este documento orienta como o agente deve trabalhar com Supabase.

## Princípios

- RLS é obrigatório em tabelas públicas expostas pela API.
- Permissão deve existir no banco e no servidor, não apenas na UI.
- Service role/secret key nunca pode chegar ao client.
- Use o usuário autenticado e RLS para operações normais.
- Use admin client apenas para jobs administrativos isolados.
- Queries devem ser específicas e paginadas.

## Modelo de autorização

Acesso depende de:

- perfil hierárquico;
- empresa;
- país;
- divisão;
- setor;
- grupo;
- concessionária;
- área;
- função;
- status ativo/aprovado.

Perfil com nível numérico menor tem maior permissão.

## Helpers SQL recomendados

Criar funções estáveis para RLS, por exemplo:

```sql
create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id from public.profiles where auth_user_id = auth.uid()
$$;
```

```sql
create or replace function public.current_profile_level()
returns integer
language sql
stable
as $$
  select perfil_nivel from public.profiles where auth_user_id = auth.uid()
$$;
```

```sql
create or replace function public.can_access_concessionaria(target_concessionaria_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profile_concessionarias pc
    join public.profiles p on p.id = pc.profile_id
    where p.auth_user_id = auth.uid()
      and pc.concessionaria_id = target_concessionaria_id
  )
$$;
```

Ajustar nomes conforme schema final.

## Políticas por tipo de tabela

### Tabelas globais de referência

Exemplos:

- option sets migrados;
- unidades;
- pesos;
- tipos de status.

Leitura pode ser liberada para usuários autenticados. Escrita apenas admin.

### Tabelas organizacionais

Exemplos:

- grupos;
- concessionárias;
- áreas;
- funções.

Leitura conforme escopo. Escrita conforme perfil.

### Dados operacionais

Exemplos:

- indicadores;
- placar;
- competências;
- visitas/RV.

Leitura e escrita devem ser escopadas por concessionária/grupo/área/função e perfil.

### Dados públicos por token

Exemplo:

- RV público.

Não usar acesso aberto à tabela principal. Preferir função/route handler que valida token, expiração e status.

## Índices obrigatórios

Indexar colunas usadas em RLS, filtros e joins:

- `auth_user_id` em profiles;
- `empresa_id`;
- `grupo_id`;
- `concessionaria_id`;
- `area_id`;
- `funcao_id`;
- `perfil_nivel`;
- `ativo`;
- `status`;
- `created_at`;
- `data`.

## Teste de RLS

Para cada módulo, criar testes ou scripts manuais:

- usuário Nissan vê escopo esperado;
- grupo admin vê apenas seu grupo;
- dealer admin vê apenas suas concessionárias;
- área admin vê apenas áreas permitidas;
- colaborador vê apenas dados permitidos;
- usuário inativo não acessa dados.

## MCP e segurança

- Começar com MCP read-only.
- Nunca colar secrets no chat.
- Conferir Project Ref antes de qualquer migration.
- Preferir Supabase CLI para aplicar migrations.
- Evitar alterações manuais no SQL Editor sem registrar migration.

## Antes de produção

Obrigatório:

- revisar todas as policies;
- remover policy permissiva de desenvolvimento;
- testar por perfil;
- validar storage policies;
- validar logs de acesso público;
- rotacionar chaves usadas em desenvolvimento.
