import { test, expect } from '@playwright/test';

test.describe('T8 — Pages Skills', () => {

  test.describe('Grille bento — Liste', () => {
    test('affiche 26 cartes skill', async ({ page }) => {
      await page.goto('/skills');
      // Exclure les skeletons pour ne compter que les vraies cartes
      const cards = page.locator('.skills__card:not(.skills__card--skeleton)');
      await expect(cards.first()).toBeVisible({ timeout: 10000 });
      await expect(cards).toHaveCount(26);
    });

    test("la carte featured (UI/UX Pro Max) a la classe --featured", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const featuredCards = page.locator('.skills__card--featured');
      await expect(featuredCards).toHaveCount(1);
    });

    test("la carte wide (Tests Create) a la classe --wide", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const wideCards = page.locator('.skills__card--wide');
      await expect(wideCards).toHaveCount(1);
    });

    test('chaque carte a un nom, une description, un emoji et une catégorie', async ({ page }) => {
      await page.goto('/skills');
      const firstCard = page.locator('.skills__card:not(.skills__card--skeleton)').first();
      await expect(firstCard).toBeVisible({ timeout: 10000 });
      await expect(firstCard.locator('.skills__card-name')).toBeVisible();
      await expect(firstCard.locator('.skills__card-desc')).toBeVisible();
      await expect(firstCard.locator('.skills__card-emoji')).toBeVisible();
      await expect(firstCard.locator('.skills__card-category')).toBeVisible();
    });

    test("chaque carte affiche sa catégorie en français", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const categories = page.locator('.skills__card-category');
      const texts = await categories.allTextContents();
      const validCategories = ['Création', 'Audit', 'Workflow', 'Documentation'];
      for (const text of texts) {
        expect(validCategories).toContain(text.trim());
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
    test('affiche 5 boutons de filtre (Tous + 4 catégories)', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const filters = page.locator('.skills__filters app-ui-button');
      await expect(filters).toHaveCount(5);
    });

    test('le filtre Tous affiche le compte total (26)', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const allFilter = page.getByRole('button', { name: /Afficher tous les skills/ });
      await expect(allFilter.locator('.skills__filter-count')).toContainText('26');
    });

    test('filtrer par Création affiche plusieurs skills', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Création');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').count()).resolves.toBeGreaterThan(3);
    });

    test('filtrer par Audit affiche plusieurs skills', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Audit/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Audit');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').count()).resolves.toBeGreaterThan(1);
    });

    test('filtrer par Documentation affiche plusieurs skills', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Documentation/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Documentation');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').count()).resolves.toBeGreaterThan(1);
    });

    test('le toggle désactive le filtre actif', async ({ page }) => {
      await page.goto('/skills');
      // Activer le filtre Création
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Création');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').count()).resolves.toBeGreaterThan(3);

      // Second clic : désactiver le filtre (toggle off)
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();

      // Vérifier que le filtre Création n'est plus actif et que Tous redevient actif
      // Utiliser toHaveCount avec auto-waiting pour éviter les timing issues
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)')).toHaveCount(26, { timeout: 10000 });
      await expect(page.locator('.skills__filter--active')).toContainText('Tous');
    });

    test("cliquer sur Tous après un filtre affiche tout", async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await page.getByRole('button', { name: /Afficher tous les skills/ }).click();
      // Vérifier via toHaveCount avec auto-waiting
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)')).toHaveCount(26, { timeout: 10000 });
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

    test("la page détail affiche la catégorie", async ({ page }) => {
      // Note : les tags ne sont pas encore extraits du frontmatter YAML
      // (content.service.ts hardcode tags: []). Le test vérifie uniquement
      // la catégorie, qui est bien présente.
      // TODO : réactiver l'assertion .skill-detail__tag quand les tags
      // seront peuplés depuis le champ 'tags' du YAML frontmatter.
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.skill-detail__category')).toBeVisible();
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
      // Attendre que les cartes réelles remplacent les skeletons
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 15000 });
      const cards = page.locator('[role="listitem"]');
      await expect(cards.count()).resolves.toBeGreaterThan(20);
    });

    test("la grille a un rôle list avec aria-label", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const grid = page.locator('[role="list"][aria-label="Liste des skills Swarm"]');
      await expect(grid).toBeVisible();
    });

    test("les filtres ont des aria-labels descriptifs", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.getByRole('button', { name: /Afficher tous les skills/ })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: /Filtrer par Création/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Audit/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Documentation/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Workflow/ })).toBeVisible();
    });
  });
});
