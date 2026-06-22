import { test, expect } from '@playwright/test';

test.describe('T5 — Pages Agents', () => {

  test.describe('Grille bento — Liste', () => {
    test('affiche 11 cartes agent', async ({ page }) => {
      await page.goto('/agents');
      const cards = page.locator('.agents__card');
      await expect(cards).toHaveCount(11);
    });

    test('les cartes featured ont un span élargi', async ({ page }) => {
      await page.goto('/agents');
      await expect(page.locator('.agents__card').first()).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(300);
      const featuredCards = page.locator('.agents__card--featured');
      const count = await featuredCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('chaque carte a un nom, un rôle, et un emoji', async ({ page }) => {
      await page.goto('/agents');
      const firstCard = page.locator('.agents__card').first();
      await expect(firstCard.locator('.agents__card-name')).toBeVisible();
      await expect(firstCard.locator('.agents__card-role')).toBeVisible();
      await expect(firstCard.locator('.agents__card-emoji')).toBeVisible();
    });

    test('les agents actifs ont le badge Actif', async ({ page }) => {
      await page.goto('/agents');
      await expect(page.locator('.agents__card').first()).toBeVisible({ timeout: 10000 });
      const activeBadges = page.locator('.agents__card-badge--active');
      const count = await activeBadges.count();
      expect(count).toBeGreaterThanOrEqual(9);
    });

    test("l'agent Back a le badge Inactif", async ({ page }) => {
      await page.goto('/agents');
      const backCard = page.locator('.agents__card--inactive');
      await expect(backCard).toBeVisible();
      await expect(backCard.locator('.agents__card-badge--inactive')).toBeVisible();
    });
  });

  test.describe('Filtres', () => {
    test('affiche 4 boutons de filtre', async ({ page }) => {
      await page.goto('/agents');
      const filters = page.locator('.agents__filter');
      await expect(filters).toHaveCount(4);
    });

    test('le filtre Tous affiche 11', async ({ page }) => {
      await page.goto('/agents');
      const allFilter = page.getByRole('button', { name: /Afficher tous les agents/ });
      await expect(allFilter.locator('.agents__filter-count')).toContainText('11');
    });

    test('filtrer par Build affiche les agents build', async ({ page }) => {
      await page.goto('/agents');
      await page.getByRole('button', { name: /Filtrer par Build/ }).click();
      // Vérifie que le filtre est actif
      await expect(page.locator('.agents__filter--active')).toContainText('Build');
      // Les agents build doivent être visibles
      await expect(page.getByText('Orchestrateur', { exact: true })).toBeVisible();
      await expect(page.getByText('Front', { exact: true })).toBeVisible();
    });

    test('filtrer par Qualité affiche les agents qualité', async ({ page }) => {
      await page.goto('/agents');
      await page.getByRole('button', { name: /Filtrer par Qualité/ }).click();
      await expect(page.locator('.agents__filter--active')).toContainText('Qualité');
      await expect(page.getByText('Contract', { exact: true })).toBeVisible();
      await expect(page.getByText('Tester', { exact: true })).toBeVisible();
    });

    test('filtrer par Infrastructure affiche les agents infra', async ({ page }) => {
      await page.goto('/agents');
      await page.getByRole('button', { name: /Filtrer par Infrastructure/ }).click();
      await expect(page.locator('.agents__filter--active')).toContainText('Infrastructure');
      await expect(page.getByText('Search', { exact: true })).toBeVisible();
      await expect(page.getByText('Explore', { exact: true })).toBeVisible();
    });

    test('le toggle désactive le filtre actif', async ({ page }) => {
      await page.goto('/agents');
      await page.getByRole('button', { name: /Filtrer par Build/ }).click();
      await page.getByRole('button', { name: /Filtrer par Build/ }).click();
      await expect(page.getByRole('button', { name: /Afficher tous les agents/ })).toHaveClass(/agents__filter--active/);
    });
  });

  test.describe('Navigation vers détail', () => {
    test("cliquer sur Orchestrateur navigue vers /agents/orchestrateur", async ({ page }) => {
      await page.goto('/agents');
      await page.locator('a[href="/agents/orchestrateur"]').first().click();
      await expect(page).toHaveURL('/agents/orchestrateur');
    });

    test("la page détail affiche le nom et l'emoji", async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.agent-detail__name')).toContainText('Orchestrateur');
      await expect(page.locator('.agent-detail__emoji')).toBeVisible();
    });

    test('la page détail affiche les badges (route, catégorie, statut)', async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.agent-detail__route')).toBeVisible();
      await expect(page.locator('.agent-detail__category')).toBeVisible();
    });

    test("la page détail affiche le contenu Markdown de l'agent", async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test("la page détail a un fil d'Ariane", async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      const breadcrumb = page.locator('.agent-detail__breadcrumb');
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.locator('.agent-detail__breadcrumb-link')).toHaveText('Agents');
    });

    test('le lien Retour au listing navigue vers /agents', async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await page.locator('.agent-detail__back').click();
      await expect(page).toHaveURL('/agents');
    });
  });

  test.describe('État 404 — Agent introuvable', () => {
    test("un agent inconnu affiche Agent introuvable", async ({ page }) => {
      await page.goto('/agents/agent-qui-nexiste-pas');
      await expect(page.locator('.agent-detail__error-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.agent-detail__error-title')).toHaveText('Agent introuvable');
    });

    test("la page 404 a un lien retour vers /agents", async ({ page }) => {
      await page.goto('/agents/inexistant');
      await page.locator('.agent-detail__error-link').click();
      await expect(page).toHaveURL('/agents');
    });
  });

  test.describe('Animation pipeline', () => {
    test('les cartes ont des dots de pipeline animés', async ({ page }) => {
      await page.goto('/agents');
      await expect(page.locator('.agents__card').first()).toBeVisible({ timeout: 10000 });
      const dots = page.locator('.agents__card-pipeline-dot');
      const count = await dots.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
