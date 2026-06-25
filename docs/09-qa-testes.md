# Plano de QA e testes

## Testes automatizados mínimos

### Unitários

- Validações Zod de formulários.
- Cálculo de pontos/ranking.
- Funções de permissão por perfil.
- Conversão de option sets.
- Geração/validação de token RV.

### Integração

- Login e criação de profile.
- CRUDs administrativos.
- Criação de placar com indicadores.
- Edição de meta customizada.
- Recálculo de ranking.
- Criação/envio/assinatura de RV.

### E2E com Playwright

- Login admin > navegar pelo menu.
- Criar empresa > país > divisão > setor > grupo > concessionária.
- Criar usuário e vincular à concessionária.
- Criar indicador e placar.
- Abrir placar e validar ranking.
- Criar RV, adicionar participante, próximo passo e anexo.
- Abrir link público de RV e assinar.

## Checklist manual por módulo

### Auth

- Login com usuário ativo/aprovado.
- Bloqueio de usuário inativo.
- Reset de senha.
- Logout.

### Admin

- Filtros por hierarquia.
- Paginação server-side.
- CRUD com validação.
- Permissões por perfil.

### Placar

- Criar placar sem duplicar indicadores.
- Alterar valor/meta e recalcular pontos.
- Finalizar placar.
- Confirmar que histórico não muda indevidamente.

### Competências

- Criar mapa por função.
- Criar calibração.
- Registrar autocalibração, líder e follow-up.

### Visitas/RV

- Criar rascunho.
- Enviar para assinatura.
- Token expira corretamente.
- Assinatura bloqueia edição.
- Anexos são privados.

## Critérios de performance

- Primeira tela autenticada sem carregar todos os módulos.
- Listas administrativas com paginação.
- Dashboard/placar usando agregados, não cálculos client-side em listas grandes.
- Nenhuma rota protegida consulta dados fora do escopo do usuário.
