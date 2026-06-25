Execute somente a fase aprovada do plano salvo.

Regras:

- Não avance para fases futuras.
- Faça commits pequenos quando possível.
- Siga `AGENTS.md` e `.cursor/rules/*.mdc`.
- Preserve a UX visual documentada.
- Use Server Components por padrão.
- Use Server Actions com Zod para mutations.
- Use Supabase SSR com cookies.
- Não exponha secrets no client.
- Toda listagem precisa de paginação server-side.
- Rode lint/typecheck/test quando possível.

Ao terminar, responda com:

1. Fase executada.
2. Arquivos criados/alterados.
3. Comandos executados.
4. Testes realizados.
5. O que precisa de QA manual.
6. Riscos/pendências.
7. Próxima fase sugerida, sem executá-la.
