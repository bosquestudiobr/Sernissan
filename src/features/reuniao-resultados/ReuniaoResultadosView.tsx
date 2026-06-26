'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import { ReuniaoFormDialog } from '@/features/reuniao-resultados/ReuniaoFormDialog'
import { ReuniaoResultadosFilters } from '@/features/reuniao-resultados/ReuniaoResultadosFilters'
import { ReuniaoResultadosTable } from '@/features/reuniao-resultados/ReuniaoResultadosTable'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { ReuniaoDetail, ReuniaoRow } from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type Option = { label: string; value: string }
type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoResultadosViewProps = {
  result: PaginatedResult<ReuniaoRow>
  filterOptions: { concessionarias: Option[]; areas: Option[]; status: Option[] }
  canManage: boolean
  canFinalize: boolean
  canDelete: boolean
  createAction: ActionFn
  updateAction: ActionFn
  deleteAction: ActionFn
  finalizeAction: ActionFn
  reopenAction: ActionFn
  refreshAction: () => Promise<ReuniaoActionState>
}

function rowToDetail(row: ReuniaoRow): ReuniaoDetail {
  return {
    id: row.id,
    data: row.data,
    id2: row.id2,
    finalizada: row.finalizada,
    dataFinalizada: row.dataFinalizada,
    empresaId: null,
    createdById: row.createdById,
    createdByNome: row.createdByNome,
    indicatorCount: row.indicatorCount,
    actionCount: row.actionCount,
    resultCount: row.resultCount,
    openActionCount: 0,
    status: row.status,
    created_at: row.created_at,
  }
}

export function ReuniaoResultadosView({
  result,
  filterOptions,
  canManage,
  canFinalize,
  canDelete,
  createAction,
  updateAction,
  deleteAction,
  finalizeAction,
  reopenAction,
  refreshAction,
}: ReuniaoResultadosViewProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ReuniaoDetail | null>(null)

  return (
    <>
      <AdminPageShell
        title="Reuniao de Resultados"
        description="XR — reunioes, pauta de indicadores, proximos passos e resultados."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RefreshIndicatorsButton action={refreshAction} />
            {canManage ? (
              <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={() => { setEditing(null); setOpen(true) }}>
                <Plus className="mr-1 size-4" /> Reuniao
              </Button>
            ) : null}
          </div>
        }
        filters={
          <ReuniaoResultadosFilters
            concessionarias={filterOptions.concessionarias}
            areas={filterOptions.areas}
            statusOptions={filterOptions.status}
          />
        }
        footer={<TablePagination page={result.page} pageCount={result.pageCount} total={result.total} className="border-t border-[var(--sn-border)] pt-4" />}
      >
        <ReuniaoResultadosTable
          data={result.data}
          canManage={canManage}
          canFinalize={canFinalize}
          canDelete={canDelete}
          onEdit={(row) => { setEditing(rowToDetail(row)); setOpen(true) }}
          deleteAction={deleteAction}
          finalizeAction={finalizeAction}
          reopenAction={reopenAction}
        />
      </AdminPageShell>

      {canManage ? (
        <ReuniaoFormDialog
          key={editing?.id ?? 'create'}
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          createAction={createAction}
          updateAction={updateAction}
        />
      ) : null}
    </>
  )
}
