import { createClient } from '@/lib/supabase/server'
import { getPerfilLabel } from '@/server/queries/scopes'

export type CalibrationStage = 'autocalibracao' | 'lider' | 'follow_up'

export const CALIBRATION_STAGE_COLUMNS: Record<
  CalibrationStage,
  { opcao: 'opcao_colaborador' | 'opcao_lider' | 'opcao_follow_up'; pontos: 'pontos_autocalibracao' | 'pontos_lider' | 'pontos_follow_up'; label: string }
> = {
  autocalibracao: { opcao: 'opcao_colaborador', pontos: 'pontos_autocalibracao', label: 'Autocalibracao' },
  lider: { opcao: 'opcao_lider', pontos: 'pontos_lider', label: 'Lider' },
  follow_up: { opcao: 'opcao_follow_up', pontos: 'pontos_follow_up', label: 'Follow-up' },
}

export type CalibrationOption = { value: string; label: string; points: number }
export type CalibrationStageInfo = { key: CalibrationStage; label: string }

export type CalibrationProfileView = {
  id: string
  nome: string | null
  foto: string | null
  perfilLabel: string
  areaNome: string | null
  funcaoNome: string | null
  funcaoId: string | null
  concessionariaId: string | null
  concessionariaNome: string | null
  empresaId: string | null
  ativo: boolean | null
  aprovado: boolean | null
}

export type CalibrationCellResponses = Record<CalibrationStage, string | null>

export type CalibrationMatrixRow = {
  habitoId: string
  pergunta: string | null
  descricao: string | null
  mv: string | null
  peso: number | null
  trilha: number | null
  responses: CalibrationCellResponses
}

export type CalibrationMatrixGroup = {
  mapaId: string
  mapaLabel: string
  rows: CalibrationMatrixRow[]
}

export type CalibrationMatrix = {
  calibracaoId: string | null
  hasMaps: boolean
  groups: CalibrationMatrixGroup[]
  lastUpdated: string | null
}

export function parseCalibrationMatrixParams(
  searchParams: Record<string, string | string[] | undefined>,
): { stage?: CalibrationStage } {
  const raw = searchParams.stage
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value === 'autocalibracao' || value === 'lider' || value === 'follow_up') return { stage: value }
  return {}
}

export function getCalibrationStages(): CalibrationStageInfo[] {
  return (Object.keys(CALIBRATION_STAGE_COLUMNS) as CalibrationStage[]).map((key) => ({
    key,
    label: CALIBRATION_STAGE_COLUMNS[key].label,
  }))
}

export async function getCalibrationOptions(): Promise<CalibrationOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_options')
    .select('db_value, label, metadata')
    .eq('option_set', 'calibracao_opcao')
    .eq('is_deleted', false)
    .order('sort_order')
  if (error) throw error
  return (data ?? []).map((r) => ({
    value: r.db_value ?? '',
    label: r.label ?? r.db_value ?? '',
    points: Number((r.metadata as { value?: number } | null)?.value ?? 0),
  }))
}

export async function getCalibrationProfile(profileId: string): Promise<CalibrationProfileView | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, foto, perfil, area, funcao, concessionaria, empresa, ativo, aprovado')
    .eq('id', profileId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const [perfilLabel, areaNome, funcaoNome, concessionariaNome] = await Promise.all([
    getPerfilLabel(data.perfil ?? null),
    (async () => {
      if (!data.area) return null
      const { data: d } = await supabase.from('setor_concessionaria').select('nome').eq('id', data.area).maybeSingle()
      return d?.nome ?? null
    })(),
    (async () => {
      if (!data.funcao) return null
      const { data: d } = await supabase.from('funcao_colaborador').select('nome').eq('id', data.funcao).maybeSingle()
      return d?.nome ?? null
    })(),
    (async () => {
      if (!data.concessionaria) return null
      const { data: d } = await supabase.from('concessionaria').select('nome').eq('id', data.concessionaria).maybeSingle()
      return d?.nome ?? null
    })(),
  ])

  return {
    id: data.id,
    nome: data.nome,
    foto: data.foto,
    perfilLabel,
    areaNome,
    funcaoNome,
    funcaoId: data.funcao,
    concessionariaId: data.concessionaria,
    concessionariaNome,
    empresaId: data.empresa,
    ativo: data.ativo,
    aprovado: data.aprovado,
  }
}

