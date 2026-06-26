'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

type RefreshIndicatorsButtonProps = {
  action: () => Promise<{ ok: boolean; message?: string }>
}

export function RefreshIndicatorsButton({ action }: RefreshIndicatorsButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      className="h-9 bg-[var(--sn-red)] text-white hover:bg-[var(--sn-red-dark)]"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action()
          router.refresh()
        })
      }
    >
      <RefreshCw className={`mr-1 size-4 ${pending ? 'animate-spin' : ''}`} />
      Atualizar
    </Button>
  )
}
