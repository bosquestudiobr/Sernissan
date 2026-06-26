import { describe, expect, it } from 'vitest'

import { resolveModuleHref } from '@/lib/navigation'

describe('/habitos route', () => {
  it('resolves habitos module href', () => {
    expect(resolveModuleHref('habitos')).toBe('/habitos')
  })
})
