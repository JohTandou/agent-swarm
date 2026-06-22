# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-cross-section.spec.ts >> T18 — Responsive cross-section (desktop + mobile) >> Mobile — iPhone 14 (390×844) >> [Mobile] Démo Markdown — le hamburger est présent
- Location: e2e/responsive-cross-section.spec.ts:59:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.header__hamburger')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.header__hamburger')

```

```yaml
- link "Aller au contenu principal":
  - /url: "#main-content"
- banner:
  - link "Swarm Wiki — Accueil":
    - /url: /
    - text: Swarm Wiki
  - button
  - button
- main:
  - navigation "Fil d'Ariane":
    - list:
      - listitem:
        - link "Accueil":
          - /url: /
      - listitem: Démo Markdown
  - button "Sur cette page"
  - paragraph: Démonstration
  - heading "Système de contenu statique" [level=1]
  - paragraph: Cette page démontre le rendu Markdown riche avec callouts, coloration syntaxique et navigation intra-page via la table des matières.
  - article "Contenu du document":
    - heading "Fonctionnalités du moteur de contenu" [level=2]
    - paragraph:
      - text: Le système de contenu statique du
      - strong: Swarm Wiki
      - text: "repose sur trois piliers :"
    - list:
      - listitem:
        - strong: Chargement asynchrone
        - text: — les fichiers Markdown sont chargés à la demande via HTTP
      - listitem:
        - strong: Frontmatter YAML
        - text: — métadonnées structurées en tête de chaque document
      - listitem:
        - strong: Rendu riche
        - text: — coloration syntaxique, diagrammes Mermaid et callouts personnalisés
    - text: "💡 Le frontmatter est obligatoire pour chaque fichier `.md` du wiki. Il contient le titre, la description et l'ordre d'affichage."
    - heading "Architecture technique" [level=2]
    - paragraph: "Voici comment les composants s'articulent :"
    - table:
      - rowgroup:
        - row "Composant Responsabilité Technologie":
          - columnheader "Composant"
          - columnheader "Responsabilité"
          - columnheader "Technologie"
      - rowgroup:
        - row "ContentService Chargement et parsing des fichiers .md HttpClient + js-yaml":
          - cell "ContentService":
            - code: ContentService
          - cell "Chargement et parsing des fichiers .md":
            - text: Chargement et parsing des fichiers
            - code: .md
          - cell "HttpClient + js-yaml"
        - row "MarkdownRenderer Rendu HTML du Markdown avec extensions ngx-markdown + marked.js":
          - cell "MarkdownRenderer":
            - code: MarkdownRenderer
          - cell "Rendu HTML du Markdown avec extensions"
          - cell "ngx-markdown + marked.js"
        - row "TableOfContents Navigation intra-page avec scroll-spy IntersectionObserver":
          - cell "TableOfContents":
            - code: TableOfContents
          - cell "Navigation intra-page avec scroll-spy"
          - cell "IntersectionObserver"
        - row "Prism.js Coloration syntaxique des blocs de code Prism.js (thème dark custom)":
          - cell "Prism.js":
            - code: Prism.js
          - cell "Coloration syntaxique des blocs de code"
          - cell "Prism.js (thème dark custom)"
        - row "Mermaid Rendu des diagrammes Mermaid.js (lazy-load)":
          - cell "Mermaid":
            - code: Mermaid
          - cell "Rendu des diagrammes"
          - cell "Mermaid.js (lazy-load)"
    - text: "ℹ️ Tous les composants sont **standalone** et utilisent le nouveau control flow Angular (`@if`, `@for`)."
    - heading "Exemple de code — ContentService" [level=2]
    - paragraph: "Le service de contenu charge et parse les documents Markdown :"
    - code: "@Injectable({ providedIn: 'root' }) export class ContentService { constructor(private http: HttpClient) {} loadDocument(sourcePath: string): Observable<MarkdownDocument> { return this.http.get(`/content/${sourcePath}`, { responseType: 'text' }).pipe( map((raw) => this.parseDocument(raw, sourcePath)), catchError((err) => { console.error(`[ContentService] Échec : ${sourcePath}`, err); return throwError(() => new Error(`Fichier \"${sourcePath}\" introuvable.`)); }), ); } private parseDocument(raw: string, sourcePath: string): MarkdownDocument { // Extraction frontmatter YAML // Construction hiérarchie des headings // Aplatissement en TocEntry[] return { frontmatter, content, headings, tocEntries, sourcePath }; } }"
    - text: ⚠️ Le YAML du frontmatter doit être syntaxiquement valide. Une erreur de parsing ne bloque pas le rendu mais les métadonnées seront vides.
    - heading "Les callouts" [level=2]
    - paragraph: "Le moteur supporte 4 types de callouts pour structurer l'information :"
    - text: ℹ️ **Information** — pour les notes contextuelles et les précisions techniques. 💡 **Astuce** — pour les conseils pratiques et les bonnes pratiques à retenir. ⚠️ **Attention** — pour les points importants qui méritent une vigilance particulière. 🚨 **Danger** — pour les erreurs courantes ou les pièges à éviter absolument.
    - heading "Tableau des dépendances" [level=2]
    - paragraph: "Voici les dépendances ajoutées pour le système de contenu :"
    - table:
      - rowgroup:
        - row "Paquet Version Poids approx. Usage":
          - columnheader "Paquet"
          - columnheader "Version"
          - columnheader "Poids approx."
          - columnheader "Usage"
      - rowgroup:
        - row "ngx-markdown 19.x ~80KB Composant Angular de rendu Markdown":
          - cell "ngx-markdown":
            - code: ngx-markdown
          - cell "19.x"
          - cell "~80KB"
          - cell "Composant Angular de rendu Markdown"
        - row "marked 15.x ~35KB Parseur Markdown (utilisé par ngx-markdown)":
          - cell "marked":
            - code: marked
          - cell "15.x"
          - cell "~35KB"
          - cell "Parseur Markdown (utilisé par ngx-markdown)"
        - row "prismjs 1.30 ~10KB Coloration syntaxique (no Babel, no React)":
          - cell "prismjs":
            - code: prismjs
          - cell "1.30"
          - cell "~10KB"
          - cell "Coloration syntaxique (no Babel, no React)"
        - row "mermaid 11.x ~500KB Diagrammes (lazy-load, chargé à la demande)":
          - cell "mermaid":
            - code: mermaid
          - cell "11.x"
          - cell "~500KB"
          - cell "Diagrammes (lazy-load, chargé à la demande)"
        - row "js-yaml 4.x ~15KB Parsing du frontmatter YAML":
          - cell "js-yaml":
            - code: js-yaml
          - cell "4.x"
          - cell "~15KB"
          - cell "Parsing du frontmatter YAML"
    - heading "Prochaines étapes" [level=2]
    - paragraph: "Le système de contenu statique est maintenant opérationnel. Les prochaines itérations apporteront :"
    - list:
      - listitem:
        - text: La
        - strong: recherche full-text
        - text: avec Fuse.js
      - listitem:
        - text: Les
        - strong: pages agents, skills et tools
        - text: en Markdown
      - listitem:
        - text: Le
        - strong: système de routage contextuel
        - text: pour la navigation intra-wiki
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('T18 — Responsive cross-section (desktop + mobile)', () => {
  4   | 
  5   |   const PAGES_TO_TEST = [
  6   |     { route: '/',                         name: 'Accueil' },
  7   |     { route: '/a-propos',                 name: 'À propos' },
  8   |     { route: '/agents',                   name: 'Agents — liste' },
  9   |     { route: '/agents/orchestrateur',     name: 'Agents — détail' },
  10  |     { route: '/skills',                   name: 'Skills — liste' },
  11  |     { route: '/skills/ui-ux-pro-max',     name: 'Skills — détail' },
  12  |     { route: '/workflow',                 name: 'Workflow' },
  13  |     { route: '/probleme-innovation',      name: 'Problème & Innovation' },
  14  |     { route: '/demo-markdown',            name: 'Démo Markdown' },
  15  |     { route: '/outils-mcp/supabase',      name: 'Outils MCP — Supabase' },
  16  |     { route: '/outils-mcp/vercel',        name: 'Outils MCP — Vercel' },
  17  |     { route: '/outils-mcp/render',        name: 'Outils MCP — Render' },
  18  |     { route: '/outils-mcp/playwright',    name: 'Outils MCP — Playwright' },
  19  |   ];
  20  | 
  21  |   test.describe('Desktop (1280×720)', () => {
  22  |     test.use({ viewport: { width: 1280, height: 720 } });
  23  | 
  24  |     for (const { route, name } of PAGES_TO_TEST) {
  25  |       test(`[Desktop] ${name} — la page se charge correctement`, async ({ page }) => {
  26  |         await page.goto(route);
  27  |         await expect(page.locator('#main-content, .homepage__hero').first()).toBeVisible({ timeout: 10000 });
  28  |         // Vérifier que l'URL correspond (tolère les redirections)
  29  |         await page.waitForTimeout(300);
  30  |       });
  31  | 
  32  |       test(`[Desktop] ${name} — le header est visible`, async ({ page }) => {
  33  |         await page.goto(route);
  34  |         await expect(page.locator('.header__brand')).toBeVisible({ timeout: 10000 });
  35  |       });
  36  | 
  37  |       test(`[Desktop] ${name} — le layout shell est chargé`, async ({ page }) => {
  38  |         await page.goto(route);
  39  |         await expect(page.locator('.shell-layout').first()).toBeAttached({ timeout: 10000 });
  40  |       });
  41  |     }
  42  |   });
  43  | 
  44  |   test.describe('Mobile — iPhone 14 (390×844)', () => {
  45  |     test.use({ viewport: { width: 390, height: 844 } });
  46  | 
  47  |     for (const { route, name } of PAGES_TO_TEST) {
  48  |       test(`[Mobile] ${name} — la page se charge correctement`, async ({ page }) => {
  49  |         await page.goto(route);
  50  |         await expect(page.locator('#main-content, .homepage__hero').first()).toBeVisible({ timeout: 10000 });
  51  |         await page.waitForTimeout(300);
  52  |       });
  53  | 
  54  |       test(`[Mobile] ${name} — le header est visible`, async ({ page }) => {
  55  |         await page.goto(route);
  56  |         await expect(page.locator('.header__brand')).toBeVisible({ timeout: 10000 });
  57  |       });
  58  | 
  59  |       test(`[Mobile] ${name} — le hamburger est présent`, async ({ page }) => {
  60  |         await page.goto(route);
> 61  |         await expect(page.locator('.header__hamburger')).toBeVisible({ timeout: 10000 });
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  62  |       });
  63  |     }
  64  |   });
  65  | 
  66  |   test.describe('Mobile — Menu hamburger', () => {
  67  |     test.use({ viewport: { width: 390, height: 844 } });
  68  | 
  69  |     test('ouvre la sidebar overlay via hamburger', async ({ page }) => {
  70  |       await page.goto('/a-propos');
  71  |       await page.locator('.header__hamburger').click();
  72  |       await page.waitForTimeout(300);
  73  |       await expect(page.locator('.shell-layout__sidebar--overlay')).toBeAttached({ timeout: 5000 });
  74  |       await expect(page.locator('.sidebar-overlay')).toBeVisible({ timeout: 5000 });
  75  |     });
  76  | 
  77  |     test('ferme la sidebar overlay via le bouton close', async ({ page }) => {
  78  |       await page.goto('/a-propos');
  79  |       await page.locator('.header__hamburger').click();
  80  |       await page.waitForTimeout(300);
  81  |       await expect(page.locator('.shell-layout__sidebar--overlay')).toBeAttached({ timeout: 5000 });
  82  |       await page.locator('.sidebar__close').dispatchEvent('click');
  83  |       await page.waitForTimeout(300);
  84  |       await expect(page.locator('.shell-layout__sidebar--overlay')).not.toBeAttached({ timeout: 5000 });
  85  |     });
  86  | 
  87  |     test('ferme la sidebar overlay via tap sur l\'overlay', async ({ page }) => {
  88  |       await page.goto('/a-propos');
  89  |       await page.locator('.header__hamburger').click();
  90  |       await page.waitForTimeout(300);
  91  |       await expect(page.locator('.sidebar-overlay')).toBeVisible({ timeout: 5000 });
  92  |       await page.locator('.sidebar-overlay').click();
  93  |       await page.waitForTimeout(300);
  94  |       await expect(page.locator('.shell-layout__sidebar--overlay')).not.toBeAttached({ timeout: 5000 });
  95  |     });
  96  |   });
  97  | 
  98  |   test.describe('Desktop large — 1920×1080', () => {
  99  |     test.use({ viewport: { width: 1920, height: 1080 } });
  100 | 
  101 |     test('la grille hexagonale est visible sur grand écran', async ({ page }) => {
  102 |       await page.goto('/');
  103 |       const canvas = page.locator('.hex-grid__canvas');
  104 |       const count = await canvas.count();
  105 |       if (count > 0) {
  106 |         await expect(canvas).toBeVisible({ timeout: 10000 });
  107 |       }
  108 |       // La page doit être chargée dans tous les cas
  109 |       await expect(page.locator('.homepage__hero')).toBeVisible({ timeout: 10000 });
  110 |     });
  111 | 
  112 |     test('le layout shell est bien proportionné', async ({ page }) => {
  113 |       await page.goto('/a-propos');
  114 |       await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });
  115 |       await expect(page.locator('.shell-layout').first()).toBeAttached({ timeout: 10000 });
  116 |     });
  117 |   });
  118 | 
  119 | });
  120 | 
```