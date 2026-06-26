'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireAdminAccess } from '@/lib/permissions'
import {
  ConcessionariaSchema,
  ConcessionariaUpdateSchema,
  DeleteByIdSchema,
  DivisaoSchema,
  DivisaoUpdateSchema,
  EmpresaSchema,
  EmpresaUpdateSchema,
  GrupoSchema,
  GrupoUpdateSchema,
  PaisSchema,
  PaisUpdateSchema,
  SetorSchema,
  SetorUpdateSchema,
} from '@/lib/validations/admin'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import { createClient } from '@/lib/supabase/server'

export type AdminActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function normalizeEmail(email?: string | null) {
  if (!email || email === '') return null
  return email
}

function parseDominios(value?: string | null) {
  if (!value || value.trim() === '') return []
  return value.split(',').map((d) => d.trim()).filter(Boolean)
}

async function guardAdmin() {
  const user = await requireAdminAccess()
  assertCan(user, 'admin:manage')
  return user
}

export async function createEmpresaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = EmpresaSchema.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    fone: formData.get('fone'),
    cor_principal: formData.get('cor_principal'),
    cor_secundaria: formData.get('cor_secundaria'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('empresa').insert({
    ...parsed.data,
    email: normalizeEmail(parsed.data.email as string | null | undefined),
  })
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/empresa')
  return { ok: true }
}

export async function updateEmpresaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = EmpresaUpdateSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    email: formData.get('email'),
    fone: formData.get('fone'),
    cor_principal: formData.get('cor_principal'),
    cor_secundaria: formData.get('cor_secundaria'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('empresa').update({
    ...payload,
    email: normalizeEmail(payload.email as string | null | undefined),
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/empresa')
  return { ok: true }
}

export async function deleteEmpresaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('empresa').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/empresa')
  return { ok: true }
}

export async function createPaisAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = PaisSchema.safeParse({ nome: formData.get('nome'), empresa: formData.get('empresa') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('pais').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/paises')
  return { ok: true }
}

export async function updatePaisAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = PaisUpdateSchema.safeParse({ id: formData.get('id'), nome: formData.get('nome'), empresa: formData.get('empresa') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('pais').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  if (formData.has('divisao_ids')) {
    try {
      await syncJoinTable(supabase, 'pais_divisoes', 'pais_id', id, 'divisao_id', parseIdList(formData.get('divisao_ids')))
    } catch (syncError) {
      return { ok: false, message: syncError instanceof Error ? syncError.message : 'Erro ao sincronizar divisoes.' }
    }
  }
  revalidatePath('/admin/paises')
  return { ok: true }
}

export async function deletePaisAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('pais').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/paises')
  return { ok: true }
}

export async function createDivisaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DivisaoSchema.safeParse({ nome: formData.get('nome'), empresa: formData.get('empresa') || null, pais: formData.get('pais') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('divisao').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/divisoes')
  return { ok: true }
}

export async function updateDivisaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DivisaoUpdateSchema.safeParse({ id: formData.get('id'), nome: formData.get('nome'), empresa: formData.get('empresa') || null, pais: formData.get('pais') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('divisao').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  if (formData.has('setor_ids')) {
    try {
      await syncJoinTable(supabase, 'divisao_setores', 'divisao_id', id, 'setores_id', parseIdList(formData.get('setor_ids')))
    } catch (syncError) {
      return { ok: false, message: syncError instanceof Error ? syncError.message : 'Erro ao sincronizar setores.' }
    }
  }
  revalidatePath('/admin/divisoes')
  return { ok: true }
}

export async function deleteDivisaoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('divisao').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/divisoes')
  return { ok: true }
}

export async function createSetorAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = SetorSchema.safeParse({ nome: formData.get('nome'), empresa: formData.get('empresa') || null, divisao: formData.get('divisao') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('setores').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/setores')
  return { ok: true }
}

export async function updateSetorAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = SetorUpdateSchema.safeParse({ id: formData.get('id'), nome: formData.get('nome'), empresa: formData.get('empresa') || null, divisao: formData.get('divisao') || null, id_2: formData.get('id_2') })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('setores').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/setores')
  return { ok: true }
}

export async function deleteSetorAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('setores').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/setores')
  return { ok: true }
}

export async function createGrupoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = GrupoSchema.safeParse({ nome: formData.get('nome'), empresa: formData.get('empresa') || null, setor: formData.get('setor') || null, id_2: formData.get('id_2'), grupo_ndp: formData.get('grupo_ndp') || null })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const supabase = await createClient()
  const { error } = await supabase.from('grupo').insert(parsed.data)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/grupos')
  return { ok: true }
}

export async function updateGrupoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = GrupoUpdateSchema.safeParse({ id: formData.get('id'), nome: formData.get('nome'), empresa: formData.get('empresa') || null, setor: formData.get('setor') || null, id_2: formData.get('id_2'), grupo_ndp: formData.get('grupo_ndp') || null })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, ...payload } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('grupo').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  if (formData.has('concessionaria_ids')) {
    try {
      await syncJoinTable(supabase, 'grupo_concessionarias', 'grupo_id', id, 'concessionaria_id', parseIdList(formData.get('concessionaria_ids')))
    } catch (syncError) {
      return { ok: false, message: syncError instanceof Error ? syncError.message : 'Erro ao sincronizar concessionarias.' }
    }
  }
  revalidatePath('/admin/grupos')
  return { ok: true }
}

export async function deleteGrupoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('grupo').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/grupos')
  return { ok: true }
}

export async function createConcessionariaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = ConcessionariaSchema.safeParse({
    nome: formData.get('nome'), bir: formData.get('bir'), uf: formData.get('uf'), municipio: formData.get('municipio'),
    codigo_ndp: formData.get('codigo_ndp'), empresa: formData.get('empresa') || null, pais: formData.get('pais') || null,
    divisao: formData.get('divisao') || null, setor: formData.get('setor') || null, grupo: formData.get('grupo') || null,
    dominios: formData.get('dominios'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { dominios, ...rest } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('concessionaria').insert({ ...rest, dominios: parseDominios(dominios) })
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/concessionarias')
  return { ok: true }
}

export async function updateConcessionariaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = ConcessionariaUpdateSchema.safeParse({
    id: formData.get('id'), nome: formData.get('nome'), bir: formData.get('bir'), uf: formData.get('uf'), municipio: formData.get('municipio'),
    codigo_ndp: formData.get('codigo_ndp'), empresa: formData.get('empresa') || null, pais: formData.get('pais') || null,
    divisao: formData.get('divisao') || null, setor: formData.get('setor') || null, grupo: formData.get('grupo') || null,
    dominios: formData.get('dominios'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }
  const { id, dominios, ...rest } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('concessionaria').update({ ...rest, dominios: parseDominios(dominios), updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/concessionarias')
  return { ok: true }
}

export async function deleteConcessionariaAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = DeleteByIdSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) return { ok: false, message: 'ID invalido.' }
  const supabase = await createClient()
  const { error } = await supabase.from('concessionaria').delete().eq('id', parsed.data.id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/admin/concessionarias')
  return { ok: true }
}
