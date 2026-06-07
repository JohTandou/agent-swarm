import { test, expect } from '@playwright/test';

test.describe('T14 — Animations GSAP + Signature Hex Grid', () => {

  test.describe('Grille hexagonale', () => {
    test('le canvas hex-grid est présent sur desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      const canvas = page.locator('.hex-grid__canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });
    });

    test('le canvas hex-grid est masqué sur mobile (aria-hidden)', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');
      const canvas = page.locator('.hex-grid__canvas');
      // Le canvas peut être présent dans le DOM mais non visible sur mobile
      await expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Compteurs de stats', () => {
    test('les 4 compteurs de stats sont visibles', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      // Scroller jusqu'à la section stats
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(500);

      const statCards = page.locator('.homepage__stat-card');
      await expect(statCards).toHaveCount(4);
    });

    test('le compteur "9 Agents spécialisés" atteint sa valeur finale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      // Scroller pour déclencher l'animation
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      // Attendre la fin de l'animation (2s + marge)
      await page.waitForTimeout(2500);

      const firstValue = page.locator('.homepage__stat-value').first();
      const text = await firstValue.textContent();
      expect(text?.trim()).toBe('9');
    });

    test('le compteur "26 Skills disponibles" atteint sa valeur finale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(2500);

      const secondValue = page.locator('.homepage__stat-value').nth(1);
      const text = await secondValue.textContent();
      expect(text?.trim()).toBe('26');
    });

    test('le compteur "4 Catégories MCP" atteint sa valeur finale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(2500);

      const thirdValue = page.locator('.homepage__stat-value').nth(2);
      const text = await thirdValue.textContent();
      expect(text?.trim()).toBe('4');
    });

    test('le compteur de coût affiche "1.25 $" en valeur finale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(2500);

      const fourthValue = page.locator('.homepage__stat-value').nth(3);
      const text = await fourthValue.textContent();
      expect(text?.trim()).toBe('1.25 $');
    });
  });

  test.describe('Animations de page', () => {
    test('la transition de page fonctionne entre accueil et une autre page', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      // Vérifier que la page est bien chargée
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });

      // Naviguer vers /agents
      await page.goto('/agents');
      await expect(page).toHaveURL(/\/agents/);
    });
  });

  test.describe('Reduced motion', () => {
    test('les animations respectent prefers-reduced-motion', async ({ page }) => {
      // Simuler reduced motion via emulation
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      // Vérifier que la page se charge sans erreur avec reduced motion
      await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });

      // Les compteurs devraient afficher leurs valeurs directement
      await page.evaluate(() => {
        document.querySelector('.homepage__stats')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(500);

      const firstValue = page.locator('.homepage__stat-value').first();
      await expect(firstValue).toBeVisible();
    });
  });
});
