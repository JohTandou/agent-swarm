# Swarm Wiki

Documentation technique du **Swarm** — pipeline d'agents IA spécialisés qui collaborent pour concevoir, implémenter, tester et documenter des projets logiciels de bout en bout.

**Cible** : recruteurs, tech leads, managers — ton accessible, jamais simpliste.

## Stack Technique

| Domaine | Technologie |
|---|---|
| Framework | Angular 19 — standalone components, pas de NgModules |
| Langage | TypeScript 5 (strict) |
| CSS | Tailwind v4 (CSS-first, `@theme` + custom properties) + SCSS |
| Composants UI | Angular CDK (primitives headless pour a11y) |
| État | Signals + Services natifs (wiki statique, pas de NgRx) |
| Animations | SCSS keyframes (GSAP à venir T14) |
| Tests unitaires | Jasmine + Karma |
| Typographie | Cabinet Grotesk (display) + Satoshi (body) via Fontshare CDN |
| Déploiement | Vercel (build : `ng build`, output : `dist/swarm-wiki/browser`) |

### Palette — Dark mode exclusif

```css
--color-bg-primary:    #3A3530;  /* Fond de page */
--color-bg-elevated:   #4A4540;  /* Cartes, surfaces */
--color-bg-subtle:     #2A2520;  /* Code blocks, footer */
--color-text-primary:  #F5F0EB;  /* Texte principal */
--color-text-secondary:#8E8882;  /* Métadonnées, légendes */
--color-accent:        #F0A522;  /* Liens, hover, glow */
```

## Setup Local

```bash
# Installation
npm install

# Serveur de développement (port 4200)
ng serve
# ou
npm start

# Build production
npm run build

# Tests unitaires (Jasmine/Karma, 79 tests, coverage 100%)
npm test

# Lint
ng lint
```

## Structure du Projet

```
swarm-wiki/
├── src/
│   ├── app/
│   │   ├── layout/                # Shell : header, sidebar, breadcrumbs, TOC placeholder
│   │   ├── features/              # Pages lazy-loadées (homepage, about, à venir)
│   │   ├── shared/models/         # Interfaces TypeScript (NavItem, Breadcrumb, TocEntry)
│   │   ├── app.component.ts       # Shell racine 3 colonnes responsive
│   │   ├── app.config.ts          # Providers (zoneless + router)
│   │   └── app.routes.ts          # Routes racine avec lazy loading
│   ├── styles/
│   │   ├── styles.css             # Thème Tailwind v4, palette, typographie, reset
│   │   └── animations.scss        # Keyframes (fadeSlideIn, shimmer, pulseGlow), easings
│   ├── index.html                 # Point d'entrée, chargement Fontshare CDN
│   └── main.ts                    # Bootstrap standalone
├── angular.json                   # Config Angular CLI (build application, test Karma)
├── postcss.config.js              # Plugin Tailwind v4 CSS-first
└── tsconfig.json                  # Strict, path alias @shared/
```

## Commandes Utiles

| Commande | Description |
|---|---|
| `ng serve` | Démarre le serveur de dev avec HMR |
| `ng build` | Build production → `dist/swarm-wiki/browser` |
| `ng test` | Lance Jasmine/Karma (watch + coverage) |
| `ng lint` | Vérifie la qualité du code |
| `ng generate component nom` | Scaffold un composant standalone |

## Conventions

- **Langue** : UI en français, code en anglais, commentaires en français
- **Composants** : 100% standalone, nouveau control flow Angular (`@if`, `@for`)
- **Dark mode** : exclusif — pas de toggle, pas de `prefers-color-scheme: light`
- **Mobile** : sidebar → slide-over, TOC caché, layout 1 colonne
- **Accessibilité** : skip-to-content link, `:focus-visible`, scrollbar custom dark, touch targets ≥ 44×44px

## Déploiement

Le projet est configuré pour Vercel avec déploiement automatique sur merge main. La commande de build est `ng build` et le répertoire de sortie est `dist/swarm-wiki/browser`.
