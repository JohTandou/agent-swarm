import { test, expect } from '@playwright/test';

test.describe('T3 — Page d\'accueil interactive', () => {

  test.describe('Métadonnées', () => {
    test('la page a le titre Swarm Wiki', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle('Swarm Wiki');
    });
  });

  test.describe('Section Hero', () => {
    test('affiche le H1 avec la tagline', async ({ page }) => {
      await page.goto('/');
      const h1 = page.locator('.homepage__tagline');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('pipeline');
    });

    test('affiche les 3 paragraphes du résumé exécutif', async ({ page }) => {
      await page.goto('/');
      const summaryTexts = page.locator('.homepage__summary-text');
      await expect(summaryTexts).toHaveCount(3);
      await expect(summaryTexts.nth(0)).toContainText('9 agents');
      await expect(summaryTexts.nth(1)).toContainText('26 skills');
      await expect(summaryTexts.nth(2)).toContainText('0.20');
    });

    test('affiche le scroll hint Explorer', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.homepage__scroll-text')).toHaveText('Explorer');
    });
  });

  test.describe('Cartes de navigation', () => {
    test('affiche les 4 cartes de navigation', async ({ page }) => {
      await page.goto('/');
      const navCards = page.locator('.homepage__nav-card');
      await expect(navCards).toHaveCount(4);
    });

    test('la carte Agents pointe vers /agents', async ({ page }) => {
      await page.goto('/');
      const agentsCard = page.locator('.homepage__nav-card').filter({ hasText: 'Agents' }).first();
      await expect(agentsCard).toHaveAttribute('href', '/agents');
    });

    test('la carte Workflow pointe vers /workflow', async ({ page }) => {
      await page.goto('/');
      const wfCard = page.locator('.homepage__nav-card').filter({ hasText: 'Workflow' });
      await expect(wfCard).toHaveAttribute('href', '/workflow');
    });

    test('la carte Skills pointe vers /skills', async ({ page }) => {
      await page.goto('/');
      const skillsCard = page.locator('.homepage__nav-card').filter({ hasText: 'Skills' });
      await expect(skillsCard).toHaveAttribute('href', '/skills');
    });

    test('la carte Outils MCP pointe vers /outils-mcp', async ({ page }) => {
      await page.goto('/');
      const ecoCard = page.locator('.homepage__nav-card').filter({ hasText: 'Outils MCP' });
      await expect(ecoCard).toHaveAttribute('href', '/outils-mcp');
    });
  });

  test.describe('Footer', () => {
    test('affiche le texte du footer', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.homepage__footer-text')).toContainText('Swarm');
    });
  });
});
