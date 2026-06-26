import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()

export const AgendaFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(['pendente', 'concluido', 'cancelado', 'atrasado']).optional(),
  concessionariaId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  view: z.enum(['list', 'calendar']).default('list'),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
})

export const AgendaDateRangeSchema = z
  .object({
    data_inicio: z.string().trim().min(1, 'Data inicio obrigatoria'),
    data_fim: z.string().trim().nullable().optional(),
    dia_todo: z
      .string()
      .optional()
      .transform((v) => v === 'true' || v === 'on')
      .or(z.boolean().optional()),
  })
  .refine(
    (data) => {
      if (!data.data_fim) return true
      const start = new Date(data.data_inicio)
      const end = new Date(data.data_fim)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return true
      return end >= start
    },
    { message: 'Data final nao pode ser anterior a data inicial', path: ['data_fim'] },
  )

export const AgendaItemCreateSchema = AgendaDateRangeSchema.and(
  z.object({
    titulo: z.string().trim().min(1, 'Titulo obrigatorio').max(300),
    concessionaria: uuid,
    user: optionalUuid,
    gerente: optionalUuid,
    placar: optionalUuid,
    participantIds: z.array(uuid).optional(),
    convidadoIds: z.array(uuid).optional(),
  }),
)

export const AgendaItemUpdateSchema = AgendaItemCreateSchema.and(z.object({ id: uuid }))

export const AgendaStatusUpdateSchema = z.object({ id: uuid })

export const DeleteAgendaItemSchema = z.object({ id: uuid })

export const AgendaParticipantsSchema = z.object({
  agendamentoId: uuid,
  userIds: z.array(uuid).default([]),
})
