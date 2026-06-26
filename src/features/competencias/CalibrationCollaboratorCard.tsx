import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Users, BarChart3, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CalibrationStatusBadge } from '@/features/competencias/CalibrationStatusBadge'
import type { CalibrationProfileView } from '@/server/queries/competencias/calibration'

type CalibrationCollaboratorCardProps = {
  profile: CalibrationProfileView
  hasCalibration: boolean
  lastUpdated: string | null
}

function formatDateTime(value: string | null) {
  if (!value) return 'Nunca'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR')
}

function initials(nome: string | null) {
  if (!nome) return '?'
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function CalibrationCollaboratorCard({ profile, hasCalibration, lastUpdated }: CalibrationCollaboratorCardProps) {
  return (
    <div className="rounded-lg border border-[var(--sn-border)] bg-[var(--sn-card)] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {profile.foto ? (
            <Image
              src={profile.foto}
              alt={profile.nome ?? 'Colaborador'}
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-[var(--sn-field)] text-lg font-semibold text-[var(--sn-muted)]">
              {initials(profile.nome)}
            </div>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--sn-text)]">{profile.nome ?? 'Colaborador'}</h1>
              <CalibrationStatusBadge hasCalibration={hasCalibration} lastUpdated={lastUpdated} />
            </div>
            <p className="text-sm text-[var(--sn-muted)]">{profile.perfilLabel}</p>
            <p className="text-xs text-[var(--sn-muted)]">
              {[profile.areaNome, profile.funcaoNome, profile.concessionariaNome].filter(Boolean).join(' · ') || '—'}
            </p>
            <p className="text-xs text-[var(--sn-muted)]">Ultima atualizacao: {formatDateTime(lastUpdated)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/competencias/calibracao"
            className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]"
          >
            <ArrowLeft className="mr-1 size-4" /> Voltar
          </Link>
          <Link
            href="/competencias/calibracao"
            className="inline-flex h-9 items-center rounded-md border border-[var(--sn-border)] px-3 text-sm hover:bg-[var(--sn-field)]"
          >
            <Users className="mr-1 size-4" /> Colaboradores
          </Link>
          <Button type="button" variant="outline" className="h-9" disabled title="Disponivel em fase futura">
            <BarChart3 className="mr-1 size-4" /> Performance
          </Button>
          <Button type="button" variant="outline" className="h-9" disabled title="Exportacao PDF em fase futura">
            <FileText className="mr-1 size-4" /> PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
