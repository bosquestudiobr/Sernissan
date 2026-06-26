'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { IconButton } from '@/components/shared/IconButton'

type RowActionsProps = {
  onEdit: () => void
  onDelete: () => Promise<void>
  deleteLabel?: string
}

export function RowActions({ onEdit, onDelete, deleteLabel = 'Excluir' }: RowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <IconButton icon={Pencil} label="Editar" onClick={onEdit} />
      <ConfirmDialog
        title="Confirmar exclusao"
        description="Esta acao nao pode ser desfeita."
        confirmLabel={deleteLabel}
        onConfirm={onDelete}
        trigger={<Button type="button" variant="ghost" size="icon-sm" aria-label="Excluir"><Trash2 className="size-4 text-[var(--sn-red)]" /></Button>}
      />
    </div>
  )
}
