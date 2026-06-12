import { test, expect } from '@playwright/test';

test.describe('T1 — Layout Shell & Navigation', () => {

  test.describe('Desktop (1920x1080)', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test.describe('Header', () => {
      test('affiche le brand Swarm Wiki avec lien vers /', async ({ page }) => {
        await page.goto('/');
        const brand = page.locator('.header__brand');
        await expect(brand).toBeVisible();
        await expect(brand).toHaveAttribute('href', '/');
        await expect(page.locator('.header__brand-text')).toHaveText('Swarm Wiki');
      });

      test('affiche les liens Accueil et À propos', async ({ page }) => {
        await page.goto('/');
        const nav = page.locator('.header__nav');
        await expect(nav.getByRole('link', { name: 'Accueil' })).toBeVisible();
        await expect(nav.getByRole('link', { name: 'À propos' })).toBeVisible();
      });

      test('surligne le lien actif', async ({ page }) => {
        await page.goto('/');
        const activeLink = page.locator('.header__nav-link--active');
        await expect(activeLink).toBeVisible();
        await expect(activeLink).toHaveText('Accueil');
      });
    });

    test.describe('Sidebar', () => {
      test('affiche menus pliables Agents, Skills, Outils MCP', async ({ page }) => {
        await page.goto('/a-propos');
        await expect(page.getByRole('button', { name: 'Agents' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Skills' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Outils MCP' })).toBeVisible();
      });

      test('affiche liens simples Accueil, À propos, Workflow', async ({ page }) => {
        await page.goto('/a-propos');
        const sidebar = page.locator('.sidebar__nav');
        await expect(sidebar.getByRole('link', { name: 'Accueil' })).toBeVisible();
        await expect(sidebar.getByRole('link', { name: 'À propos' })).toBeVisible();
        await expect(sidebar.getByRole('link', { name: 'Workflow' })).toBeVisible();
      });

      test('déplie/replie le menu Agents', async ({ page }) => {
        await page.goto('/a-propos');
        const agentsBtn = page.getByRole('button', { name: 'Agents' });

        // Déplier
        await agentsBtn.click();
        await expect(agentsBtn).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'Orchestrateur' })).toBeVisible();

        // Replier
        await agentsBtn.click();
        await expect(agentsBtn).toHaveAttribute('aria-expanded', 'false');
      });

      test('surligne le lien actif', async ({ page }) => {
        await page.goto('/a-propos');
        const activeLink = page.locator('.sidebar__link--active');
        await expect(activeLink).toBeVisible();
        await expect(activeLink).toHaveText('À propos');
      });
    });

    test.describe('Breadcrumbs', () => {
      test("affiche le fil d'Ariane", async ({ page }) => {
        await page.goto('/agents');
        await expect(page.locator('nav[aria-label="Fil d\'Ariane"]')).toBeVisible();
      });
    });

    test.describe('Table of Contents', () => {
      test('affiche "Sur cette page" sur /demo-markdown', async ({ page }) => {
        await page.goto('/demo-markdown');
        await expect(page.locator('.toc__title')).toHaveText('Sur cette page');
      });

      test('affiche "Aucune section détectée" sur page sans contenu', async ({ page }) => {
        await page.goto('/a-propos');
        await expect(page.locator('.toc__empty-text')).toHaveText('Aucune section détectée');
      });
    });

    test.describe('Accessibilité', () => {
      test('skip-to-content visible avec lien vers #main-content', async ({ page }) => {
        await page.goto('/');
        const skipLink = page.locator('.skip-to-content');
        await expect(skipLink).toBeVisible();
        await expect(skipLink).toHaveAttribute('href', '#main-content');
        await expect(skipLink).toHaveText('Aller au contenu principal');
      });
    });

    test.describe('Routing', () => {
      test('navigue vers /a-propos', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'À propos' }).first().click();
        await expect(page).toHaveURL('/a-propos');
      });

      test('route inconnue redirige vers /', async ({ page }) => {
        await page.goto('/nimportequoi');
        await expect(page).toHaveURL('/');
      });
    });
  });

  test.describe('Mobile (390x844)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('le hamburger ouvre/ferme la sidebar overlay', async ({ page }) => {
      await page.goto('/a-propos');
      const hamburger = page.locator('.header__hamburger-btn');
      await expect(hamburger).toBeVisible();
      await hamburger.click();

      // Sidebar en overlay attachée au DOM
      const sidebar = page.locator('.shell-layout__sidebar--overlay');
      await expect(sidebar).toBeAttached();

      // Overlay semi-transparent visible
      await expect(page.locator('.sidebar-overlay')).toBeVisible();

      // Fermer via le bouton close (dispatchEvent car display:none)
      await page.locator('.sidebar__close').dispatchEvent('click');
      await expect(sidebar).not.toBeAttached();
    });

    test("l'overlay ferme la sidebar au tap", async ({ page }) => {
      await page.goto('/a-propos');
      await page.locator('.header__hamburger-btn').click();

      const overlay = page.locator('.sidebar-overlay');
      await expect(overlay).toBeVisible();
      await overlay.click();

      await expect(page.locator('.shell-layout__sidebar--overlay')).not.toBeAttached();
    });

    test('la sidebar affiche les menus après ouverture', async ({ page }) => {
      await page.goto('/a-propos');
      await page.locator('.header__hamburger-btn').click();
      await expect(page.locator('.sidebar__link--parent', { hasText: 'Agents' })).toBeAttached();
    });
  });

  test.describe('Dark mode (commun)', () => {
    test('le fond est sombre (pas blanc)', async ({ page }) => {
      await page.goto('/');
      const bg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).not.toBe('rgb(255, 255, 255)');
    });
  });
});
