# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **T2 — Système de contenu statique** (en cours) : service de chargement Markdown, renderer avec template riche (callouts, code blocks Prism.js, diagrammes Mermaid, TOC dynamique), frontmatter YAML.
- Placeholder pour les sections Agents, Skills, Workflow, Outils MCP dans la sidebar.

## [1.0.0] — 2026-06-05

### Added — T0 : Fondations & Décisions

- Rédaction du `AGENTS.md` (366 lignes) : bible du projet, stack technique, protocole comportemental, standards Apple-grade, philosophie UX/UI, standards de rédaction.
- Décisions techniques documentées : Angular 19 standalone, Tailwind v4 + SCSS, CDK headless, Signals+Services, GSAP, Fuse.js, stratégie contenu hybride, lazy loading, déploiement Vercel.
- Palette 6 couleurs dark mode exclusif définie en CSS custom properties.
- Pairing typographique : Cabinet Grotesk (display) + Satoshi (body) via Fontshare CDN.
- Système d'élévation dark N1–N4 (glow borders, pas d'ombres).
- Vocabulaire d'animation documenté (durées, easings, contextes).
- Interdictions absolues : Inter/Roboto/Open Sans, violet/bleu/indigo, light mode, grille de cards, Material non reskinné.
- `PLAN.md` : 20 tâches, graphe de dépendances, phases parallélisables, analyse du système Swarm.

### Added — T1 : Bootstrap Angular 19 + Thème Dark

- Initialisation du projet via Angular CLI 19.2.27 (`ng new swarm-wiki`).
- Configuration Tailwind v4 CSS-first avec `@theme` exposant palette et polices.
- SCSS pour keyframes (fadeSlideIn, shimmer, pulseGlow, slowRotate), easings custom, stagger children avec délai incrémental, respect `prefers-reduced-motion`.
- Layout shell 3 colonnes responsive (header glassmorphism fixe, sidebar 280px, zone contenu 860px, TOC placeholder 220px).
- Header glassmorphique avec navigation desktop, hamburger mobile, touch targets 44×44px.
- Sidebar hiérarchique 280px avec menus pliables (Agents, Skills, Outils MCP) — placeholder en attente du service dynamique (T2).
- Fil d'Ariane (breadcrumbs) accessible avec `aria-label`.
- TOC placeholder avec 3 barres shimmer animées — attente du service de génération dynamique (T2).
- Composant mobile : sidebar overlay avec backdrop semi-transparent + blur, fermeture Escape/click.
- Page d'accueil placeholder avec titre en dégradé texte (ambre → blanc), sous-titre, CTA "Découvrir le système →".
- Page "À propos" placeholder avec stats (9 agents, 26 skills, 4 catégories MCP).
- Lazy loading par feature : homepage (eager, critique LCP), about (lazy).
- Routes `**` wildcard → redirection accueil.
- Models partagés TypeScript : `NavItem`, `Breadcrumb`, `TocEntry`, `ShellConfig`.
- Path alias `@shared/*` → `src/app/shared/*` dans `tsconfig.json`.
- Détection mobile via `BreakpointObserver` CDK (`Handset`, `TabletPortrait`).
- Accessibilité : skip-to-content link, scrollbar custom dark, `:focus-visible`, sélection ambrée.
- Polices Cabinet Grotesk (800, 700) + Satoshi (500, 400) chargées via Fontshare CDN avec `display=swap`.
- Thème dark exclusif : `background-color: #3A3530`, pas de toggle, pas de media query light.
- 79 tests Jasmine/Karma, coverage 100% (composants, models, routes, config).
- Config `@angular-devkit/build-angular:application` pour build optimisé.
- Budgets de build : initial ≤ 500KB warning, composant style ≤ 4KB warning.
