'use client'

import { useActionState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataCard } from '@/components/shared/DataCard'
import { signInAction, type AuthActionState } from '@/server/actions/auth'

const initialState: AuthActionState = { ok: false }

type LoginFormProps = {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, initialState)

  return (
    <DataCard className="w-full max-w-md">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--sn-text)]">Entrar</h1>
          <p className="text-sm text-[var(--sn-muted)]">Acesse o SerNissan com seu e-mail corporativo.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="bg-[var(--sn-field)]" />
          {state.fieldErrors?.email ? (
            <p className="text-xs text-[var(--sn-red)]">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="bg-[var(--sn-field)]" />
          {state.fieldErrors?.password ? (
            <p className="text-xs text-[var(--sn-red)]">{state.fieldErrors.password[0]}</p>
          ) : null}
        </div>

        {state.message && !state.ok ? <p className="text-sm text-[var(--sn-red)]">{state.message}</p> : null}

        <Button type="submit" disabled={pending} className="h-10 w-full bg-[var(--sn-black)] text-white hover:bg-black/90">
          {pending ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-[var(--sn-muted)]">
          <Link href="/resetar-senha" className="font-medium text-[var(--sn-red)] hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      </form>
    </DataCard>
  )
}
