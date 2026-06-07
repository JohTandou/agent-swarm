import { test, expect } from '@playwright/test';

test.describe('T16 — Dead links et redirections', () => {

  test.describe('Lien /ecosysteme (mort)', () => {
    test('la carte Écosystème sur la homepage pointe vers /ecosysteme', async ({ page }) => {
      await page.goto('/');
      const ecoCard = page.locator('.homepage__nav-card').filter({ hasText: 'Écosystème' });
      await expect(ecoCard).toBeVisible();
      await expect(ecoCard).toHaveAttribute('href', '/ecosysteme');
    });

    test('cliquer sur la carte Écosystème redirige vers l\'accueil (wildcard)', async ({ page }) => {
      await page.goto('/');
      const ecoCard = page.locator('.homepage__nav-card').filter({ hasText: 'Écosystème' });
      await ecoCard.click();
      // La route /ecosysteme n'existe pas → wildcard ** → redirectTo '/'
      await expect(page).toHaveURL('/', { timeout: 5000 });
      // Vérifier qu'on est bien sur la homepage
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });
    });

    test('accéder directement à /ecosysteme redirige vers l\'accueil', async ({ page }) => {
      await page.goto('/ecosysteme');
      // Le wildcard doit rediriger vers /
      await expect(page).toHaveURL(/\/(\?|#|$)/, { timeout: 5000 });
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Route inconnue', () => {
    test('/nimportequoi redirige vers l\'accueil', async ({ page }) => {
      await page.goto('/nimportequoi');
      await expect(page).toHaveURL('/', { timeout: 5000 });
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });
    });

    test('/agents/inexistant affiche l\'erreur 404 agent', async ({ page }) => {
      await page.goto('/agents/agent-qui-nexiste-pas');
      await expect(page.locator('.agent-detail__error-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.agent-detail__error-title')).toHaveText('Agent introuvable');
    });

    test('/skills/inexistant affiche l\'erreur 404 skill', async ({ page }) => {
      await page.goto('/skills/skill-qui-nexiste-pas');
      await expect(page.locator('.skill-detail__error-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.skill-detail__error-title')).toHaveText('Skill introuvable');
    });

    test('/outils-mcp/inconnue affiche l\'erreur de catégorie', async ({ page }) => {
      await page.goto('/outils-mcp/inconnue');
      await expect(page.locator('.mcp-tools__error')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Redirections légitimes', () => {
    test('/outils-mcp redirige vers /outils-mcp/supabase', async ({ page }) => {
      await page.goto('/outils-mcp');
      await page.waitForURL(/outils-mcp\/supabase/);
      await expect(page.getByRole('heading', { name: 'Supabase' })).toBeVisible();
    });
  });

  test.describe('Navigation vers des routes valides via homepage', () => {
    test('carte Agents → /agents', async ({ page }) => {
      await page.goto('/');
      await page.locator('.homepage__nav-card').filter({ hasText: 'Agents' }).click();
      await expect(page).toHaveURL(/\/agents/);
    });

    test('carte Workflow → /workflow', async ({ page }) => {
      await page.goto('/');
      await page.locator('.homepage__nav-card').filter({ hasText: 'Workflow' }).click();
      await expect(page).toHaveURL(/\/workflow/);
    });

    test('carte Skills → /skills', async ({ page }) => {
      await page.goto('/');
      await page.locator('.homepage__nav-card').filter({ hasText: 'Skills' }).click();
      await expect(page).toHaveURL(/\/skills/);
    });
  });

});
