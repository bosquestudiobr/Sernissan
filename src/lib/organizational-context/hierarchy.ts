import type { ContextOption, OrganizationalContextOptions } from '@/lib/types/user'
import type { OrganizationalContextInput } from '@/lib/validations/context'

export type HierarchyFields = OrganizationalContextInput

export function findOption<T extends ContextOption>(options: T[], id: string | null | undefined) {
  if (!id) return undefined
  return options.find((o) => o.id === id)
}

export function resolveChainFromSetor(
  setorId: string | null,
  options: OrganizationalContextOptions,
): Pick<HierarchyFields, 'empresaId' | 'paisId' | 'divisaoId' | 'setorId'> {
  const setor = findOption(options.setores, setorId)
  const divisao = findOption(options.divisoes, setor?.divisaoId ?? null)
  const pais = findOption(options.paises, divisao?.paisId ?? null)
  const empresa = findOption(options.empresas, divisao?.empresaId ?? pais?.empresaId ?? setor?.empresaId ?? null)
  return {
    empresaId: empresa?.id ?? divisao?.empresaId ?? pais?.empresaId ?? setor?.empresaId ?? null,
    paisId: pais?.id ?? divisao?.paisId ?? null,
    divisaoId: divisao?.id ?? setor?.divisaoId ?? null,
    setorId: setor?.id ?? setorId,
  }
}

export function resolveChainFromGrupo(
  grupoId: string | null,
  options: OrganizationalContextOptions,
): Pick<HierarchyFields, 'empresaId' | 'paisId' | 'divisaoId' | 'setorId' | 'grupoId'> {
  const grupo = findOption(options.grupos, grupoId)
  const fromSetor = resolveChainFromSetor(grupo?.setorId ?? null, options)
  return { ...fromSetor, grupoId: grupo?.id ?? grupoId }
}

export function resolveChainFromConcessionaria(
  concessionariaId: string | null,
  options: OrganizationalContextOptions,
): HierarchyFields {
  const conc = findOption(options.concessionarias, concessionariaId)
  const fromGrupo = resolveChainFromGrupo(conc?.grupoId ?? null, options)
  return { ...fromGrupo, concessionariaId: conc?.id ?? concessionariaId }
}

export function enrichOrganizationalContext(
  input: HierarchyFields,
  options: OrganizationalContextOptions,
): HierarchyFields {
  if (input.concessionariaId) return resolveChainFromConcessionaria(input.concessionariaId, options)
  if (input.grupoId) return { ...resolveChainFromGrupo(input.grupoId, options), concessionariaId: null }
  if (input.setorId) return { ...resolveChainFromSetor(input.setorId, options), grupoId: null, concessionariaId: null }
  if (input.divisaoId) {
    const divisao = findOption(options.divisoes, input.divisaoId)
    const pais = findOption(options.paises, divisao?.paisId ?? null)
    const empresa = findOption(options.empresas, divisao?.empresaId ?? pais?.empresaId ?? null)
    return {
      empresaId: empresa?.id ?? divisao?.empresaId ?? pais?.empresaId ?? null,
      paisId: pais?.id ?? divisao?.paisId ?? null,
      divisaoId: divisao?.id ?? input.divisaoId,
      setorId: null,
      grupoId: null,
      concessionariaId: null,
    }
  }
  return input
}

export function filterDivisoes(options: OrganizationalContextOptions, paisId: string | null) {
  if (!paisId) return options.divisoes
  return options.divisoes.filter((d) => !d.paisId || d.paisId === paisId)
}

export function filterSetores(
  options: OrganizationalContextOptions,
  divisaoId: string | null,
  empresaId: string | null,
) {
  return options.setores.filter((s) => {
    if (divisaoId && s.divisaoId && s.divisaoId !== divisaoId) return false
    if (empresaId && s.empresaId && s.empresaId !== empresaId) return false
    return true
  })
}

export function filterGrupos(options: OrganizationalContextOptions, setorId: string | null) {
  if (!setorId) return options.grupos
  return options.grupos.filter((g) => !g.setorId || g.setorId === setorId)
}

export function filterConcessionarias(options: OrganizationalContextOptions, grupoId: string | null) {
  if (!grupoId) return options.concessionarias
  return options.concessionarias.filter((c) => !c.grupoId || c.grupoId === grupoId)
}

export function filterPaises(options: OrganizationalContextOptions, empresaId: string | null) {
  if (!empresaId) return options.paises
  return options.paises.filter((p) => !p.empresaId || p.empresaId === empresaId)
}

export function formatContextSummary(context: {
  grupo: string
  concessionaria: string
  setor?: string
}): string {
  const parts = [context.grupo, context.concessionaria].filter((p) => p && p !== 'Nao definido')
  if (parts.length === 0 && context.setor && context.setor !== 'Nao definido') return context.setor
  return parts.join(' · ') || 'Selecionar hierarquia'
}

export function isHierarchyConsistent(input: HierarchyFields, options: OrganizationalContextOptions): boolean {
  const enriched = enrichOrganizationalContext(input, options)
  if (input.empresaId && enriched.empresaId && input.empresaId !== enriched.empresaId) return false
  if (input.paisId && enriched.paisId && input.paisId !== enriched.paisId) return false
  if (input.divisaoId && enriched.divisaoId && input.divisaoId !== enriched.divisaoId) return false
  if (input.setorId && enriched.setorId && input.setorId !== enriched.setorId) return false
  if (input.grupoId && enriched.grupoId && input.grupoId !== enriched.grupoId) return false
  if (input.concessionariaId && enriched.concessionariaId && input.concessionariaId !== enriched.concessionariaId) {
    return false
  }
  return true
}
