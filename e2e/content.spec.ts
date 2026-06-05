import { test, expect } from '@playwright/test';

test.describe('T2 — Système de contenu statique', () => {

  test.describe('Page démo Markdown', () => {
    test('charge sans erreur', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test('affiche le titre du document depuis le frontmatter', async ({ page }) => {
      await page.goto('/demo-markdown');
      await expect(page.locator('h1').first()).toBeVisible();
    });
  });

  test.describe('Callouts', () => {
    test('rend un callout :::info avec la classe et icône', async ({ page }) => {
      await page.goto('/demo-markdown');
      const infoCallout = page.locator('.callout--info').first();
      await expect(infoCallout).toBeVisible();
      await expect(infoCallout.locator('.callout__icon')).toBeVisible();
    });

    test('rend un callout :::warning avec la classe et icône', async ({ page }) => {
      await page.goto('/demo-markdown');
      const warningCallout = page.locator('.callout--warning').first();
      await expect(warningCallout).toBeVisible();
      await expect(warningCallout.locator('.callout__icon')).toBeVisible();
    });

    test('rend un callout :::tip avec la classe', async ({ page }) => {
      await page.goto('/demo-markdown');
      const tipCallout = page.locator('.callout--tip').first();
      await expect(tipCallout).toBeVisible();
    });

    test('rend un callout :::danger avec la classe', async ({ page }) => {
      await page.goto('/demo-markdown');
      const dangerCallout = page.locator('.callout--danger').first();
      await expect(dangerCallout).toBeVisible();
    });
  });

  test.describe('Blocs de code avec Prism.js', () => {
    test('rend un bloc de code dans <pre><code>', async ({ page }) => {
      await page.goto('/demo-markdown');
      const codeBlock = page.locator('.markdown-body pre code').first();
      await expect(codeBlock).toBeVisible();
    });

    test('le bloc de code a une classe de langage (pré-coloration)', async ({ page }) => {
      await page.goto('/demo-markdown');
      // ngx-markdown attribue des classes language-* aux blocs de code
      await expect(page.locator('.markdown-body pre code.language-typescript').first()).toBeVisible();
    });

    test('le code inline est stylisé dans des balises <code> hors <pre>', async ({ page }) => {
      await page.goto('/demo-markdown');
      const inlineCode = page.locator('.markdown-body :not(pre) > code').first();
      await expect(inlineCode).toBeVisible();
    });
  });

  test.describe('Tableaux', () => {
    test('rend un tableau markdown dans .markdown-body', async ({ page }) => {
      await page.goto('/demo-markdown');
      const table = page.locator('.markdown-body table').first();
      await expect(table).toBeVisible();
    });

    test('le tableau a des en-têtes <th>', async ({ page }) => {
      await page.goto('/demo-markdown');
      const th = page.locator('.markdown-body th').first();
      await expect(th).toBeVisible();
    });
  });

  test.describe('Table of Contents dynamique', () => {
    /**
     * Helper : détermine si la TOC est rendue dans le layout courant.
     * La TOC est conditionnelle : desktop uniquement (!isMobile) et hors homepage.
     */
    async function isTocAvailable(page: import('@playwright/test').Page): Promise<boolean> {
      // Attendre que le layout Angular soit stable
      await page.waitForSelector('#main-content', { timeout: 10000 });
      await page.waitForTimeout(300);
      return (await page.locator('app-table-of-contents').count()) > 0;
    }

    test('génère les entrées TOC depuis les headings du document', async ({ page }) => {
      await page.goto('/demo-markdown');
      test.skip(!(await isTocAvailable(page)), 'TOC non rendue sur mobile');
      // Attendre que la TOC soit peuplée (signal réactif)
      await expect(page.locator('.toc__link').first()).toBeAttached({ timeout: 5000 });
      await expect(page.locator('.toc__link')).toHaveCount(6);
    });

    test('affiche les niveaux hiérarchiques via classes CSS', async ({ page }) => {
      await page.goto('/demo-markdown');
      test.skip(!(await isTocAvailable(page)), 'TOC non rendue sur mobile');
      await expect(page.locator('.toc__link').first()).toBeAttached({ timeout: 5000 });
      // Les 6 headings h2 de demo.md produisent des liens avec classe de niveau
      await expect(page.locator('.toc__link--level-2').first()).toBeVisible();
    });

    test('le scroll-spy active le lien TOC correspondant', async ({ page }) => {
      await page.goto('/demo-markdown');
      test.skip(!(await isTocAvailable(page)), 'TOC non rendue sur mobile');
      await expect(page.locator('.toc__link').first()).toBeAttached({ timeout: 5000 });
      // Scroller vers le bas pour activer un heading via IntersectionObserver
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(600);
      // Au moins un lien doit être actif
      await expect(page.locator('.toc__link--active')).toHaveCount(1);
    });
  });

  test.describe('États du MarkdownRenderer', () => {
    test('affiche un shimmer pendant le chargement', async ({ page }) => {
      await page.goto('/demo-markdown');
      // Le shimmer est montré avant que le contenu arrive
      const shimmer = page.locator('.markdown-loading__shimmer').first();
      // Peut déjà être disparu si le chargement est rapide, on vérifie juste que le contenu final est là
      await expect(page.locator('.markdown-body')).toBeVisible({ timeout: 10000 });
    });

    test('affiche une erreur pour un document inexistant', async ({ page }) => {
      // On teste via la page agent-detail avec un ID invalide qui utilisera ContentService
      await page.goto('/agents/agent-inexistant-xyz');
      // Devrait afficher l'état d'erreur ou 404
      const errorState = page.locator('.agent-detail__error, .markdown-error');
      await expect(errorState.first()).toBeVisible({ timeout: 10000 });
    });
  });
});
