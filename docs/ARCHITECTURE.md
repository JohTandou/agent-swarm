# Architecture — Swarm Wiki

## Vue d'ensemble

Swarm Wiki est une application **100% statique** — pas de backend, pas d'API, pas de base de données. Le contenu est stocké en fichiers Markdown dans `src/content/` (T2) et rendu côté client via ngx-markdown. Les pages à fort impact visuel (accueil, workflow, architecture) sont des composants Angular purs pour un contrôle Apple-grade total.

## Décisions Techniques

### Pourquoi Angular 19

Angular 19 est la dernière version stable au démarrage du projet (juin 2026). Les standalone components sont matures — plus de NgModules, plus simples à lazy-loader, tree-shaking natif. Le nouveau control flow (`@if`, `@for`) remplace les directives structurelles, code plus lisible. Pour un wiki statique greenfield, aucune raison de partir sur une version antérieure.

### Pourquoi Tailwind v4 + SCSS (et pas l'un ou l'autre)

**Tailwind v4** apporte le utility-first rapide pour le layout, les espacements et la typographie — l'essentiel des composants est stylé en classes utilitaires, pas de CSS écrit main. Le mode CSS-first (pas de `tailwind.config`, `@theme` dans le CSS) expose les design tokens (palette, polices, breakpoints) comme des utilitaires Tailwind.

**SCSS** est réservé aux animations complexes, keyframes custom, et design tokens programmatiques que Tailwind ne peut pas exprimer élégamment (stagger children avec boucle `@for`, easings `cubic-bezier()`). Cette séparation claire évite que le SCSS ne devienne un fourre-tout.

### Pourquoi Angular CDK, pas Material

Angular CDK fournit des primitives headless pour l'accessibilité (BreakpointObserver pour responsive, à venir : Overlay pour modale recherche, FocusTrap, keyboard nav). Il n'impose **aucun style** — tout le rendu visuel est custom, ce qui est indispensable pour le standard Apple-grade. Material et shadcn imposent un design system incompatible avec la direction esthétique dark technologique raffiné.

### Pourquoi Signals + Services, pas NgRx

Le wiki est statique — l'état applicatif se résume à : page courante, état d'ouverture sidebar, breadcrumbs, TOC active. Les Signals Angular natifs offrent une réactivité fine sans le boilerplate de NgRx (actions, reducers, effets, selectors). Pour ~200 pages de contenu sans état complexe partagé, NgRx serait de la sur-ingénierie.

La règle : un service par domaine fonctionnel (ContentService, SearchService, NavigationService) avec des Signals exposés pour la réactivité.

### Pourquoi lazy loading par feature

Chaque section (agents, skills, workflow, outils MCP) a son propre routeur lazy-loadé via `loadChildren`. La homepage et le layout shell sont chargés eagerly (critiques pour le LCP). Objectif : bundle initial < 500KB (budget configuré dans angular.json) et score Lighthouse ≥ 90.

### Pourquoi Fuse.js pour la recherche, pas un index côté serveur

Volume modéré (~200 pages de contenu, pas des millions). Fuse.js fait du fuzzy search client-side — pas d'index à construire, pas de backend, réponses instantanées après le chargement initial du JSON de contenu. La recherche est un modal Cmd+K / Ctrl+K avec résultats en temps réel et navigation clavier.

### Pourquoi Vercel (et pas GitHub Pages)

Vercel offre un CDN global, SSL automatique, déploiement Git automatique, et un MCP natif accessible aux agents de la swarm. Supporte les SPA nativement (rewrites). GitHub Pages nécessiterait des workarounds pour l'historique HTML5 et n'a pas de MCP. Vercel est le standard de fait pour les static sites modernes.

### Pourquoi Cabinet Grotesk + Satoshi (et pas Inter/Roboto)

Cabinet Grotesk a une personnalité affirmée — tracking serré, graisses extrêmes (800), fonctionne en grandes tailles comme élément graphique. Satoshi est géométrique, élégante, optimisée lecture écran longue durée. Les deux sont gratuites via Fontshare — pas de licence, chargement optimisé (CDN, `display=swap`). Inter et Roboto sont explicitement interdits : trop génériques, connotés "template SaaS".

## Structure du Projet

