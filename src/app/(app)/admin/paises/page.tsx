import { Suspense } from 'react'

import { AdminCrudView } from '@/components/admin/AdminCrudView'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import { parseListParams } from '@/server/queries/list-helpers'
import { listPaises } from '@/server/queries/admin/lists'
import { createPaisAction, deletePaisAction, updatePaisAction } from '@/server/actions/admin'
import { getPaisDivisoesMap, getRelationshipOptions } from '@/server/queries/admin/relationships'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function PaisesAdminPage({ searchParams }: PageProps) {
  const params = parseListParams(await searchParams)
  const { scopeCtx, filterOptions } = await buildAdminPageContext()
  const result = await listPaises(params, scopeCtx)
  const relationshipOptions = await getRelationshipOptions(scopeCtx.user.empresaId)
  const divisaoMap = await getPaisDivisoesMap(result.data.map((row) => row.id))

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminCrudView
        title="Paises"
        description="Cadastro de paises por empresa."
        entityLabel="Pais"
        result={result}
        filters={
          <AdminFilters
            filters={[{ key: 'empresa', label: 'Empresa', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) }]}
          />
        }
        fields={[
          { name: 'nome', label: 'Nome', required: true },
          { name: 'id_2', label: 'Codigo' },
          { name: 'empresa', label: 'Empresa', type: 'select', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) },
        ]}
        relationshipFields={[
          {
            name: 'divisao_ids',
            label: 'Divisoes vinculadas',
            options: relationshipOptions.divisoes.map((o) => ({ label: o.label, value: o.id })),
            getSelectedIds: (row) => divisaoMap[row.id] ?? [],
          },
        ]}
        columns={[
          { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
          { key: 'id_2', header: 'Codigo', cell: (row) => row.id_2 ?? '—' },
        ]}
        createAction={createPaisAction}
        updateAction={updatePaisAction}
        deleteAction={deletePaisAction}
        mapRowToFields={(row) => ({ nome: row.nome, id_2: row.id_2, empresa: row.empresa })}
      />
    </Suspense>
  )
}
