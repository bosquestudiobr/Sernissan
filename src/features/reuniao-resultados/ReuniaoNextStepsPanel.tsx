'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { NextStepRow } from '@/server/queries/reuniao-resultados'
import type { ReuniaoActionState } from '@/server/actions/reuniao-resultados'

type ActionFn = (prev: ReuniaoActionState, formData: FormData) => Promise<ReuniaoActionState>

type ReuniaoNextStepsPanelProps = {
  reuniaoId: string
  data: NextStepRow[]
  canManage: boolean
  locked: boolean
  addAction: ActionFn
  removeAction: ActionFn
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function ReuniaoNextStepsPanel({ reuniaoId, data, canManage, locked, addAction, removeAction }: ReuniaoNextStepsPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [descricao, setDescricao] = useState('')
  const [dataPrazo, setDataPrazo] = useState('')
  const [responsavel, setResponsavel] = useState('')

  function add() {
    if (!descricao.trim()) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('reuniaoId', reuniaoId)
      fd.set('descricao', descricao)
      if (dataPrazo) fd.set('data', dataPrazo)
      if (responsavel) fd.set('responsavel', responsavel)
      const result = await addAction({ ok: false }, fd)
      if (result.ok) {
        setDescricao('')
        setDataPrazo('')
        setResponsavel('')
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
          {data.map((step) => (
            <li key={step.id} className="flex items-start justify-between gap-2 py-2 text-sm">
              <div>
                <p className={step.completa ? 'text-[var(--sn-muted)] line-through' : 'text-[var(--sn-text)]'}>{step.descricao}</p>
                <p className="text-xs text-[var(--sn-muted)]">
                  {step.responsavel ? `Resp.: ${step.responsavel}` : 'Sem responsavel'}
                  {' · '}
                  Prazo: {formatDate(step.data)}
                  {step.indicadorNome ? ` · ${step.indicadorNome}` : ''}
                </p>
              </div>
              {canManage && !locked ? (
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[var(--sn-red)]" onClick={() => remove(step.id)} disabled={pending}>
                  <Trash2 className="size-3.5" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {canManage && !locked ? (
        <div className="flex flex-wrap items-end gap-2">
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descricao da acao" className="h-9 min-w-[200px] bg-[var(--sn-field)]" />
          <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Responsavel" className="h-9 w-36 bg-[var(--sn-field)]" />
          <Input value={dataPrazo} onChange={(e) => setDataPrazo(e.target.value)} type="date" className="h-9 bg-[var(--sn-field)]" />
          <Button type="button" size="sm" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={add} disabled={pending}>
            <Plus className="mr-1 size-4" /> Adicionar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
