'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ParticipanteRow } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type ParticipantesTableProps = {
  rvId: string
  data: ParticipanteRow[]
  canManage: boolean
  locked: boolean
  addAction: ActionFn
  removeAction: ActionFn
}

export function ParticipantesTable({ rvId, data, canManage, locked, addAction, removeAction }: ParticipantesTableProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')

  function add() {
    if (!nome.trim()) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('rv', rvId)
      fd.set('nome', nome)
      fd.set('cargo', cargo)
      const result = await addAction({ ok: false }, fd)
      if (result.ok) {
        setNome('')
        setCargo('')
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
        <p className="text-sm text-[var(--sn-muted)]">Nenhum participante.</p>
      ) : (
        <ul className="divide-y divide-[var(--sn-border)]">
          {data.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2 text-sm">
              <span>{p.nome}{p.cargo ? <span className="text-[var(--sn-muted)]"> — {p.cargo}</span> : null}</span>
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
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="h-9 w-40 bg-[var(--sn-field)]" />
          <Input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" className="h-9 w-40 bg-[var(--sn-field)]" />
          <Button type="button" size="sm" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={add} disabled={pending}>
            <Plus className="mr-1 size-4" /> Adicionar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