```
swarm-wiki/
├── src/
│   ├── app/
│   │   ├── layout/                     # Composants du shell applicatif
│   │   │   ├── header/                 # En-tête glassmorphique fixe
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   ├── header.component.scss
│   │   │   │   └── header.component.spec.ts
│   │   │   ├── sidebar/                # Navigation hiérarchique 280px
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   ├── sidebar.component.scss
│   │   │   │   └── sidebar.component.spec.ts
│   │   │   ├── breadcrumbs/            # Fil d'Ariane accessible
│   │   │   │   ├── breadcrumbs.component.ts
│   │   │   │   ├── breadcrumbs.component.html
│   │   │   │   ├── breadcrumbs.component.scss
│   │   │   │   └── breadcrumbs.component.spec.ts
│   │   │   └── toc-placeholder/        # TOC shimmer en attendant T2
│   │   │       ├── toc-placeholder.component.ts
│   │   │       └── toc-placeholder.component.spec.ts
│   │   ├── features/                   # Pages lazy-loadées
│   │   │   ├── homepage/               # Accueil (eager, critique LCP)
│   │   │   │   ├── homepage.component.ts
│   │   │   │   ├── homepage.routes.ts
│   │   │   │   └── homepage.component.spec.ts
│   │   │   └── about/                  # À propos (lazy)
│   │   │       ├── about.component.ts
│   │   │       ├── about.routes.ts
│   │   │       └── about.component.spec.ts
│   │   ├── shared/                     # Code partagé transverse
│   │   │   └── models/                 # Interfaces TypeScript
│   │   │       ├── index.ts            # Barrel export
│   │   │       ├── navigation.model.ts # NavItem (sidebar hiérarchique)
│   │   │       ├── breadcrumb.model.ts # Breadcrumb (fil d'Ariane)
│   │   │       ├── toc-entry.model.ts  # TocEntry (table des matières)
│   │   │       └── shell-config.model.ts # ShellConfig (layout responsive)
│   │   ├── app.component.ts            # Shell racine 3 colonnes responsive
│   │   ├── app.component.html          # Template shell avec sidebar overlay mobile
│   │   ├── app.component.scss          # Grille flexbox, breakpoints, z-index
│   │   ├── app.config.ts               # Providers (zoneless + router)
│   │   ├── app.config.spec.ts
│   │   ├── app.routes.ts               # Lazy loading homepage + about + wildcard
│   │   └── app.routes.spec.ts
│   ├── styles/
│   │   ├── styles.css                  # Thème Tailwind v4, palette, typo, reset, scrollbar, focus
│   │   └── animations.scss             # Keyframes (fadeSlideIn, shimmer, pulseGlow, slowRotate), easings, stagger, reduced-motion
│   ├── index.html                      # Point d'entrée, meta, Fontshare CDN
│   └── main.ts                         # Bootstrap standalone (bootstrapApplication)
├── docs/                               # Documentation projet
│   └── ARCHITECTURE.md                 # Ce fichier
├── public/                             # Assets statiques (favicon, etc.)
├── angular.json                        # Config Angular CLI (build, test, budgets)
├── package.json                        # Dépendances (Angular 19, Tailwind v4, CDK)
├── postcss.config.js                   # Plugin @tailwindcss/postcss
├── tsconfig.json                       # TypeScript strict, path alias @shared/*
├── CHANGELOG.md                        # Historique des versions
├── README.md                           # Présentation, setup, commandes
├── AGENTS.md                           # Bible des agents swarm
└── PLAN.md                             # Plan d'implémentation 20 tâches
```

## Flux de Données

Le wiki étant statique, le flux de données est exclusivement **navigateur → fichiers statiques → rendu client** :

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Navigateur  │────▶│  Angular Router  │────▶│  Composant / Page  │
│  (URL)       │     │  (lazy loading)  │     │  (standalone)      │
└─────────────┘     └──────────────────┘     └────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  ContentService (T2)  │
                                          │  Charge le .md depuis │
                                          │  src/content/         │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  ngx-markdown         │
                                          │  Parse Markdown →     │
                                          │  HTML + Prism.js      │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  DOM — Rendu final    │
                                          │  (palette dark, typo  │
                                          │   Cabinet+Satoshi)    │
                                          └───────────────────────┘
