import { describe, expect, it } from 'vitest'

import { fixUtf8Mojibake } from '@/lib/text/encoding'

describe('fixUtf8Mojibake', () => {
  it('corrige labels do menu', () => {
    const areas = Buffer.from('Áreas e funções', 'utf8').toString('latin1')
    expect(fixUtf8Mojibake('RelatÃ³rios')).toBe('Relatórios')
    expect(fixUtf8Mojibake('CalibraÃ§Ã£o')).toBe('Calibração')
    expect(fixUtf8Mojibake('UsuÃ¡rios')).toBe('Usuários')
    expect(fixUtf8Mojibake(areas)).toBe('Áreas e funções')
  })

  it('nao altera texto ja correto', () => {
    expect(fixUtf8Mojibake('Relatórios')).toBe('Relatórios')
    expect(fixUtf8Mojibake('Agenda')).toBe('Agenda')
  })
})
