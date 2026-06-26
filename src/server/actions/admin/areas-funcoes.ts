'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireAdminAccess } from '@/lib/permissions'
import {
  AreaSchema,
  AreaUpdateSchema,
  DeleteByIdSchema,
  FuncaoSchema,
  FuncaoUpdateSchema,
} from '@/lib/validations/admin'
import { createClient } from '@/lib/supabase/server'
import type { AdminActionState } from '@/server/actions/admin'

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function guardAdmin() {
  const user = await requireAdminAccess()
  assertCan(user, 'admin:manage')
  return user
}

export async function createAreaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = AreaSchema.safeParse({ nome: formData.get('nome'), empresa: formData.get('empresa') || null })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('setor_concessionaria').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}

export async function updateAreaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = AreaUpdateSchema.safeParse({ id: formData.get('id'), nome: formData.get('nome'), empresa: formData.get('empresa') || null })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('setor_concessionaria')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}

export async function deleteAreaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('setor_concessionaria').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}

export async function createFuncaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = FuncaoSchema.safeParse({
    nome: formData.get('nome'),
    empresa: formData.get('empresa') || null,
    area: formData.get('area') || null,
    chave: formData.get('chave')?.toString(),
    lideranca: formData.get('lideranca')?.toString(),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('funcao_colaborador').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}

export async function updateFuncaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = FuncaoUpdateSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    empresa: formData.get('empresa') || null,
    area: formData.get('area') || null,
    chave: formData.get('chave')?.toString(),
    lideranca: formData.get('lideranca')?.toString(),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('funcao_colaborador')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}

export async function deleteFuncaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('funcao_colaborador').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/areas-funcoes')
  return { ok: true }
}
