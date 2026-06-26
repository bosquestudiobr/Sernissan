import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppFooter } from '@/components/app-shell/AppFooter'
import { PageTitleActions } from '@/components/shared/PageTitleActions'

describe('layout smoke', () => {
  it('renderiza PageTitleActions', () => {
    render(<PageTitleActions title="SerNissan" description="Teste" />)
    expect(screen.getByRole('heading', { name: 'SerNissan' })).toBeInTheDocument()
  })

  it('renderiza AppFooter com copyright', () => {
    render(<AppFooter />)
    expect(screen.getByText(/SERNISSAN - INDIVIDUANDO/i)).toBeInTheDocument()
  })
})
