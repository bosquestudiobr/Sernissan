'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import type { IndicatorActionState } from '@/server/actions/indicadores/library'

type CheckIndicatorsButtonProps = {
  action: () => Promise<IndicatorActionState>
}

export function CheckIndicatorsButton({ action }: CheckIndicatorsButtonProps) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        className="h-9 border-[var(--sn-border)]"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await action()
            setMessage(result.message ?? (result.ok ? 'Checagem concluida.' : 'Erro na checagem.'))
          })
        }
      >
        {pending ? 'Checando...' : 'Checar indicadores'}
      </Button>
      {message ? <p className="max-w-xs text-right text-xs text-[var(--sn-muted)]">{message}</p> : null}
    </div>
  )
}
