'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PlacarActionState } from '@/server/actions/placar'

type PlacarRecalcButtonProps = {
  placarId: string
  action: (prev: PlacarActionState, formData: FormData) => Promise<PlacarActionState>
  disabled?: boolean
  onResult?: (state: PlacarActionState) => void
}

export function PlacarRecalcButton({ placarId, action, disabled, onResult }: PlacarRecalcButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function onClick() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', placarId)
      const result = await action({ ok: false }, fd)
      setMessage(result.summary ?? result.message ?? null)
      onResult?.(result)
      if (result.ok) router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 px-2"
        disabled={disabled || pending}
        onClick={onClick}
        title={disabled ? 'Placar finalizado' : 'Recalcular placar'}
      >
        <Calculator className={`size-3.5 ${pending ? 'animate-pulse' : ''}`} />
      </Button>
      {message ? <span className="max-w-[220px] truncate text-xs text-[var(--sn-muted)]">{message}</span> : null}
    </div>
  )
}
