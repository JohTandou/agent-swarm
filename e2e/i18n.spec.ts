import { test, expect } from '@playwright/test';

test.describe('T18 — i18n — English language routes', () => {

  test.describe('Homepage', () => {
    test('/en displays English headline', async ({ page }) => {
      await page.goto('/en');
      await expect(page.locator('h1')).toContainText('AI agent pipeline');
    });
  });

  test.describe('Agents', () => {
    test('/en/agents displays English eyebrow', async ({ page }) => {
      await page.goto('/en/agents');
      await expect(page.locator('body')).toContainText('Nine agents');
    });
  });

  test.describe('About', () => {
    test('/en/about displays Collective Intelligence', async ({ page }) => {
      await page.goto('/en/about');
      await expect(page.locator('body')).toContainText('Collective Intelligence');
    });
  });

  test.describe('Workflow', () => {
    test('/en/workflow displays English hero', async ({ page }) => {
      await page.goto('/en/workflow');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toContainText('From issue to merge');
    });
  });

  test.describe('Ecosystem', () => {
    test('/en/ecosystem displays English content', async ({ page }) => {
      await page.goto('/en/ecosystem');
      await expect(page.locator('body')).toContainText('Infrastructure');
    });
  });

  test.describe('Problem & Innovation', () => {
    test('/en/problem-innovation displays English', async ({ page }) => {
      await page.goto('/en/problem-innovation');
      // Le kicker hero est hardcodé "Constat & Vision" — on vérifie le titre anglais
      await expect(page.locator('body')).toContainText('Why the Swarm');
    });
  });

  test.describe('MCP Tools', () => {
    test('/en/mcp-tools displays English', async ({ page }) => {
      await page.goto('/en/mcp-tools');
      await expect(page.locator('body')).toContainText('MCP Tools');
    });
  });

  test.describe('Language switcher', () => {
    test('toggles from FR to EN and back', async ({ page }) => {
      await page.goto('/a-propos');
      // Should be in French
      await expect(page.locator('body')).toContainText('collective');
      // Switch to English
      await page.click('.header__lang-switch');
      await page.waitForURL('**/en/about');
      await expect(page.locator('body')).toContainText('Collective Intelligence');
      // Switch back to French
      await page.click('.header__lang-switch');
      await page.waitForURL('**/a-propos');
      await expect(page.locator('body')).toContainText('collective');
    });
  });

  test.describe('404 page', () => {
    test('/en/nonexistent displays English', async ({ page }) => {
      await page.goto('/en/nonexistent');
      // notfound.message EN = "This page got lost in the Swarm. The agents are looking for it."
      await expect(page.locator('body')).toContainText('This page got lost');
    });
  });

  test.describe('Stay in English across navigation', () => {
    test('navigating from /en/about to /en/agents stays in English', async ({ page }) => {
      await page.goto('/en/about');
      await expect(page.locator('body')).toContainText('Collective Intelligence');
      // Naviguer vers Agents via le header
      const agentsLink = page.locator('.sidebar__nav').getByRole('link', { name: 'Agents' });
      await expect(agentsLink).toBeVisible({ timeout: 10000 });
      await agentsLink.click();
      await expect(page).toHaveURL('/en/agents', { timeout: 5000 });
      await expect(page.locator('body')).toContainText('Nine agents');
    });
  });

});
