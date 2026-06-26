import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { AppShell } from '@/components/app-shell/AppShell'
import { getCurrentUserView } from '@/server/queries/auth'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserView()
  if (!user) redirect('/entrar')

  const context = {
    setor: 'Setor (mock)',
    grupo: 'Grupo (mock)',
    concessionaria: 'Concessionaria (mock)',
  }

  return (
    <AppShell user={user} context={context} activeModuleId="home">
      <div className="flex-1 px-4 py-6 lg:px-6">{children}</div>
    </AppShell>
  )
}
