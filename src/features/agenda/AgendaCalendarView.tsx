'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { eventOccursOnDay } from '@/lib/agenda/status'
import { AgendaStatusBadge } from '@/features/agenda/AgendaStatusBadge'
import type { AgendaCalendarItem } from '@/server/queries/agenda'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

type AgendaCalendarViewProps = {
  month: string
  items: AgendaCalendarItem[]
}

function parseMonth(month: string) {
  const [y, m] = month.split('-').map(Number)
  return { year: y, monthIndex: m - 1 }
}

function formatMonthLabel(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function AgendaCalendarView({ month, items }: AgendaCalendarViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { year, monthIndex } = parseMonth(month)
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const startOffset = firstDay.getDay()

  function changeMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1)
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', 'calendar')
    params.set('month', next)
    router.push(`?${params.toString()}`)
  }

  const cells: Array<{ day: number | null; date: Date | null }> = []
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, date: null })
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, date: new Date(year, monthIndex, day) })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-sm font-semibold capitalize text-[var(--sn-text)]">{formatMonthLabel(year, monthIndex)}</p>
        <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => changeMonth(1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-1 py-1 text-center text-xs font-medium text-[var(--sn-muted)]">{d}</div>
        ))}
        {cells.map((cell, idx) => {
          if (!cell.date || cell.day == null) {
            return <div key={`empty-${idx}`} className="min-h-[88px] rounded border border-transparent bg-[var(--sn-field)]/30" />
          }
          const dayItems = items.filter((item) => eventOccursOnDay(item.dataInicio, item.dataFim, cell.date!))
          const isToday = new Date().toDateString() === cell.date.toDateString()
          return (
            <div
              key={cell.day}
              className={`min-h-[88px] rounded border p-1 ${isToday ? 'border-[var(--sn-black)] bg-white' : 'border-[var(--sn-border)] bg-white'}`}
            >
              <p className="text-xs font-medium text-[var(--sn-text)]">{cell.day}</p>
              <ul className="mt-1 space-y-0.5">
                {dayItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="truncate text-[10px] leading-tight text-[var(--sn-text)]" title={item.titulo ?? ''}>
                    {item.titulo ?? '—'}
                  </li>
                ))}
                {dayItems.length > 3 ? (
                  <li className="text-[10px] text-[var(--sn-muted)]">+{dayItems.length - 3}</li>
                ) : null}
              </ul>
            </div>
          )
        })}
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-[var(--sn-border)] rounded-md border border-[var(--sn-border)] bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
              <span>{item.titulo ?? '—'}</span>
              <AgendaStatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
