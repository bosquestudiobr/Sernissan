import { CALIBRATION_STAGES } from '@/lib/validations/competencias'
import { STAGE_FIELDS } from '@/lib/competencias/calibration-performance'
import type { CalibrationPerformance } from '@/lib/competencias/calibration-performance'

type CalibrationPerformanceSummaryProps = {
  performance: CalibrationPerformance
}

export function CalibrationPerformanceSummary({ performance }: CalibrationPerformanceSummaryProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--sn-border)] text-left text-xs text-[var(--sn-muted)]">
            <th className="py-1 pr-3">Etapa</th>
            <th className="py-1 px-2 text-right">Sim</th>
            <th className="py-1 px-2 text-right">Parcial</th>
            <th className="py-1 px-2 text-right">Nao</th>
            <th className="py-1 px-2 text-right">Respondidos</th>
            <th className="py-1 px-2 text-right">Pontos</th>
            <th className="py-1 pl-2 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {CALIBRATION_STAGES.map((stage) => {
            const s = performance.perStage[stage]
            return (
              <tr key={stage} className="border-b border-[var(--sn-border)]">
                <td className="py-1.5 pr-3 font-medium text-[var(--sn-text)]">{STAGE_FIELDS[stage].label}</td>
                <td className="py-1.5 px-2 text-right">{s.sim}</td>
                <td className="py-1.5 px-2 text-right">{s.parcial}</td>
                <td className="py-1.5 px-2 text-right">{s.nao}</td>
                <td className="py-1.5 px-2 text-right">{s.answered}</td>
                <td className="py-1.5 px-2 text-right">{s.points}</td>
                <td className="py-1.5 pl-2 text-right">{s.percent}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
