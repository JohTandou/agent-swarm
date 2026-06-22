import { test, expect } from '@playwright/test';

test.describe('T15 — Page À propos', () => {

  test.describe('Chargement initial', () => {
    test('la page /a-propos se charge sans erreur', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page).toHaveURL(/\/a-propos/);
    });

    test('la page a le titre Swarm Wiki', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page).toHaveTitle('Swarm Wiki');
    });
  });

  test.describe('Contenu', () => {
    test('affiche le H1 "la Swarm"', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('.about__title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.about__title')).toContainText('la Swarm');
    });

    test('affiche le sous-titre de description', async ({ page }) => {
      await page.goto('/a-propos');
      const desc = page.locator('.about__subtitle');
      await expect(desc).toBeVisible({ timeout: 10000 });
      await expect(desc).toContainText('pipeline');
    });

    test('affiche les 6 cartes de statistiques', async ({ page }) => {
      await page.goto('/a-propos');
      const stats = page.locator('.about__stat-card');
      await expect(stats).toHaveCount(6);
    });

    test('la première stat affiche "9" agents spécialisés', async ({ page }) => {
      await page.goto('/a-propos');
      const firstStat = page.locator('.about__stat-card').first();
      await expect(firstStat.locator('.about__stat-number')).toHaveText('9');
      await expect(firstStat).toContainText('Agents spécialisés');
    });

    test('la deuxième stat affiche "26" skills disponibles', async ({ page }) => {
      await page.goto('/a-propos');
      const secondStat = page.locator('.about__stat-card').nth(1);
      await expect(secondStat.locator('.about__stat-number')).toHaveText('26');
      await expect(secondStat).toContainText('Skills disponibles');
    });

    test('la troisième stat affiche "5" niveaux de complexité', async ({ page }) => {
      await page.goto('/a-propos');
      const thirdStat = page.locator('.about__stat-card').nth(2);
      await expect(thirdStat.locator('.about__stat-number')).toHaveText('5');
      await expect(thirdStat).toContainText('Niveaux de complexité');
    });
  });

  test.describe('Navigation', () => {
    test('le lien sidebar "À propos" est actif', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('.sidebar__link--active')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.sidebar__link--active')).toContainText('À propos');
    });

    test('le lien header "À propos" est actif', async ({ page }) => {
      await page.goto('/a-propos');
      const activeLink = page.locator('.header__nav-link--active');
      await expect(activeLink).toBeVisible({ timeout: 10000 });
      await expect(activeLink).toHaveText('À propos');
    });

    test('navigue depuis /agents vers /a-propos via la sidebar', async ({ page }) => {
      await page.goto('/agents');
      const sidebarLink = page.locator('.sidebar__nav').getByRole('link', { name: 'À propos' });
      await expect(sidebarLink).toBeVisible({ timeout: 10000 });
      await sidebarLink.click();
      await expect(page).toHaveURL(/\/a-propos/, { timeout: 5000 });
    });

    test('navigue depuis /agents vers /a-propos via le header', async ({ page }) => {
      await page.goto('/agents');
      const headerLink = page.locator('.header__nav').getByRole('link', { name: 'À propos' });
      await expect(headerLink).toBeVisible({ timeout: 10000 });
      await headerLink.click();
      await expect(page).toHaveURL(/\/a-propos/, { timeout: 5000 });
    });
  });

  test.describe('Fil d\'Ariane', () => {
    test('affiche le fil d\'Ariane', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('nav[aria-label="Fil d\'Ariane"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Responsive — Mobile (390x844)', () => {
    test('le contenu est visible sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/a-propos');
      await expect(page.locator('.about__title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.about__subtitle')).toBeVisible({ timeout: 10000 });
    });

    test('les stats sont visibles sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/a-propos');
      await expect(page.locator('.about__stat-card')).toHaveCount(6);
    });
  });

  test.describe('Accessibilité', () => {
    test('le skip-to-content est présent', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('.skip-to-content')).toBeVisible({ timeout: 10000 });
    });

    test('le contenu principal a l\'id main-content', async ({ page }) => {
      await page.goto('/a-propos');
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Dark mode', () => {
    test('le fond est sombre (pas blanc)', async ({ page }) => {
      await page.goto('/a-propos');
      const bg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).not.toBe('rgb(255, 255, 255)');
    });
  });

});
