import { z } from 'zod'

const uuid = z.string().uuid()
const optionalUuid = z.string().uuid().nullable().optional()
const optionalText = z.string().trim().max(500).nullable().optional()

export const EmpresaSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  email: z.string().trim().email('E-mail invalido').nullable().optional().or(z.literal('')),
  fone: optionalText,
  cor_principal: optionalText,
  cor_secundaria: optionalText,
})

export const PaisSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
  id_2: optionalText,
})

export const DivisaoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
  pais: optionalUuid,
  id_2: optionalText,
})

export const SetorSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
  divisao: optionalUuid,
  id_2: optionalText,
})

export const GrupoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
  setor: optionalUuid,
  id_2: optionalText,
  grupo_ndp: optionalUuid,
})

export const ConcessionariaSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  bir: optionalText,
  uf: z.string().trim().max(2).nullable().optional(),
  municipio: optionalText,
  codigo_ndp: optionalText,
  empresa: optionalUuid,
  pais: optionalUuid,
  divisao: optionalUuid,
  setor: optionalUuid,
  grupo: optionalUuid,
  dominios: z.string().trim().nullable().optional(),
})

export const EmpresaUpdateSchema = EmpresaSchema.extend({ id: uuid })
export const PaisUpdateSchema = PaisSchema.extend({ id: uuid })
export const DivisaoUpdateSchema = DivisaoSchema.extend({ id: uuid })
export const SetorUpdateSchema = SetorSchema.extend({ id: uuid })
export const GrupoUpdateSchema = GrupoSchema.extend({ id: uuid })
export const ConcessionariaUpdateSchema = ConcessionariaSchema.extend({ id: uuid })

export const DeleteByIdSchema = z.object({ id: uuid })
export const AreaSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
})

export const FuncaoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  empresa: optionalUuid,
  area: optionalUuid,
  chave: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on'),
  lideranca: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === 'on'),
})

export const AreaUpdateSchema = AreaSchema.extend({ id: uuid })
export const FuncaoUpdateSchema = FuncaoSchema.extend({ id: uuid })

export const ProfileAdminUpdateSchema = z.object({
  id: uuid,
  nome: z.string().trim().min(1, 'Nome obrigatorio').max(200),
  perfil: z.string().trim().min(1, 'Perfil obrigatorio'),
  empresa: optionalUuid,
  setor: optionalUuid,
  divisao: optionalUuid,
  grupo: optionalUuid,
  concessionaria: optionalUuid,
  area: optionalUuid,
  funcao: optionalUuid,
})

export const ProfileRelationshipsSchema = z.object({
  id: uuid,
  grupoIds: z.array(uuid).default([]),
  concessionariaIds: z.array(uuid).default([]),
  areaIds: z.array(uuid).default([]),
  funcaoId: optionalUuid,
})

export const SyncRelationshipListSchema = z.object({
  parentId: uuid,
  childIds: z.array(uuid),
})
