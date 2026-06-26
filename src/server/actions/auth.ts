'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { ResetPasswordSchema, SignInSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'

export type AuthActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrorsFromZod(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: 'Verifique os campos informados.',
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { ok: false, message: 'E-mail ou senha invalidos.' }
  }

  revalidatePath('/', 'layout')
  const redirectTo = formData.get('redirectTo')?.toString()
  redirect(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/entrar')
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = ResetPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: 'Informe um e-mail valido.',
    }
  }

  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/entrar`,
  })

  if (error) {
    return { ok: false, message: 'Nao foi possivel enviar o e-mail de recuperacao.' }
  }

  return {
    ok: true,
    message: 'Se o e-mail existir, voce recebera instrucoes para redefinir a senha.',
  }
}
