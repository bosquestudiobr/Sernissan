import { Suspense } from 'react'

import { AdminCrudView } from '@/components/admin/AdminCrudView'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import { parseListParams } from '@/server/queries/list-helpers'
import { listDivisoes } from '@/server/queries/admin/lists'
import { createDivisaoAction, deleteDivisaoAction, updateDivisaoAction } from '@/server/actions/admin'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function DivisoesAdminPage({ searchParams }: PageProps) {
  const params = parseListParams(await searchParams)
  const { scopeCtx, filterOptions } = await buildAdminPageContext()
  const result = await listDivisoes(params, scopeCtx)

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminCrudView
        title="Divisoes"
        description="Cadastro de divisoes."
        entityLabel="Divisao"
        result={result}
        filters={
          <AdminFilters
            filters={[
              { key: 'empresa', label: 'Empresa', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) },
              { key: 'pais', label: 'Pais', options: filterOptions.paises.map((o) => ({ label: o.label, value: o.id })) },
            ]}
          />
        }
        fields={[
          { name: 'nome', label: 'Nome', required: true },
          { name: 'id_2', label: 'Codigo' },
          { name: 'empresa', label: 'Empresa', type: 'select', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'pais', label: 'Pais', type: 'select', options: filterOptions.paises.map((o) => ({ label: o.label, value: o.id })) },
        ]}
        columns={[
          { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
          { key: 'id_2', header: 'Codigo', cell: (row) => row.id_2 ?? '—' },
        ]}
        createAction={createDivisaoAction}
        updateAction={updateDivisaoAction}
        deleteAction={deleteDivisaoAction}
        mapRowToFields={(row) => ({ nome: row.nome, id_2: row.id_2, empresa: row.empresa, pais: row.pais })}
      />
    </Suspense>
  )
}
