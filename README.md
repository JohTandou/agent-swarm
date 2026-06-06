# Swarm Wiki

Documentation technique du **Swarm** — pipeline d'agents IA spécialisés qui collaborent pour concevoir, implémenter, tester et documenter des projets logiciels de bout en bout.

**Cible** : recruteurs, tech leads, managers. Ton accessible, jamais simpliste. Dark mode exclusif, design Apple-grade.

## Pourquoi le Swarm

Le Swarm combine **9 agents IA spécialisés** (orchestrateur, search, planner, contract, front, back, tester, reviewer, writer) en un pipeline automatisé. Contrairement aux assistants mono-agents (Claude Code, Cursor, Devin), le Swarm classifie automatiquement la complexité d'une tâche, route vers les agents appropriés, parallélise l'implémentation, génère des tests, et valide la qualité avant merge. Résultat : **5–8× moins cher** qu'une API mono-modèle équivalente, avec des gates qualité systématiques.

## Stack Technique

| Domaine | Technologie | Justification |
|---|---|---|
| Framework | **Angular 19** (standalone) | Dernière version stable, standalone components matures, tree-shaking natif |
| Langage | **TypeScript 5** (strict) | Typage strict, `noImplicitReturns`, `strictTemplates` |
| CSS | **Tailwind v4** (CSS-first) + **SCSS** | Tailwind pour l'utility-first (layout, espacements, typo) ; SCSS réservé aux animations et keyframes |
| Composants UI | **Angular CDK** (headless) | Primitives a11y (BreakpointObserver, Overlay, FocusTrap) sans imposer de style |
| État | **Signals + Services** natifs | Wiki statique = état minimal (page courante, sidebar, recherche) — pas de NgRx |
| Animations | **GSAP** (ScrollTrigger) | Timelines complexes, parallaxe, stagger sequences, compteurs animés |
| Markdown | **ngx-markdown** + marked.js | Rendu riche (callouts, tableaux, code colorisé, diagrammes Mermaid) |
| Coloration | **Prism.js** | Léger (~1.5KB/langage), thème dark custom palette 6 couleurs |
| Diagrammes | **Mermaid.js** (lazy-load) + **D3.js** | Mermaid pour les diagrammes Markdown ; D3.js pour la carte interactive homepage |
| Recherche | **Fuse.js** | Fuzzy search client-side, pas d'index backend, volume modéré (36 pages) |
| Typographie | **Cabinet Grotesk** (display) + **Satoshi** (body) | Gratuites (Fontshare CDN), pairing distinctif, pas d'Inter/Roboto |
| Tests unitaires | **Jasmine + Karma** | 194 tests, coverage 89.5% |
| Tests E2E | **Playwright** | Desktop Chrome + iPhone 14, 16 specs |
| Déploiement | **Vercel** | CDN global, SSL, SPA rewrites, déploiement Git auto |

### Palette — Dark Mode Exclusif

```css
--color-bg-primary:    #3A3530;  /* Fond de page principal (brun profond) */
--color-bg-elevated:   #4A4540;  /* Cartes, surfaces surélevées */
--color-bg-subtle:     #2A2520;  /* Zones d'ombre, footer, code blocks */
--color-text-primary:  #F5F0EB;  /* Texte principal (blanc cassé chaud) */
--color-text-secondary:#B0A8A0;  /* Texte secondaire, légendes, métadonnées */
--color-accent:        #F0A522;  /* Accent ambré — liens, hover, highlights, glow */
```

**Règle absolue** : dark mode exclusif. Pas de light mode, pas de toggle, pas de `prefers-color-scheme: light`.

## Setup Local

### Prérequis

- **Node.js** ≥ 18.19
- **npm** ≥ 9
- **Angular CLI** ≥ 19 (`npm install -g @angular/cli`)

### Installation

```bash
# Cloner le dépôt
git clone <repository-url>
cd swarm-wiki

# Installer les dépendances
npm install

# Lancer le serveur de développement (port 3000, HMR)
npm start
```

