'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import { AgendaCalendarView } from '@/features/agenda/AgendaCalendarView'
import { AgendaFilters } from '@/features/agenda/AgendaFilters'
import { AgendaFormDialog } from '@/features/agenda/AgendaFormDialog'
import { AgendaSummaryCards } from '@/features/agenda/AgendaSummaryCards'
import { AgendaTable } from '@/features/agenda/AgendaTable'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { AgendaCalendarItem, AgendaDetail, AgendaRow, AgendaSummary } from '@/server/queries/agenda'
import { loadAgendaItemForEditAction, type AgendaActionState } from '@/server/actions/agenda'

type Option = { label: string; value: string }
type ActionFn = (prev: AgendaActionState, formData: FormData) => Promise<AgendaActionState>

type AgendaViewProps = {
  result: PaginatedResult<AgendaRow>
  summary: AgendaSummary
  calendarItems: AgendaCalendarItem[]
  month: string
  view: 'list' | 'calendar'
  filterOptions: {
    concessionarias: Option[]
    profiles: Option[]
    placares: Option[]
    status: Option[]
  }
  canManage: boolean
  canReopen: boolean
  canDelete: boolean
  createAction: ActionFn
  updateAction: ActionFn
  deleteAction: ActionFn
  completeAction: ActionFn
  cancelAction: ActionFn
  reopenAction: ActionFn
  refreshAction: () => Promise<AgendaActionState>
}

function rowToDetail(row: AgendaRow): AgendaDetail {
  return {
    ...row,
    participantIds: [],
    convidadoIds: [],
    concluidoEm: null,
  }
}

export function AgendaView({
  result,
  summary,
  calendarItems,
  month,
  view,
  filterOptions,
  canManage,
  canReopen,
  canDelete,
  createAction,
  updateAction,
  deleteAction,
  completeAction,
  cancelAction,
  reopenAction,
  refreshAction,
}: AgendaViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AgendaDetail | null>(null)

  async function handleEdit(row: AgendaRow) {
    const detail = await loadAgendaItemForEditAction(row.id)
    setEditing(detail ?? rowToDetail(row))
    setOpen(true)
  }

  function setView(next: 'list' | 'calendar') {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', next)
    if (next === 'calendar' && !params.get('month')) {
      const now = new Date()
      params.set('month', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <div className="mb-4">
        <AgendaSummaryCards summary={summary} />
      </div>

      <AdminPageShell
        title="Agenda"
        description="Compromissos e agendamentos por concessionaria e responsavel."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md border border-[var(--sn-border)]">
              <Button type="button" size="sm" variant={view === 'list' ? 'default' : 'ghost'} className="h-9 rounded-r-none" onClick={() => setView('list')}>
                Lista
              </Button>
              <Button type="button" size="sm" variant={view === 'calendar' ? 'default' : 'ghost'} className="h-9 rounded-l-none" onClick={() => setView('calendar')}>
                Calendario
              </Button>
            </div>
            <RefreshIndicatorsButton action={refreshAction} />
            {canManage ? (
              <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={() => { setEditing(null); setOpen(true) }}>
                <Plus className="mr-1 size-4" /> Compromisso
              </Button>
            ) : null}
          </div>
        }
        filters={
          <AgendaFilters
            concessionarias={filterOptions.concessionarias}
            profiles={filterOptions.profiles}
            statusOptions={filterOptions.status}
          />
        }
        footer={
          view === 'list' ? (
            <TablePagination page={result.page} pageCount={result.pageCount} total={result.total} className="border-t border-[var(--sn-border)] pt-4" />
          ) : null
        }
      >
        {view === 'calendar' ? (
          <AgendaCalendarView month={month} items={calendarItems} />
        ) : (
          <AgendaTable
            data={result.data}
            canManage={canManage}
            canReopen={canReopen}
            canDelete={canDelete}
            onEdit={handleEdit}
            deleteAction={deleteAction}
            completeAction={completeAction}
            cancelAction={cancelAction}
            reopenAction={reopenAction}
          />
        )}
      </AdminPageShell>

      {canManage ? (
        <AgendaFormDialog
          key={editing?.id ?? 'create'}
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          concessionarias={filterOptions.concessionarias}
          profiles={filterOptions.profiles}
          placares={filterOptions.placares}
          createAction={createAction}
          updateAction={updateAction}
        />
      ) : null}
    </>
  )
}
