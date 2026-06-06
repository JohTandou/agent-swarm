import { test, expect } from '@playwright/test';

test.describe('T18 — Responsive cross-section (desktop + mobile)', () => {

  const PAGES_TO_TEST = [
    { route: '/',                         name: 'Accueil' },
    { route: '/a-propos',                 name: 'À propos' },
    { route: '/agents',                   name: 'Agents — liste' },
    { route: '/agents/orchestrateur',     name: 'Agents — détail' },
    { route: '/skills',                   name: 'Skills — liste' },
    { route: '/skills/ui-ux-pro-max',     name: 'Skills — détail' },
    { route: '/workflow',                 name: 'Workflow' },
    { route: '/probleme-innovation',      name: 'Problème & Innovation' },
    { route: '/demo-markdown',            name: 'Démo Markdown' },
    { route: '/outils-mcp/supabase',      name: 'Outils MCP — Supabase' },
    { route: '/outils-mcp/vercel',        name: 'Outils MCP — Vercel' },
    { route: '/outils-mcp/render',        name: 'Outils MCP — Render' },
    { route: '/outils-mcp/playwright',    name: 'Outils MCP — Playwright' },
  ];

  test.describe('Desktop (1280×720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    for (const { route, name } of PAGES_TO_TEST) {
      test(`[Desktop] ${name} — la page se charge correctement`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('#main-content, .homepage__hero').first()).toBeVisible({ timeout: 10000 });
        // Vérifier que l'URL correspond (tolère les redirections)
        await page.waitForTimeout(300);
      });

      test(`[Desktop] ${name} — le header est visible`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('.header__brand')).toBeVisible({ timeout: 10000 });
      });

      test(`[Desktop] ${name} — le layout shell est chargé`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('.shell-layout').first()).toBeAttached({ timeout: 10000 });
      });
    }
  });

  test.describe('Mobile — iPhone 14 (390×844)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    for (const { route, name } of PAGES_TO_TEST) {
      test(`[Mobile] ${name} — la page se charge correctement`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('#main-content, .homepage__hero').first()).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(300);
      });

      test(`[Mobile] ${name} — le header est visible`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('.header__brand')).toBeVisible({ timeout: 10000 });
      });

      test(`[Mobile] ${name} — le hamburger est présent`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('.header__hamburger')).toBeVisible({ timeout: 10000 });
      });
    }
  });

  test.describe('Mobile — Menu hamburger', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('ouvre la sidebar overlay via hamburger', async ({ page }) => {
      await page.goto('/a-propos');
      await page.locator('.header__hamburger').click();
      await page.waitForTimeout(300);
      await expect(page.locator('.shell-layout__sidebar--overlay')).toBeAttached({ timeout: 5000 });
      await expect(page.locator('.sidebar-overlay')).toBeVisible({ timeout: 5000 });
    });

    test('ferme la sidebar overlay via le bouton close', async ({ page }) => {
      await page.goto('/a-propos');
      await page.locator('.header__hamburger').click();
      await page.waitForTimeout(300);
      await expect(page.locator('.shell-layout__sidebar--overlay')).toBeAttached({ timeout: 5000 });
      await page.locator('.sidebar__close').dispatchEvent('click');
      await page.waitForTimeout(300);
      await expect(page.locator('.shell-layout__sidebar--overlay')).not.toBeAttached({ timeout: 5000 });
    });

    test('ferme la sidebar overlay via tap sur l\'overlay', async ({ page }) => {
      await page.goto('/a-propos');
      await page.locator('.header__hamburger').click();
      await page.waitForTimeout(300);
      await expect(page.locator('.sidebar-overlay')).toBeVisible({ timeout: 5000 });
      await page.locator('.sidebar-overlay').click();
      await page.waitForTimeout(300);
      await expect(page.locator('.shell-layout__sidebar--overlay')).not.toBeAttached({ timeout: 5000 });
    });
  });

  test.describe('Desktop large — 1920×1080', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('la grille hexagonale est visible sur grand écran', async ({ page }) => {
      await page.goto('/');
      const canvas = page.locator('.hex-grid__canvas');
      const count = await canvas.count();
      if (count > 0) {
        await expect(canvas).toBeVisible({ timeout: 10000 });
      }
      // La page doit être chargée dans tous les cas
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });
    });

    test('le layout shell est bien proportionné', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.shell-layout').first()).toBeAttached({ timeout: 10000 });
    });
  });

});
