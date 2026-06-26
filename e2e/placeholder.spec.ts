import { expect, test } from '@playwright/test'

test('pagina inicial exibe titulo SerNissan', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Fase 0B/i })).toBeVisible()
})
