import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('placeholder', () => {
  it('vitest configurado', () => {
    render(<span>SerNissan</span>)
    expect(screen.getByText('SerNissan')).toBeInTheDocument()
  })
})
