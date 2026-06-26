'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import { RefreshIndicatorsButton } from '@/features/indicadores/RefreshIndicatorsButton'
import { VisitasFilters } from '@/features/visitas/VisitasFilters'
import { VisitasTable } from '@/features/visitas/VisitasTable'
import { VisitaFormDialog } from '@/features/visitas/VisitaFormDialog'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { VisitaDetail, VisitaRow } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type Option = { label: string; value: string }
type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type VisitasViewProps = {
  result: PaginatedResult<VisitaRow>
  filterOptions: { concessionarias: Option[]; modalidades: Option[]; focos: Option[] }
  canManage: boolean
  createAction: ActionFn
  updateAction: ActionFn
  deleteAction: ActionFn
  refreshAction: () => Promise<VisitaActionState>
}

export function VisitasView({ result, filterOptions, canManage, createAction, updateAction, deleteAction, refreshAction }: VisitasViewProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VisitaDetail | null>(null)

  return (
    <>
      <AdminPageShell
        title="RV/Visitas"
        description="Relatorios de visita, participantes, proximos passos e assinatura."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RefreshIndicatorsButton action={refreshAction} />
            {canManage ? (
              <Button type="button" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={() => { setEditing(null); setOpen(true) }}>
                <Plus className="mr-1 size-4" /> Visita
              </Button>
            ) : null}
          </div>
        }
        filters={<VisitasFilters concessionarias={filterOptions.concessionarias} />}
        footer={<TablePagination page={result.page} pageCount={result.pageCount} total={result.total} className="border-t border-[var(--sn-border)] pt-4" />}
      >
        <VisitasTable
          data={result.data}
          canManage={canManage}
          onEdit={(row) => {
            setEditing({
              id: row.id,
              dataVisita: row.dataVisita,
              horaInicio: null,
              horaFim: null,
              dealerId: row.dealerId,
              dealerNome: row.dealerNome,
              consultorId: null,
              consultorNome: row.consultorNome,
              modalidadeId: row.modalidadeId,
              modalidadeNome: row.modalidadeNome,
              focoId: row.focoId,
              focoNome: null,
              relato: row.relato,
              pontosDestaque: row.pontosDestaque,
              avaliacaoConsultor: row.avaliacaoConsultor,
              status: row.status,
              assinadoEm: row.assinadoEm,
              enviadoEm: null,
              tokenExpiracao: row.tokenExpiracao,
              hasToken: row.hasToken,
              bloqueadoEdicao: false,
              created_at: row.created_at,
            })
            setOpen(true)
          }}
          deleteAction={deleteAction}
        />
      </AdminPageShell>

      {canManage ? (
        <VisitaFormDialog
          key={editing?.id ?? 'create'}
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          concessionarias={filterOptions.concessionarias}
          modalidades={filterOptions.modalidades}
          focos={filterOptions.focos}
          createAction={createAction}
          updateAction={updateAction}
        />
      ) : null}
    </>
  )
}

