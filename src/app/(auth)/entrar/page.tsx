import { LoginForm } from '@/features/auth/LoginForm'

type EntrarPageProps = {
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const params = await searchParams
  return <LoginForm redirectTo={params.redirectTo ?? '/'} />
}
