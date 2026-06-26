'use server'

import { revalidatePath } from 'next/cache'

import { assertCan, requireCurrentUser } from '@/lib/permissions'
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

export async function setOrganizationalContextAction(
  _prevState: SetContextActionState,
  formData: FormData,
): Promise<SetContextActionState> {
  const user = await requireCurrentUser()
  const scopes = await getUserScopes(user.id)

  const parsed = OrganizationalContextSchema.safeParse({
    setorId: readUuidField(formData, 'setorId'),
    grupoId: readUuidField(formData, 'grupoId'),
    concessionariaId: readUuidField(formData, 'concessionariaId'),
  })

  if (!parsed.success) {
    return { ok: false, message: 'Contexto organizacional invalido.' }
  }

  try {
    assertCan(user, 'context:set', scopes, parsed.data)
  } catch {
    return { ok: false, message: 'Voce nao tem permissao para este contexto.' }
  }

  const options = await getOrganizationalContextOptions(user.id)

  if (parsed.data.setorId && !options.setores.some((s) => s.id === parsed.data.setorId)) {
    return { ok: false, message: 'Setor nao permitido.' }
  }

  if (parsed.data.grupoId) {
    const grupo = options.grupos.find((g) => g.id === parsed.data.grupoId)
    if (!grupo) return { ok: false, message: 'Grupo nao permitido.' }
    if (parsed.data.setorId && grupo.setorId && grupo.setorId !== parsed.data.setorId) {
      return { ok: false, message: 'Grupo nao pertence ao setor selecionado.' }
    }
  }

  if (parsed.data.concessionariaId) {
    const conc = options.concessionarias.find((c) => c.id === parsed.data.concessionariaId)
    if (!conc) return { ok: false, message: 'Concessionaria nao permitida.' }
    if (parsed.data.grupoId && conc.grupoId && conc.grupoId !== parsed.data.grupoId) {
      return { ok: false, message: 'Concessionaria nao pertence ao grupo selecionado.' }
    }
  }

  await writeOrganizationalContextCookie(parsed.data)
  revalidatePath('/', 'layout')

  return { ok: true }
}
