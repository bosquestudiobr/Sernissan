'use client'

import { CalibrationMatrixCell } from '@/features/competencias/CalibrationMatrixCell'
import { CalibrationStageHeader } from '@/features/competencias/CalibrationStageHeader'
import { CompetencyEmptyState } from '@/features/competencias/CompetencyEmptyState'
import type { CalibrationMatrixGroup, CalibrationStage, CalibrationStageInfo } from '@/server/queries/competencias/calibration'

type Option = { value: string; label: string }

type CalibrationMatrixTableProps = {
  groups: CalibrationMatrixGroup[]
  stages: CalibrationStageInfo[]
  options: Option[]
  canEdit: boolean
  getValue: (habitoId: string, stage: CalibrationStage) => string | null
  onChange: (habitoId: string, stage: CalibrationStage, value: string | null) => void
}

export function CalibrationMatrixTable({
  groups,
  stages,
  options,
  canEdit,
  getValue,
  onChange,
}: CalibrationMatrixTableProps) {
  const totalRows = groups.reduce((acc, g) => acc + g.rows.length, 0)
  if (totalRows === 0) {
    return (
      <CompetencyEmptyState
        title="Sem habitos para calibrar"
        description="Nao ha mapa/habitos vinculados a funcao deste colaborador."
      />
    )
  }

  const colSpan = stages.length + 1

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[var(--sn-border)]">
            <th className="h-9 px-3 text-left text-xs font-semibold text-[var(--sn-text)]">Habito</th>
            {stages.map((s) => (
              <CalibrationStageHeader key={s.key} label={s.label} />
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CalibrationMatrixGroupRows
              key={group.mapaId}
              group={group}
              stages={stages}
              options={options}
              canEdit={canEdit}
              colSpan={colSpan}
              getValue={getValue}
              onChange={onChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CalibrationMatrixGroupRows({
  group,
  stages,
  options,
  canEdit,
  colSpan,
  getValue,
  onChange,
}: {
  group: CalibrationMatrixGroup
  stages: CalibrationStageInfo[]
  options: Option[]
  canEdit: boolean
  colSpan: number
  getValue: (habitoId: string, stage: CalibrationStage) => string | null
  onChange: (habitoId: string, stage: CalibrationStage, value: string | null) => void
}) {
  return (
    <>
      <tr className="bg-[var(--sn-field)]">
        <td colSpan={colSpan} className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--sn-muted)]">
          {group.mapaLabel}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.habitoId} className="border-b border-[var(--sn-border)] align-top">
          <td className="px-3 py-2">
            <p className="font-medium text-[var(--sn-text)]">{row.pergunta ?? '—'}</p>
            {row.descricao ? <p className="text-xs text-[var(--sn-muted)]">{row.descricao}</p> : null}
            {row.mv ? <p className="text-[11px] text-[var(--sn-muted)]">MV: {row.mv}</p> : null}
          </td>
          {stages.map((s) => (
            <td key={s.key} className="px-2 py-2 text-center">
              <CalibrationMatrixCell
                value={getValue(row.habitoId, s.key)}
                options={options}
                canEdit={canEdit}
                onChange={(value) => onChange(row.habitoId, s.key, value)}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
