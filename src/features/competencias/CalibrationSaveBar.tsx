'use client'

import { Button } from '@/components/ui/button'

type CalibrationSaveBarProps = {
  dirtyCount: number
  pending: boolean
  message: string | null
  error: boolean
  canEdit: boolean
  onSave: () => void
}

export function CalibrationSaveBar({ dirtyCount, pending, message, error, canEdit, onSave }: CalibrationSaveBarProps) {
  if (!canEdit) {
    return (
      <div className="flex items-center justify-between border-t border-[var(--sn-border)] pt-3 text-xs text-[var(--sn-muted)]">
        <span>Visualizacao somente leitura.</span>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--sn-border)] pt-3">
      <span className={`text-xs ${error ? 'text-[var(--sn-red)]' : 'text-[var(--sn-muted)]'}`}>
        {message ?? (dirtyCount > 0 ? `${dirtyCount} alteracao(oes) nao salva(s).` : 'Tudo salvo.')}
      </span>
      <Button
        type="button"
        className="h-9 bg-[var(--sn-black)] text-white hover:bg-black/90"
        disabled={pending || dirtyCount === 0}
        onClick={onSave}
      >
        {pending ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  )
}
