'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { AnexoRow } from '@/server/queries/visitas'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type AnexosPanelProps = {
  rvId: string
  data: AnexoRow[]
  canManage: boolean
  locked: boolean
  uploadAction: ActionFn
  removeAction: ActionFn
  signedUrlAction: ActionFn
}

export function AnexosPanel({ rvId, data, canManage, locked, uploadAction, removeAction, signedUrlAction }: AnexosPanelProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function upload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('rv', rvId)
      fd.set('file', file)
      const result = await uploadAction({ ok: false }, fd)
      setMessage(result.message ?? null)
      if (result.ok) {
        if (fileRef.current) fileRef.current.value = ''
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

  function download(id: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      const result = await signedUrlAction({ ok: false }, fd)
      if (result.ok && result.signedUrl) window.open(result.signedUrl, '_blank', 'noopener')
      else setMessage(result.message ?? 'Erro ao abrir anexo.')
    })
  }

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-sm text-[var(--sn-muted)]">Nenhum anexo.</p>
      ) : (
        <ul className="divide-y divide-[var(--sn-border)]">
          {data.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-2 text-sm">
              <span>{a.nome}{a.tamanhoMb != null ? <span className="text-[var(--sn-muted)]"> ({a.tamanhoMb}MB)</span> : null}</span>
              <div className="flex items-center gap-1">
                <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => download(a.id)} disabled={pending}>
                  <Download className="size-3.5" />
                </Button>
                {canManage && !locked ? (
                  <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-[var(--sn-red)]" onClick={() => remove(a.id)} disabled={pending}>
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {canManage && !locked ? (
        <div className="flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" className="text-xs" accept=".pdf,.png,.jpg,.jpeg,.webp" />
          <Button type="button" size="sm" className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90" onClick={upload} disabled={pending}>
            <Upload className="mr-1 size-4" /> Enviar
          </Button>
          {message ? <span className="text-xs text-[var(--sn-muted)]">{message}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
