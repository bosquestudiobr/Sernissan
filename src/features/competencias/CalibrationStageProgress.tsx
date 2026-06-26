import { CALIBRATION_STAGES } from '@/lib/validations/competencias'
import { STAGE_FIELDS } from '@/lib/competencias/calibration-performance'
import type { CalibrationPerformance } from '@/lib/competencias/calibration-performance'

type CalibrationStageProgressProps = {
  performance: CalibrationPerformance
}

export function CalibrationStageProgress({ performance }: CalibrationStageProgressProps) {
  return (
    <div className="space-y-2">
      {CALIBRATION_STAGES.map((stage) => {
        const s = performance.perStage[stage]
        return (
          <div key={stage} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--sn-muted)]">
              <span>{STAGE_FIELDS[stage].label}</span>
              <span>{s.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--sn-field)]">
              <div className="h-full rounded-full bg-[var(--sn-black)]" style={{ width: `${Math.min(100, s.percent)}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
