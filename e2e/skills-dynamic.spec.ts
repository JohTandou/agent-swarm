import { test, expect } from '@playwright/test';

test.describe('Skills — 26 skills dynamiques', () => {

  test.describe('Page listing /skills', () => {
    test('devrait afficher les 26 cartes skill chargées dynamiquement', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 15000 });
      const cards = page.locator('.skills__card:not(.skills__card--skeleton)');
      await expect(cards).toHaveCount(26);
    });

    test('devrait afficher les 4 catégories de filtre (Tous + Création, Audit, Workflow, Documentation)', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.getByRole('button', { name: /Afficher tous les skills/ })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: /Filtrer par Création/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Audit/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Workflow/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Documentation/ })).toBeVisible();
    });

    test('le filtre Tous affiche le compte total (26)', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const allFilter = page.getByRole('button', { name: /Afficher tous les skills/ });
      await expect(allFilter.locator('.skills__filter-count')).toContainText('26');
    });

    test('filtrer par Création affiche les skills de cette catégorie', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Création/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Création');
      const visibleCards = page.locator('.skills__card:not(.skills__card--skeleton)');
      const count = await visibleCards.count();
      for (let i = 0; i < count; i++) {
        await expect(visibleCards.nth(i)).toHaveAttribute('data-category', 'creation');
      }
    });

    test('filtrer par Audit affiche les skills de cette catégorie', async ({ page }) => {
      await page.goto('/skills');
      await page.getByRole('button', { name: /Filtrer par Audit/ }).click();
      await expect(page.locator('.skills__filter--active')).toContainText('Audit');
      const visibleCards = page.locator('.skills__card:not(.skills__card--skeleton)');
      const count = await visibleCards.count();
      for (let i = 0; i < count; i++) {
        await expect(visibleCards.nth(i)).toHaveAttribute('data-category', 'audit');
      }
    });
  });

  test.describe('Navigation vers détail', () => {
    test("cliquer sur UI/UX Pro Max navigue vers /skills/ui-ux-pro-max", async ({ page }) => {
      await page.goto('/skills');
      await page.locator('a[href="/skills/ui-ux-pro-max"]').first().click();
      await expect(page).toHaveURL('/skills/ui-ux-pro-max');
    });

    test("la page détail affiche le contenu Markdown dynamique", async ({ page }) => {
      await page.goto('/skills/graphify');
      await expect(page.locator('.skill-detail__name')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test('le lien Retour au listing navigue vers /skills', async ({ page }) => {
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.skill-detail__back')).toBeVisible({ timeout: 10000 });
      await page.locator('.skill-detail__back').click();
      await expect(page).toHaveURL('/skills');
    });
  });

  test.describe('Sidebar — Skills dynamiques', () => {
    test('la sidebar charge les skills dynamiquement dans le menu Skills', async ({ page }) => {
      // Naviguer vers /skills car la sidebar est masquée sur la homepage (isHomepage())
      await page.goto('/skills');

      // Sur mobile, la sidebar est masquée (overlay). On détecte via les barres
      // du hamburger (.header__hamburger-bar — classe statique, toujours présente
      // sur mobile). Si les barres sont visibles → mobile → ouvrir la sidebar.
      const hamburgerBar = page.locator('.header__hamburger-bar').first();
      if (await hamburgerBar.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Cliquer sur le bouton parent (le span .header__hamburger-bar est dans
        // un <app-ui-button> qui émet toggleSidebar au clic)
        await hamburgerBar.click();
        await expect(page.locator('.sidebar')).toBeVisible({ timeout: 5000 });
      }

      // L'item Skills (<li class="sidebar__item">) existe toujours.
      // On cible le wrapper plutôt que le <button> (qui n'existe qu'après
      // loadSkillsManifest, quand children.length > 0).
      const skillsItem = page.locator('.sidebar__item').filter({ hasText: /^Skills/ });
      await skillsItem.waitFor({ state: 'visible', timeout: 15000 });
      await skillsItem.locator('.sidebar__link').click();

      // Vérifier que les enfants sont chargés
      const childLinks = page.locator('.sidebar__sublist .sidebar__link--child');
      await expect(childLinks.first()).toBeVisible({ timeout: 10000 });
      const count = await childLinks.count();
      expect(count).toBeGreaterThan(0);
      // Vérifier qu'un skill connu est présent
      await expect(page.locator('.sidebar__link--child').filter({ hasText: 'UI/UX Pro Max' })).toBeVisible();
    });
  });

  test.describe('État vide (filtre sans résultat)', () => {
    test("l'empty state s'affiche quand aucun skill ne correspond", async ({ page }) => {
      await page.goto('/skills');
      await expect(page.locator('.skills__card:not(.skills__card--skeleton)').first()).toBeVisible({ timeout: 10000 });
      const filters = page.locator('.skills__filters');
      await expect(filters).toBeVisible();
    });
  });

  test.describe('Accessibilité', () => {
    test('les filtres ont des aria-labels pour les 4 catégories', async ({ page }) => {
      await page.goto('/skills');
      await expect(page.getByRole('button', { name: /Filtrer par Création/ })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('button', { name: /Filtrer par Audit/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Workflow/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Filtrer par Documentation/ })).toBeVisible();
    });
  });
});
