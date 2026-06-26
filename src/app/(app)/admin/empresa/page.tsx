import { Suspense } from 'react'

import { AdminCrudView } from '@/components/admin/AdminCrudView'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import { parseListParams } from '@/server/queries/list-helpers'
import { listEmpresas } from '@/server/queries/admin/lists'
import {
  createEmpresaAction,
  deleteEmpresaAction,
  updateEmpresaAction,
} from '@/server/actions/admin'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function EmpresaAdminPage({ searchParams }: PageProps) {
  const params = parseListParams(await searchParams)
  const { scopeCtx } = await buildAdminPageContext()
  const result = await listEmpresas(params, scopeCtx)

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminCrudView
        title="Empresa"
        description="Cadastro estrutural de empresas."
        entityLabel="Empresa"
        result={result}
        fields={[
          { name: 'nome', label: 'Nome', required: true },
          { name: 'email', label: 'E-mail', type: 'email' },
          { name: 'fone', label: 'Telefone' },
          { name: 'cor_principal', label: 'Cor principal' },
          { name: 'cor_secundaria', label: 'Cor secundaria' },
        ]}
        columns={[
          { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
          { key: 'email', header: 'E-mail', cell: (row) => row.email ?? '—' },
          { key: 'fone', header: 'Telefone', cell: (row) => row.fone ?? '—' },
        ]}
        createAction={createEmpresaAction}
        updateAction={updateEmpresaAction}
        deleteAction={deleteEmpresaAction}
        mapRowToFields={(row) => ({
          nome: row.nome,
          email: row.email,
          fone: row.fone,
          cor_principal: (row as { cor_principal?: string | null }).cor_principal ?? null,
          cor_secundaria: (row as { cor_secundaria?: string | null }).cor_secundaria ?? null,
        })}
      />
    </Suspense>
  )
}


