import { test, expect } from '@playwright/test';

test.describe('T7 — Page Workflow / Pipeline Swarm', () => {

  test.describe('Chargement initial', () => {
    test('la page /workflow se charge sans erreur', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page).toHaveURL(/\/workflow/);
    });
  });

  test.describe('Section Hero', () => {
    test('affiche le H1 Le Pipeline Swarm', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('#hero-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('#hero-title')).toHaveText('Le Pipeline Swarm');
    });

    test('affiche les 3 statistiques du hero (5, 10, ≥80%)', async ({ page }) => {
      await page.goto('/workflow');
      const stats = page.locator('.hero__stat');
      await expect(stats).toHaveCount(3);
    });
  });

  test.describe('Section Arbre de décision', () => {
    test('affiche 5 noeuds de décision', async ({ page }) => {
      await page.goto('/workflow');
      const nodes = page.locator('.node-card');
      await expect(nodes).toHaveCount(5);
    });

    test('les badges de route affichent DIRECT, SIMPLE, ADAPT, MEDIUM, FULL', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.node-card__route').first()).toContainText('DIRECT');
      await expect(page.locator('.node-card__route').nth(1)).toContainText('SIMPLE');
      await expect(page.locator('.node-card__route').nth(2)).toContainText('ADAPT');
      await expect(page.locator('.node-card__route').nth(3)).toContainText('MEDIUM');
      await expect(page.locator('.node-card__route').nth(4)).toContainText('FULL');
    });
  });

  test.describe('Section Diagramme Mermaid', () => {
    test('affiche la section du diagramme Mermaid', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.mermaid-section')).toBeVisible();
    });

    test('le diagramme Mermaid se rend dans un wrapper', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.mermaid-wrapper')).toBeVisible();
    });
  });

  test.describe('Section Pre-search', () => {
    test('affiche le tableau des seuils de pre-search', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.pre-search__table')).toBeVisible();
    });

    test('le tableau contient 5 lignes de seuil', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.pre-search__table tbody tr')).toHaveCount(5);
    });
  });

  test.describe('Section Gates Qualité', () => {
    test('affiche 2 cartes de gate qualité', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.gate-card')).toHaveCount(2);
    });

    test('affiche le diagramme de flux des gates', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.gate-flow')).toBeVisible();
    });
  });

  test.describe('Section Intégration Git', () => {
    test('affiche 5 étapes Git', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.git-step')).toHaveCount(5);
    });

    test('mentionne les scripts setup.ts et finish.ts', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.getByText('setup.ts')).toBeVisible();
      await expect(page.getByText('finish.ts')).toBeVisible();
    });
  });

  test.describe('Section Fichiers Swarm', () => {
    test('affiche 2 cartes de fichier swarm', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.locator('.file-card')).toHaveCount(2);
    });

    test('mentionne .swarm-queue.json et .agent-memory.json', async ({ page }) => {
      await page.goto('/workflow');
      await expect(page.getByText('.swarm-queue.json')).toBeVisible();
      await expect(page.getByText('.agent-memory.json')).toBeVisible();
    });
  });
});
