# RV / Visitas (Fase 9A)

Módulo de Relatórios de Visita com fluxo administrativo e fluxo público de ciência/assinatura por token.

## Tabelas usadas

- `rv` (visita): `data_visita`, `dealer` (FK concessionaria), `consultor` (FK auth.users), `modalidade` (FK rv_modalidade), `foco` (FK rv_foco), `relato`, `pontos_destaque`, `avaliacao_consultor`, `enviado_em`, `assinado_em`, `token_ciencia`, `data_expiracao_token`, `ip_assinatura`, `user_agent_assinatura`, `hash_assinatura`, `bloqueado_edicao`, `status`.
- `rv_participante`: `nome`, `cargo`, `ordem`, `rv`.
- `rv_proximo_passo`: `acao`, `responsavel`, `prazo`, `ordem`, `concluido_bool`, `rv`.
- `rv_anexo`: `nome`, `tipo`, `arquivo` (path no bucket), `tamanho_mb`, `uploaded_by`, `rv`.
- `rv_assinatura`: `assinante_nome`, `assinante_cargo`, `comentario`, `ip`, `user_agent`, `hash_sha256`, `token_usado`, `data_hora_utc`, `dealer`, `rv`.
- `rv_auditoria`: `acao`, `descricao`, `data`, `user`, `rv`, `snapshot_json`.
- `rv_foco`, `rv_modalidade` (catálogos), `concessionaria`, `profiles`.
- Storage: bucket privado `rv-anexos`.

## Fluxo administrativo

1. `/visitas`: listagem paginada (filtros status/concessionária/período/busca), criar/editar/excluir.
2. `/visitas/[id]`: detalhe com participantes, próximos passos, anexos e geração de link público.
3. Status derivado (`src/lib/rv/status.ts`): `assinada` (assinado_em) > `expirada` (token vencido e não assinada) > `enviada` (enviado_em) > `rascunho`.
4. Edição bloqueada quando `assinado_em` ou `bloqueado_edicao` (estado LOCKED).

## Fluxo público por token

1. Admin gera link: token aleatório (32 bytes base64url). Armazena-se **apenas o hash SHA-256** em `rv.token_ciencia`; o token bruto vai somente na URL `/rv-publico/[token]`.
2. `getPublicRvByToken(raw)` recalcula o hash e busca a `rv` via **admin client server-only** (sem sessão de usuário), retornando **somente campos whitelisted** (sem UUIDs internos).
3. Validações antes de exibir: existência, não expirado, não assinado. Link expirado/inexistente → estado de expirado (sem dados).
4. Assinatura (`signPublicRvAction`): valida token (hash), expiração e duplicidade; grava `rv_assinatura` + atualiza `rv` (assinado_em, ip, user_agent, hash, bloqueado_edicao=true); registra auditoria.

## Regras de assinatura

- Campos: nome (obrigatório), cargo (opcional), comentário (opcional).
- Registra `data_hora_utc`, `ip` (x-forwarded-for), `user_agent` (headers do servidor).
- `hash_sha256` = SHA-256 de `tokenHash|nome|dataHoraUtc` (integridade).
- Assinatura duplicada bloqueada (`rv.assinado_em` já preenchido) e update condicional `.is('assinado_em', null)`.
- Assinatura após expiração bloqueada e auditada (`assinatura_expirada`).

## Regras de segurança

- Token bruto nunca persistido (apenas hash). UUID interno nunca exposto na URL nem no payload público.
- Rota pública liberada no middleware (`PUBLIC_ROUTES = ['/rv-publico']`); demais rotas exigem auth.
- Leitura/assinatura pública usam `createAdminClient` (server-only, `import 'server-only'`); a chave de serviço nunca chega ao client.
- Anexos: bucket privado; upload/remover/download via admin server-only; download por signed URL de 60s; validação de tamanho (≤10MB) e tipo (pdf/png/jpeg/webp).
- Admin: acesso por escopo organizacional (dealer ∈ concessionárias do usuário); inativo/não aprovado bloqueado.

## Auditoria

- `rv_auditoria` registra: `criar`, `editar`, `gerar_link`, `anexo_upload`, `assinatura`, `assinatura_expirada` (best-effort, não quebra a operação principal).

## Justificativa do uso de service role (server-only)

- O fluxo público não possui sessão de usuário; ler/gravar a RV pelo token validado exige bypass de RLS de forma controlada. Isso é feito exclusivamente em `src/server/.../public.ts` e em operações de storage, sempre server-only, retornando apenas dados whitelisted. `src/lib/supabase/admin.ts` permanece `import 'server-only'`.

## Limitações conhecidas

- `token_ciencia` é coluna única de texto; adotado hash SHA-256 (sem coluna dedicada de hash). Não há rotação/uso-único explícito além de expiração + flag assinado.
- Sem e-mail real de envio do link (fora do escopo); o link é copiado manualmente pelo admin.
- Sem exportação PDF (placeholder/futuro).
- RLS production pendente; storage policies de produção pendentes (upload usa admin server-only por ora).
- `rv_assinatura` sem unicidade formal por `rv`; duplicidade mitigada por `assinado_em` + update condicional.

## Migration

`0009_rv_visitas_helpers.sql`: índices em `rv(token_ciencia, dealer, consultor, status, data_visita)` e filhos (`rv_participante/rv_proximo_passo/rv_anexo/rv_assinatura/rv_auditoria` por `rv`). Idempotente; sem alteração de tipos.
