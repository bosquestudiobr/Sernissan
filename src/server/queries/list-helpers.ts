import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, type ListParams } from '@/lib/types/pagination'

export function parseListParams(
  searchParams: Record<string, string | string[] | undefined>,
): ListParams {
  const page = Math.max(1, parseInt(getParam(searchParams, 'page') ?? '1', 10) || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(getParam(searchParams, 'pageSize') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  )
  const search = getParam(searchParams, 'search')?.trim() || undefined
  const sort = getParam(searchParams, 'sort')?.trim() || undefined
  const sortDir = getParam(searchParams, 'sortDir') === 'desc' ? 'desc' : 'asc'
  const filters: Record<string, string> = {}
  for (const [key] of Object.entries(searchParams)) {
    if (['page', 'pageSize', 'search', 'sort', 'sortDir'].includes(key)) continue
    const v = getParam(searchParams, key)
    if (v) filters[key] = v
  }
  return { page, pageSize, search, sort, sortDir, filters }
}

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key]
  if (Array.isArray(value)) return value[0]
  return value
}

export function resolveSortColumn(
  sort: string | undefined,
  allowed: readonly string[],
  fallback: string,
): string {
  if (sort && allowed.includes(sort)) return sort
  return fallback
}

export function rangeFromPage(page: number, pageSize: number) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { from, to }
}

export function buildPageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize))
}

