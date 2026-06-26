import { z } from 'zod'

const uuid = z.string().uuid()
const optionalText = z.string().trim().max(2000).nullable().optional()

export const INDICATOR_REQUEST_TIPO = 'indicador'

export const IndicatorObjectiveFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  areaId: z.string().uuid().optional(),
  funcaoId: z.string().uuid().optional(),
  ativo: z.enum(['true', 'false']).optional(),
  sort: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
})

export const IndicatorObjectiveUpdateSchema = z.object({
  id: uuid,
  meta: z.coerce.number().nullable().optional(),
  pontos: z.coerce.number().nullable().optional(),
  unidade: optionalText,
})

export const ToggleIndicatorObjectiveActiveSchema = z.object({
  id: uuid,
  ativo: z.boolean(),
  concessionariaId: z.string().uuid().optional().nullable(),
})

export const IndicatorRequestSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  sigla: z.string().trim().min(1, 'Sigla obrigatoria').max(50),
  observacao: optionalText,
  concessionariaId: z.string().uuid().optional().nullable(),
  areaIds: z.array(uuid).default([]),
  funcaoIds: z.array(uuid).default([]),
})

export const ReviewIndicatorRequestSchema = z.object({
  id: uuid,
  action: z.enum(['approve', 'reject']),
})
