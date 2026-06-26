import { Suspense } from 'react'

import { AdminCrudView } from '@/components/admin/AdminCrudView'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import { parseListParams } from '@/server/queries/list-helpers'
import { listConcessionarias } from '@/server/queries/admin/lists'
import {
  createConcessionariaAction,
  deleteConcessionariaAction,
  updateConcessionariaAction,
} from '@/server/actions/admin'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ConcessionariasAdminPage({ searchParams }: PageProps) {
  const params = parseListParams(await searchParams)
  const { scopeCtx, filterOptions } = await buildAdminPageContext()
  const result = await listConcessionarias(params, scopeCtx)

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminCrudView
        title="Concessionarias"
        description="Cadastro de concessionarias."
        entityLabel="Concessionaria"
        result={result}
        filters={
          <AdminFilters
            filters={[
              { key: 'empresa', label: 'Empresa', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) },
              { key: 'grupo', label: 'Grupo', options: filterOptions.grupos.map((o) => ({ label: o.label, value: o.id })) },
              { key: 'setor', label: 'Setor', options: filterOptions.setores.map((o) => ({ label: o.label, value: o.id })) },
            ]}
          />
        }
        fields={[
          { name: 'nome', label: 'Nome', required: true },
          { name: 'bir', label: 'BIR' },
          { name: 'uf', label: 'UF' },
          { name: 'municipio', label: 'Municipio' },
          { name: 'codigo_ndp', label: 'Codigo NDP' },
          { name: 'empresa', label: 'Empresa', type: 'select', options: filterOptions.empresas.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'pais', label: 'Pais', type: 'select', options: filterOptions.paises.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'divisao', label: 'Divisao', type: 'select', options: filterOptions.divisoes.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'setor', label: 'Setor', type: 'select', options: filterOptions.setores.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'grupo', label: 'Grupo', type: 'select', options: filterOptions.grupos.map((o) => ({ label: o.label, value: o.id })) },
          { name: 'dominios', label: 'Dominios (separados por virgula)' },
        ]}
        columns={[
          { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
          { key: 'bir', header: 'BIR', cell: (row) => row.bir ?? '—' },
          { key: 'uf', header: 'UF', cell: (row) => row.uf ?? '—' },
          { key: 'municipio', header: 'Municipio', cell: (row) => row.municipio ?? '—' },
        ]}
        createAction={createConcessionariaAction}
        updateAction={updateConcessionariaAction}
        deleteAction={deleteConcessionariaAction}
        mapRowToFields={(row) => ({
          nome: row.nome,
          bir: row.bir,
          uf: row.uf,
          municipio: row.municipio,
          grupo: row.grupo,
          setor: row.setor,
        })}
      />
    </Suspense>
  )
}
