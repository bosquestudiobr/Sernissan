import { z } from 'zod'

const uuid = z.string().uuid()

export const REGISTRATION_TIPO = 'cadastro'
export const INCLUSION_TIPO = 'inclusao'

export const SolicitacoesFiltersSchema = z.object({
  pageCad: z.coerce.number().int().min(1).default(1),
  pageInc: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(['pendente', 'aprovada', 'rejeitada']).optional(),
  tipo: z.string().trim().optional(),
  concessionariaId: z.string().uuid().optional(),
})

export const ReviewRequestSchema = z.object({ id: uuid })

export const ApproveRegistrationRequestSchema = z.object({ id: uuid })
export const RejectRegistrationRequestSchema = z.object({
  id: uuid,
  motivo: z.string().trim().max(500).optional(),
})

export const ApproveInclusionRequestSchema = z.object({ id: uuid })
export const RejectInclusionRequestSchema = z.object({
  id: uuid,
  motivo: z.string().trim().max(500).optional(),
})
