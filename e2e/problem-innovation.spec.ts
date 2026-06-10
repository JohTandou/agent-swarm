import { test, expect } from '@playwright/test';

test.describe('T4 — Page Problème & Innovation', () => {

  test.describe('Section Hero', () => {
    test('affiche le H1 Pourquoi la Swarm ?', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.locator('#hero-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('#hero-title')).toHaveText('Pourquoi la Swarm ?');
    });

    test('affiche le kicker "Le pipeline d\'agents IA"', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.locator('.hero__kicker')).toBeVisible();
    });

    test('affiche les 3 stats du hero (8×, 160×, ≥80%)', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const statValues = page.locator('.hero__stat-value');
      await expect(statValues).toHaveCount(3);
      // Scroll vers le compteur pour déclencher l'IntersectionObserver
      await statValues.nth(2).scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
      await expect(statValues.nth(0)).toHaveText('8×');
      await expect(statValues.nth(1)).toHaveText('160×');
    });
  });

  test.describe('Section Avant/Après', () => {
    test('affiche 5 cartes de comparaison', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const cards = page.locator('.comparison-card');
      await expect(cards).toHaveCount(5);
    });

    test('affiche les barres de comparaison animées', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const bars = page.locator('.comparison-bar');
      await expect(bars).toHaveCount(5);
    });

    test('les barres ont des largeurs cibles via data-width', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const bar = page.locator('.comparison-bar').first();
      await expect(bar).toHaveAttribute('data-width');
    });
  });

  test.describe('Section Comparaison systèmes', () => {
    test('affiche le tableau avec 7 systèmes', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const rows = page.locator('.systems__table tbody tr');
      await expect(rows).toHaveCount(7);
    });

    test('la ligne Swarm est surlignée', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const swarmRow = page.locator('.systems__row--swarm');
      await expect(swarmRow).toBeVisible();
    });

    test('mentionne Claude Code, Cursor, Devin dans le tableau', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.getByText('Claude Code')).toBeVisible();
      await expect(page.locator('.systems__table').getByText('Devin')).toBeVisible();
    });
  });

  test.describe('Section 7 piliers', () => {
    test('affiche 7 cartes pilier', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const pillars = page.locator('.pillar-card');
      await expect(pillars).toHaveCount(7);
    });

    test('chaque pilier a un numéro et un titre', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const numbers = page.locator('.pillar-card__number');
      await expect(numbers).toHaveCount(7);
    });
  });

  test.describe('Section Analyse des coûts', () => {
    test('affiche le tableau des coûts par route', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const table = page.locator('.costs__table');
      await expect(table).toBeVisible();
    });

    test('compare Swarm vs Claude Max vs Devin', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.locator('.costs__comparison').getByText('Claude Max')).toBeVisible();
      await expect(page.locator('.costs__comparison').getByText('Devin')).toBeVisible();
    });
  });

  test.describe('Section Modèles IA', () => {
    test('affiche 2 cartes modèle', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const models = page.locator('.model-card');
      await expect(models).toHaveCount(2);
    });

    test('DeepSeek V4 Pro = lourd, Gemini Flash Lite = léger', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.locator('.model-card--heavy')).toBeVisible();
      await expect(page.locator('.model-card--light')).toBeVisible();
      await expect(page.locator('.model-card--heavy').getByText('DeepSeek V4 Pro')).toBeVisible();
      await expect(page.locator('.model-card--light').getByText('Gemini Flash Lite')).toBeVisible();
    });
  });

  test.describe('Section Limites', () => {
    test('affiche 3 catégories de limites', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const limitCards = page.locator('.limit-card');
      await expect(limitCards).toHaveCount(3);
    });
  });

  test.describe('Section Pour qui', () => {
    test('affiche 4 cartes audience', async ({ page }) => {
      await page.goto('/probleme-innovation');
      const audienceCards = page.locator('.audience-card');
      await expect(audienceCards).toHaveCount(4);
    });

    test('mentionne les 4 publics cibles', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.getByText('Recruteurs techniques')).toBeVisible();
      await expect(page.getByText('Tech leads')).toBeVisible();
      await expect(page.getByText('Développeurs')).toBeVisible();
      await expect(page.getByText('Startups')).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('mentionne open source', async ({ page }) => {
      await page.goto('/probleme-innovation');
      await expect(page.locator('.page-footer__text')).toContainText('open source');
    });
  });
});
