import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()
const optionalText = z.string().trim().max(200).nullable().optional()

export const PlacarFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  concessionariaId: z.string().uuid().optional(),
  finalizado: z.enum(['true', 'false']).optional(),
  opcaoOrigem: z.string().trim().optional(),
  opcaoAcumulado: z.string().trim().optional(),
  sort: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
})

export const PlacarCreateSchema = z.object({
  data: z.string().trim().min(1, 'Data obrigatoria'),
  concessionaria: uuid,
  empresa: optionalUuid,
  opcao_origem: optionalText,
  opcao_acumulado: optionalText,
  finalizado: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on')
    .or(z.boolean().optional()),
})

export const PlacarUpdateSchema = PlacarCreateSchema.extend({
  id: uuid,
})

export const PlacarIndicatorsSchema = z.object({
  id: uuid,
  indicadorIds: z.array(uuid).default([]),
})

export const DeletePlacarSchema = z.object({ id: uuid })

export const RecalculatePlacarSchema = z.object({ id: uuid })

export const FinalizePlacarSchema = z.object({ id: uuid })

export const ReopenPlacarSchema = z.object({ id: uuid })

export const RankingParamsSchema = z.object({
  placarId: uuid,
  escopo: z.enum(['colaborador', 'concessionaria']).optional(),
})

export const PlacarCalculationInputSchema = z.object({
  meta: z.coerce.number().nullable(),
  valor: z.coerce.number().nullable(),
  peso: z.coerce.number().nullable(),
})
