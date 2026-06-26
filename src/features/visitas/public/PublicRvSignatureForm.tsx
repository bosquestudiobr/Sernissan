'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PublicSignActionState } from '@/server/actions/visitas/public'

type ActionFn = (prev: PublicSignActionState, formData: FormData) => Promise<PublicSignActionState>

type PublicRvSignatureFormProps = {
  token: string
  action: ActionFn
}

const initialState: PublicSignActionState = { ok: false }

export function PublicRvSignatureForm({ token, action }: PublicRvSignatureFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  if (state.ok) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        {state.message ?? 'Assinatura registrada com sucesso.'}
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-1">
        <Label htmlFor="assinanteNome">Nome completo</Label>
        <Input id="assinanteNome" name="assinanteNome" required className="bg-[var(--sn-field)]" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="assinanteCargo">Cargo</Label>
        <Input id="assinanteCargo" name="assinanteCargo" className="bg-[var(--sn-field)]" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="comentario">Comentario (opcional)</Label>
        <textarea id="comentario" name="comentario" rows={3} className="w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] p-2 text-sm" />
      </div>
      {state.message && !state.ok ? <p className="text-sm text-[var(--sn-red)]">{state.message}</p> : null}
      <p className="text-xs text-[var(--sn-muted)]">
        Ao assinar, voce confirma ciencia do conteudo desta visita. Sua data/hora, IP e navegador serao registrados para auditoria.
      </p>
      <Button type="submit" className="h-10 w-full bg-[var(--sn-black)] text-white hover:bg-black/90" disabled={pending}>
        {pending ? 'Registrando...' : 'Confirmar ciencia e assinar'}
      </Button>
    </form>
  )
}
