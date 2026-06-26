import { Suspense } from 'react'

import { AdminUsersView } from '@/components/admin/AdminUsersView'
import { LoadingState } from '@/components/shared/LoadingState'
import { buildAdminPageContext } from '@/features/admin/buildAdminPageContext'
import {
  approveProfileAction,
  toggleProfileActiveAction,
  updateProfileAdminAction,
  updateProfileRelationshipsAction,
} from '@/server/actions/admin/users'
import { getUserAdminFilterOptions } from '@/server/queries/admin/filter-options'
import { getUsuarioVinculos, listUsuarios } from '@/server/queries/admin/usuarios'
import { parseListParams } from '@/server/queries/list-helpers'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function toOptions(items: { id: string; label: string }[]) {
  return items.map((item) => ({ label: item.label, value: item.id }))
}

export default async function UsuariosAdminPage({ searchParams }: PageProps) {
  const params = parseListParams(await searchParams)
  const { scopeCtx } = await buildAdminPageContext()
  const [result, filterData] = await Promise.all([
    listUsuarios(params, scopeCtx),
    getUserAdminFilterOptions(scopeCtx.user.empresaId),
  ])

  const vinculosEntries = await Promise.all(
    result.data.map(async (row) => [row.id, await getUsuarioVinculos(row.id)] as const),
  )
  const vinculosByUser = Object.fromEntries(vinculosEntries)

  const filterOptions = {
    empresas: toOptions(filterData.empresas),
    setores: toOptions(filterData.setores),
    grupos: toOptions(filterData.grupos),
    perfis: filterData.perfis.filter((p) => p.id).map((p) => ({ label: p.label, value: p.id as string })),
    areas: toOptions(filterData.areas),
    funcoes: toOptions(filterData.funcoes),
    concessionarias: toOptions(filterData.concessionarias),
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminUsersView
        result={result}
        filterOptions={filterOptions}
        vinculosByUser={vinculosByUser}
        updateAction={updateProfileAdminAction}
        relationshipsAction={updateProfileRelationshipsAction}
        toggleActiveAction={toggleProfileActiveAction}
        approveAction={approveProfileAction}
      />
    </Suspense>
  )
}

