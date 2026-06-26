'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TablePaginationProps = {
  page: number
  pageCount: number
  total: number
  className?: string
  pageParam?: string
}

export function TablePagination({ page, pageCount, total, className, pageParam = 'page' }: TablePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(pageParam, String(nextPage))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className={cn('flex items-center justify-between gap-3 text-sm text-[var(--sn-muted)]', className)}>
      <span>
        Pagina {page} de {pageCount} — {total} registro(s)
      </span>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
          Anterior
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={page >= pageCount} onClick={() => goToPage(page + 1)}>
          Proxima
        </Button>
      </div>
    </div>
  )
}

