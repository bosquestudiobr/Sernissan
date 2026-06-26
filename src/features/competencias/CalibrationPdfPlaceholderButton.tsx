'use client'

import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CalibrationPdfPlaceholderButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9"
      disabled
      title="Exportacao PDF sera implementada em fase futura (sem dependencia pesada)"
    >
      <FileText className="mr-1 size-4" /> PDF
    </Button>
  )
}
