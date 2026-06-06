import { test, expect } from '@playwright/test';

test.describe('T12 — Page Standards / Normes', () => {

  test.describe('Chargement initial', () => {
    test('la page /normes se charge sans erreur', async ({ page }) => {
      await page.goto('/normes');
      await expect(page).toHaveURL(/\/normes/);
    });
  });

  test.describe('Section Hero', () => {
    test('affiche le H1 Standards', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('#hero-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('#hero-title')).toHaveText('Standards');
    });

    test('affiche le kicker "Conventions du projet"', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.hero__kicker')).toBeVisible();
      await expect(page.locator('.hero__kicker')).toHaveText('Conventions du projet');
    });

    test('affiche le sous-titre de description', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.hero__subtitle')).toBeVisible();
    });
  });

  test.describe('Section 1 — Standards Apple-grade', () => {
    test('affiche la palette de couleurs avec 6 swatches', async ({ page }) => {
      await page.goto('/normes');
      const swatches = page.locator('.palette-swatch');
      await expect(swatches).toHaveCount(6);
    });

    test('mentionne les couleurs #3A3530 et #F0A522', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.getByText('#3A3530')).toBeVisible();
      await expect(page.getByText('#F0A522')).toBeVisible();
    });

    test('affiche le pairing typographique Cabinet Grotesk + Satoshi', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.getByText('Cabinet Grotesk')).toBeVisible();
      await expect(page.getByText('Satoshi')).toBeVisible();
    });

    test('affiche les 4 niveaux d\'élévation N1 à N4', async ({ page }) => {
      await page.goto('/normes');
      const levels = page.locator('.elevation-card');
      await expect(levels).toHaveCount(4);
    });

    test('affiche le tableau du vocabulaire d\'animation', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.animations__table')).toBeVisible();
    });

    test('le tableau contient 6 entrées d\'animation', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.animations__table tbody tr')).toHaveCount(6);
    });
  });

  test.describe('Section 2 — Conventions de code', () => {
    test('affiche le titre "Conventions de code"', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('#conventions-title')).toBeVisible();
      await expect(page.locator('#conventions-title')).toHaveText('Conventions de code');
    });

    test('affiche 4 cartes de convention', async ({ page }) => {
      await page.goto('/normes');
      const cards = page.locator('.convention-card');
      await expect(cards).toHaveCount(4);
    });

    test('mentionne les conventions TypeScript strict et Architecture Angular', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.getByText('TypeScript strict')).toBeVisible();
      await expect(page.getByText('Architecture Angular')).toBeVisible();
    });
  });

  test.describe('Section 3 — Philosophie de test', () => {
    test('affiche le titre "Philosophie de test"', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('#testing-title')).toBeVisible();
      await expect(page.locator('#testing-title')).toHaveText('Philosophie de test');
    });

    test('affiche 4 principes de test', async ({ page }) => {
      await page.goto('/normes');
      const cards = page.locator('.test-card');
      await expect(cards).toHaveCount(4);
    });

    test('mentionne Jest, Playwright et le seuil de 80%', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.getByText('Jest')).toBeVisible();
      await expect(page.getByText('Playwright')).toBeVisible();
      await expect(page.getByText('80')).toBeVisible();
    });
  });

  test.describe('Section 4 — Documentation', () => {
    test('affiche le titre "Documentation"', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('#docs-title')).toBeVisible();
      await expect(page.locator('#docs-title')).toHaveText('Documentation');
    });

    test('affiche 4 ressources de documentation', async ({ page }) => {
      await page.goto('/normes');
      const cards = page.locator('.doc-card');
      await expect(cards).toHaveCount(4);
    });

    test('mentionne AGENTS.md, CHANGELOG.md et agent writer', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.getByText('AGENTS.md')).toBeVisible();
      await expect(page.getByText('CHANGELOG.md')).toBeVisible();
      await expect(page.getByText('Agent writer')).toBeVisible();
    });
  });

  test.describe('Navigation depuis la sidebar', () => {
    test('le lien Standards dans la sidebar navigue vers /normes', async ({ page }) => {
      await page.goto('/');
      const sidebarLink = page.locator('.sidebar__nav').getByRole('link', { name: 'Standards' });
      await expect(sidebarLink).toBeVisible();
      await sidebarLink.click();
      await expect(page).toHaveURL(/\/normes/);
    });

    test('le lien Standards est actif quand on est sur /normes', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.sidebar__link--active', { hasText: 'Standards' })).toBeVisible();
    });
  });

  test.describe('Navigation depuis le header', () => {
    test('le lien Standards dans le header navigue vers /normes', async ({ page }) => {
      await page.goto('/');
      const headerLink = page.locator('.header__nav').getByRole('link', { name: 'Standards' });
      await expect(headerLink).toBeVisible();
      await headerLink.click();
      await expect(page).toHaveURL(/\/normes/);
    });

    test('le lien Standards est actif dans le header quand on est sur /normes', async ({ page }) => {
      await page.goto('/normes');
      const activeLink = page.locator('.header__nav-link--active');
      await expect(activeLink).toBeVisible();
      await expect(activeLink).toHaveText('Standards');
    });
  });

  test.describe('Footer', () => {
    test('le footer de page mentionne le socle des décisions', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.page-footer__text')).toBeVisible();
      await expect(page.locator('.page-footer__text')).toContainText('socle');
    });
  });

  test.describe('Accessibilité', () => {
    test('le skip-to-content est présent sur la page', async ({ page }) => {
      await page.goto('/normes');
      await expect(page.locator('.skip-to-content')).toBeVisible();
    });
  });
});
