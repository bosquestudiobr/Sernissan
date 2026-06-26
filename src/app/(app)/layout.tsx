import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { AppShell } from '@/components/app-shell/AppShell'
import { getCurrentUserView } from '@/server/queries/auth'
import {
  getCurrentOrganizationalContext,
  getOrganizationalContextOptions,
} from '@/server/queries/organizational-context'
import { getAllowedSidebarItems } from '@/server/queries/sidebar'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserView()
  if (!user) redirect('/entrar')
  if (user.ativo === false || user.aprovado === false) redirect('/acesso-negado')

  const [context, options, sidebarItems] = await Promise.all([
    getCurrentOrganizationalContext(user.id),
    getOrganizationalContextOptions(user.id),
    getAllowedSidebarItems(user),
  ])

  return (
    <AppShell
      user={user}
      context={context}
      options={options}
      sidebarItems={sidebarItems}
      activeModuleId="home"
    >
      <div className="flex-1 px-4 py-6 lg:px-6">{children}</div>
    </AppShell>
  )
}
