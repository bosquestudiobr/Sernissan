import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()

export const HabitosFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(['pendente', 'concluido', 'atrasado', 'inativo']).optional(),
  concessionariaId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  funcaoId: z.string().uuid().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
})

export const HabitoDateRangeSchema = z
  .object({
    data_inicio: z.string().trim().nullable().optional(),
    data_fim: z.string().trim().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.data_inicio || !data.data_fim) return true
      const start = new Date(data.data_inicio)
      const end = new Date(data.data_fim)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return true
      return end >= start
    },
    { message: 'Data final nao pode ser anterior a data inicial', path: ['data_fim'] },
  )

export const HabitoCreateSchema = HabitoDateRangeSchema.and(
  z.object({
    titulo: z.string().trim().min(1, 'Titulo obrigatorio').max(300),
    descricao: z.string().trim().max(2000).nullable().optional(),
    colaborador: optionalUuid,
    concessionaria: uuid,
    funcao: optionalUuid,
    area: optionalUuid,
    competenciaHabitoId: optionalUuid,
    agendamentoId: optionalUuid,
    metaExecucoes: z.coerce.number().int().min(0).nullable().optional(),
    execucoesRealizadas: z.coerce.number().int().min(0).optional(),
    ativo: z
      .string()
      .optional()
      .transform((v) => v !== 'false' && v !== 'off')
      .or(z.boolean().optional()),
  }),
)

export const HabitoUpdateSchema = HabitoCreateSchema.and(z.object({ id: uuid }))

export const HabitoStatusUpdateSchema = z.object({ id: uuid })

export const DeleteHabitoSchema = z.object({ id: uuid })

export const HabitoProgressSchema = z.object({
  id: uuid,
  execucoesRealizadas: z.coerce.number().int().min(0),
})
