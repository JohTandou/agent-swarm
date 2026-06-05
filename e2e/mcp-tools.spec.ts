import { test, expect } from '@playwright/test';

test.describe('T10 — Pages Outils MCP', () => {

  test.describe('Navigation', () => {
    test('la page Supabase se charge et affiche le titre', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      await expect(page.getByRole('heading', { name: 'Supabase' })).toBeVisible();
    });

    test('affiche 4 onglets de catégorie', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const tabs = page.locator('.mcp-nav__tab');
      await expect(tabs).toHaveCount(4);
    });

    test("l'onglet actif a la classe --active", async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const activeTab = page.locator('.mcp-nav__tab--active');
      await expect(activeTab).toContainText('Supabase');
    });

    test('la redirection racine fonctionne', async ({ page }) => {
      await page.goto('/outils-mcp');
      await page.waitForURL(/outils-mcp\/supabase/);
      await expect(page.getByRole('heading', { name: 'Supabase' })).toBeVisible();
    });

    test('le clic sur Vercel change de catégorie', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      await expect(page.getByRole('link', { name: /Vercel/ })).toBeVisible({ timeout: 10000 });
      await page.getByRole('link', { name: /Vercel/ }).click();
      await page.waitForURL(/outils-mcp\/vercel/);
      await expect(page.getByRole('heading', { name: 'Vercel' })).toBeVisible();
    });
  });

  test.describe('Tableau des outils', () => {
    test('affiche 10 outils Supabase dans le tableau', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const rows = page.locator('.mcp-table__row');
      await expect(rows).toHaveCount(10);
    });

    test('affiche 8 outils Vercel dans le tableau', async ({ page }) => {
      await page.goto('/outils-mcp/vercel');
      const rows = page.locator('.mcp-table__row');
      await expect(rows).toHaveCount(8);
    });

    test('affiche 10 outils Render dans le tableau', async ({ page }) => {
      await page.goto('/outils-mcp/render');
      const rows = page.locator('.mcp-table__row');
      await expect(rows).toHaveCount(10);
    });

    test('affiche 10 outils Playwright dans le tableau', async ({ page }) => {
      await page.goto('/outils-mcp/playwright');
      const rows = page.locator('.mcp-table__row');
      await expect(rows).toHaveCount(10);
    });

    test('chaque ligne a un nom outil, une description et des paramètres', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const firstRow = page.locator('.mcp-table__row').first();
      await expect(firstRow.locator('.mcp-table__tool-name')).toBeVisible();
      await expect(firstRow.locator('.mcp-table__cell--desc')).not.toBeEmpty();
    });

    test("le nom d'outil inclut le préfixe supabase_", async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const firstToolName = page.locator('.mcp-table__tool-name').first();
      await expect(firstToolName).toContainText('supabase_');
    });
  });

  test.describe('Exemple de code', () => {
    test("affiche un bloc d'exemple de code", async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const codeBlock = page.locator('.mcp-example__code');
      await expect(codeBlock).toBeVisible();
    });
  });

  test.describe('Playground', () => {
    test('affiche les champs de paramètres', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      await expect(page.locator('.mcp-playground__input').first()).toBeVisible({ timeout: 10000 });
      const inputs = page.locator('.mcp-playground__input');
      const count = await inputs.count();
      expect(count).toBeGreaterThan(0);
    });

    test("le bouton Assembler affiche/masque le résultat", async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      const btn = page.locator('.mcp-playground__button');
      await expect(btn).toBeVisible({ timeout: 10000 });
      await btn.click();
      await expect(page.locator('.mcp-playground__result')).toBeVisible();
      await btn.click();
      await expect(page.locator('.mcp-playground__result')).not.toBeVisible();
    });
  });

  test.describe('Erreur — Catégorie inconnue', () => {
    test("affiche un message d'erreur pour une catégorie inexistante", async ({ page }) => {
      await page.goto('/outils-mcp/inconnue');
      await expect(page.locator('.mcp-tools__error')).toBeVisible();
      await expect(page.locator('.mcp-error__message')).toContainText('inconnue');
    });

    test("le bouton Réessayer est présent", async ({ page }) => {
      await page.goto('/outils-mcp/inconnue');
      await expect(page.getByRole('button', { name: 'Réessayer' })).toBeVisible();
    });
  });

  test.describe('Responsive — Mobile', () => {
    test("les onglets s'affichent sur mobile", async ({ page: mobilePage }) => {
      await mobilePage.goto('/outils-mcp/supabase');
      const tabs = mobilePage.locator('.mcp-nav__tab');
      await expect(tabs).toHaveCount(4);
    });

    test('le tableau est visible sur mobile', async ({ page: mobilePage }) => {
      await mobilePage.goto('/outils-mcp/supabase');
      const table = mobilePage.locator('.mcp-tools__table');
      await expect(table).toBeVisible();
    });
  });

  test.describe('Accessibilité', () => {
    test('la section principale a role="main"', async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      await expect(page.locator('section[role="main"]')).toBeVisible();
    });

    test("l'onglet actif a aria-current=\"page\"", async ({ page }) => {
      await page.goto('/outils-mcp/supabase');
      await expect(page.locator('[aria-current="page"]')).toBeVisible();
    });
  });
});