```

**Remarques** :
- Pas d'appels réseau vers une API — tout est chargé depuis le filesystem (build-time) ou le CDN (fonts).
- La recherche (T13) utilise Fuse.js avec un index construit côté client à partir des fichiers `.md`.
- Les composants purs (homepage, workflow) ne passent pas par Markdown — leur contenu est directement dans le template TypeScript.

## Routes et Lazy Loading

| Route | Composant | Chargement | Status T1 |
|---|---|---|---|
| `/` | HomepageComponent | Eager (critique LCP) | ✅ Placeholder |
| `/a-propos` | AboutComponent | Lazy | ✅ Placeholder |
| `/agents` | AgentsListComponent | Lazy | ⬜ T5 (à venir) |
| `/agents/:id` | AgentDetailComponent | Lazy | ⬜ T5 (à venir) |
| `/skills` | SkillsListComponent | Lazy | ⬜ T8 (à venir) |
| `/skills/:id` | SkillDetailComponent | Lazy | ⬜ T8 (à venir) |
| `/workflow` | WorkflowComponent | Lazy | ⬜ T7 (à venir) |
| `/outils-mcp/:category` | McpToolsComponent | Lazy | ⬜ T10 (à venir) |
| `/demo-markdown` | WikiDemoComponent | Lazy | ✅ T2 |
| `**` | Redirect → `/` | — | ✅ |

La route `**` (wildcard) redirige vers l'accueil pour éviter les 404 SPA sur Vercel.

## Système de contenu (T2)

Le système de contenu statique transforme des fichiers Markdown bruts en pages HTML Apple-grade. Le pipeline complet :

```
src/content/*.md  →  ContentService  →  MarkdownDocument  →  MarkdownRenderer  →  DOM
       │                    │                                      │
       │              [parse YAML]                           [pre-processing]
       │              [extract headings]                     [ngx-markdown]
       │              [flatten → TocEntry[]]                 [post-processing]
       │                    │                                      │
       │              TocService ◄─────────────────────────────────┘
       │              (Signals réactifs)
       │                    │
       │              TableOfContentsComponent
       │              (scroll-spy IntersectionObserver)
```

### ContentService — Chargement et parsing

Le `ContentService` (singleton, `providedIn: 'root'`) expose une méthode unique :

```typescript
loadDocument(sourcePath: string): Observable<MarkdownDocument>
```

**Fonctionnement interne** :
1. **Chargement** : `HttpClient.get(/content/${sourcePath})` en mode `text` — les fichiers `.md` sont dans `src/content/`, servis comme assets statiques par le dev server et inclus dans le build.
2. **Parsing YAML** : le bloc frontmatter délimité par `---` est extrait via regex et parsé avec `js-yaml`. Champs obligatoires : `title`, `description`, `order`. Les champs supplémentaires sont conservés (extensibilité). Une erreur YAML ne bloque pas le rendu — le frontmatter est ignoré avec un `console.warn`.
3. **Extraction des headings** : regex `^(#{1,4})\s+(.+)$` capture les h1–h4, construit une hiérarchie arborescente (`HeadingNode[]`) par niveau via une pile, puis aplatit en `TocEntry[]` (niveaux 1–3 uniquement).
4. **Slugification** : génération de slugs HTML (`"Mon Titre !"` → `"mon-titre"`) via normalisation Unicode NFD, suppression des accents et caractères spéciaux.

### TocService — État réactif partagé

Le `TocService` découple le producteur (`MarkdownRendererComponent`) du consommateur (`TableOfContentsComponent`) via deux Signals :

```typescript
readonly entries = signal<TocEntry[]>([]);   // Hiérarchie TOC complète
readonly activeId = signal<string>('');       // Slug du heading visible (scroll-spy)
```

Ce découplage permet au `MarkdownRendererComponent` d'être réutilisé sans dépendance au TOC, et au `TableOfContentsComponent` de fonctionner avec n'importe quelle source de `TocEntry[]`.

### MarkdownRendererComponent — Rendu riche

Composant standalone (`<app-markdown-renderer>`) acceptant soit un `sourcePath` (charge via ContentService), soit un `content` brut.

**Pre-processing** (avant ngx-markdown) :
- **Callouts** : `:::info`, `:::warning`, `:::tip`, `:::danger` sont transformés en `<div class="callout callout--{type}">` avec icônes (ℹ️/⚠️/💡/🚨) et bordures colorées
- **Ancres** : injection de `<a id="slug" class="heading-anchor">` avant chaque heading pour le scroll-spy TOC

**Post-processing** (après rendu ngx-markdown) :
- **Mermaid.js** : import dynamique `import('mermaid')` déclenché uniquement si des blocs `language-mermaid` sont détectés (~500KB lazy-load). Thème dark synchronisé avec la palette (fond `#3A3530`, texte `#F5F0EB`, bordures `rgba(142,136,130,0.3)`)
- **Prism.js** : coloration via `markdownService.highlight()` — applique le thème custom `prism-theme.css`

**États gérés** :
| État | Rendu |
|---|---|
| Loading | 3 barres shimmer animées (largeurs 100%/70%/40%) |
| Error | Bloc avec bordure ambrée, titre "Erreur de chargement", message explicite |
| Empty | Message "Aucun contenu à afficher" + hint "Fournissez un chemin source ou du contenu brut" |
| Success | Rendu Markdown complet avec callouts, code colorisé, tableaux |

### TableOfContentsComponent — Navigation intra-page

Composant standalone (`<app-table-of-contents>`) dans la colonne latérale droite (220px).

- **Scroll-spy** : `IntersectionObserver` avec `rootMargin: '-64px 0 -20% 0'` (compense le header fixe de 64px). Détecte le premier heading visible et met à jour `TocService.activeId()`
- **Hiérarchie visuelle** : indentation par niveau (h1: 0px, h2: 16px, h3: 32px), variations de taille de police et opacité
- **Navigation** : clic → `scrollIntoView({ behavior: 'smooth' })` avec désactivation temporaire de l'observer (800ms) pour éviter les conflits
- **Animation** : entrée stagger — le bloc TOC fade-in + translateY(8px→0) après un délai de 50ms post-chargement
- **État vide** : message "Aucune section" + hint "Naviguez vers un document pour voir la table des matières"

### Thème Prism.js dark custom

`src/styles/prism-theme.css` (183 lignes) — coloration syntaxique utilisant exclusivement la palette 6 couleurs :

| Token | Couleur | Style |
|---|---|---|
| Commentaires | `--color-text-secondary` | Italique |
| Mots-clés, attributs | `--color-accent` | Gras 500 |
| Fonctions, classes | `--color-text-primary` | Gras 500 |
| Chaînes, sélecteurs | `--color-text-primary` | Normal |
| Ponctuation, opérateurs | `--color-text-secondary` | Normal |
| Code inline | `--color-accent` sur fond `--color-bg-subtle` | — |

Support additionnel : line numbers (bordures `rgba(142,136,130,0.2)`), toolbar copier (bouton avec hover glow ambré).

### Structure du contenu

```
src/content/
├── .gitkeep              # Placeholder pour Git
└── demo.md               # Démo du système (105 lignes, frontmatter YAML)
```

**Convention** : chaque fichier `.md` DOIT avoir un bloc frontmatter YAML avec `title`, `description` et `order`. Le corps du document est en Markdown standard avec extensions callout `:::type`.

## Système d'Élévation Dark

Les ombres classiques sont invisibles sur fond `#3A3530`. Le système utilise des **bordures lumineuses** et des **contrastes de surface** :

| Niveau | Fond | Bordure | Box-shadow | Usage |
|---|---|---|---|---|
| N1 | `#3A3530` | — | — | Fond de page |
| N2 | `#4A4540` | `1px rgba(142,136,130, 0.12)` | — | Cartes, sidebar |
| N3 | `#4A4540` | `1px rgba(142,136,130, 0.20)` | `0 0 20px rgba(240,165,34, 0.04)` | Cartes surélevées |
| N4 | `#4A4540` | `1px rgba(142,136,130, 0.30)` | `0 0 40px rgba(240,165,34, 0.06)` | Modale, overlay |

Le header utilise le glassmorphism : `backdrop-filter: blur(12px)` + fond semi-transparent.

## Typographie

| Rôle | Police | Graisses | Usage |
|---|---|---|---|
| Display | Cabinet Grotesk | 800, 700 | H1–H2, labels navigation, stats |
| Body | Satoshi | 500, 400 | Paragraphes, code, tableaux, métadonnées |

Les deux sont chargées depuis Fontshare CDN dans `index.html` avec `display=swap`.

## Tests

**Framework** : Jasmine + Karma (Angular CLI default).

À date (T2) : **194 tests, coverage 89.5%** — tous les composants, services, modèles et routes sont testés. Le coverage légèrement inférieur à T1 s'explique par les branches de gestion d'erreur asynchrone dans le ContentService (timeout HTTP, YAML corrompu) difficiles à couvrir en Jasmine/Karma.

**À venir (T16)** : migration vers Jest pour les snapshots et le watch mode. Playwright pour les E2E (T17).

## Build & Déploiement

**Build** : `@angular-devkit/build-angular:application` — bundler esbuild, pas de Webpack.

**Budgets** (angular.json) :
- Initial bundle : 500KB warning, 1MB error
- Style par composant : 4KB warning, 8KB error

**Déploiement Vercel** (T19) :
- Build command : `ng build`
- Output directory : `dist/swarm-wiki/browser`
- SPA rewrites via `vercel.json`
- Merge main → déploiement automatique
