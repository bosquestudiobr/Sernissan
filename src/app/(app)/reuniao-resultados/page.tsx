import { Suspense } from 'react'

import { LoadingState } from '@/components/shared/LoadingState'
import { ReuniaoResultadosView } from '@/features/reuniao-resultados/ReuniaoResultadosView'
import { buildReuniaoResultadosPageContext } from '@/features/reuniao-resultados/buildReuniaoResultadosPageContext'
import {
  createReuniaoResultadoAction,
  deleteReuniaoResultadoAction,
  finalizeReuniaoResultadoAction,
  refreshReuniaoResultadosAction,
  reopenReuniaoResultadoAction,
  updateReuniaoResultadoAction,
} from '@/server/actions/reuniao-resultados'
import { getReuniaoResultadoFilterOptions, listReunioesResultados, parseReuniaoResultadosParams } from '@/server/queries/reuniao-resultados'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ReuniaoResultadosPage({ searchParams }: PageProps) {
  const params = parseReuniaoResultadosParams(await searchParams)
  const { user, scopes, orgContext, canManage, canFinalize, canDelete } = await buildReuniaoResultadosPageContext()
  const ctx = { scopes, orgContext, empresaId: user.empresaId }

  const [result, filterOptions] = await Promise.all([
    listReunioesResultados(params, ctx),
    getReuniaoResultadoFilterOptions(ctx),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <ReuniaoResultadosView
        result={result}
        filterOptions={filterOptions}
        canManage={canManage}
        canFinalize={canFinalize}
        canDelete={canDelete}
        createAction={createReuniaoResultadoAction}
        updateAction={updateReuniaoResultadoAction}
        deleteAction={deleteReuniaoResultadoAction}
        finalizeAction={finalizeReuniaoResultadoAction}
        reopenAction={reopenReuniaoResultadoAction}
        refreshAction={refreshReuniaoResultadosAction}
      />
    </Suspense>
  )
}
