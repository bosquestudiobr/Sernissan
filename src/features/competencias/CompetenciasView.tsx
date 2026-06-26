'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { CompetenciasFilters } from '@/features/competencias/CompetenciasFilters'
import { CompetencyMapTable } from '@/features/competencias/CompetencyMapTable'
import { CompetencyHabitTable } from '@/features/competencias/CompetencyHabitTable'
import { CompetencyMapFormDialog } from '@/features/competencias/CompetencyMapFormDialog'
import { CompetencyHabitFormDialog } from '@/features/competencias/CompetencyHabitFormDialog'
import type { PaginatedResult } from '@/lib/types/pagination'
import type {
  CompetencyHabitDetail,
  CompetencyHabitRow,
  CompetencyMapDetail,
  CompetencyMapRow,
  CompetencyTab,
} from '@/server/queries/competencias'
import type { CompetencyActionState } from '@/server/actions/competencias'

type Option = { label: string; value: string }
type ActionFn = (prev: CompetencyActionState, formData: FormData) => Promise<CompetencyActionState>

type CompetenciasViewProps = {
  tab: CompetencyTab
  mapsResult: PaginatedResult<CompetencyMapRow>
  habitsResult: PaginatedResult<CompetencyHabitRow>
  filterOptions: { areas: Option[]; funcoes: Option[] }
  habitOptions: Option[]
  canManage: boolean
  createMapAction: ActionFn
  updateMapAction: ActionFn
  deleteMapAction: ActionFn
  updateMapHabitsAction: ActionFn
  createHabitAction: ActionFn
  updateHabitAction: ActionFn
  deleteHabitAction: ActionFn
}

export function CompetenciasView({
  tab,
  mapsResult,
  habitsResult,
  filterOptions,
  habitOptions,
  canManage,
  createMapAction,
  updateMapAction,
  deleteMapAction,
  updateMapHabitsAction,
  createHabitAction,
  updateHabitAction,
  deleteHabitAction,
}: CompetenciasViewProps) {
  const [mapOpen, setMapOpen] = useState(false)
  const [editingMap, setEditingMap] = useState<CompetencyMapDetail | null>(null)
  const [habitOpen, setHabitOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<CompetencyHabitDetail | null>(null)

  const isMapas = tab === 'mapas'
  const activeResult = isMapas ? mapsResult : habitsResult

  function tabClass(active: boolean) {
    return `inline-flex h-9 items-center rounded-md px-3 text-sm font-medium ${
      active ? 'bg-[var(--sn-black)] text-white' : 'border border-[var(--sn-border)] text-[var(--sn-text)] hover:bg-[var(--sn-field)]'
    }`
  }

  return (
    <>
      <AdminPageShell
        title="Competencias"
        description="Mapas de competencia e habitos de calibracao."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/competencias/calibracao" className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]">
              Calibracao
            </Link>
            {canManage && isMapas ? (
              <Button
                type="button"
                className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
                onClick={() => {
                  setEditingMap(null)
                  setMapOpen(true)
                }}
              >
                <Plus className="mr-1 size-4" /> Mapa
              </Button>
            ) : null}
            {canManage && !isMapas ? (
              <Button
                type="button"
                className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
                onClick={() => {
                  setEditingHabit(null)
                  setHabitOpen(true)
                }}
              >
                <Plus className="mr-1 size-4" /> Habito
              </Button>
            ) : null}
          </div>
        }
        filters={
          <div className="space-y-3">
            <div className="flex gap-2">
              <Link href="/competencias?tab=mapas" className={tabClass(isMapas)}>
                Mapas
              </Link>
              <Link href="/competencias?tab=habitos" className={tabClass(!isMapas)}>
                Habitos
              </Link>
            </div>
            {isMapas ? (
              <CompetenciasFilters areas={filterOptions.areas} funcoes={filterOptions.funcoes} showConcessionaria={false} />
            ) : (
              <CompetenciasFilters showArea={false} showFuncao={false} showConcessionaria={false} />
            )}
          </div>
        }
        footer={
          <TablePagination
            page={activeResult.page}
            pageCount={activeResult.pageCount}
            total={activeResult.total}
            className="border-t border-[var(--sn-border)] pt-4"
          />
        }
      >
        {isMapas ? (
          <CompetencyMapTable
            data={mapsResult.data}
            canManage={canManage}
            onEdit={(row) => {
              setEditingMap(row)
              setMapOpen(true)
            }}
            deleteAction={deleteMapAction}
          />
        ) : (
          <CompetencyHabitTable
            data={habitsResult.data}
            canManage={canManage}
            onEdit={(row) => {
              setEditingHabit({ ...row, id_2: null })
              setHabitOpen(true)
            }}
            deleteAction={deleteHabitAction}
          />
        )}
      </AdminPageShell>

      {canManage ? (
        <CompetencyMapFormDialog
          key={editingMap?.id ?? 'create-map'}
          open={mapOpen}
          onOpenChange={setMapOpen}
          editing={editingMap}
          funcoes={filterOptions.funcoes}
          habitOptions={habitOptions}
          createAction={createMapAction}
          updateAction={updateMapAction}
          updateHabitsAction={updateMapHabitsAction}
        />
      ) : null}

      {canManage ? (
        <CompetencyHabitFormDialog
          key={editingHabit?.id ?? 'create-habit'}
          open={habitOpen}
          onOpenChange={setHabitOpen}
          editing={editingHabit}
          createAction={createHabitAction}
          updateAction={updateHabitAction}
        />
      ) : null}
    </>
  )
}

