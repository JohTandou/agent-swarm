import { test, expect } from '@playwright/test';

test.describe('T8 — Pages Skills', () => {

  test.describe('Grille bento — Liste', () => {
    test('affiche 3 cartes skill', async ({ page }) => {
      await page.goto('/skills');
      const cards = page.locator('.skills__card');
      await expect(cards).toHaveCount(3);
    });

    test("la carte featured (UI/UX Pro Max) a la classe --featured", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card').first()).toBeVisible({ timeout: 10000 });
      const featuredCards = page.locator('.skills__card--featured');
      await expect(featuredCards).toHaveCount(1);
    });

    test("la carte wide (Tests Create) a la classe --wide", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card').first()).toBeVisible({ timeout: 10000 });
      const wideCards = page.locator('.skills__card--wide');
      await expect(wideCards).toHaveCount(1);
    });

    test('chaque carte a un nom, une description, un emoji et des tags', async ({ page }) => {
      await page.goto('/skills');
      const firstCard = page.locator('.skills__card').first();
      await expect(firstCard.locator('.skills__card-name')).toBeVisible();
      await expect(firstCard.locator('.skills__card-desc')).toBeVisible();
      await expect(firstCard.locator('.skills__card-emoji')).toBeVisible();
      await expect(firstCard.locator('.skills__card-category')).toBeVisible();
    });

    test("chaque carte affiche sa catégorie en français", async ({ page }) => {
      await page.goto('/skills');
      const categories = page.locator('.skills__card-category');
      const texts = await categories.allTextContents();
      const validCategories = ['Création', 'Qualité', 'Analyse'];
      for (const text of texts) {
        expect(validCategories).toContain(text);
      }
    });

    test("affiche l'en-tête de section", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__title')).toHaveText('Skills');
      await expect(page.locator('.skills__eyebrow')).toHaveText('Modules Réutilisables');
      await expect(page.locator('.skills__subtitle')).toBeVisible();
    });
  });

  test.describe('Filtres', () => {
    test('affiche 4 boutons de filtre (Tous + 3 catégories)', async ({ page }) => {
      await page.goto('/skills');
      const filters = page.locator('.skills__filter');
      await expect(filters).toHaveCount(4);
    });

    test('le filtre Tous affiche le compte total (3)', async ({ page }) => {
      await page.goto('/skills');
      const allFilter = page.getByRole('button', { name: /Afficher tous les skills/ });
      await expect(allFilter.locator('.skills__filter-count')).toContainText('3');
    });

    test('filtrer par Création affiche 1 skill', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Création');
      await expect(page.locator('.skills__card')).toHaveCount(1);
      await expect(page.getByText('UI/UX Pro Max', { exact: true })).toBeVisible();
    });

    test('filtrer par Qualité affiche 1 skill', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Qualité/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Qualité');
      await expect(page.locator('.skills__card')).toHaveCount(1);
      await expect(page.getByText('Tests Create', { exact: true })).toBeVisible();
    });

    test('filtrer par Analyse affiche 1 skill', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Analyse/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Analyse');
      await expect(page.locator('.skills__card')).toHaveCount(1);
      await expect(page.getByText('Graphify', { exact: true })).toBeVisible();
    });

    test('le toggle désactive le filtre actif', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__card')).toHaveCount(1);
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__card')).toHaveCount(3);
    });

    test("cliquer sur Tous après un filtre affiche tout", async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await page.getByRole('button', { name: /Afficher tous les skills/ }).click();
      await expect(page.locator('.skills__card')).toHaveCount(3);
      await expect(page.locator('.skills__filter--active')).toContainText('Tous');
    });
  });

  test.describe('Navigation vers détail', () => {
    test("cliquer sur UI/UX Pro Max navigue vers /skills/ui-ux-pro-max", async ({ page }) => {
      await page.goto('/skills');
      await page.locator('a[href="/skills/ui-ux-pro-max"]').first().click();
      await expect(page).toHaveURL('/skills/ui-ux-pro-max');
    });

    test("la page détail affiche le nom et l'emoji", async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.skill-detail__name')).toContainText('UI/UX Pro Max');
      await expect(page.locator('.skill-detail__emoji')).toBeVisible();
    });

    test("la page détail affiche la catégorie et les tags", async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.skill-detail__category')).toBeVisible();
      await expect(page.locator('.skill-detail__tag').first()).toBeVisible();
    });

    test("la page détail affiche le contenu Markdown du skill", async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test("la page détail a un fil d'Ariane", async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      const breadcrumb = page.locator('.skill-detail__breadcrumb');
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.locator('.skill-detail__breadcrumb-link')).toHaveText('Skills');
    });

    test('le lien Retour au listing navigue vers /skills', async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      await page.locator('.skill-detail__back').click();
      await expect(page).toHaveURL('/skills');
    });

    test('la page Tests Create charge son Markdown', async ({ page }) => {
      await page.goto('/skills/tests-create');
      await expect(page.locator('.skill-detail__name')).toContainText('Tests Create');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test('la page Graphify charge son Markdown', async ({ page }) => {
      await page.goto('/skills/graphify');
      await expect(page.locator('.skill-detail__name')).toContainText('Graphify');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('État 404 — Skill introuvable', () => {
    test("un skill inconnu affiche Skill introuvable", async ({ page }) => {
      await page.goto('/skills/skill-qui-nexiste-pas');
      await expect(page.locator('.skill-detail__error-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.skill-detail__error-title')).toHaveText('Skill introuvable');
    });

    test("la page 404 affiche l'ID du skill manquant", async ({ page }) => {
      await page.goto('/skills/skill-inexistant-xyz');
      await expect(page.locator('.skill-detail__error-text')).toContainText('skill-inexistant-xyz');
    });

    test("la page 404 a un lien retour vers /skills", async ({ page }) => {
      await page.goto('/skills/inexistant');
      await page.locator('.skill-detail__error-link').click();
      await expect(page).toHaveURL('/skills');
    });
  });

  test.describe('Responsive & Accessibilité', () => {
    test("les cartes sont des liens navigables (rôle listitem)", async ({ page }) => {
      await page.goto('/skills');
      const cards = page.locator('[role="listitem"]');
      await expect(cards).toHaveCount(3);
    });

    test("la grille a un rôle list avec aria-label", async ({ page }) => {
      await page.goto('/skills');
      const grid = page.locator('[role="list"][aria-label="Liste des skills Swarm"]');
      await expect(grid).toBeVisible();
    });

    test("les filtres ont des aria-labels descriptifs", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.getByRole('button', { name: /Afficher tous les skills/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Création/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Qualité/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Analyse/ })).toBeVisible();
    });
  });
});
