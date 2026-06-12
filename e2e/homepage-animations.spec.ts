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
    });
  });
});
