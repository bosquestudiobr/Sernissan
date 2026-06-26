import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'

export type DataTableColumn<T> = {
  key: string
  header: string
  className?: string
  cell: (row: T) => ReactNode
}

type ServerDataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[]
  data: T[]
  rowActions?: (row: T) => ReactNode
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function ServerDataTable<T extends { id: string }>({
  columns,
  data,
  rowActions,
  emptyTitle,
  emptyDescription,
  className,
}: ServerDataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={cn('h-9 px-3 font-semibold text-[var(--sn-text)]', column.className)}>
                {column.header}
              </TableHead>
            ))}
            {rowActions ? <TableHead className="h-9 w-[100px] px-3 text-right">Acoes</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="sn-table-row-hover h-10">
              {columns.map((column) => (
                <TableCell key={column.key} className={cn('px-3 py-2', column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
              {rowActions ? <TableCell className="px-3 py-2 text-right">{rowActions(row)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
