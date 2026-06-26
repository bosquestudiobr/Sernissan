import { Suspense } from 'react'

import { AdminCrudView } from '@/components/admin/AdminCrudView'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import {
  createAreaAction,
  createFuncaoAction,
  deleteAreaAction,
  deleteFuncaoAction,
  updateAreaAction,
  updateFuncaoAction,
} from '@/server/actions/admin/areas-funcoes'
import { getAreaFuncaoFilterOptions } from '@/server/queries/admin/filter-options'
import { listAreas, listFuncoes } from '@/server/queries/admin/areas-funcoes'
import { parseListParams } from '@/server/queries/list-helpers'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AreasFuncoesAdminPage({ searchParams }: PageProps) {
  const rawParams = await searchParams
  const areaParams = parseListParams({ ...rawParams, tab: undefined })
  const funcaoParams = parseListParams({ ...rawParams, page: rawParams.funcaoPage ?? rawParams.page, tab: undefined })
  const { scopeCtx } = await buildAdminPageContext()
  const filterOptions = await getAreaFuncaoFilterOptions(scopeCtx.user.empresaId)

  const [areasResult, funcoesResult] = await Promise.all([
    listAreas(areaParams, scopeCtx),
    listFuncoes(funcaoParams, scopeCtx),
  ])

  const empresaOptions = filterOptions.empresas.map((o) => ({ label: o.label, value: o.id }))
  const areaOptions = filterOptions.areas.map((o) => ({ label: o.label, value: o.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="space-y-8">
        <AdminCrudView
          title="Areas"
          description="Cadastro de areas (setor_concessionaria)."
          entityLabel="Area"
          result={areasResult}
          filters={
            <AdminFilters
              filters={[{ key: 'empresa', label: 'Empresa', options: empresaOptions }]}
            />
          }
          fields={[
            { name: 'nome', label: 'Nome', required: true },
            { name: 'empresa', label: 'Empresa', type: 'select', options: empresaOptions },
          ]}
          columns={[{ key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' }]}
          createAction={createAreaAction}
          updateAction={updateAreaAction}
          deleteAction={deleteAreaAction}
          mapRowToFields={(row) => ({ nome: row.nome, empresa: row.empresa })}
        />

        <AdminCrudView
          title="Funcoes"
          description="Cadastro de funcoes de colaborador."
          entityLabel="Funcao"
          result={funcoesResult}
          filters={
            <AdminFilters
              filters={[
                { key: 'empresa', label: 'Empresa', options: empresaOptions },
                { key: 'area', label: 'Area', options: areaOptions },
              ]}
            />
          }
          fields={[
            { name: 'nome', label: 'Nome', required: true },
            { name: 'empresa', label: 'Empresa', type: 'select', options: empresaOptions },
            { name: 'area', label: 'Area', type: 'select', options: areaOptions },
            { name: 'chave', label: 'Funcao chave', type: 'checkbox' },
            { name: 'lideranca', label: 'Lideranca', type: 'checkbox' },
          ]}
          columns={[
            { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
            { key: 'chave', header: 'Chave', cell: (row) => (row.chave ? 'Sim' : 'Nao') },
            { key: 'lideranca', header: 'Lideranca', cell: (row) => (row.lideranca ? 'Sim' : 'Nao') },
          ]}
          createAction={createFuncaoAction}
          updateAction={updateFuncaoAction}
          deleteAction={deleteFuncaoAction}
          mapRowToFields={(row) => ({
            nome: row.nome,
            empresa: row.empresa,
            area: row.area,
            chave: row.chave ? 'true' : 'false',
            lideranca: row.lideranca ? 'true' : 'false',
          })}
        />
      </div>
    </Suspense>
  )
}
