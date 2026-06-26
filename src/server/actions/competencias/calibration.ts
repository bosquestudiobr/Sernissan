'use server'

import { revalidatePath } from 'next/cache'

import { canEditCalibration, canManageCompetencias } from '@/lib/permissions/competencias'
import { requireCurrentUser } from '@/lib/permissions'
import { canAccessConcessionaria, isHighPrivilegeScope } from '@/lib/permissions/scopes'
import { createClient } from '@/lib/supabase/server'
import {
  CalibrationCellSchema,
  CalibrationFinalizeSchema,
  CalibrationMatrixSaveSchema,
  CalibrationReopenSchema,
  CalibrationResetCellSchema,
} from '@/lib/validations/competencias'
import { getUserScopes } from '@/server/queries/scopes'
import {
  getCalibrationMatrix,
  getCalibrationOptions,
  getCalibrationPerformanceSummary,
  getCalibrationProfile,
  countMatrixHabitos,
  CALIBRATION_STAGE_COLUMNS,
} from '@/server/queries/competencias/calibration'
import type { CalibrationStage } from '@/server/queries/competencias/calibration'
import { buildCalibrationValidationAlerts } from '@/lib/competencias/calibration-performance'

export type CalibrationActionState = {
  ok: boolean
  message?: string
  summary?: string
  alerts?: string[]
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

function errorState(err: unknown, fallback: string): CalibrationActionState {
  if (err instanceof Error && err.message === 'FORBIDDEN') return { ok: false, message: 'Sem permissao para esta operacao.' }
  if (err instanceof Error && err.message === 'NOT_FOUND') return { ok: false, message: 'Colaborador nao encontrado.' }
  if (err instanceof Error && err.message === 'FINALIZED') return { ok: false, message: 'Calibracao finalizada: reabra antes de editar.' }
  return { ok: false, message: fallback }
}

async function guardCalibration(profileId: string, requireAdmin = false) {
  const user = await requireCurrentUser()
  if (requireAdmin ? !canManageCompetencias(user.perfilNivel) : !canEditCalibration(user.perfilNivel)) {
    throw new Error('FORBIDDEN')
  }
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
    if (profile.concessionaria && !canAccessConcessionaria(scopes, profile.concessionaria)) throw new Error('FORBIDDEN')
  }

  return { user, scopes, profile }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findCalibration(supabase: any, profileId: string, concessionariaId: string | null) {
  let q = supabase
    .from('competencia_calibracao')
    .select('id, finalizada')
    .eq('colaborador', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
  if (concessionariaId) q = q.eq('concessionaria', concessionariaId)
  const { data, error } = await q.maybeSingle()
  if (error) throw error
  return data as { id: string; finalizada: boolean } | null
}

async function createOrGetCalibration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  profileId: string,
  concessionariaId: string | null,
  userId: string,
): Promise<{ id: string; finalizada: boolean }> {
  const existing = await findCalibration(supabase, profileId, concessionariaId)
  if (existing) return existing

  const { data: created, error } = await supabase
    .from('competencia_calibracao')
    .insert({
      colaborador: profileId,
      concessionaria: concessionariaId,
      created_by: userId,
      data_calibracao: new Date().toISOString(),
    })
    .select('id, finalizada')
    .single()
  if (error) throw error
  return created
}

type CellPatch = { habitoId: string; stage: CalibrationStage; opcao: string | null }

async function upsertCells(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  calibracaoId: string,
  cells: CellPatch[],
  pointsMap: Map<string, number>,
) {
  const byHabito = new Map<string, Record<string, unknown>>()
  for (const cell of cells) {
    const cols = CALIBRATION_STAGE_COLUMNS[cell.stage]
    const payload = byHabito.get(cell.habitoId) ?? { calibracao: calibracaoId, habito: cell.habitoId }
    payload[cols.opcao] = cell.opcao
    payload[cols.pontos] = cell.opcao ? pointsMap.get(cell.opcao) ?? null : null
    payload.updated_at = new Date().toISOString()
    byHabito.set(cell.habitoId, payload)
  }
  const rows = [...byHabito.values()]
  if (rows.length === 0) return
  const { error } = await supabase
    .from('calibracao_resultado')
    .upsert(rows, { onConflict: 'calibracao,habito' })
  if (error) throw error
}

async function buildPointsMap(): Promise<Map<string, number>> {
  const options = await getCalibrationOptions()
  const map = new Map<string, number>()
  for (const o of options) map.set(o.value, o.points)
  return map
}

async function assertNotFinalized(calibration: { finalizada: boolean }) {
  if (calibration.finalizada) throw new Error('FINALIZED')
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
    const calibration = await createOrGetCalibration(supabase, parsed.data.profileId, profile.concessionaria, user.id)
    await assertNotFinalized(calibration)
    const pointsMap = await buildPointsMap()
    await upsertCells(supabase, calibration.id, [parsed.data], pointsMap)

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
    let parsedCells: unknown = []
    try {
      const raw = formData.get('cells')
      parsedCells = JSON.parse(typeof raw === 'string' ? raw : '[]')
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
    const calibration = await createOrGetCalibration(supabase, parsed.data.profileId, profile.concessionaria, user.id)
    await assertNotFinalized(calibration)
    const pointsMap = await buildPointsMap()
    await upsertCells(supabase, calibration.id, parsed.data.cells, pointsMap)

    const habitosTocados = new Set(parsed.data.cells.map((c) => c.habitoId)).size
    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return {
      ok: true,
      message: 'Matriz salva.',
      summary: `${parsed.data.cells.length} resposta(s) em ${habitosTocados} habito(s).`,
    }
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
    const calibration = await findCalibration(supabase, parsed.data.profileId, profile.concessionaria)
    if (!calibration) return { ok: true, message: 'Nada para limpar.' }
    await assertNotFinalized(calibration)
    await upsertCells(supabase, calibration.id, [{ ...parsed.data, opcao: null }], new Map())

    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: 'Resposta limpa.' }
  } catch (err) {
    return errorState(err, 'Erro ao limpar resposta.')
  }
}

