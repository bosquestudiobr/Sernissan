import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()

export const ReuniaoResultadosFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(['rascunho', 'em_andamento', 'finalizada']).optional(),
  concessionariaId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
})

export const ReuniaoResultadoCreateSchema = z.object({
  data: z.string().trim().min(1, 'Data obrigatoria'),
  id_2: z.coerce.number().int().positive().optional(),
})

export const ReuniaoResultadoUpdateSchema = ReuniaoResultadoCreateSchema.extend({ id: uuid })

export const DeleteReuniaoResultadoSchema = z.object({ id: uuid })

export const ReuniaoFinalizeSchema = z.object({ id: uuid })

export const ReuniaoReopenSchema = z.object({ id: uuid })

export const ReuniaoAgendaItemSchema = z.object({
  reuniaoId: uuid,
  indicadorId: uuid,
})

export const RemoveReuniaoAgendaItemSchema = z.object({
  reuniaoId: uuid,
  indicadorId: uuid,
})

export const ReuniaoNextStepSchema = z.object({
  id: z.string().uuid().optional(),
  reuniaoId: uuid,
  descricao: z.string().trim().min(1, 'Descricao obrigatoria').max(500),
  data: z.string().trim().nullable().optional(),
  responsavel: z.string().trim().max(200).nullable().optional(),
  indicadorId: optionalUuid,
  grupoId: optionalUuid,
  completa: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on')
    .or(z.boolean().optional()),
})

export const RemoveReuniaoNextStepSchema = z.object({ id: uuid })
