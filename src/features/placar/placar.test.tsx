import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminPageShell } from '@/components/admin/AdminPageShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('placar page smoke', () => {
  it('renderiza shell do placar', () => {
    render(
      <AdminPageShell title="Placar" description="Placares de performance">
        <table>
          <tbody>
            <tr>
              <td>Jun/2026</td>
            </tr>
          </tbody>
        </table>
      </AdminPageShell>,
    )
    expect(screen.getByRole('heading', { name: 'Placar' })).toBeInTheDocument()
    expect(screen.getByText('Jun/2026')).toBeInTheDocument()
  })
})
