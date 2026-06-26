'use server'

import { revalidatePath } from 'next/cache'

import { canManageCompetencias } from '@/lib/permissions/competencias'
import { requireCurrentUser } from '@/lib/permissions'
import { isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { parseIdList, syncJoinTable } from '@/lib/server/sync-relationships'
import { createClient } from '@/lib/supabase/server'
import {
  CompetencyHabitCreateSchema,
  CompetencyHabitUpdateSchema,
  CompetencyMapCreateSchema,
  CompetencyMapHabitsSchema,
  CompetencyMapUpdateSchema,
  DeleteCompetencySchema,
} from '@/lib/validations/competencias'
import { getUserScopes } from '@/server/queries/scopes'

export type CompetencyActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function normalizeOptionalText(value?: string | null) {
  if (!value || value.trim() === '') return null
  return value.trim()
}

async function guardCompetencyMutation() {
  const user = await requireCurrentUser()
  if (!canManageCompetencias(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)
  return { user, scopes }
}

async function assertFuncaoScope(funcaoId: string | null | undefined, user: { empresaId: string | null }, scopes: Awaited<ReturnType<typeof getUserScopes>>) {
  if (!funcaoId) return
  if (isHighPrivilegeScope(scopes.perfilNivel)) return
  const supabase = await createClient()
  const { data, error } = await supabase.from('funcao_colaborador').select('empresa').eq('id', funcaoId).maybeSingle()
  if (error) throw error
  if (data && user.empresaId && data.empresa && data.empresa !== user.empresaId) {
    throw new Error('FORBIDDEN')
  }
}

function errorState(err: unknown, fallback: string): CompetencyActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') {
    return { ok: false, message: 'Sem permissao para esta operacao.' }
  }
  if (err instanceof Error && err.message === 'NOT_FOUND') {
    return { ok: false, message: 'Registro nao encontrado.' }
  }
  return { ok: false, message: fallback }
}

export async function createCompetencyMapAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    const { user, scopes } = await guardCompetencyMutation()
    const parsed = CompetencyMapCreateSchema.safeParse({
      versao: formData.get('versao'),
      entrega: formData.get('entrega'),
      para_que: formData.get('para_que'),
      funcao_mapa: formData.get('funcao_mapa') || null,
      data: formData.get('data') || null,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertFuncaoScope(parsed.data.funcao_mapa, user, scopes)

    const supabase = await createClient()
    const { error } = await supabase.from('competencia_mapa').insert({
      versao: parsed.data.versao,
      entrega: normalizeOptionalText(parsed.data.entrega),
      para_que: normalizeOptionalText(parsed.data.para_que),
      funcao_mapa: parsed.data.funcao_mapa ?? null,
      data: parsed.data.data || null,
      created_by: user.id,
    })
    if (error) return { ok: false, message: 'Nao foi possivel criar o mapa.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Mapa criado com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar mapa.')
  }
}

export async function updateCompetencyMapAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    const { user, scopes } = await guardCompetencyMutation()
    const parsed = CompetencyMapUpdateSchema.safeParse({
      id: formData.get('id'),
      versao: formData.get('versao'),
      entrega: formData.get('entrega'),
      para_que: formData.get('para_que'),
      funcao_mapa: formData.get('funcao_mapa') || null,
      data: formData.get('data') || null,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    await assertFuncaoScope(parsed.data.funcao_mapa, user, scopes)

    const supabase = await createClient()
    const { error } = await supabase
      .from('competencia_mapa')
      .update({
        versao: parsed.data.versao,
        entrega: normalizeOptionalText(parsed.data.entrega),
        para_que: normalizeOptionalText(parsed.data.para_que),
        funcao_mapa: parsed.data.funcao_mapa ?? null,
        data: parsed.data.data || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar o mapa.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Mapa atualizado com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar mapa.')
  }
}

export async function deleteCompetencyMapAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    await guardCompetencyMutation()
    const parsed = DeleteCompetencySchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const supabase = await createClient()
    const { error } = await supabase.from('competencia_mapa').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir o mapa.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Mapa excluido com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir mapa.')
  }
}

export async function createCompetencyHabitAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    const { user } = await guardCompetencyMutation()
    const parsed = CompetencyHabitCreateSchema.safeParse({
      pergunta: formData.get('pergunta'),
      descricao: formData.get('descricao'),
      mv: formData.get('mv'),
      area: formData.get('area'),
      momento_de_verdade: formData.get('momento_de_verdade'),
      peso: formData.get('peso'),
      trilha: formData.get('trilha'),
      essencial: formData.get('essencial'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const supabase = await createClient()
    const { error } = await supabase.from('competencia_habito').insert({
      pergunta: parsed.data.pergunta,
      descricao: normalizeOptionalText(parsed.data.descricao),
      mv: normalizeOptionalText(parsed.data.mv),
      area: normalizeOptionalText(parsed.data.area),
      momento_de_verdade: normalizeOptionalText(parsed.data.momento_de_verdade),
      peso: parsed.data.peso ?? null,
      trilha: parsed.data.trilha ?? null,
      essencial: parsed.data.essencial ?? false,
      created_by: user.id,
    })
    if (error) return { ok: false, message: 'Nao foi possivel criar o habito.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Habito criado com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao criar habito.')
  }
}

export async function updateCompetencyHabitAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    await guardCompetencyMutation()
    const parsed = CompetencyHabitUpdateSchema.safeParse({
      id: formData.get('id'),
      pergunta: formData.get('pergunta'),
      descricao: formData.get('descricao'),
      mv: formData.get('mv'),
      area: formData.get('area'),
      momento_de_verdade: formData.get('momento_de_verdade'),
      peso: formData.get('peso'),
      trilha: formData.get('trilha'),
      essencial: formData.get('essencial'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const supabase = await createClient()
    const { error } = await supabase
      .from('competencia_habito')
      .update({
        pergunta: parsed.data.pergunta,
        descricao: normalizeOptionalText(parsed.data.descricao),
        mv: normalizeOptionalText(parsed.data.mv),
        area: normalizeOptionalText(parsed.data.area),
        momento_de_verdade: normalizeOptionalText(parsed.data.momento_de_verdade),
        peso: parsed.data.peso ?? null,
        trilha: parsed.data.trilha ?? null,
        essencial: parsed.data.essencial ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel atualizar o habito.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Habito atualizado com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar habito.')
  }
}

export async function deleteCompetencyHabitAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    await guardCompetencyMutation()
    const parsed = DeleteCompetencySchema.safeParse({ id: formData.get('id') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const supabase = await createClient()
    const { error } = await supabase.from('competencia_habito').delete().eq('id', parsed.data.id)
    if (error) return { ok: false, message: 'Nao foi possivel excluir o habito.' }

    revalidatePath('/competencias')
    return { ok: true, message: 'Habito excluido com sucesso.' }
  } catch (err) {
    return errorState(err, 'Erro ao excluir habito.')
  }
}

export async function updateCompetencyMapHabitsAction(
  _: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  try {
    await guardCompetencyMutation()
    const parsed = CompetencyMapHabitsSchema.safeParse({
      id: formData.get('id'),
      habitoIds: parseIdList(formData.get('habitoIds')),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const supabase = await createClient()
    await syncJoinTable(
      supabase,
      'competencia_mapa_habitos',
      'competencia_mapa_id',
      parsed.data.id,
      'competencia_habito_id',
      parsed.data.habitoIds,
    )

    revalidatePath('/competencias')
    return { ok: true, message: 'Habitos do mapa atualizados.' }
  } catch (err) {
    return errorState(err, 'Erro ao atualizar habitos do mapa.')
  }
}
