'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { createAdminClient } from '@/lib/supabase/admin'
import { hashRvToken, signatureIntegrityHash } from '@/lib/rv/token'
import { isTokenExpired } from '@/lib/rv/status'
import { PublicRvSignatureSchema } from '@/lib/validations/visitas'

export type PublicSignActionState = {
  ok: boolean
  message?: string
  alreadySigned?: boolean
  expired?: boolean
  fieldErrors?: Record<string, string[] | undefined>
}

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors
}

async function getRequestMeta() {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0]?.trim() || h.get('x-real-ip') || null
  const userAgent = h.get('user-agent') || null
  return { ip, userAgent }
}

export async function signPublicRvAction(_: PublicSignActionState, formData: FormData): Promise<PublicSignActionState> {
  try {
    const parsed = PublicRvSignatureSchema.safeParse({
      token: formData.get('token'),
      assinanteNome: formData.get('assinanteNome'),
      assinanteCargo: formData.get('assinanteCargo') || undefined,
      comentario: formData.get('comentario') || undefined,
    })
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) }

    const admin = createAdminClient()
    const tokenHash = hashRvToken(parsed.data.token)
    const { data: rv, error } = await admin
      .from('rv')
      .select('id, dealer, assinado_em, data_expiracao_token')
      .eq('token_ciencia', tokenHash)
      .maybeSingle()
    if (error) return { ok: false, message: 'Erro ao validar o link.' }
    if (!rv) return { ok: false, message: 'Link invalido.' }

    if (rv.assinado_em) {
      return { ok: false, alreadySigned: true, message: 'Esta visita ja foi assinada.' }
    }
    if (isTokenExpired(rv.data_expiracao_token)) {
      await admin.from('rv_auditoria').insert({
        rv: rv.id,
        acao: 'assinatura_expirada',
        descricao: 'Tentativa de assinatura com link expirado',
        data: new Date().toISOString(),
      })
      return { ok: false, expired: true, message: 'Link expirado.' }
    }

    const { ip, userAgent } = await getRequestMeta()
    const nowIso = new Date().toISOString()
    const integrity = signatureIntegrityHash({ token: tokenHash, nome: parsed.data.assinanteNome, dataHoraUtc: nowIso })

    const { error: signError } = await admin.from('rv_assinatura').insert({
      rv: rv.id,
      assinante_nome: parsed.data.assinanteNome,
      assinante_cargo: parsed.data.assinanteCargo ?? null,
      comentario: parsed.data.comentario ?? null,
      ip,
      user_agent: userAgent,
      hash_sha256: integrity,
      token_usado: tokenHash,
      data_hora_utc: nowIso,
      dealer: rv.dealer,
    })
    if (signError) return { ok: false, message: 'Nao foi possivel registrar a assinatura.' }

    const { error: rvError } = await admin
      .from('rv')
      .update({
        assinado_em: nowIso,
        ip_assinatura: ip,
        user_agent_assinatura: userAgent,
        hash_assinatura: integrity,
        bloqueado_edicao: true,
        comentario_ciencia: parsed.data.comentario ?? null,
        updated_at: nowIso,
      })
      .eq('id', rv.id)
      .is('assinado_em', null)
    if (rvError) return { ok: false, message: 'Nao foi possivel concluir a assinatura.' }

    await admin.from('rv_auditoria').insert({
      rv: rv.id,
      acao: 'assinatura',
      descricao: `Assinado por ${parsed.data.assinanteNome}`,
      data: nowIso,
    })

    revalidatePath(`/rv-publico/${parsed.data.token}`)
    return { ok: true, message: 'Assinatura registrada com sucesso.' }
  } catch {
    return { ok: false, message: 'Erro ao processar assinatura.' }
  }
}
