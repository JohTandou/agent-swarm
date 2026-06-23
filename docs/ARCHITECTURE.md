# Architecture — Swarm Wiki

## Vue d'ensemble

Swarm Wiki est une application **100% statique** — pas de backend, pas d'API, pas de base de données. Le contenu est stocké en fichiers Markdown dans `src/content/`, rendu côté client via ngx-markdown. Les pages à fort impact visuel (accueil, workflow, problème & innovation) sont des composants Angular purs pour un contrôle Apple-grade total.

**Principe fondamental** : le wiki est une vitrine du système Swarm. Chaque pixel, chaque animation, chaque mot communique la qualité du système documenté.

## Décisions Techniques

### F1 : Pourquoi Angular 19

Angular 19 (juin 2026) est la dernière version stable au démarrage du projet. Les standalone components sont matures — plus de NgModules, tree-shaking natif, lazy loading simplifié. Le nouveau control flow (`@if`, `@for`, `@let`) remplace les directives structurelles pour un code plus lisible. Pour un wiki statique greenfield, aucune raison de partir sur une version antérieure.

### F2 : Pourquoi Tailwind v4 + SCSS (et pas l'un ou l'autre)

**Tailwind v4** apporte l'utility-first rapide pour le layout, les espacements et la typographie. Le mode CSS-first (`@theme` dans le CSS, pas de `tailwind.config`) expose les design tokens (palette, polices, breakpoints) comme des classes utilitaires.

**SCSS** est réservé aux animations complexes, keyframes custom, et design tokens programmatiques que Tailwind ne peut pas exprimer élégamment (stagger children avec boucle `@for`, easings `cubic-bezier()`). Cette séparation claire évite que le SCSS ne devienne un fourre-tout.

### F3 : Pourquoi Angular CDK, pas Material

Angular CDK fournit des primitives headless pour l'accessibilité (`BreakpointObserver` pour responsive, `Overlay` pour la modale recherche, `FocusTrap` pour le clavier). Il n'impose **aucun style** — tout le rendu visuel est custom, indispensable pour le standard Apple-grade. Material et shadcn imposent un design system incompatible avec la direction esthétique dark technologique raffiné.

### F4 : Pourquoi Signals + Services, pas NgRx

Le wiki est statique — l'état applicatif se résume à : page courante, état d'ouverture sidebar, breadcrumbs, TOC active, résultats de recherche. Les Signals Angular natifs offrent une réactivité fine sans le boilerplate de NgRx (actions, reducers, effets, selectors). Pour 36 pages de contenu sans état complexe partagé, NgRx serait de la sur-ingénierie.

La règle : un service par domaine fonctionnel (`ContentService`, `SearchService`, `AnimationService`) avec des Signals exposés pour la réactivité.

### F5 : Pourquoi GSAP (et pas @angular/animations seul)

`@angular/animations` gère les transitions de base (enter/leave). GSAP apporte ce que l'Apple-grade exige : ScrollTrigger pour les animations liées au scroll, timelines complexes, parallaxe multi-vitesses, stagger sequences, compteurs animés. Chargement lazy-load (via `AnimationService`) pour ne pas pénaliser le bundle initial.

### F6–F7 : Pourquoi Jasmine+Karma / Playwright (et pas Jest / Cypress)

**Jasmine+Karma** est le défaut Angular CLI — pas de migration nécessaire, intégration native, exécution dans Chrome headless. 194 tests, coverage 89.5%.

**Playwright** offre : auto-waiting natif (pas de `cy.wait()`), tests cross-browser (Chromium + iPhone 14), visual comparisons, trace viewer, et intégration swarm via MCP. Configuré avec `colorScheme: 'dark'` pour correspondre au thème.

### F8 : Pourquoi ngx-markdown + marked.js

Wrapper Angular mature pour marked.js, support natif des plugins, custom renderers, intégration Prism.js. Permet le pre-processing (callouts, ancres) et post-processing (Mermaid lazy-load, coloration) dans le cycle de vie Angular.

