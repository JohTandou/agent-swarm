# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- *Rien pour l'instant — prochaine tâche : T3 (page d'accueil interactive avec grille hexagonale Canvas).*

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

### Added — T2 : Système de contenu statique

- **ContentService** (`src/app/shared/services/content.service.ts`) : chargement asynchrone des fichiers Markdown depuis `src/content/` via HttpClient, parsing du frontmatter YAML avec js-yaml, extraction de la hiérarchie des headings (h1–h4), aplatissement en `TocEntry[]` pour le composant TOC. Gestion des erreurs (fichier introuvable, YAML invalide) avec messages en français.
- **TocService** (`src/app/shared/services/toc.service.ts`) : service réactif Signals (`entries()` et `activeId()`) partagé entre le `MarkdownRendererComponent` (producteur) et le `TableOfContentsComponent` (consommateur). Permet le découplage complet entre le rendu de contenu et la navigation intra-page.
- **MarkdownRendererComponent** (`src/app/shared/components/markdown-renderer/`) : composant standalone utilisant ngx-markdown pour le rendu Markdown → HTML. Pre-processing des callouts `:::info` / `:::warning` / `:::tip` / `:::danger` en HTML structuré avec icônes et bordures colorées. Injection automatique d'ancres HTML sur les headings pour le scroll-spy. Post-processing : lazy-load de Mermaid.js pour les diagrammes (import dynamique, ~500KB chargés uniquement si des blocs `mermaid` sont présents) et coloration syntaxique Prism.js. Gère les 4 états : loading (shimmer animé), error (message + icône ambrée), empty (message guide), success.
- **TableOfContentsComponent** (`src/app/shared/components/table-of-contents/`) : navigation intra-page avec scroll-spy via `IntersectionObserver` (rootMargin `-64px 0 -20%`). Surbrillance ambrée du heading actif, indentation hiérarchique par niveau (16px/32px), défilement fluide programmatique avec désactivation temporaire de l'observer. État vide avec message guide. Animation d'entrée stagger au chargement.
- **Thème Prism.js dark custom** (`src/styles/prism-theme.css`, 183 lignes) : coloration syntaxique utilisant exclusivement la palette 6 couleurs du projet — pas de bleu, vert ou rouge. Tokens : commentaires en `--color-text-secondary` (italique), mots-clés en `--color-accent` (gras 500), noms de fonctions en `--color-text-primary`. Support des line numbers et toolbar (bouton copier avec hover glow ambré).
- **Page démo `/demo-markdown`** (`src/app/features/wiki-demo/`) : page lazy-loadée illustrant l'intégration complète du pipeline. Affiche un titre avec dégradé texte (ambre → blanc), charge `demo.md` via `MarkdownRendererComponent` et peuple la TOC latérale. Contient des callouts, tableaux, blocs de code TypeScript avec coloration, et diagrammes Mermaid.
- **Modèles** : `HeadingNode` (nœud hiérarchique h1–h4), `MarkdownDocument` (document parsé complet), `MarkdownFrontmatter` (métadonnées YAML), `MarkdownConfig` (options du renderer), `CalloutType` (union `'info'|'warning'|'tip'|'danger'`).
- **Contenu** : `src/content/demo.md` — premier fichier Markdown du wiki, illustrant toutes les fonctionnalités du moteur de rendu.
- **Dépendances ajoutées** : `ngx-markdown` (19.x), `marked` (15.x), `prismjs` (1.30), `mermaid` (11.x, lazy-load), `js-yaml` (4.x).
- **Provider** : `provideMarkdown()` et `provideHttpClient(withFetch())` dans `app.config.ts`.
- 194 tests Jasmine/Karma, coverage 89.5% (composants, services, modèles).
