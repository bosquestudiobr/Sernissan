import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/database.types'

type DbClient = SupabaseClient<Database>

export async function syncJoinTable(
  supabase: DbClient,
  table: 'pais_divisoes' | 'divisao_setores' | 'grupo_concessionarias' | 'profiles_grupos_disponiveis' | 'profiles_concessionarias_equipe' | 'profiles_areas_disponiveis' | 'indicadores_areas' | 'indicadores_funcoes',
  parentKey: string,
  parentId: string,
  childKey: string,
  desiredChildIds: string[],
): Promise<void> {
  const uniqueDesired = [...new Set(desiredChildIds.filter(Boolean))]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: readError } = await (supabase as any)
    .from(table)
    .select(childKey)
    .eq(parentKey, parentId)

  if (readError) throw readError

  const currentIds = new Set(
    ((current ?? []) as Record<string, string>[]).map((row) => String(row[childKey])),
  )
  const desiredSet = new Set(uniqueDesired)

  const toRemove = [...currentIds].filter((id) => !desiredSet.has(id))
  const toAdd = uniqueDesired.filter((id) => !currentIds.has(id))

  if (toRemove.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(table)
      .delete()
      .eq(parentKey, parentId)
      .in(childKey, toRemove)
    if (error) throw error
  }

  if (toAdd.length > 0) {
    const rows = toAdd.map((childId) => ({
      [parentKey]: parentId,
      [childKey]: childId,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from(table).insert(rows)
    if (error) throw error
  }
}

export function parseIdList(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string' || value.trim() === '') return []
  return [...new Set(value.split(',').map((id) => id.trim()).filter(Boolean))]
}
