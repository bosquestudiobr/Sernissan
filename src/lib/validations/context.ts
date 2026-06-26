import { z } from 'zod'

const nullableUuid = z.string().uuid().nullable()

export const OrganizationalContextSchema = z.object({
  empresaId: nullableUuid,
  paisId: nullableUuid,
  divisaoId: nullableUuid,
  setorId: nullableUuid,
  grupoId: nullableUuid,
  concessionariaId: nullableUuid,
})

export const PermissionScopeSchema = z.object({
  empresaId: z.string().uuid().optional(),
  paisId: z.string().uuid().optional(),
  divisaoId: z.string().uuid().optional(),
  setorId: z.string().uuid().optional(),
  grupoId: z.string().uuid().optional(),
  concessionariaId: z.string().uuid().optional(),
})

export type OrganizationalContextInput = z.infer<typeof OrganizationalContextSchema>
export type PermissionScopeInput = z.infer<typeof PermissionScopeSchema>
