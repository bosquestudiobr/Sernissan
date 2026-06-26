import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()
const optionalText = z.string().trim().max(2000).nullable().optional()

export const CompetencyFiltersSchema = z.object({
  tab: z.enum(['mapas', 'habitos']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  areaId: z.string().uuid().optional(),
  funcaoId: z.string().uuid().optional(),
  concessionariaId: z.string().uuid().optional(),
  sort: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
})

export const CompetencyMapCreateSchema = z.object({
  versao: z.string().trim().min(1, 'Versao obrigatoria').max(100),
  entrega: optionalText,
  para_que: optionalText,
  funcao_mapa: optionalUuid,
  data: z.string().trim().optional().nullable(),
})

export const CompetencyMapUpdateSchema = CompetencyMapCreateSchema.extend({ id: uuid })

export const CompetencyHabitCreateSchema = z.object({
  pergunta: z.string().trim().min(1, 'Pergunta obrigatoria').max(1000),
  descricao: optionalText,
  mv: optionalText,
  area: z.string().trim().max(200).nullable().optional(),
  momento_de_verdade: optionalText,
  peso: z.coerce.number().nullable().optional(),
  trilha: z.coerce.number().nullable().optional(),
  essencial: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on')
    .or(z.boolean().optional()),
})

export const CompetencyHabitUpdateSchema = CompetencyHabitCreateSchema.extend({ id: uuid })

export const CompetencyMapHabitsSchema = z.object({
  id: uuid,
  habitoIds: z.array(uuid).default([]),
})

export const DeleteCompetencySchema = z.object({ id: uuid })
