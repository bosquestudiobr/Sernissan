'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import type { AgendaItemRow } from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type Option = { label: string; value: string }
type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoAgendaItemsPanelProps = {
  reuniaoId: string
  data: AgendaItemRow[]
  indicadores: Option[]
  canManage: boolean
  locked: boolean
  addAction: ActionFn
  removeAction: ActionFn
}

export function ReuniaoAgendaItemsPanel({
  reuniaoId,
  data,
  indicadores,
  canManage,
  locked,
  addAction,
  removeAction,
}: ReuniaoAgendaItemsPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [indicadorId, setIndicadorId] = useState('')

  const linkedIds = new Set(data.map((d) => d.id))
  const available = indicadores.filter((i) => !linkedIds.has(i.value))

  function add() {
    if (!indicadorId) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('reuniaoId', reuniaoId)
      fd.set('indicadorId', indicadorId)
      const result = await addAction({ ok: false }, fd)
      if (result.ok) {
        setIndicadorId('')
        router.refresh()
      }
    })
  }

  function remove(indicadorIdToRemove: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('reuniaoId', reuniaoId)
      fd.set('indicadorId', indicadorIdToRemove)
      await removeAction({ ok: false }, fd)
      router.refresh()
    })
  }

  const columns: DataTableColumn<AgendaItemRow>[] = [
    { key: 'nome', header: 'Indicador', cell: (row) => row.nome ?? '—' },
    { key: 'area', header: 'Area', cell: (row) => row.areaNome ?? '—' },
    { key: 'pontos', header: 'Pontos', cell: (row) => row.pontos ?? '—' },
    { key: 'status', header: 'Status', cell: (row) => row.status ?? '—' },
  ]

  return (
    <div className="space-y-3">
      <ServerDataTable
        columns={columns}
        data={data}
        emptyTitle="Nenhum indicador na pauta"
        emptyDescription="Adicione indicadores RR a esta reuniao."
        rowActions={
          canManage && !locked
            ? (row) => (
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[var(--sn-red)]" onClick={() => remove(row.id)} disabled={pending}>
                  <Trash2 className="size-3.5" />
                </Button>
              )
            : undefined
        }
      />
      {canManage && !locked ? (
        <div className="flex flex-wrap items-end gap-2">
          <select value={indicadorId} onChange={(e) => setIndicadorId(e.target.value)} className="h-9 min-w-[220px] rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm">
            <option value="">Selecione indicador</option>
            {available.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Button type="button" size="sm" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={add} disabled={pending || !indicadorId}>
            <Plus className="mr-1 size-4" /> Adicionar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
