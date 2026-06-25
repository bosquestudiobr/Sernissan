# Plano de migração Bubble → Supabase

## Antes de migrar

- Fazer backup completo do Bubble.
- Exportar CSVs por tipo de dado.
- Congelar alterações ou definir janela de corte.
- Criar projeto Supabase de desenvolvimento.
- Aplicar migrations.
- Criar scripts de importação idempotentes.

## Ordem sugerida de importação

1. `app_options`.
2. Empresas.
3. Países.
4. Divisões.
5. Setores.
6. Grupos.
7. Concessionárias.
8. Áreas e funções.
9. Usuários/profiles.
10. Indicadores biblioteca.
11. Placar.
12. Indicadores de placar.
13. Agenda/agendamentos.
14. Reunião de resultados.
15. Competências.
16. RV, participantes, próximos passos, anexos e assinaturas.

## Estratégia de IDs

- Guardar o ID original do Bubble em `bubble_id`.
- Importações relacionadas devem resolver FK por `bubble_id`.
- Nunca usar ID Bubble como PK principal do Postgres.

## Validações pós-importação

- Contagem por tabela comparada com Bubble.
- Amostragem de registros críticos.
- Usuários com perfil e escopo corretos.
- Placar com mesma quantidade de indicadores.
- RVs com participantes/anexos/assinaturas corretos.
- Arquivos migrados para Supabase Storage.

## Arquivos e imagens

- Baixar arquivos do Bubble.
- Subir para buckets privados no Supabase Storage.
- Salvar path no banco.
- Gerar signed URLs apenas na visualização.

## Segurança

O export analisado contém configurações sensíveis do Bubble/plugins. Antes de qualquer deploy real:

- Rotacionar chaves de e-mail/API usadas no Bubble.
- Não copiar secrets para repositório.
- Usar `.env.local` e variáveis de ambiente no provedor de deploy.
- Revisar todos os logs e arquivos exportados antes de subir para GitHub.
