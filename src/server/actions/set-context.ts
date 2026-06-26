'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireCurrentUser } from '@/lib/permissions'
import { enrichOrganizationalContext, isHierarchyConsistent } from '@/lib/organizational-context/hierarchy'
import { OrganizationalContextSchema } from '@/lib/validations/context'
import {
  getOrganizationalContextOptions,
  writeOrganizationalContextCookie,
} from '@/server/queries/organizational-context'
import { getUserScopes } from '@/server/queries/scopes'

export type SetContextActionState = {
  ok: boolean
  message?: string
}

function readUuidField(formData: FormData, key: string): string | null {
  const value = formData.get(key)?.toString().trim()
  return value ? value : null
}

function readContextFromForm(formData: FormData) {
  return {
    empresaId: readUuidField(formData, 'empresaId'),
    paisId: readUuidField(formData, 'paisId'),
    divisaoId: readUuidField(formData, 'divisaoId'),
    setorId: readUuidField(formData, 'setorId'),
    grupoId: readUuidField(formData, 'grupoId'),
    concessionariaId: readUuidField(formData, 'concessionariaId'),
  }
}

export async function setOrganizationalContextAction(
  _prevState: SetContextActionState,
  formData: FormData,
): Promise<SetContextActionState> {
  const user = await requireCurrentUser()
  const scopes = await getUserScopes(user.id)
  const options = await getOrganizationalContextOptions(user.id)

  const parsed = OrganizationalContextSchema.safeParse(readContextFromForm(formData))
  if (!parsed.success) {
    return { ok: false, message: 'Contexto organizacional invalido.' }
  }

  const enriched = enrichOrganizationalContext(parsed.data, options)

  try {
    assertCan(user, 'context:set', scopes, enriched)
  } catch {
    return { ok: false, message: 'Voce nao tem permissao para este contexto.' }
  }

  if (!isHierarchyConsistent(enriched, options)) {
    return { ok: false, message: 'Hierarquia inconsistente. Revise os niveis selecionados.' }
  }

  if (enriched.empresaId && !options.empresas.some((e) => e.id === enriched.empresaId)) {
    return { ok: false, message: 'Empresa nao permitida.' }
  }
  if (enriched.paisId && !options.paises.some((p) => p.id === enriched.paisId)) {
    return { ok: false, message: 'Pais nao permitido.' }
  }
  if (enriched.divisaoId && !options.divisoes.some((d) => d.id === enriched.divisaoId)) {
    return { ok: false, message: 'Divisao nao permitida.' }
  }
  if (enriched.setorId && !options.setores.some((s) => s.id === enriched.setorId)) {
    return { ok: false, message: 'Setor nao permitido.' }
  }
  if (enriched.grupoId && !options.grupos.some((g) => g.id === enriched.grupoId)) {
    return { ok: false, message: 'Grupo nao permitido.' }
  }
  if (enriched.concessionariaId && !options.concessionarias.some((c) => c.id === enriched.concessionariaId)) {
    return { ok: false, message: 'Concessionaria nao permitida.' }
  }

  await writeOrganizationalContextCookie(enriched)
  revalidatePath('/', 'layout')

  return { ok: true }
}
