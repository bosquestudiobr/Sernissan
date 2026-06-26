import { expect, test } from '@playwright/test'

test('pagina de entrar exibe formulario', async ({ page }) => {
  await page.goto('/entrar')
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  await expect(page.getByLabel('E-mail')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
})

test('rota protegida redireciona para entrar', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/entrar/)
})