### F9 : Pourquoi Prism.js (et pas Shiki)

Prism.js est léger (~1.5KB par langage chargé à la demande), thème entièrement customisable en CSS (183 lignes dans la palette 6 couleurs). Shiki est plus précis (grammaires TextMate) mais plus lourd et nécessite un runtime WASM. Pour un wiki statique, Prism.js est le bon compromis.

### F10 : Pourquoi Mermaid.js + D3.js

**Mermaid.js** (lazy-load, ~500KB) pour les diagrammes Markdown standard — intégration native avec ngx-markdown, thème dark synchronisé avec la palette.

**D3.js** exclusivement pour la carte interactive de la homepage (`SwarmGraphComponent`) : graphe force-directed des 9 agents avec connexions animées, zoom/pan, tooltips. D3.js est chargé paresseusement (comme Mermaid et GSAP).

### F11 : Pourquoi Fuse.js (et pas lunr.js)

Volume modéré (36 pages, pas des millions). Fuse.js fait du fuzzy search client-side — pas d'index à construire, pas de backend, réponses instantanées après le chargement initial. Configuration : pondération titre (50%), description (30%), section (20%), seuil 0.4 pour une recherche inclusive.

### C1 : Stratégie de contenu hybride

- **Pages à fort impact visuel** (accueil, workflow, problème & innovation) = composants Angular purs. Contrôle total sur le layout, les animations GSAP, le responsive
- **Pages de référence** (agents, skills) = Markdown. Cohérence structurelle, maintenabilité, rédaction accessible aux non-développeurs
- **Template Markdown riche** : callouts `:::info`/`:::warning`/`:::tip`/`:::danger`, code colorisé, tableaux, diagrammes Mermaid — le meilleur des deux mondes

### C2 : Pourquoi Vercel (et pas GitHub Pages)

Vercel offre : CDN global, SSL automatique, déploiement Git automatique, MCP natif accessible aux agents swarm, support SPA natif (rewrites). GitHub Pages nécessiterait des workarounds pour l'historique HTML5.

### C3 : Pourquoi lazy loading par feature

Chaque section a son propre routeur lazy-loadé via `loadChildren`. La homepage et le layout shell sont chargés eagerly (critiques pour le LCP). Objectif : bundle initial < 500KB (budget configuré dans `angular.json`).

## Structure du Projet

