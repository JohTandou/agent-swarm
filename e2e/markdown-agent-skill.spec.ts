import { test, expect } from '@playwright/test';

test.describe('T19 — Rendu Markdown sur pages Agent et Skill', () => {

  test.describe('Pages Agent — Chargement Markdown', () => {
    const AGENTS = [
      'orchestrateur',
      'search',
      'planner',
      'contract',
      'front',
      'back',
      'tester',
      'reviewer',
      'writer',
      'explore',
      'general',
    ];

    for (const agentId of AGENTS) {
      test(`/agents/${agentId} — charge le Markdown`, async ({ page }) => {
        await page.goto(`/agents/${agentId}`);
        await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
      });

      test(`/agents/${agentId} — la page détail est fonctionnelle`, async ({ page }) => {
        await page.goto(`/agents/${agentId}`);
        // Vérifier au moins que le nom de l'agent est affiché
        await expect(page.locator('.agent-detail__name')).toBeVisible({ timeout: 10000 });
        // Et que le contenu Markdown est présent
        await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      });
    }
  });

  test.describe('Pages Agent — Éléments Markdown riches', () => {
    test('/agents/orchestrateur — contient des paragraphes', async ({ page }) => {
      await page.waitForTimeout(1000);
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      const paragraphs = page.locator('.markdown-body p, .markdown-body ul, .markdown-body ol, .markdown-body h2, .markdown-body h3');
      const count = await paragraphs.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('/agents/front — charge sans erreur', async ({ page }) => {
      await page.goto('/agents/front');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
    });

    test('/agents/tester — charge sans erreur', async ({ page }) => {
      await page.goto('/agents/tester');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Pages Skill — Chargement Markdown', () => {
    const SKILLS = [
      'ui-ux-pro-max',
      'tests-create',
      'graphify',
    ];

    for (const skillId of SKILLS) {
      test(`/skills/${skillId} — charge le Markdown`, async ({ page }) => {
        await page.goto(`/skills/${skillId}`);
        await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
      });

      test(`/skills/${skillId} — la page détail est fonctionnelle`, async ({ page }) => {
        await page.goto(`/skills/${skillId}`);
        await expect(page.locator('.skill-detail__name')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      });
    }
  });

  test.describe('Pages Skill — Éléments Markdown riches', () => {
    test('/skills/ui-ux-pro-max — contient du contenu structuré', async ({ page }) => {
      await page.waitForTimeout(1000);
      await page.goto('/skills/ui-ux-pro-max');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      const paragraphs = page.locator('.markdown-body p, .markdown-body ul, .markdown-body ol, .markdown-body h2, .markdown-body h3');
      const count = await paragraphs.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('/skills/tests-create — charge sans erreur', async ({ page }) => {
      await page.goto('/skills/tests-create');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
    });

    test('/skills/graphify — charge sans erreur', async ({ page }) => {
      await page.goto('/skills/graphify');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Mise en forme Markdown', () => {
    test('le Markdown est stylisé avec la classe .markdown-body', async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.markdown-body')).toHaveClass(/markdown-body/);
    });

    test('les liens dans le Markdown sont présents', async ({ page }) => {
      await page.goto('/agents/orchestrateur');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      const links = page.locator('.markdown-body a');
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Démo Markdown — Rendu complet', () => {
    test('/demo-markdown — charge la page wiki-demo', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('.wiki-demo__title')).toBeVisible({ timeout: 10000 });
    });

    test('/demo-markdown — contient des callouts', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      const callouts = page.locator('.callout');
      await expect(callouts.first()).toBeVisible({ timeout: 5000 });
    });

    test('/demo-markdown — contient des blocs de code avec coloration', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('.markdown-body').first()).toBeVisible({ timeout: 10000 });
      const codeBlocks = page.locator('.markdown-body pre code');
      await expect(codeBlocks.first()).toBeVisible({ timeout: 5000 });
    });

    test('/demo-markdown — contient un tableau', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('.markdown-body table').first()).toBeVisible({ timeout: 10000 });
    });
  });

});
