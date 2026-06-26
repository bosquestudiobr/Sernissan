import { PublicRvViewComponent } from '@/features/visitas/public/PublicRvView'
import { signPublicRvAction } from '@/server/actions/visitas/public'
import { getPublicRvByToken } from '@/server/queries/visitas/public'

type PageProps = { params: Promise<{ token: string }> }

export const dynamic = 'force-dynamic'

export default async function PublicRvPage({ params }: PageProps) {
  const { token } = await params
  const data = await getPublicRvByToken(token)

  return <PublicRvViewComponent token={token} data={data} signAction={signPublicRvAction} />
}