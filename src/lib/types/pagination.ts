export type PaginatedResult<T> = {
  data: T[]
  page: number
  pageSize: number
  total: number
  pageCount: number
}

export type ListParams = {
  page: number
  pageSize: number
  search?: string
  sort?: string
  sortDir: 'asc' | 'desc'
  filters: Record<string, string>
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
