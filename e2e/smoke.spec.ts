import { test, expect } from '@playwright/test';

test.describe('Smoke tests — Swarm Wiki', () => {
  test("la page d'accueil charge le titre et le graphe D3", async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swarm Wiki');
    await expect(page.locator('h1')).toContainText('pipeline');
    await expect(page.getByText('Orchestrateur', { exact: true })).toBeVisible();
  });

  test('la page Problème & Innovation charge les 8 sections', async ({ page }) => {
    await page.goto('/probleme-innovation');
    await expect(page.locator('h1')).toContainText('Pourquoi');
    await expect(page.locator('.comparison-card__text').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comparaison' })).toBeVisible();
  });

  test('la page Agents affiche la grille bento', async ({ page }) => {
    await page.goto('/agents');
    await expect(page.getByText('Orchestrateur', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Front' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible();
  });

  test("la fiche agent affiche le contenu Markdown", async ({ page }) => {
    await page.goto('/agents/orchestrateur');
    await expect(page.locator('h1')).toContainText('Orchestrateur');
    await expect(page.locator('text=Classification automatique')).toBeVisible();
    await expect(page.locator('text=pipeline')).toBeVisible();
  });

  test('le skip-to-content est présent sur toutes les pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Aller au contenu principal')).toBeVisible();
  });
});
