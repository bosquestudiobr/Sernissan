import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('empresa')
    .select('id', { count: 'exact', head: true })

  const dbStatus = error ? 'erro de conexao' : 'conectado'

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 text-center">
      <div className="max-w-xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">SerNissan</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Fase 0B — bootstrap QA</h1>
        <p className="text-base text-zinc-600">
          App Next.js com Supabase SSR. Sem telas de negocio nesta fase.
        </p>
      </div>
      <dl className="grid w-full max-w-md gap-3 rounded-xl border border-zinc-200 bg-white p-6 text-left text-sm shadow-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Ambiente</dt>
          <dd className="font-medium text-zinc-900">QA</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Supabase</dt>
          <dd className="font-medium text-zinc-900">{dbStatus}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Tabela empresa (count)</dt>
          <dd className="font-medium text-zinc-900">{count ?? '—'}</dd>
        </div>
      </dl>
    </main>
  )
}