```
agent-swarm/
├── src/
│   ├── app/
│   │   ├── layout/                     # Composants du shell applicatif
│   │   │   ├── header/                 # En-tête glassmorphique fixe (64px)
│   │   │   ├── sidebar/                # Navigation hiérarchique 280px, menus pliables
│   │   │   ├── breadcrumbs/            # Fil d'Ariane accessible (aria-label)
│   │   │   └── toc-placeholder/        # TOC shimmer (phase T1, remplacé T2)
│   │   ├── features/                   # Pages lazy-loadées par section
│   │   │   ├── homepage/               # Accueil (eager) — D3.js swarm graph + Canvas hex grid
│   │   │   ├── about/                  # À propos + stats (lazy)
│   │   │   ├── agents/                 # 9 agents — liste + détail Markdown (lazy)
│   │   │   ├── skills/                 # 26 skills — liste + détail Markdown (lazy)
│   │   │   ├── workflow/               # Pipeline interactif 5 routes (lazy)
│   │   │   ├── mcp-tools/              # 4 catégories d'outils MCP (lazy)
│   │   │   ├── problem-innovation/     # Avant/Après, comparaisons (lazy)
│   │   │   ├── standards/              # Conventions et standards (lazy)
│   │   │   └── wiki-demo/              # Démo système Markdown (lazy)
│   │   ├── shared/                     # Code partagé transverse
│   │   │   ├── components/             # Composants réutilisables
│   │   │   │   ├── markdown-renderer/  # Rendu Markdown riche (callouts, Prism, Mermaid)
│   │   │   │   ├── table-of-contents/  # TOC avec scroll-spy IntersectionObserver
│   │   │   │   └── search-modal/       # Modale Cmd+K (CDK Overlay, Fuse.js)
│   │   │   ├── models/                 # Interfaces TypeScript (16 modèles)
│   │   │   │   ├── navigation.model.ts # NavItem (sidebar hiérarchique)
│   │   │   │   ├── breadcrumb.model.ts # Breadcrumb (fil d'Ariane)
│   │   │   │   ├── toc-entry.model.ts  # TocEntry (table des matières)
│   │   │   │   ├── shell-config.model.ts # ShellConfig (layout responsive)
│   │   │   │   ├── markdown-document.model.ts # Document parsé complet
│   │   │   │   ├── markdown-frontmatter.model.ts # Métadonnées YAML
│   │   │   │   ├── markdown-config.model.ts # Options du renderer
│   │   │   │   ├── heading-node.model.ts # Nœud hiérarchique h1-h4
│   │   │   │   ├── callout-type.model.ts # Union info|warning|tip|danger
│   │   │   │   ├── agent.model.ts      # Interface Agent (rôle, outils, routes)
│   │   │   │   ├── skill.model.ts      # Interface Skill (catégorie, triggers)
│   │   │   │   └── search-result.model.ts # Résultat de recherche Fuse.js
│   │   │   └── services/               # Services fonctionnels
│   │   │       ├── content.service.ts  # Chargement + parsing Markdown
│   │   │       ├── toc.service.ts      # État TOC réactif (Signals)
│   │   │       ├── search.service.ts   # Index Fuse.js + recherche
│   │   │       ├── content-registry.ts # Registre exhaustif 36 fichiers .md
│   │   │       └── animation.service.ts # GSAP lazy-load + API unifiée
│   │   ├── app.component.ts            # Shell racine 3 colonnes responsive
│   │   ├── app.component.html          # Template shell avec sidebar overlay mobile
│   │   ├── app.component.scss          # Grille flexbox, breakpoints, z-index
│   │   ├── app.config.ts               # Providers (zoneless, router, HTTP, Markdown, CDK Overlay)
│   │   └── app.routes.ts               # Routes racine avec lazy loading
│   ├── content/                        # Fichiers Markdown du wiki (36 fichiers)
│   │   ├── agents/                     # 9 agents (orchestrateur, front, back, planner, contract, tester, reviewer, writer, search)
│   │   ├── skills/                     # 26 skills (ui-ux-pro-max, tests-create, graphify…)
│   │   └── demo.md                     # Démo du système de rendu
│   ├── styles/
│   │   ├── styles.css                  # Thème Tailwind v4, palette, typographie, reset, scrollbar, focus
│   │   ├── animations.scss             # Keyframes, easings, stagger, reduced-motion
│   │   └── prism-theme.css             # Thème Prism.js dark custom (183 lignes)
│   ├── index.html                      # Point d'entrée, meta, Fontshare CDN
│   └── main.ts                         # Bootstrap standalone (bootstrapApplication)
├── e2e/                                # Tests Playwright (16 specs)
├── docs/                               # Documentation projet
│   └── ARCHITECTURE.md                 # Ce fichier
├── public/                             # Assets statiques (favicon, etc.)
├── angular.json                        # Config Angular CLI (build esbuild, test Karma, budgets)
├── package.json                        # Dépendances (Angular 19, Tailwind v4, CDK, GSAP, D3.js, Fuse.js)
├── postcss.config.js                   # Plugin @tailwindcss/postcss
├── tsconfig.json                       # TypeScript strict, path alias @shared/*
├── playwright.config.ts                # Config Playwright (Chromium + iPhone 14, dark mode)
├── vercel.json                         # Config déploiement Vercel (SPA rewrites)
├── CHANGELOG.md                        # Historique des versions
├── README.md                           # Présentation, setup, commandes
├── AGENTS.md                           # Bible des agents Swarm (390 lignes)
└── PLAN.md                             # Plan d'implémentation 20 tâches
```

