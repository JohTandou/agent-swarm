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
| `**` | Redirect → `/` | — | ✅ |

La route `**` (wildcard) redirige vers l'accueil pour éviter les 404 SPA sur Vercel.

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

À date (T1) : **79 tests, coverage 100%** — chaque composant, service, route et modèle est testé.

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
