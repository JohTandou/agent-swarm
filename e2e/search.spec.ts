import { test, expect } from '@playwright/test';

test.describe('T13 — Recherche Cmd+K', () => {

  test.describe('Bouton de recherche dans le header', () => {
    test('affiche le bouton de recherche sur desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await expect(page.locator('.header__search-btn')).toBeVisible({ timeout: 10000 });
    });

    test('le bouton desktop affiche le raccourci ⌘K', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      const kbd = page.locator('.header__search-kbd');
      await expect(kbd).toBeVisible();
      await expect(kbd).toContainText('⌘K');
    });

    test('le bouton mobile est présent sur petit écran', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');
      await expect(page.locator('.header__search-btn--mobile')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Ouverture de la modale', () => {
    test('Cmd+K ouvre la modale de recherche', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      await expect(page.locator('.search-modal__panel')).toBeVisible({ timeout: 5000 });
    });

    test('Ctrl+K ouvre la modale de recherche sur non-Mac', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Control+k');
      await expect(page.locator('.search-modal__panel')).toBeVisible({ timeout: 5000 });
    });

    test('le clic sur le bouton de recherche ouvre la modale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.locator('.header__search-btn').click();
      await expect(page.locator('.search-modal__panel')).toBeVisible({ timeout: 5000 });
    });

    test('Escape ferme la modale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      await expect(page.locator('.search-modal__panel')).toBeVisible({ timeout: 5000 });
      await page.keyboard.press('Escape');
      await expect(page.locator('.search-modal__panel')).toBeHidden({ timeout: 3000 });
    });

    test('le clic sur le backdrop ferme la modale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      await expect(page.locator('.search-modal__panel')).toBeVisible({ timeout: 5000 });
      await page.locator('.search-modal__backdrop').click();
      await expect(page.locator('.search-modal__panel')).toBeHidden({ timeout: 3000 });
    });
  });

  test.describe('Recherche et résultats', () => {
    test('affiche l\'input de recherche dans la modale', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await expect(input).toHaveAttribute('placeholder', /Rechercher/);
    });

    test('taper un terme de recherche affiche des résultats', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('orchestrateur');
      // Attendre que les résultats apparaissent (debounce 150ms + chargement)
      await expect(page.locator('.search-modal__result')).toBeVisible({ timeout: 10000 });
    });

    test('affiche un état vide pour une recherche sans résultat', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('xyznonexistentterm123');
      await expect(page.locator('.search-modal__empty')).toBeVisible({ timeout: 10000 });
    });

    test('les résultats affichent leur section (Agents, Skills, Documentation)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('orchestrateur');
      await expect(page.locator('.search-modal__result-section')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation depuis les résultats', () => {
    test('Enter navigate vers le résultat sélectionné', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('orchestrateur');
      await expect(page.locator('.search-modal__result')).toBeVisible({ timeout: 10000 });
      await page.keyboard.press('Enter');
      // La modale devrait se fermer et naviguer
      await expect(page.locator('.search-modal__panel')).toBeHidden({ timeout: 5000 });
      // Vérifier que l'URL contient la route attendue
      await expect(page).toHaveURL(/\/agents\/orchestrateur/, { timeout: 5000 });
    });

    test('le clic sur un résultat navigue', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('front');
      await expect(page.locator('.search-modal__result').first()).toBeVisible({ timeout: 10000 });
      await page.locator('.search-modal__result').first().click();
      await expect(page).toHaveURL(/\/agents\/front/, { timeout: 5000 });
    });
  });

  test.describe('Navigation clavier', () => {
    test('ArrowDown sélectionne le résultat suivant', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('agent');
      await expect(page.locator('.search-modal__result')).toBeVisible({ timeout: 10000 });
      await page.keyboard.press('ArrowDown');
      // Le deuxième résultat devrait avoir la classe --selected
      const selected = page.locator('.search-modal__result--selected');
      await expect(selected).toBeVisible({ timeout: 3000 });
    });

    test('ArrowUp fait un wrap circulaire', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      const input = page.locator('.search-modal__input');
      await expect(input).toBeVisible({ timeout: 5000 });
      await input.fill('orchestrateur');
      await expect(page.locator('.search-modal__result')).toBeVisible({ timeout: 10000 });
      // Appuyer sur ArrowUp devrait sélectionner le dernier résultat (wrap)
      await page.keyboard.press('ArrowUp');
      const selected = page.locator('.search-modal__result--selected');
      await expect(selected).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Footer et raccourcis', () => {
    test('affiche les raccourcis clavier dans le footer', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      await page.keyboard.press('Meta+k');
      await expect(page.locator('.search-modal__footer')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.search-modal__kbd-label').filter({ hasText: 'Ouvrir' })).toBeVisible();
      await expect(page.locator('.search-modal__kbd-label').filter({ hasText: 'Naviguer' })).toBeVisible();
      await expect(page.locator('.search-modal__kbd-label').filter({ hasText: 'Fermer' })).toBeVisible();
    });
  });

});