export async function getCalibrationByColaborador(
  profileId: string,
  concessionariaId?: string | null,
): Promise<{ id: string; updated_at: string } | null> {
  const supabase = await createClient()
  let query = supabase
    .from('competencia_calibracao')
    .select('id, updated_at')
    .eq('colaborador', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
  if (concessionariaId) query = query.eq('concessionaria', concessionariaId)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function getExistingCalibrationResults(
  calibracaoId: string,
): Promise<Map<string, CalibrationCellResponses>> {
  const map = new Map<string, CalibrationCellResponses>()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('calibracao_resultado')
    .select('habito, opcao_colaborador, opcao_lider, opcao_follow_up')
    .eq('calibracao', calibracaoId)
  if (error) throw error
  for (const r of data ?? []) {
    if (!r.habito) continue
    map.set(r.habito, {
      autocalibracao: r.opcao_colaborador,
      lider: r.opcao_lider,
      follow_up: r.opcao_follow_up,
    })
  }
  return map
}

export async function getCalibrationLastUpdated(calibracaoId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('calibracao_resultado')
    .select('updated_at')
    .eq('calibracao', calibracaoId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.updated_at ?? null
}

export async function getCalibrationMatrix(
  profile: CalibrationProfileView,
): Promise<CalibrationMatrix> {
  const supabase = await createClient()

  if (!profile.funcaoId) {
    return { calibracaoId: null, hasMaps: false, groups: [], lastUpdated: null }
  }

  const { data: maps, error: mapsError } = await supabase
    .from('competencia_mapa')
    .select('id, versao, entrega')
    .eq('funcao_mapa', profile.funcaoId)
    .order('versao', { ascending: true })
  if (mapsError) throw mapsError

  const mapIds = (maps ?? []).map((m) => m.id)
  if (mapIds.length === 0) {
    return { calibracaoId: null, hasMaps: false, groups: [], lastUpdated: null }
  }

  const { data: links, error: linksError } = await supabase
    .from('competencia_mapa_habitos')
    .select('competencia_mapa_id, competencia_habito_id')
    .in('competencia_mapa_id', mapIds)
  if (linksError) throw linksError

  const habitoIdsByMap = new Map<string, string[]>()
  const allHabitoIds = new Set<string>()
  for (const l of links ?? []) {
    const arr = habitoIdsByMap.get(l.competencia_mapa_id) ?? []
    arr.push(l.competencia_habito_id)
    habitoIdsByMap.set(l.competencia_mapa_id, arr)
    allHabitoIds.add(l.competencia_habito_id)
  }

  const habitos = new Map<string, { pergunta: string | null; descricao: string | null; mv: string | null; peso: number | null; trilha: number | null }>()
  if (allHabitoIds.size > 0) {
    const { data: habitoRows, error: habitoError } = await supabase
      .from('competencia_habito')
      .select('id, pergunta, descricao, mv, peso, trilha')
      .in('id', [...allHabitoIds])
    if (habitoError) throw habitoError
    for (const h of habitoRows ?? []) {
      habitos.set(h.id, { pergunta: h.pergunta, descricao: h.descricao, mv: h.mv, peso: h.peso, trilha: h.trilha })
    }
  }

  const calibration = await getCalibrationByColaborador(profile.id, profile.concessionariaId)
  const responses = calibration ? await getExistingCalibrationResults(calibration.id) : new Map<string, CalibrationCellResponses>()
  const lastUpdated = calibration ? await getCalibrationLastUpdated(calibration.id) : null

  const emptyResponses: CalibrationCellResponses = { autocalibracao: null, lider: null, follow_up: null }

  const groups: CalibrationMatrixGroup[] = (maps ?? []).map((m) => {
    const ids = habitoIdsByMap.get(m.id) ?? []
    const rows: CalibrationMatrixRow[] = ids
      .map((hid) => {
        const h = habitos.get(hid)
        return {
          habitoId: hid,
          pergunta: h?.pergunta ?? null,
          descricao: h?.descricao ?? null,
          mv: h?.mv ?? null,
          peso: h?.peso ?? null,
          trilha: h?.trilha ?? null,
          responses: responses.get(hid) ?? emptyResponses,
        }
      })
      .sort((a, b) => (a.trilha ?? 0) - (b.trilha ?? 0))
    return {
      mapaId: m.id,
      mapaLabel: [m.versao, m.entrega].filter(Boolean).join(' — ') || m.versao || m.id,
      rows,
    }
  })

  return {
    calibracaoId: calibration?.id ?? null,
    hasMaps: true,
    groups,
    lastUpdated,
  }
}
