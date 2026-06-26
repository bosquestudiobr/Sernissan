export type CurrentUserView = {
  id: string
  email: string
  nome: string
  perfil: string
  avatarUrl: string | null
  ativo: boolean | null
  aprovado: boolean | null
}

export type OrganizationalContextView = {
  setor: string
  grupo: string
  concessionaria: string
}

export type AppModule = {
  id: string
  href: string
  label: string
  icon: string
}
