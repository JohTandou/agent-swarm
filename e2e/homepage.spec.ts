import { test, expect } from '@playwright/test';

test.describe('T3 — Page d\'accueil interactive', () => {

  test.describe('Métadonnées', () => {
    test('la page a le titre Swarm Wiki', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle('Swarm Wiki');
    });
  });

  test.describe('Section Hero', () => {
    test('affiche le badge Pipeline d\'agents IA', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.homepage__badge')).toBeVisible();
    });

    test('affiche le H1 avec la tagline', async ({ page }) => {
      await page.goto('/');
      const h1 = page.locator('.homepage__tagline');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('pipeline');
    });

    test('affiche les 3 paragraphes du résumé exécutif', async ({ page }) => {
      await page.goto('/');
      const summaryTexts = page.locator('.homepage__summary-text');
      await expect(summaryTexts).toHaveCount(3);
      await expect(summaryTexts.nth(0)).toContainText('9 agents');
      await expect(summaryTexts.nth(1)).toContainText('26 skills');
      await expect(summaryTexts.nth(2)).toContainText('1.25');
    });

    test('affiche le scroll hint Explorer', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.homepage__scroll-text')).toHaveText('Explorer');
    });
  });

  test.describe('Graphe D3.js', () => {
    test('rend un SVG dans le conteneur du graphe', async ({ page }) => {
      await page.goto('/');
      const svg = page.locator('.swarm-graph__svg');
      await expect(svg).toBeVisible({ timeout: 15000 });
    });

    test('affiche les 9 agents du Swarm dans le graphe', async ({ page }) => {
      await page.goto('/');
      const agents = ['Orchestrateur', 'Search', 'Planner', 'Contract', 'Front', 'Back', 'Tester', 'Reviewer', 'Writer'];
      for (const agent of agents) {
        await expect(page.getByText(agent, { exact: true })).toBeVisible({ timeout: 15000 });
      }
    });

    test("l'orchestrateur a l'animation de pulse", async ({ page }) => {
      await page.goto('/');
      const orchestrator = page.locator('.swarm-graph__node-group--pulse');
      await expect(orchestrator).toBeVisible({ timeout: 15000 });
    });

    test('affiche un tooltip au survol d\'un nœud', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.swarm-graph__node-group--pulse')).toBeVisible({ timeout: 15000 });
      await page.locator('.swarm-graph__node-group--pulse').dispatchEvent('mouseenter');
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Statistiques', () => {
    test('affiche les 4 cartes de statistiques', async ({ page }) => {
      await page.goto('/');
      const statCards = page.locator('.homepage__stat-card');
      await expect(statCards).toHaveCount(4);
    });

    test('affiche les labels des statistiques', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('Agents spécialisés', { exact: true })).toBeVisible();
      await expect(page.getByText('Skills disponibles')).toBeVisible();
      await expect(page.getByText('Catégories MCP')).toBeVisible();
      await expect(page.getByText('par session MEDIUM')).toBeVisible();
    });
  });

  test.describe('Cartes de navigation', () => {
    test('affiche les 4 cartes de navigation', async ({ page }) => {
      await page.goto('/');
      const navCards = page.locator('.homepage__nav-card');
      await expect(navCards).toHaveCount(4);
    });

    test('la carte Agents pointe vers /agents', async ({ page }) => {
      await page.goto('/');
      const agentsCard = page.locator('.homepage__nav-card').filter({ hasText: 'Agents' });
      await expect(agentsCard).toHaveAttribute('href', '/agents');
    });

    test('la carte Workflow pointe vers /workflow', async ({ page }) => {
      await page.goto('/');
      const wfCard = page.locator('.homepage__nav-card').filter({ hasText: 'Workflow' });
      await expect(wfCard).toHaveAttribute('href', '/workflow');
    });

    test('la carte Skills pointe vers /skills', async ({ page }) => {
      await page.goto('/');
      const skillsCard = page.locator('.homepage__nav-card').filter({ hasText: 'Skills' });
      await expect(skillsCard).toHaveAttribute('href', '/skills');
    });

    test('la carte Écosystème pointe vers /ecosysteme', async ({ page }) => {
      await page.goto('/');
      const ecoCard = page.locator('.homepage__nav-card').filter({ hasText: 'Écosystème' });
      await expect(ecoCard).toHaveAttribute('href', '/ecosysteme');
    });
  });

  test.describe('Footer', () => {
    test('affiche le texte du footer', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.homepage__footer-text')).toContainText('Swarm');
    });
  });
});
