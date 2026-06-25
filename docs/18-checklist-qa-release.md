# Checklist de QA e release

Use este checklist a cada fase e antes de homologação.

## QA técnico geral

- `pnpm lint` passa.
- `pnpm typecheck` passa.
- `pnpm test` passa.
- `pnpm exec playwright test` passa para fluxos críticos.
- Build local passa.
- Não há secrets commitados.
- Não há `select('*')` em listagens de produção.
- Tabelas grandes têm paginação server-side.
- Filtros principais rodam no banco.
- Erros aparecem para o usuário de forma clara.

## QA visual

- Header igual ao padrão SerNissan.
- Sidebar compacta e ativa em vermelho.
- Cards brancos com sombra leve.
- Botões pretos/vermelhos preservados.
- Tabelas densas e legíveis.
- Inputs inline com fundo cinza claro.
- Footer preto presente.
- Tela de Biblioteca de indicadores comparável ao screenshot.
- Matriz de competências usa verde/amarelo/vermelho corretamente.

## QA autenticação/permissão

Testar perfis:

- Nissan/global.
- Nissan setor.
- Grupo admin.
- Dealer admin.
- Área admin.
- Colaborador.

Para cada perfil:

- login;
- menu permitido;
- contexto organizacional;
- tentativa de acessar rota proibida;
- tentativa de alterar dado fora do escopo.

## QA indicadores

- Criar indicador.
- Editar nome/sigla/API.
- Alterar área/função.
- Alterar peso/unidade/meta.
- Ativar/desativar.
- Excluir ou arquivar.
- Copiar ID.
- Buscar por nome/sigla.
- Filtrar por área/função.
- Checar indicadores.
- Solicitar indicador.
- Aprovar/rejeitar solicitação.

## QA placar

- Criar placar.
- Vincular indicadores.
- Vincular colaboradores.
- Atualizar valores.
- Customizar meta com justificativa.
- Recalcular pontos.
- Conferir ranking.
- Conferir performance com dados grandes.

## QA competências

- Selecionar colaborador.
- Filtrar por área/função.
- Editar status Sim/Parcial/Não.
- Validar cores.
- Conferir última atualização.
- Testar export/PDF se implementado.

## QA visitas/RV

- Criar visita.
- Editar visita.
- Anexar arquivo.
- Criar próximos passos.
- Gerar link público.
- Abrir link sem login.
- Assinar.
- Bloquear edição após assinatura.
- Testar token expirado.

## Critério para homologação

A versão só deve ir para homologação quando:

- Fases críticas 1 a 8 estiverem estáveis.
- QA visual das telas principais for aprovado.
- RLS não tiver policy permissiva de desenvolvimento.
- Fluxos críticos tiverem pelo menos smoke tests.
- Usuários reais conseguirem validar com dados de teste.
