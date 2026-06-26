'use server'

import { revalidatePath } from 'next/cache'

import { canEditCalibration } from '@/lib/permissions/competencias'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import {
  CalibrationCellSchema,
  CalibrationMatrixSaveSchema,
  CalibrationResetCellSchema,
} from '@/lib/validations/competencias'
import { getUserScopes } from '@/server/queries/scopes'
import { getCalibrationOptions, CALIBRATION_STAGE_COLUMNS } from '@/server/queries/competencias/calibration'
import type { CalibrationStage } from '@/server/queries/competencias/calibration'

export type CalibrationActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): CalibrationActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') {
    return { ok: false, message: 'Sem permissao para esta operacao.' }
  }
  if (err instanceof Error && err.message === 'NOT_FOUND') {
    return { ok: false, message: 'Colaborador nao encontrado.' }
  }
  return { ok: false, message: fallback }
}

async function guardCalibration(profileId: string) {
  const user = await requireCurrentUser()
  if (!canEditCalibration(user.perfilNivel)) throw new Error('FORBIDDEN')
  const scopes = await getUserScopes(user.id)

  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, empresa, concessionaria')
    .eq('id', profileId)
    .maybeSingle()
  if (error) throw error
  if (!profile) throw new Error('NOT_FOUND')

  if (!isHighPrivilegeScope(scopes.perfilNivel)) {
    if (user.empresaId && profile.empresa && profile.empresa !== user.empresaId) throw new Error('FORBIDDEN')
    if (profile.concessionaria && !canAccessConcessionaria(scopes, profile.concessionaria)) {
      throw new Error('FORBIDDEN')
    }
  }

  return { user, scopes, profile }
}

async function createOrGetCalibration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  profileId: string,
  concessionariaId: string | null,
  userId: string,
): Promise<string> {
  let findQuery = supabase
    .from('competencia_calibracao')
    .select('id')
    .eq('colaborador', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
  if (concessionariaId) findQuery = findQuery.eq('concessionaria', concessionariaId)
  const { data: existing, error: findError } = await findQuery.maybeSingle()
  if (findError) throw findError
  if (existing) return existing.id

  const { data: created, error: insertError } = await supabase
    .from('competencia_calibracao')
    .insert({
      colaborador: profileId,
      concessionaria: concessionariaId,
      created_by: userId,
      data_calibracao: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (insertError) throw insertError
  return created.id
}

async function upsertCalibrationResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  calibracaoId: string,
  habitoId: string,
  stage: CalibrationStage,
  opcao: string | null,
  points: number | null,
) {
  const cols = CALIBRATION_STAGE_COLUMNS[stage]
  const { data: existing, error: findError } = await supabase
    .from('calibracao_resultado')
    .select('id')
    .eq('calibracao', calibracaoId)
    .eq('habito', habitoId)
    .limit(1)
    .maybeSingle()
  if (findError) throw findError

  const patch: Record<string, unknown> = {
    [cols.opcao]: opcao,
    [cols.pontos]: points,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { error } = await supabase.from('calibracao_resultado').update(patch).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('calibracao_resultado').insert({
      calibracao: calibracaoId,
      habito: habitoId,
      ...patch,
    })
    if (error) throw error
  }
}

async function buildPointsMap(): Promise<Map<string, number>> {
  const options = await getCalibrationOptions()
  const map = new Map<string, number>()
  for (const o of options) map.set(o.value, o.points)
  return map
}

export async function createOrGetCalibrationAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const profileId = String(formData.get('profileId') ?? '')
    const { user, profile } = await guardCalibration(profileId)
    const supabase = await createClient()
    await createOrGetCalibration(supabase, profileId, profile.concessionaria, user.id)
    revalidatePath(`/competencias/calibracao/${profileId}`)
    return { ok: true, message: 'Calibracao pronta.' }
  } catch (err) {
    return errorState(err, 'Erro ao iniciar calibracao.')
  }
}

export async function saveCalibrationCellAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const parsed = CalibrationCellSchema.safeParse({
      profileId: formData.get('profileId'),
      habitoId: formData.get('habitoId'),
      stage: formData.get('stage'),
      opcao: formData.get('opcao'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { user, profile } = await guardCalibration(parsed.data.profileId)
    const supabase = await createClient()
    const calibracaoId = await createOrGetCalibration(supabase, parsed.data.profileId, profile.concessionaria, user.id)
    const points = (await buildPointsMap()).get(parsed.data.opcao) ?? null
    await upsertCalibrationResult(supabase, calibracaoId, parsed.data.habitoId, parsed.data.stage, parsed.data.opcao, points)

    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: 'Resposta salva.' }
  } catch (err) {
    return errorState(err, 'Erro ao salvar resposta.')
  }
}

export async function saveCalibrationMatrixAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const rawCells = formData.get('cells')
    let parsedCells: unknown = []
    try {
      parsedCells = JSON.parse(typeof rawCells === 'string' ? rawCells : '[]')
    } catch {
      return { ok: false, message: 'Dados invalidos.' }
    }

    const parsed = CalibrationMatrixSaveSchema.safeParse({
      profileId: formData.get('profileId'),
      cells: parsedCells,
    })
    if (!parsed.success) return { ok: false, message: 'Nenhuma alteracao valida para salvar.' }

    const { user, profile } = await guardCalibration(parsed.data.profileId)
    const supabase = await createClient()
    const calibracaoId = await createOrGetCalibration(supabase, parsed.data.profileId, profile.concessionaria, user.id)
    const pointsMap = await buildPointsMap()

    for (const cell of parsed.data.cells) {
      await upsertCalibrationResult(
        supabase,
        calibracaoId,
        cell.habitoId,
        cell.stage,
        cell.opcao,
        cell.opcao ? pointsMap.get(cell.opcao) ?? null : null,
      )
    }

    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: `${parsed.data.cells.length} resposta(s) salva(s).` }
  } catch (err) {
    return errorState(err, 'Erro ao salvar matriz.')
  }
}

export async function resetCalibrationCellAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const parsed = CalibrationResetCellSchema.safeParse({
      profileId: formData.get('profileId'),
      habitoId: formData.get('habitoId'),
      stage: formData.get('stage'),
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const { profile } = await guardCalibration(parsed.data.profileId)
    const supabase = await createClient()
    const calibration = await supabase
      .from('competencia_calibracao')
      .select('id')
      .eq('colaborador', parsed.data.profileId)
      .eq('concessionaria', profile.concessionaria ?? '')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (calibration.error) throw calibration.error
    if (!calibration.data) return { ok: true, message: 'Nada para limpar.' }

    await upsertCalibrationResult(supabase, calibration.data.id, parsed.data.habitoId, parsed.data.stage, null, null)
    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: 'Resposta limpa.' }
  } catch (err) {
    return errorState(err, 'Erro ao limpar resposta.')
  }
}

