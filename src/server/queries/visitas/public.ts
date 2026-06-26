import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { hashRvToken } from '@/lib/rv/token'
import { isTokenExpired } from '@/lib/rv/status'

export type PublicRvParticipant = { nome: string | null; cargo: string | null }
export type PublicRvNextStep = { acao: string | null; responsavel: string | null; prazo: string | null }

export type PublicRvView = {
  found: boolean
  expired: boolean
  signed: boolean
  visita: {
    dataVisita: string | null
    dealerNome: string | null
    consultorNome: string | null
    modalidadeNome: string | null
    focoNome: string | null
    relato: string | null
    pontosDestaque: string | null
    participantes: PublicRvParticipant[]
    proximosPassos: PublicRvNextStep[]
  } | null
}

type InternalRv = {
  id: string
  data_visita: string | null
  dealer: string | null
  consultor: string | null
  modalidade: string | null
  foco: string | null
  relato: string | null
  pontos_destaque: string | null
  assinado_em: string | null
  data_expiracao_token: string | null
}

async function findRvByToken(rawToken: string): Promise<InternalRv | null> {
  const admin = createAdminClient()
  const hash = hashRvToken(rawToken)
  const { data, error } = await admin
    .from('rv')
    .select('id, data_visita, dealer, consultor, modalidade, foco, relato, pontos_destaque, assinado_em, data_expiracao_token')
    .eq('token_ciencia', hash)
    .maybeSingle()
  if (error) throw error
  return (data as InternalRv | null) ?? null
}

export async function getRvSignatureStatus(rawToken: string): Promise<{ found: boolean; signed: boolean; expired: boolean }> {
  const rv = await findRvByToken(rawToken)
  if (!rv) return { found: false, signed: false, expired: true }
  const signed = Boolean(rv.assinado_em)
  return { found: true, signed, expired: !signed && isTokenExpired(rv.data_expiracao_token) }
}

export async function getPublicRvByToken(rawToken: string): Promise<PublicRvView> {
  const rv = await findRvByToken(rawToken)
  if (!rv) return { found: false, expired: true, signed: false, visita: null }

  const signed = Boolean(rv.assinado_em)
  const expired = !signed && isTokenExpired(rv.data_expiracao_token)

  // Nao expor dados completos de link expirado e nao assinado.
  if (expired) return { found: true, expired: true, signed: false, visita: null }

  const admin = createAdminClient()
  const [dealer, consultor, modalidade, foco, participantes, passos] = await Promise.all([
    rv.dealer ? admin.from('concessionaria').select('nome').eq('id', rv.dealer).maybeSingle() : Promise.resolve({ data: null }),
    rv.consultor ? admin.from('profiles').select('nome').eq('id', rv.consultor).maybeSingle() : Promise.resolve({ data: null }),
    rv.modalidade ? admin.from('rv_modalidade').select('nome').eq('id', rv.modalidade).maybeSingle() : Promise.resolve({ data: null }),
    rv.foco ? admin.from('rv_foco').select('nome').eq('id', rv.foco).maybeSingle() : Promise.resolve({ data: null }),
    admin.from('rv_participante').select('nome, cargo, ordem').eq('rv', rv.id).order('ordem', { ascending: true, nullsFirst: false }),
    admin.from('rv_proximo_passo').select('acao, responsavel, prazo, ordem').eq('rv', rv.id).order('ordem', { ascending: true, nullsFirst: false }),
  ])

  return {
    found: true,
    expired: false,
    signed,
    visita: {
      dataVisita: rv.data_visita,
      dealerNome: (dealer.data as { nome?: string } | null)?.nome ?? null,
      consultorNome: (consultor.data as { nome?: string } | null)?.nome ?? null,
      modalidadeNome: (modalidade.data as { nome?: string } | null)?.nome ?? null,
      focoNome: (foco.data as { nome?: string } | null)?.nome ?? null,
      relato: rv.relato,
      pontosDestaque: rv.pontos_destaque,
      participantes: ((participantes.data as { nome: string | null; cargo: string | null }[] | null) ?? []).map((p) => ({ nome: p.nome, cargo: p.cargo })),
      proximosPassos: ((passos.data as { acao: string | null; responsavel: string | null; prazo: string | null }[] | null) ?? []).map((p) => ({ acao: p.acao, responsavel: p.responsavel, prazo: p.prazo })),
    },
  }
}
