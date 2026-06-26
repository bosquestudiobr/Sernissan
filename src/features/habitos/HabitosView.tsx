'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import { HabitoFormDialog } from '@/features/habitos/HabitoFormDialog'
import { HabitosFilters } from '@/features/habitos/HabitosFilters'
import { HabitosSummaryCards } from '@/features/habitos/HabitosSummaryCards'
import { HabitosTable } from '@/features/habitos/HabitosTable'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { HabitoDetail, HabitoRow, HabitosSummary } from '@/server/queries/habitos'
import { loadHabitoForEditAction, type HabitoActionState } from '@/server/actions/habitos'

type Option = { label: string; value: string }
type ActionFn = (prev: HabitoActionState, formData: FormData) => Promise<HabitoActionState>

type HabitosViewProps = {
  result: PaginatedResult<HabitoRow>
  summary: HabitosSummary
  filterOptions: {
    concessionarias: Option[]
    profiles: Option[]
    areas: Option[]
    funcoes: Option[]
    competenciaHabitos: Option[]
    status: Option[]
  }
  canManage: boolean
  canReopen: boolean
  canDelete: boolean
  createAction: ActionFn
  updateAction: ActionFn
  deleteAction: ActionFn
  completeAction: ActionFn
  toggleActiveAction: ActionFn
  reopenAction: ActionFn
  markDoneAction: ActionFn
  refreshAction: () => Promise<HabitoActionState>
}

export function HabitosView({
  result,
  summary,
  filterOptions,
  canManage,
  canReopen,
  canDelete,
  createAction,
  updateAction,
  deleteAction,
  completeAction,
  toggleActiveAction,
  reopenAction,
  markDoneAction,
  refreshAction,
}: HabitosViewProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<HabitoDetail | null>(null)

  async function handleEdit(row: HabitoRow) {
    const detail = await loadHabitoForEditAction(row.id)
    setEditing(detail ?? row)
    setOpen(true)
  }

  return (
    <>
      <div className="mb-4">
        <HabitosSummaryCards summary={summary} />
      </div>

      <AdminPageShell
        title="Habitos"
        description="Gestao e acompanhamento de habitos por concessionaria, area e responsavel."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RefreshIndicatorsButton action={refreshAction} />
            {canManage ? (
              <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={() => { setEditing(null); setOpen(true) }}>
                <Plus className="mr-1 size-4" /> Habito
              </Button>
            ) : null}
          </div>
        }
        filters={
          <HabitosFilters
            concessionarias={filterOptions.concessionarias}
            profiles={filterOptions.profiles}
            areas={filterOptions.areas}
            funcoes={filterOptions.funcoes}
            statusOptions={filterOptions.status}
          />
        }
        footer={
          <TablePagination page={result.page} pageCount={result.pageCount} total={result.total} className="border-t border-[var(--sn-border)] pt-4" />
        }
      >
        <HabitosTable
          data={result.data}
          canManage={canManage}
          canReopen={canReopen}
          canDelete={canDelete}
          onEdit={handleEdit}
          deleteAction={deleteAction}
          completeAction={completeAction}
          toggleActiveAction={toggleActiveAction}
          reopenAction={reopenAction}
          markDoneAction={markDoneAction}
        />
      </AdminPageShell>

      {canManage ? (
        <HabitoFormDialog
          key={editing?.id ?? 'create'}
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          concessionarias={filterOptions.concessionarias}
          profiles={filterOptions.profiles}
          areas={filterOptions.areas}
          funcoes={filterOptions.funcoes}
          competenciaHabitos={filterOptions.competenciaHabitos}
          createAction={createAction}
          updateAction={updateAction}
        />
      ) : null}
    </>
  )
}
