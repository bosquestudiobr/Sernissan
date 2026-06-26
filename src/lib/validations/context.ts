import { z } from 'zod'

export const OrganizationalContextSchema = z.object({
  setorId: z.string().uuid().nullable(),
  grupoId: z.string().uuid().nullable(),
  concessionariaId: z.string().uuid().nullable(),
})

export const PermissionScopeSchema = z.object({
  setorId: z.string().uuid().optional(),
  grupoId: z.string().uuid().optional(),
  concessionariaId: z.string().uuid().optional(),
})

export type OrganizationalContextInput = z.infer<typeof OrganizationalContextSchema>
export type PermissionScopeInput = z.infer<typeof PermissionScopeSchema>
