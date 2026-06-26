import type { ReactNode } from 'react'

import { DataCard } from '@/components/shared/DataCard'
import { PageTitleActions } from '@/components/shared/PageTitleActions'

type AdminPageShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AdminPageShell({
  title,
  description,
  actions,
  filters,
  children,
  footer,
}: AdminPageShellProps) {
  return (
    <>
      <PageTitleActions title={title} description={description} actions={actions} />
      {filters}
      <DataCard className="space-y-4">
        {children}
        {footer}
      </DataCard>
    </>
  )
}
