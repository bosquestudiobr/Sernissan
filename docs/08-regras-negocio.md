# Regras de negócio consolidadas

## Permissões e hierarquia

- O usuário possui um `perfil` com nível numérico.
- Perfis menores representam maior poder administrativo.
- O menu lateral vem do option set `pages` e respeita `max_nivel`.
- Usuários podem ter escopo por empresa, país, divisão, setor, grupo, concessionária, área e função.
- Toda query deve receber o escopo permitido do usuário no servidor.

## Usuários

- Usuário precisa estar `ativo` e `aprovado` para acessar o app.
- Usuário pode ter foto, CPF textual, responsável, perfil, setor, área, função e concessionária.
- `concessionarias_equipe`, `areas_disponiveis` e `grupos_disponiveis` são relacionamentos N:N.

## Placar

- Um placar pertence a uma empresa e concessionária.
- Placar possui data e status `finalizado`.
- Indicadores pertencem a placar e concessionária.
- Pontos e ranking devem ser recalculados por job/RPC idempotente.
- `ranking_atualizado` deve indicar se os agregados estão consistentes.
- Ao criar novo placar, copiar ou gerar indicadores ativos conforme regras da biblioteca.

## Indicadores

- Indicador pode ser administrativo ou customizado.
- Indicador tem meta, valor, peso/importância, unidade, classe e status.
- Indicador pode estar vinculado a colaborador, área e função.
- Se `meta_customizada` for true, exigir justificativa.
- Indicadores inativos não entram em novos placares, salvo histórico.

## Competências

- Mapas vinculam competências a funções, áreas e concessionárias.
- Calibração tem etapas: autocalibração, líder e follow-up.
- Resultados de calibração devem preservar histórico e data.

## Relatório de visita / RV

- RV pertence a concessionária/dealer e tem consultor.
- RV pode ter participantes, próximos passos, anexos e assinatura.
- Token público deve expirar.
- Após assinatura, RV deve ficar bloqueado para edição, salvo perfil autorizado.
- Assinatura deve salvar hash, IP, user agent, token usado e data/hora.

## Solicitações, e-mails e lembretes

- E-mails devem sair por Edge Function ou provider dedicado.
- Toda rotina de envio deve registrar log e evitar duplicidade.
- Lembretes de RV dependem do status e data de expiração.

## Auditoria mínima

Registrar alterações em:

- Usuário/perfil/permissões.
- Indicadores e metas.
- Placar/ranking/finalização.
- RV/assinatura/anexos.
- Jobs de importação e e-mail.
