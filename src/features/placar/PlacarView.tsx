'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { PlacarFilters } from '@/features/placar/PlacarFilters'
import { PlacarFormDialog } from '@/features/placar/PlacarFormDialog'
import { PlacarTable } from '@/features/placar/PlacarTable'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { PlacarDetail, PlacarIndicatorOption, PlacarRow } from '@/server/queries/placar'
import type { PlacarActionState } from '@/server/actions/placar'

type Option = { label: string; value: string }

type PlacarViewProps = {
  result: PaginatedResult<PlacarRow>
  filterOptions: {
    concessionarias: Option[]
    origens: Option[]
    acumulados: Option[]
  }
  availableIndicators: PlacarIndicatorOption[]
  defaultConcessionariaId?: string | null
  canEdit: boolean
  createAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  updateAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  deleteAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  updateIndicatorsAction: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  refreshAction: () => Promise<PlacarActionState>
}

export function PlacarView({
  result,
  filterOptions,
  availableIndicators,
  defaultConcessionariaId,
  canEdit,
  createAction,
  updateAction,
  deleteAction,
  updateIndicatorsAction,
  refreshAction,
}: PlacarViewProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PlacarDetail | null>(null)

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(row: PlacarRow) {
    setEditing(row)
    setOpen(true)
  }

  return (
    <>
      <AdminPageShell
        title="Placar"
        description="Placares de performance por concessionaria e periodo."
        actions={
          canEdit ? (
            <div className="flex flex-wrap items-start gap-2">
              <RefreshIndicatorsButton action={refreshAction} />
              <Button
                type="button"
                className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
                onClick={openCreate}
              >
                <Plus className="mr-1 size-4" /> Placar
              </Button>
            </div>
          ) : (
            <RefreshIndicatorsButton action={refreshAction} />
          )
        }
        filters={
          <PlacarFilters
            concessionarias={filterOptions.concessionarias}
            origens={filterOptions.origens}
            acumulados={filterOptions.acumulados}
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
        <PlacarTable data={result.data} canEdit={canEdit} onEdit={openEdit} deleteAction={deleteAction} />
      </AdminPageShell>

      {canEdit ? (
        <PlacarFormDialog
          key={editing?.id ?? 'create'}
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          concessionarias={filterOptions.concessionarias}
          origens={filterOptions.origens}
          acumulados={filterOptions.acumulados}
          availableIndicators={availableIndicators}
          defaultConcessionariaId={defaultConcessionariaId}
          createAction={createAction}
          updateAction={updateAction}
          updateIndicatorsAction={updateIndicatorsAction}
        />
      ) : null}
    </>
  )
}

