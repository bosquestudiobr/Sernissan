import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()
const optionalText = z.string().trim().max(500).nullable().optional()

export const IndicatorLibrarySchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  sigla: z.string().trim().min(1, 'Sigla obrigatoria').max(50),
  api_id: optionalText,
  ordem: z.coerce.number().nullable().optional(),
  pontos: z.coerce.number().nullable().optional(),
  meta: z.coerce.number().nullable().optional(),
  unidade: optionalText,
  importancia: optionalText,
  empresa: optionalUuid,
  ativo: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on')
    .or(z.boolean().optional()),
})

export const IndicatorLibraryUpdateSchema = IndicatorLibrarySchema.extend({ id: uuid })

export const IndicatorRelationshipsSchema = z.object({
  id: uuid,
  areaIds: z.array(uuid).default([]),
  funcaoIds: z.array(uuid).default([]),
})

export const IndicatorFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  areaId: z.string().uuid().optional(),
  funcaoId: z.string().uuid().optional(),
  ativo: z.enum(['true', 'false']).optional(),
  sort: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
})

export const DeleteIndicatorSchema = z.object({ id: uuid })

export const ToggleIndicatorActiveSchema = z.object({
  id: uuid,
  ativo: z.boolean(),
})