→ Ouvrir [http://localhost:3000](http://localhost:3000)

### Commandes Principales

| Commande | Description |
|---|---|
| `npm start` | Serveur de développement (port 3000, HMR) |
| `npm run build` | Build production → `dist/swarm-wiki/browser` |
| `npm test` | Tests unitaires Jasmine/Karma (watch + coverage) |
| `npm run e2e` | Tests end-to-end Playwright (Chromium + iPhone 14) |

### Structure du Projet

```
swarm-wiki/
├── src/
│   ├── app/
│   │   ├── layout/              # Shell applicatif (header, sidebar, breadcrumbs)
│   │   ├── features/            # Pages lazy-loadées par section
│   │   │   ├── homepage/        # Accueil (eager, D3.js + Canvas)
│   │   │   ├── agents/          # 9 agents (liste + détail Markdown)
│   │   │   ├── skills/          # 26 skills (liste + détail Markdown)
│   │   │   ├── workflow/        # Pipeline interactif
│   │   │   ├── mcp-tools/       # 4 catégories d'outils MCP
│   │   │   ├── problem-innovation/ # Avant/Après, comparaisons
│   │   │   ├── standards/       # Conventions et standards
│   │   │   ├── about/           # À propos + statistiques
│   │   │   └── wiki-demo/       # Démo du système Markdown
│   │   ├── shared/              # Code transverse
│   │   │   ├── components/      # MarkdownRenderer, TOC, SearchModal
│   │   │   ├── models/          # Interfaces TypeScript (16 modèles)
│   │   │   └── services/        # ContentService, TocService, SearchService, AnimationService
│   │   ├── app.component.ts     # Shell racine 3 colonnes
│   │   ├── app.config.ts        # Providers (zoneless, router, HTTP, Markdown, CDK Overlay)
│   │   └── app.routes.ts        # Routes racine avec lazy loading
│   ├── content/                 # Fichiers Markdown du wiki (36 fichiers)
│   │   ├── agents/              # 9 agents (orchestrateur, front, back, planner…)
│   │   └── skills/              # 26 skills (ui-ux-pro-max, tests-create, graphify…)
│   ├── styles/
│   │   ├── styles.css           # Thème Tailwind v4, palette, typographie, reset
│   │   ├── animations.scss      # Keyframes, easings, stagger, reduced-motion
│   │   └── prism-theme.css      # Thème Prism.js dark custom (183 lignes)
│   ├── index.html               # Point d'entrée, Fontshare CDN
│   └── main.ts                  # Bootstrap standalone (bootstrapApplication)
├── e2e/                         # Tests Playwright (16 specs)
├── docs/                        # Documentation projet
│   └── ARCHITECTURE.md          # Décisions techniques et architecture
├── angular.json                 # Config Angular CLI
├── vercel.json                  # Config déploiement Vercel
├── CHANGELOG.md                 # Historique des versions
├── AGENTS.md                    # Bible des agents Swarm
└── PLAN.md                      # Plan d'implémentation 20 tâches
```

## Conventions

- **Langue** : UI en français, code en anglais, commentaires en français
- **Composants** : 100% standalone, nouveau control flow Angular (`@if`, `@for`, `@let`)
- **Dark mode** : exclusif — pas de toggle, pas de `prefers-color-scheme: light`
- **Mobile** : sidebar → slide-over, TOC → accordéon, layout 1 colonne, `clamp()` pour le responsive fluide
- **Accessibilité** : skip-to-content link, `:focus-visible`, scrollbar dark custom, touch targets ≥ 44×44px, navigation clavier complète
- **Contenu Markdown** : frontmatter YAML obligatoire (`title`, `description`, `order`), callouts `:::type`, coloration Prism.js

## Déploiement

Déployé sur **Vercel** à l'adresse [swarm-wiki.vercel.app](https://swarm-wiki.vercel.app).

- Build command : `ng build`
- Output directory : `dist/swarm-wiki/browser`
- SPA rewrites : toutes les routes → `/index.html`
- Déploiement automatique sur merge main

## Licence

Projet privé — documentation interne du système Swarm.
