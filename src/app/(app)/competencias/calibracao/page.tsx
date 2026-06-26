import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { LoadingState } from '@/components/shared/LoadingState'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { CompetenciasFilters } from '@/features/competencias/CompetenciasFilters'
import { CalibrationCollaboratorsTable } from '@/features/competencias/CalibrationCollaboratorsTable'
import { buildCompetenciasPageContext } from '@/features/competencias/buildCompetenciasPageContext'
import {
  getCompetencyFilterOptions,
  listCalibrationCollaborators,
  parseCompetencyParams,
} from '@/server/queries/competencias'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function CompetenciasCalibracaoPage({ searchParams }: PageProps) {
  const params = parseCompetencyParams(await searchParams)
  const { user, scopes, orgContext } = await buildCompetenciasPageContext()

  const ctx = { scopes, orgContext, empresaId: user.empresaId }
  const [result, filterData] = await Promise.all([
    listCalibrationCollaborators(params, ctx),
    getCompetencyFilterOptions(ctx),
  ])

  const toOptions = (items: { id: string; label: string }[]) => items.map((i) => ({ label: i.label, value: i.id }))

  return (
    <Suspense fallback={<LoadingState />}>
      <AdminPageShell
        title="Calibracao de competencias"
        description="Colaboradores elegiveis para calibracao no contexto atual. A matriz completa chega na Fase 7B."
        actions={
          <Link href="/competencias" className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]">
            <ArrowLeft className="mr-1 size-4" /> Voltar
          </Link>
        }
        filters={
          <CompetenciasFilters
            areas={toOptions(filterData.areas)}
            funcoes={toOptions(filterData.funcoes)}
            concessionarias={toOptions(filterData.concessionarias)}
            showConcessionaria
          />
        }
        footer={
          <TablePagination
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
            className="border-t border-[var(--sn-border)] pt-4"
          />
        }
      >
        <CalibrationCollaboratorsTable data={result.data} />
      </AdminPageShell>
    </Suspense>
  )
}