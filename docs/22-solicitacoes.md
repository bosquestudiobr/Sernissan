# Solicitações (Fase 8)

Módulo administrativo de Solicitações de cadastro e de inclusão.

## Interpretação da tabela `solicitacoes`

A tabela é genérica:

- `id`, `nome` (text), `text` (descrição), `user` (FK auth.users), `colaborador_2` (FK auth.users), `atendida` (boolean), `tipo` (text), `concessionaria` (FK).

Como `tipo` é texto livre, a Fase 8 adota convenções explícitas:

- **Solicitações de cadastro**: `tipo = 'cadastro'`.
- **Solicitações de inclusão**: `tipo = 'inclusao'`.
- (`tipo = 'indicador'` continua pertencendo ao módulo de Indicadores — Fase 5.)

## Status (via `atendida`)

- `atendida IS NULL` → **Pendente**
- `atendida = true` → **Aprovada**
- `atendida = false` → **Rejeitada**

Helper puro: `src/lib/solicitacoes/status.ts` (`requestStatus`).

## Tabelas usadas

- `solicitacoes` (principal)
- `profiles` (dados do colaborador: nome, foto, área, função, concessionária; aprovação/ativação)
- `concessionaria`, `setor_concessionaria`, `funcao_colaborador` (rótulos)
- `profiles_concessionarias_equipe` (vínculo na aprovação de inclusão)

## Regras de aprovação/rejeição

- **Cadastro aprovado**: `solicitacoes.atendida = true` e, se houver `user`, `profiles.aprovado = true`, `profiles.ativo = true`.
- **Cadastro rejeitado**: `solicitacoes.atendida = false`.
- **Inclusão aprovada**: `solicitacoes.atendida = true` e vínculo `profiles_concessionarias_equipe (user/colaborador_2 ↔ concessionaria)` via `upsert` com `onConflict` (ignoreDuplicates) — não duplica vínculos.
- **Inclusão rejeitada**: `solicitacoes.atendida = false`.
- Escopo: só aprova/rejeita solicitações dentro do escopo organizacional (concessionária). Admin estrutural (nível ≤ 4) gerencia; nível alto (≤ 3) vê tudo.

## Permissões

- Acesso à tela: nível ≤ 6. Aprovar/rejeitar: admin estrutural (nível ≤ 4).
- Usuário inativo/não aprovado bloqueado (`requireCurrentUser`).
- Fora do escopo da concessionária → bloqueado.

## UX (padrão Bubble)

- Título "Solicitações", duas seções em cards brancos (Cadastro e Inclusão), tabelas densas, filtros compactos (status, concessionária, busca), ações por linha (revisar, aprovar preto, rejeitar vermelho), paginação server-side independente por seção (`pageCad`/`pageInc`), dialog de revisão.

## Limitações conhecidas

- `solicitacoes` não tem `email` nem `area`/`funcao` próprios; esses vêm do `profiles` vinculado (`user`). E-mail não está em `profiles` → exibido como "—".
- Inclusão carrega apenas `concessionaria` no schema; vínculo de grupo/área/função não é representado na tabela (documentado; vínculo aplicado é colaborador↔concessionária).
- Sem dados reais de `cadastro`/`inclusao` ainda (apenas `indicador` da Fase 5); telas funcionam vazias.
- Sem e-mail/notificação real (fora do escopo).
- RLS production pendente.
- Busca (`q`) aplicada em `solicitacoes.nome`.

## Migration

`0008_solicitacoes_helpers.sql`: índices em `solicitacoes(tipo, atendida, concessionaria, user)` (idempotente; alguns já existiam). Sem alteração de tipos.
