export type CurrentUserView = {
  id: string
  email: string
  nome: string
  perfil: string
  perfilDbValue: string | null
  perfilLabel: string
  perfilNivel: number
  avatarUrl: string | null
  ativo: boolean | null
  aprovado: boolean | null
  empresaId: string | null
}

export type ContextOption = {
  id: string
  label: string
  empresaId?: string | null
  paisId?: string | null
  divisaoId?: string | null
  setorId?: string | null
  grupoId?: string | null
}

export type OrganizationalContextView = {
  empresaId: string | null
  paisId: string | null
  divisaoId: string | null
  setorId: string | null
  grupoId: string | null
  concessionariaId: string | null
  empresa: string
  pais: string
  divisao: string
  setor: string
  grupo: string
  concessionaria: string
}

export type OrganizationalContextOptions = {
  empresas: ContextOption[]
  paises: ContextOption[]
  divisoes: ContextOption[]
  setores: ContextOption[]
  grupos: ContextOption[]
  concessionarias: ContextOption[]
}

export type UserScopes = {
  setorIds: string[]
  grupoIds: string[]
  concessionariaIds: string[]
  empresaId: string | null
  perfilNivel: number
}

export type AppModule = {
  id: string
  href: string
  label: string
  icon: string
  dbValue: string
  sortOrder?: number
  children?: AppModule[]
}