export async function finalizeCalibrationAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const parsed = CalibrationFinalizeSchema.safeParse({ profileId: formData.get('profileId') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { user, profile } = await guardCalibration(parsed.data.profileId)
    const supabase = await createClient()
    const calibration = await createOrGetCalibration(supabase, parsed.data.profileId, profile.concessionaria, user.id)
    const { error } = await supabase
      .from('competencia_calibracao')
      .update({ finalizada: true, data_finalizada: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', calibration.id)
    if (error) return { ok: false, message: 'Nao foi possivel finalizar.' }

    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: 'Calibracao finalizada.' }
  } catch (err) {
    return errorState(err, 'Erro ao finalizar calibracao.')
  }
}

export async function reopenCalibrationAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const parsed = CalibrationReopenSchema.safeParse({ profileId: formData.get('profileId') })
    if (!parsed.success) return { ok: false, message: 'Dados invalidos.' }

    const { profile } = await guardCalibration(parsed.data.profileId, true)
    const supabase = await createClient()
    const calibration = await findCalibration(supabase, parsed.data.profileId, profile.concessionaria)
    if (!calibration) return { ok: true, message: 'Calibracao inexistente.' }
    const { error } = await supabase
      .from('competencia_calibracao')
      .update({ finalizada: false, data_finalizada: null, updated_at: new Date().toISOString() })
      .eq('id', calibration.id)
    if (error) return { ok: false, message: 'Nao foi possivel reabrir.' }

    revalidatePath(`/competencias/calibracao/${parsed.data.profileId}`)
    return { ok: true, message: 'Calibracao reaberta.' }
  } catch (err) {
    return errorState(err, 'Erro ao reabrir calibracao.')
  }
}

export async function validateCalibrationAction(
  _: CalibrationActionState,
  formData: FormData,
): Promise<CalibrationActionState> {
  try {
    const profileId = String(formData.get('profileId') ?? '')
    await guardCalibration(profileId)
    const profile = await getCalibrationProfile(profileId)
    if (!profile) throw new Error('NOT_FOUND')

    const matrix = await getCalibrationMatrix(profile)
    const totalHabitos = countMatrixHabitos(matrix)
    const performance = await getCalibrationPerformanceSummary(matrix.calibracaoId, totalHabitos)
    const alerts = buildCalibrationValidationAlerts({
      hasMaps: matrix.hasMaps,
      totalHabitos,
      performance,
      finalizada: matrix.finalizada,
    })

    return {
      ok: true,
      message: alerts.length === 0 ? 'Sem pendencias.' : `${alerts.length} alerta(s).`,
      alerts: alerts.map((a) => a.message),
    }
  } catch (err) {
    return errorState(err, 'Erro ao validar calibracao.')
  }
}
