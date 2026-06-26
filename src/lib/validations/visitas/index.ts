import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()
const optionalText = z.string().trim().max(4000).nullable().optional()

export const VisitasFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(['rascunho', 'enviada', 'assinada', 'expirada']).optional(),
  concessionariaId: z.string().uuid().optional(),
  consultorId: z.string().uuid().optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
})

export const VisitaCreateSchema = z.object({
  data_visita: z.string().trim().min(1, 'Data obrigatoria'),
  dealer: uuid,
  consultor: optionalUuid,
  modalidade: optionalUuid,
  foco: optionalUuid,
  relato: optionalText,
  pontos_destaque: optionalText,
  avaliacao_consultor: optionalText,
})

export const VisitaUpdateSchema = VisitaCreateSchema.extend({ id: uuid })

export const DeleteVisitaSchema = z.object({ id: uuid })

export const ParticipanteSchema = z.object({
  id: z.string().uuid().optional(),
  rv: uuid,
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  cargo: z.string().trim().max(200).nullable().optional(),
  ordem: z.coerce.number().nullable().optional(),
})

export const RemoveChildSchema = z.object({ id: uuid })

export const ProximoPassoSchema = z.object({
  id: z.string().uuid().optional(),
  rv: uuid,
  acao: z.string().trim().min(1, 'Acao obrigatoria').max(500),
  responsavel: z.string().trim().max(200).nullable().optional(),
  prazo: z.string().trim().nullable().optional(),
  ordem: z.coerce.number().nullable().optional(),
  concluido_bool: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on')
    .or(z.boolean().optional()),
})

export const GeneratePublicLinkSchema = z.object({
  id: uuid,
  diasValidade: z.coerce.number().int().min(1).max(90).default(7),
})

export const PublicRvTokenSchema = z.object({
  token: z.string().trim().min(20).max(300),
})

export const PublicRvSignatureSchema = z.object({
  token: z.string().trim().min(20).max(300),
  assinanteNome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  assinanteCargo: z.string().trim().max(200).optional(),
  comentario: z.string().trim().max(1000).optional(),
})

export const RvAttachmentSchema = z.object({
  rv: uuid,
  nome: z.string().trim().min(1).max(255),
  tipo: z.string().trim().max(100).nullable().optional(),
  tamanho_mb: z.coerce.number().nullable().optional(),
})

export const DeleteRvAttachmentSchema = z.object({ id: uuid })
