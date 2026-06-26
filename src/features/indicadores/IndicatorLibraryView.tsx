'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { CheckIndicatorsButton } from '@/features/indicadores/CheckIndicatorsButton'
import { IndicatorFilters } from '@/features/indicadores/IndicatorFilters'
import { IndicatorFormDialog } from '@/features/indicadores/IndicatorFormDialog'
import { IndicatorLibraryTable } from '@/features/indicadores/IndicatorLibraryTable'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { IndicatorLibraryRow } from '@/server/queries/indicadores/library'
import type { IndicatorActionState } from '@/server/actions/indicadores/library'

type Option = { label: string; value: string }

type IndicatorLibraryViewProps = {
  result: PaginatedResult<IndicatorLibraryRow>
  filterOptions: { areas: Option[]; funcoes: Option[] }
  optionSets: { unidades: Option[]; importancias: Option[] }
  createAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  updateAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  deleteAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  toggleAction: (prev: IndicatorActionState, formData: FormData) => Promise<IndicatorActionState>
  checkAction: () => Promise<IndicatorActionState>
}

export function IndicatorLibraryView({
  result,
  filterOptions,
  optionSets,
  createAction,
  updateAction,
  deleteAction,
  toggleAction,
  checkAction,
}: IndicatorLibraryViewProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IndicatorLibraryRow | null>(null)

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(row: IndicatorLibraryRow) {
    setEditing(row)
    setOpen(true)
  }

  return (
    <>
      <AdminPageShell
        title="Biblioteca de indicadores"
        description="Cadastro e manutencao da biblioteca de indicadores."
        actions={
          <div className="flex flex-wrap items-start gap-2">
            <CheckIndicatorsButton action={checkAction} />
            <Button
              type="button"
              className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
              onClick={openCreate}
            >
              <Plus className="mr-1 size-4" /> Indicador
            </Button>
          </div>
        }
        filters={<IndicatorFilters areas={filterOptions.areas} funcoes={filterOptions.funcoes} />}
        footer={
          <TablePagination
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
            className="border-t border-[var(--sn-border)] pt-4"
          />
        }
      >
        <IndicatorLibraryTable
          data={result.data}
          onEdit={openEdit}
          deleteAction={deleteAction}
          toggleAction={toggleAction}
        />
      </AdminPageShell>

      <IndicatorFormDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        areas={filterOptions.areas}
        funcoes={filterOptions.funcoes}
        unidades={optionSets.unidades}
        importancias={optionSets.importancias}
        createAction={createAction}
        updateAction={updateAction}
      />
    </>
  )
}
