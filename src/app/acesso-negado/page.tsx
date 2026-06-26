import { redirect } from 'next/navigation'

import { ForbiddenState } from '@/components/shared/ForbiddenState'
import { getCurrentUserView } from '@/server/queries/auth'

export default async function AcessoNegadoPage() {
  const user = await getCurrentUserView()
  if (!user) redirect('/entrar')
  if (user.ativo !== false && user.aprovado !== false) redirect('/')

  const description =
    user.ativo === false
      ? 'Sua conta esta inativa. Entre em contato com o administrador.'
      : 'Sua conta ainda nao foi aprovada. Aguarde a liberacao do administrador.'

  return <ForbiddenState description={description} />
}
