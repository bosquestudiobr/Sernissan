import { PageTitleActions } from '@/components/shared/PageTitleActions'
import { DataCard } from '@/components/shared/DataCard'

type ModuloPlaceholderPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ModuloPlaceholderPage({ params }: ModuloPlaceholderPageProps) {
  const { slug } = await params
  const label = slug.replace(/-/g, ' ')

  return (
    <>
      <PageTitleActions
        title={label.charAt(0).toUpperCase() + label.slice(1)}
        description="Modulo em implementacao. Disponivel na fase correspondente do plano."
      />
      <DataCard>
        <p className="text-sm text-[var(--sn-muted)]">
          Este modulo faz parte da navegacao dinamica da Fase 2. O conteudo sera implementado nas
          proximas fases.
        </p>
      </DataCard>
    </>
  )
}
