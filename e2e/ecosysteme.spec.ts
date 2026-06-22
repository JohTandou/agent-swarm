import { test, expect } from '@playwright/test';

test.describe('T11 — Page Écosystème / Infrastructure Swarm', () => {

  test.describe('Chargement initial', () => {
    test('la page /ecosysteme se charge sans erreur', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page).toHaveURL(/\/ecosysteme/);
    });
  });

  test.describe('Section Hero', () => {
    test('affiche le H1 L\'Écosystème Technique', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.hero__title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.hero__title')).toContainText('Écosystème');
    });

    test('affiche le kicker Infrastructure', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.hero__kicker')).toContainText('Infrastructure');
    });

    test('affiche les 3 statistiques du hero', async ({ page }) => {
      await page.goto('/ecosysteme');
      const stats = page.locator('.hero__stat');
      await expect(stats).toHaveCount(3);
    });
  });

  test.describe('Section Structure .opencode/', () => {
    test('affiche 8 entrées du directoryTree', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.dir-card')).toHaveCount(8);
    });

    test('les badges affichent le nombre de fichiers/dossiers', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.dir-card__badge').first()).toBeVisible();
    });

    test('la carte agents/ affiche ses enfants', async ({ page }) => {
      await page.goto('/ecosysteme');
      const children = page.locator('.dir-card__children').first();
      await expect(children).toBeVisible();
      await expect(children.locator('.dir-card__child')).toHaveCount(9);
    });
  });

  test.describe('Section swarm-workflow.json', () => {
    test('affiche 4 catégories de configuration', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.config-category')).toHaveCount(4);
    });

    test('les catégories incluent Pipeline, Qualité, Git & Branches, Tests', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.config-category__name').first()).toContainText('Pipeline');
      await expect(page.locator('.config-category__name').nth(1)).toContainText('Qualité');
      await expect(page.locator('.config-category__name').nth(2)).toContainText('Git');
      await expect(page.locator('.config-category__name').nth(3)).toContainText('Tests');
    });
  });

  test.describe('Section AGENTS.md', () => {
    test('affiche 10 sections AGENTS.md', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.agentsmd-card')).toHaveCount(10);
    });

    test('la première carte mentionne Stack Technique', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.agentsmd-card__title').first()).toContainText('Stack Technique');
    });
  });

  test.describe('Section Architecture Globale', () => {
    test('affiche le diagramme Mermaid', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.mermaid-wrapper')).toBeVisible();
    });

    test('affiche 4 intégrations MCP', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.integration-card')).toHaveCount(4);
    });

    test('les intégrations incluent Supabase, Vercel, Render, Playwright', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.integration-card__name').first()).toContainText('Supabase');
      await expect(page.locator('.integration-card__name').nth(1)).toContainText('Vercel');
      await expect(page.locator('.integration-card__name').nth(2)).toContainText('Render');
      await expect(page.locator('.integration-card__name').nth(3)).toContainText('Playwright');
    });
  });

  test.describe('État d\'erreur', () => {
    test('la page gère l\'état de chargement initial (loader)', async ({ page }) => {
      await page.goto('/ecosysteme');
      await expect(page.locator('.page')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation depuis la homepage', () => {
    test('la carte Écosystème sur la homepage navigue vers /ecosysteme', async ({ page }) => {
      await page.goto('/');
      const ecoCard = page.locator('.homepage__nav-card').filter({ hasText: 'Écosystème' });
      await expect(ecoCard).toHaveAttribute('href', '/ecosysteme');
    });
  });
});
