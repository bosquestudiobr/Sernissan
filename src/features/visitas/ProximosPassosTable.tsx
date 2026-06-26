'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProximoPassoRow } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type ProximosPassosTableProps = {
  rvId: string
  data: ProximoPassoRow[]
  canManage: boolean
  locked: boolean
  addAction: ActionFn
  removeAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

export function ProximosPassosTable({ rvId, data, canManage, locked, addAction, removeAction }: ProximosPassosTableProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [acao, setAcao] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [prazo, setPrazo] = useState('')

  function add() {
    if (!acao.trim()) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('rv', rvId)
      fd.set('acao', acao)
      fd.set('responsavel', responsavel)
      if (prazo) fd.set('prazo', prazo)
      const result = await addAction({ ok: false }, fd)
      if (result.ok) {
        setAcao('')
        setResponsavel('')
        setPrazo('')
        router.refresh()
      }
    })
  }

  function remove(id: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      await removeAction({ ok: false }, fd)
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-sm text-[var(--sn-muted)]">Nenhum proximo passo.</p>
      ) : (
        <ul className="divide-y divide-[var(--sn-border)]">
          {data.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                {p.acao}
                {p.responsavel ? <span className="text-[var(--sn-muted)]"> — {p.responsavel}</span> : null}
                {p.prazo ? <span className="text-[var(--sn-muted)]"> ({formatDate(p.prazo)})</span> : null}
              </span>
              {canManage && !locked ? (
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[var(--sn-red)]" onClick={() => remove(p.id)} disabled={pending}>
                  <Trash2 className="size-3.5" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {canManage && !locked ? (
        <div className="flex flex-wrap items-end gap-2">
          <Input value={acao} onChange={(e) => setAcao(e.target.value)} placeholder="Acao" className="h-9 w-48 bg-[var(--sn-field)]" />
          <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Responsavel" className="h-9 w-40 bg-[var(--sn-field)]" />
          <Input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="h-9 bg-[var(--sn-field)]" />
          <Button type="button" size="sm" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={add} disabled={pending}>
            <Plus className="mr-1 size-4" /> Adicionar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
