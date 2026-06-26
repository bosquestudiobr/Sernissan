'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { VisitaActionState } from '@/server/actions/visitas'

type ActionFn = (prev: VisitaActionState, formData: FormData) => Promise<VisitaActionState>

type GeneratePublicLinkButtonProps = {
  rvId: string
  disabled?: boolean
  action: ActionFn
}

export function GeneratePublicLinkButton({ rvId, disabled, action }: GeneratePublicLinkButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [url, setUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function generate() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', rvId)
      fd.set('diasValidade', '7')
      const result = await action({ ok: false }, fd)
      if (result.ok && result.token) {
        setUrl(`${window.location.origin}/rv-publico/${result.token}`)
        setMessage('Link gerado (valido por 7 dias). Copie e envie ao cliente.')
        router.refresh()
      } else {
        setMessage(result.message ?? 'Erro ao gerar link.')
      }
    })
  }

  function copy() {
    if (url) navigator.clipboard?.writeText(url)
  }

  return (
    <div className="space-y-2">
      <Button type="button" className="h-9 bg-[var(--sn-red)] text-white hover:bg-[var(--sn-red-dark)]" onClick={generate} disabled={disabled || pending}>
        <Link2 className="mr-1 size-4" /> Gerar link publico
      </Button>
      {message ? <p className="text-xs text-[var(--sn-muted)]">{message}</p> : null}
      {url ? (
        <div className="flex items-center gap-2">
          <input readOnly value={url} className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-xs" />
          <Button type="button" size="sm" variant="outline" className="h-9" onClick={copy}>
            <Copy className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
