import { test, expect } from '@playwright/test';

test.describe('Pagina de inicio', () => {
  test('carga correctamente con titulo y navegacion', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Agricultura Antigua/);
    await expect(page.locator('#nav-logo')).toBeVisible();
    await expect(page.locator('#hero-banner')).toBeVisible();
    await expect(page.locator('#app-footer')).toBeVisible();
  });

  test('la barra de navegacion tiene todos los tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tab-btn-inicio')).toBeVisible();
    await expect(page.locator('#tab-btn-campus')).toBeVisible();
    await expect(page.locator('#tab-btn-biblioteca')).toBeVisible();
    await expect(page.locator('#tab-btn-academia')).toBeVisible();
    await expect(page.locator('#tab-btn-comunidad')).toBeVisible();
    await expect(page.locator('#tab-btn-aiready')).toBeVisible();
    await expect(page.locator('#tab-btn-recursos')).toBeVisible();
    await expect(page.locator('#tab-btn-instituciones')).toBeVisible();
    await expect(page.locator('#tab-btn-perfil')).toBeVisible();
  });

  test('el buscador del hero redirige a biblioteca', async ({ page }) => {
    await page.goto('/');
    await page.fill('#hero-search-input', 'compost');
    await page.click('button[type="submit"]');
    await expect(page.locator('#biblioteca-search-input')).toHaveValue('compost');
  });

  test('las metricas se renderizan', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home-metrics')).toBeVisible();
    const metrics = page.locator('#home-metrics > div');
    await expect(metrics).toHaveCount(4);
  });
});

test.describe('Navegacion entre tabs', () => {
  test('navega a Biblioteca', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-biblioteca');
    await expect(page.locator('#biblioteca-section')).toBeVisible();
  });

  test('navega a Academia', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-academia');
    await expect(page.locator('#academia-landing')).toBeVisible();
  });

  test('navega a Rutas & Campus', async ({ page }) => {
    await page.goto('/');
    await page.click('#tab-btn-campus');
    await expect(page.locator('#campus-section')).toBeVisible();
  });
});