## Flux de Données

Le wiki étant statique, le flux est exclusivement **navigateur → fichiers statiques → rendu client** :

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Navigateur  │────▶│  Angular Router  │────▶│  Composant / Page  │
│  (URL)       │     │  (lazy loading)  │     │  (standalone)      │
└─────────────┘     └──────────────────┘     └────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  ContentService       │
                                          │  Charge le .md depuis │
                                          │  /content/ (HttpClient)│
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  ngx-markdown         │
                                          │  Parse Markdown →     │
                                          │  HTML + Prism.js      │
                                          │  + Mermaid.js (lazy)  │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  DOM — Rendu final    │
                                          │  (palette dark, typo  │
                                          │   Cabinet+Satoshi,    │
                                          │   animations GSAP)    │
                                          └───────────────────────┘
```

### Flux spécifiques

**Recherche Cmd+K** :
```
ContentRegistry (36 fichiers) → SearchService (index Fuse.js) → SearchModal (CDK Overlay)
                                      │
                                      ▼
                               Fuse.js fuzzy search
                               (titre 50%, desc 30%, section 20%)
```

**Table des matières** :
```
ContentService → TocEntry[] → TocService (Signals) → TableOfContentsComponent
                              ↕ (activeId via IntersectionObserver)
```

**Animations GSAP** :
```
AnimationService (lazy-load GSAP + ScrollTrigger) → revealOnScroll(), staggerChildren(), parallaxElement()
                                                         │
                                                         ▼
                                                    DOM elements
