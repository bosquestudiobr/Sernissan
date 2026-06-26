'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireAdminAccess } from '@/lib/permissions'
import {
  assertCanAssignScopes,
  assertCanEditProfile,
  assertCanToggleProfileActive,
  canAssignPerfil,
} from '@/lib/permissions/users'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import {
  ProfileAdminUpdateSchema,
  ProfileRelationshipsSchema,
} from '@/lib/validations/admin'
import { createClient } from '@/lib/supabase/server'
import { getPerfilNivel } from '@/server/queries/scopes'
import { getUserScopes } from '@/server/queries/scopes'
import type { AdminActionState } from '@/server/actions/admin'

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function guardAdmin() {
  const user = await requireAdminAccess()
  assertCan(user, 'admin:manage')
  return user
}

export async function updateProfileAdminAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const actor = await guardAdmin()
  const scopes = await getUserScopes(actor.id)

  const parsed = ProfileAdminUpdateSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    perfil: formData.get('perfil'),
    empresa: formData.get('empresa') || null,
    setor: formData.get('setor') || null,
    divisao: formData.get('divisao') || null,
    grupo: formData.get('grupo') || null,
    concessionaria: formData.get('concessionaria') || null,
    area: formData.get('area') || null,
    funcao: formData.get('funcao') || null,
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }

  const supabase = await createClient()
  const { data: target, error: readError } = await supabase
    .from('profiles')
    .select('perfil')
    .eq('id', parsed.data.id)
    .maybeSingle()
  if (readError) return { ok: false, message: readError.message }
  if (!target) return { ok: false, message: 'Usuario nao encontrado.' }

  const targetNivel = await getPerfilNivel(target.perfil)
  const newNivel = await getPerfilNivel(parsed.data.perfil)

  try {
    assertCanEditProfile(actor, parsed.data.id, targetNivel)
    if (!canAssignPerfil(actor, newNivel)) throw new Error('FORBIDDEN')
    assertCanAssignScopes(actor, scopes, {
      empresaId: parsed.data.empresa ?? null,
      setorId: parsed.data.setor ?? null,
      grupoId: parsed.data.grupo ?? null,
      concessionariaId: parsed.data.concessionaria ?? null,
    })
  } catch {
    return { ok: false, message: 'Sem permissao para editar este usuario.' }
  }

  const { id, ...payload } = parsed.data
  const { error } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/admin/usuarios')
  return { ok: true }
}

export async function toggleProfileActiveAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const actor = await guardAdmin()
  const id = formData.get('id')?.toString()
  const ativo = formData.get('ativo')?.toString() === 'true'
  if (!id) return { ok: false, message: 'ID invalido.' }

  const supabase = await createClient()
  const { data: target, error: readError } = await supabase
    .from('profiles')
    .select('perfil')
    .eq('id', id)
    .maybeSingle()
  if (readError) return { ok: false, message: readError.message }
  if (!target) return { ok: false, message: 'Usuario nao encontrado.' }

  const targetNivel = await getPerfilNivel(target.perfil)
  try {
    assertCanToggleProfileActive(actor, id, targetNivel, ativo)
  } catch {
    return { ok: false, message: 'Sem permissao para alterar status.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ ativo, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/admin/usuarios')
  return { ok: true }
}

export async function approveProfileAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const actor = await guardAdmin()
  const id = formData.get('id')?.toString()
  const aprovado = formData.get('aprovado')?.toString() === 'true'
  if (!id) return { ok: false, message: 'ID invalido.' }

  const supabase = await createClient()
  const { data: target, error: readError } = await supabase
    .from('profiles')
    .select('perfil')
    .eq('id', id)
    .maybeSingle()
  if (readError) return { ok: false, message: readError.message }
  if (!target) return { ok: false, message: 'Usuario nao encontrado.' }

  const targetNivel = await getPerfilNivel(target.perfil)
  try {
    assertCanEditProfile(actor, id, targetNivel)
    if (actor.id === id && !aprovado) throw new Error('FORBIDDEN')
  } catch {
    return { ok: false, message: 'Sem permissao para aprovar/reprovar.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ aprovado, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }

  revalidatePath('/admin/usuarios')
  return { ok: true }
}

export async function updateProfileRelationshipsAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const actor = await guardAdmin()
  const scopes = await getUserScopes(actor.id)

  const parsed = ProfileRelationshipsSchema.safeParse({
    id: formData.get('id'),
    grupoIds: parseIdList(formData.get('grupoIds')),
    concessionariaIds: parseIdList(formData.get('concessionariaIds')),
    areaIds: parseIdList(formData.get('areaIds')),
    funcaoId: formData.get('funcaoId') || null,
  })
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: 'Dados invalidos.' }

  const supabase = await createClient()
  const { data: target, error: readError } = await supabase
    .from('profiles')
    .select('perfil, funcao')
    .eq('id', parsed.data.id)
    .maybeSingle()
  if (readError) return { ok: false, message: readError.message }
  if (!target) return { ok: false, message: 'Usuario nao encontrado.' }

  const targetNivel = await getPerfilNivel(target.perfil)
  try {
    assertCanEditProfile(actor, parsed.data.id, targetNivel)
    assertCanAssignScopes(actor, scopes, {
      grupoIds: parsed.data.grupoIds,
      concessionariaIds: parsed.data.concessionariaIds,
    })
  } catch {
    return { ok: false, message: 'Sem permissao para atribuir vinculos.' }
  }

  const { id, grupoIds, concessionariaIds, areaIds, funcaoId } = parsed.data

  await Promise.all([
    syncJoinTable(supabase, 'profiles_grupos_disponiveis', 'profiles_id', id, 'grupo_id', grupoIds),
    syncJoinTable(
      supabase,
      'profiles_concessionarias_equipe',
      'profiles_id',
      id,
      'concessionaria_id',
      concessionariaIds,
    ),
    syncJoinTable(
      supabase,
      'profiles_areas_disponiveis',
      'profiles_id',
      id,
      'setor_concessionaria_id',
      areaIds,
    ),
  ])

  if (funcaoId !== undefined) {
    const { error } = await supabase
      .from('profiles')
      .update({ funcao: funcaoId, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { ok: false, message: error.message }
  }

  revalidatePath('/admin/usuarios')
  return { ok: true }
}
