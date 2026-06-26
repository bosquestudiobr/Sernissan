'use client'

import { useActionState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataCard } from '@/components/shared/DataCard'
import { resetPasswordAction, type AuthActionState } from '@/server/actions/auth'

const initialState: AuthActionState = { ok: false }

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState)

  return (
    <DataCard className="w-full max-w-md">
      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--sn-text)]">Resetar senha</h1>
          <p className="text-sm text-[var(--sn-muted)]">Informe seu e-mail para receber o link de recuperacao.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="bg-[var(--sn-field)]" />
          {state.fieldErrors?.email ? (
            <p className="text-xs text-[var(--sn-red)]">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>

        {state.message ? (
          <p className={state.ok ? 'text-sm text-green-700' : 'text-sm text-[var(--sn-red)]'}>{state.message}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="h-10 w-full bg-[var(--sn-red)] text-white hover:bg-[var(--sn-red-dark)]">
          {pending ? 'Enviando...' : 'Enviar link'}
        </Button>

        <p className="text-center text-sm text-[var(--sn-muted)]">
          <Link href="/entrar" className="font-medium text-[var(--sn-red)] hover:underline">
            Voltar para entrar
          </Link>
        </p>
      </form>
    </DataCard>
  )
}