```

## Routes et Lazy Loading

| Route | Composant | Chargement | Description |
|---|---|---|---|
| `/` | `HomepageComponent` | **Eager** (critique LCP) | Accueil — carte interactive D3.js + grille hexagonale Canvas |
| `/a-propos` | `AboutComponent` | Lazy | À propos + statistiques Swarm |
| `/agents` | `AgentsListComponent` | Lazy | Liste des 9 agents |
| `/agents/:id` | `AgentDetailComponent` | Lazy | Fiche agent (Markdown) |
| `/skills` | `SkillsListComponent` | Lazy | Catalogue des 26 skills |
| `/skills/:id` | `SkillDetailComponent` | Lazy | Fiche skill (Markdown) |
| `/workflow` | `WorkflowComponent` | Lazy | Pipeline interactif 5 routes |
| `/outils-mcp` | `McpToolsComponent` | Lazy | 4 catégories d'outils MCP |
| `/probleme-innovation` | `ProblemInnovationComponent` | Lazy | Avant/Après, comparaisons, coûts |
| `/normes` | `StandardsComponent` | Lazy | Standards et conventions |
| `/demo-markdown` | `WikiDemoComponent` | Lazy | Démo du système Markdown |
| `**` | Redirect → `/` | — | Wildcard → accueil (évite 404 SPA) |

## Système de Contenu

### Pipeline complet

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

Singleton (`providedIn: 'root'`) exposant une méthode unique :

```typescript
loadDocument(sourcePath: string): Observable<MarkdownDocument>
```

1. **Chargement** : `HttpClient.get(/content/${sourcePath})` en mode `text` — les fichiers `.md` sont servis comme assets statiques
2. **Parsing YAML** : extraction du bloc frontmatter (`---`) via regex, parsé avec `js-yaml`. Champs obligatoires : `title`, `description`, `order`
3. **Extraction des headings** : regex `^(#{1,4})\s+(.+)$` → `HeadingNode[]` hiérarchique → aplatissement en `TocEntry[]` (niveaux 1–3)
4. **Slugification** : normalisation Unicode NFD, suppression accents et caractères spéciaux

### TocService — État réactif partagé

Découple le producteur (`MarkdownRendererComponent`) du consommateur (`TableOfContentsComponent`) via deux Signals :

```typescript
readonly entries = signal<TocEntry[]>([]);   // Hiérarchie TOC complète
readonly activeId = signal<string>('');       // Slug du heading visible (scroll-spy)
```

### MarkdownRendererComponent — Rendu riche

Composant standalone (`<app-markdown-renderer>`) acceptant `sourcePath` ou `content` brut.

**Pre-processing** (avant ngx-markdown) :
- **Callouts** `:::info` / `:::warning` / `:::tip` / `:::danger` → `<div class="callout callout--{type}">` avec icônes et bordures colorées
- **Ancres** : injection de `<a id="slug">` avant chaque heading pour le scroll-spy

**Post-processing** (après rendu) :
- **Mermaid.js** : import dynamique ~500KB, uniquement si présence de blocs `language-mermaid`. Thème dark synchronisé avec la palette
- **Prism.js** : coloration via `markdownService.highlight()`

**États gérés** :
| État | Rendu |
|---|---|
| Loading | 3 barres shimmer animées (largeurs 100%/70%/40%) |
| Error | Bloc bordure ambrée, titre « Erreur de chargement », message explicite |
| Empty | Message « Aucun contenu à afficher » + hint |
| Success | Rendu Markdown complet |

### TableOfContentsComponent — Navigation intra-page

Colonne latérale droite (220px desktop), accordéon mobile.

- **Scroll-spy** : `IntersectionObserver` avec `rootMargin: '-64px 0 -20% 0'` (compense header 64px)
- **Hiérarchie visuelle** : indentation par niveau (h1: 0px, h2: 16px, h3: 32px)
- **Navigation** : clic → `scrollIntoView({ behavior: 'smooth' })` avec désactivation temporaire observer (800ms)
- **Animation** : entrée stagger — fade-in + translateY(8px→0)

### Thème Prism.js dark custom

183 lignes de CSS utilisant exclusivement la palette 6 couleurs :

| Token | Couleur | Style |
|---|---|---|
| Commentaires | `--color-text-secondary` | Italique |
| Mots-clés | `--color-accent` | Gras 500 |
| Fonctions, classes | `--color-text-primary` | Gras 500 |
| Chaînes, sélecteurs | `--color-text-primary` | Normal |
| Opérateurs | `--color-text-secondary` | Normal |
| Code inline | `--color-accent` sur fond `--color-bg-subtle` | — |

## Système de Recherche

### SearchService

Index Fuse.js construit à partir du `ContentRegistry` (36 fichiers `.md`). Chargement asynchrone des fichiers, extraction du frontmatter (titre, description) et des headings (section). Pondération : titre (50%), description (30%), section (20%), seuil 0.4.

### SearchModalComponent

- **Déclenchement** : `Cmd+K` / `Ctrl+K` (keydown global)
- **Overlay** : CDK Overlay avec backdrop sombre + blur
- **Input** : autofocus, recherche en temps réel (debounce 200ms)
- **Résultats** : liste avec navigation clavier circulaire (↑↓), highlight des termes matchés, entrée stagger
- **Accessibilité** : `role="dialog"`, `aria-activedescendant`, `aria-label`, focus trapping

## Design System

### Palette — Dark Mode Exclusif

```css
:root {
  --color-bg-primary:    #3A3530;  /* Fond de page principal (brun profond) */
  --color-bg-elevated:   #4A4540;  /* Cartes, surfaces surélevées */
  --color-bg-subtle:     #2A2520;  /* Zones d'ombre, footer, code blocks */
  --color-text-primary:  #F5F0EB;  /* Texte principal (blanc cassé chaud) */
  --color-text-secondary:#B0A8A0;  /* Texte secondaire, légendes, métadonnées */
  --color-accent:        #F0A522;  /* Accent ambré — liens, hover, highlights, glow */
  --color-accent-glow:   rgba(240, 165, 34, 0.15);  /* Glow semi-transparent */
}
```

**Règle absolue** : dark mode exclusif. Pas de toggle, pas de `prefers-color-scheme: light`.

### Typographie — Cabinet Grotesk + Satoshi

| Rôle | Police | Graisses | Usage |
|---|---|---|---|
| Display | Cabinet Grotesk | 800 (Extrabold), 700 (Bold) | H1–H2, labels navigation, statistiques |
| Body | Satoshi | 500 (Medium), 400 (Regular) | Paragraphes, code, tableaux, métadonnées |

Chargement via Fontshare CDN dans `index.html` avec `display=swap`. Inter, Roboto, Open Sans, Lato, Montserrat, Poppins sont **explicitement interdits**.

### Système d'Élévation Dark (N1–N4)

Les ombres classiques étant invisibles sur fond `#3A3530`, le système utilise des **bordures lumineuses** et des **contrastes de surface** :

| Niveau | Fond | Bordure | Box-shadow | Usage |
|---|---|---|---|---|
| N1 | `#3A3530` | — | — | Fond de page |
| N2 | `#4A4540` | `1px rgba(142,136,130, 0.12)` | — | Cartes, sidebar |
| N3 | `#4A4540` | `1px rgba(142,136,130, 0.20)` | `0 0 20px rgba(240,165,34, 0.04)` | Cartes surélevées |
| N4 | `#4A4540` | `1px rgba(142,136,130, 0.30)` | `0 0 40px rgba(240,165,34, 0.06)` | Modale, overlay (+ `backdrop-filter: blur(12px)`) |

### Vocabulaire d'Animation

| Contexte | Propriétés | Durée | Easing |
|---|---|---|---|
| Transition de page | fade + translateY(8px→0) | 400ms | `cubic-bezier(0.22,1,0.36,1)` |
| Navigation (hover) | color + scale(1.02) | 200ms | ease-out |
| Stagger contenu | fade + translateY(16px→0) | 80ms/item | ease-out |
| Hover carte | translateY(-2px) + glow | 250ms | `cubic-bezier(0.25,0.46,0.45,0.94)` |
| Active (press) | scale(0.97) | 100ms | ease-in-out |
| Scroll décoratif | parallaxe, sticky | continu | linear |

### Layout Shell

```
┌──────────────────────────────────────────────────────────┐
│  Header (64px, glassmorphism: blur(12px), position: fixed)│
├────────┬─────────────────────────────────┬────────────────┤
│Sidebar │  Zone contenu (860px max-width) │  TOC (220px)   │
│(280px) │                                 │  desktop only  │
│        │                                 │                │
│ Nav    │  <router-outlet>               │  Scroll-spy    │
│ hiérar-│                                 │  Intersection  │
│ chique │  Composant de page              │  Observer      │
│ pliable│                                 │                │
│        │                                 │                │
├────────┴─────────────────────────────────┴────────────────┤
│  Footer                                                   │
└──────────────────────────────────────────────────────────┘
```

**Mobile** (< 768px) : sidebar → slide-over gauche avec overlay blur, TOC → accordéon pliable au-dessus du contenu, layout 1 colonne.

## Tests

| Type | Framework | Stats |
|---|---|---|
| Unitaires | Jasmine + Karma | 194 tests, coverage 89.5% |
| E2E | Playwright | 16 specs, Desktop Chrome + iPhone 14 |

**Couverture** : tous les composants, services, modèles et routes sont testés. États critiques (loading, empty, error, success) vérifiés pour chaque composant asynchrone.

**Playwright** : navigation complète, recherche, rendu Markdown, responsive, snapshots visuels, liens morts. Config : `colorScheme: 'dark'`, retry CI, serveur web intégré.

## Build & Déploiement

**Build** : `@angular-devkit/build-angular:application` — bundler esbuild.

**Budgets** (`angular.json`) :
- Initial bundle : 500KB warning, 1MB error
- Style par composant : 8KB warning, 20KB error

**Déploiement Vercel** :
- Domaine : `swarm-wiki.vercel.app`
- Build command : `ng build`
- Output : `dist/swarm-wiki/browser`
- SPA rewrites : toutes les routes → `/index.html`
- Merge main → déploiement automatique
