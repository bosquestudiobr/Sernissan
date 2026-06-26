'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { IndicatorObjectiveEditDialog } from '@/features/indicadores/IndicatorObjectiveEditDialog'
import { IndicatorObjectiveFilters } from '@/features/indicadores/IndicatorObjectiveFilters'
import { IndicatorObjectivesTable } from '@/features/indicadores/IndicatorObjectivesTable'
import { IndicatorRequestDialog } from '@/features/indicadores/IndicatorRequestDialog'
import { IndicatorRequestsPanel } from '@/features/indicadores/IndicatorRequestsPanel'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { IndicatorObjectiveRow, IndicatorRequestRow } from '@/server/queries/indicadores/objectives'
import type { IndicatorObjectiveActionState } from '@/server/actions/indicadores/objectives'

type Option = { label: string; value: string }

type IndicatorObjectivesViewProps = {
  result: PaginatedResult<IndicatorObjectiveRow>
  pendingCount: number
  requests: IndicatorRequestRow[]
  filterOptions: { areas: Option[]; funcoes: Option[] }
  unidades: Option[]
  concessionariaId?: string | null
  canApprove: boolean
  updateAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  toggleAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  requestAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  approveAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  rejectAction: (prev: IndicatorObjectiveActionState, formData: FormData) => Promise<IndicatorObjectiveActionState>
  refreshAction: () => Promise<IndicatorObjectiveActionState>
}

export function IndicatorObjectivesView({
  result,
  pendingCount,
  requests,
  filterOptions,
  unidades,
  concessionariaId,
  canApprove,
  updateAction,
  toggleAction,
  requestAction,
  approveAction,
  rejectAction,
  refreshAction,
}: IndicatorObjectivesViewProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [editing, setEditing] = useState<IndicatorObjectiveRow | null>(null)

  return (
    <>
      <AdminPageShell
        title="Indicadores e Objetivos"
        description={
          pendingCount > 0
            ? `${pendingCount} indicador${pendingCount === 1 ? '' : 'es'} solicitado${pendingCount === 1 ? '' : 's'}`
            : 'Indicadores aplicaveis ao contexto organizacional atual.'
        }
        actions={
          <div className="flex flex-wrap items-start gap-2">
            <RefreshIndicatorsButton action={refreshAction} />
            <Link href="/biblioteca-indicadores" className="inline-flex h-9 items-center rounded-md bg-[var(--sn-red)] px-4 text-sm font-medium text-white hover:bg-[var(--sn-red-dark)]">Biblioteca</Link>
            <Button
              type="button"
              className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
              onClick={() => setRequestOpen(true)}
            >
              <Plus className="mr-1 size-4" /> Solicitar Indicador
            </Button>
          </div>
        }
        filters={
          <IndicatorObjectiveFilters areas={filterOptions.areas} funcoes={filterOptions.funcoes} />
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
        <IndicatorRequestsPanel
          requests={requests}
          canApprove={canApprove}
          approveAction={approveAction}
          rejectAction={rejectAction}
        />
        <IndicatorObjectivesTable
          data={result.data}
          concessionariaId={concessionariaId}
          onEdit={(row) => {
            setEditing(row)
            setEditOpen(true)
          }}
          toggleAction={toggleAction}
        />
      </AdminPageShell>

      <IndicatorObjectiveEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        editing={editing}
        unidades={unidades}
        concessionariaId={concessionariaId}
        updateAction={updateAction}
      />

      <IndicatorRequestDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        areas={filterOptions.areas}
        funcoes={filterOptions.funcoes}
        concessionariaId={concessionariaId}
        requestAction={requestAction}
      />
    </>
  )
}
