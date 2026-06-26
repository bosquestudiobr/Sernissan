'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireAdminAccess } from '@/lib/permissions'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import { SyncRelationshipListSchema } from '@/lib/validations/admin'
import { createClient } from '@/lib/supabase/server'
import type { AdminActionState } from '@/server/actions/admin'

async function guardAdmin() {
  const user = await requireAdminAccess()
  assertCan(user, 'admin:manage')
  return user
}

export async function syncPaisDivisoesAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = SyncRelationshipListSchema.safeParse({
    parentId: formData.get('parentId'),
    childIds: parseIdList(formData.get('childIds')),
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
  const supabase = await createClient()
  try {
    await syncJoinTable(
      supabase,
      'pais_divisoes',
      'pais_id',
      parsed.data.parentId,
      'divisao_id',
      parsed.data.childIds,
    )
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Erro ao sincronizar.' }
  }
  revalidatePath('/admin/paises')
  return { ok: true }
}

export async function syncDivisaoSetoresAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = SyncRelationshipListSchema.safeParse({
    parentId: formData.get('parentId'),
    childIds: parseIdList(formData.get('childIds')),
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
  const supabase = await createClient()
  try {
    await syncJoinTable(
      supabase,
      'divisao_setores',
      'divisao_id',
      parsed.data.parentId,
      'setores_id',
      parsed.data.childIds,
    )
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Erro ao sincronizar.' }
  }
  revalidatePath('/admin/divisoes')
  return { ok: true }
}

export async function syncGrupoConcessionariasAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await guardAdmin()
  const parsed = SyncRelationshipListSchema.safeParse({
    parentId: formData.get('parentId'),
    childIds: parseIdList(formData.get('childIds')),
  })
  if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }
  const supabase = await createClient()
  try {
    await syncJoinTable(
      supabase,
      'grupo_concessionarias',
      'grupo_id',
      parsed.data.parentId,
      'concessionaria_id',
      parsed.data.childIds,
    )
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Erro ao sincronizar.' }
  }
  revalidatePath('/admin/grupos')
  return { ok: true }
}
