# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-06-06

**Swarm Wiki** — documentation technique du pipeline d'agents IA Swarm. Application Angular 19 100% statique, dark mode exclusif, design Apple-grade.

### Phase SOCLE (T0–T2) — Fondations

#### Added — T0 : Réécriture AGENTS.md

- Audit exhaustif de l'AGENTS.md existant (Next.js/FastAPI → Angular statique)
- Décisions techniques documentées : Angular 19 standalone, Tailwind v4 + SCSS, Angular CDK, Signals + Services, GSAP, Fuse.js, stratégie contenu hybride, lazy loading, déploiement Vercel
- Palette 6 couleurs dark mode exclusif définie en CSS custom properties
- Pairing typographique : Cabinet Grotesk (display) + Satoshi (body) via Fontshare CDN
- Système d'élévation dark N1–N4 (glow borders, pas d'ombres)
- Vocabulaire d'animation documenté (durées, easings, contextes)
- `PLAN.md` : 20 tâches, graphe de dépendances, phases parallélisables, analyse du système Swarm (modèles IA, coûts, comparaisons, limites)

#### Added — T1 : Bootstrap Angular 19 + Thème Dark

- Initialisation du projet via Angular CLI 19.2.27 (`ng new swarm-wiki`)
- Configuration Tailwind v4 CSS-first avec `@theme` exposant palette et polices
- SCSS pour keyframes (fadeSlideIn, shimmer, pulseGlow, slowRotate), easings custom, stagger children avec délai incrémental, respect `prefers-reduced-motion`
- Layout shell 3 colonnes responsive : header glassmorphism fixe (64px), sidebar 280px, zone contenu 860px, TOC placeholder 220px
- Header glassmorphique avec navigation desktop, hamburger mobile, touch targets 44×44px
- Sidebar hiérarchique avec menus pliables (Agents, Skills, Outils MCP)
- Fil d'Ariane (breadcrumbs) accessible avec `aria-label`
- Composant mobile : sidebar overlay avec backdrop semi-transparent + blur, fermeture Escape
- Lazy loading par feature : homepage (eager, critique LCP), toutes les autres sections (lazy)
- Route `**` wildcard → redirection accueil
- Models partagés TypeScript : `NavItem`, `Breadcrumb`, `TocEntry`, `ShellConfig`
- Path alias `@shared/*` → `src/app/shared/*` dans `tsconfig.json`
- Détection mobile via `BreakpointObserver` CDK
- Accessibilité : skip-to-content link, scrollbar custom dark, `:focus-visible`, sélection ambrée
- Polices Cabinet Grotesk (800, 700) + Satoshi (500, 400) chargées via Fontshare CDN avec `display=swap`
- 79 tests Jasmine/Karma, coverage 100% (composants, models, routes, config)
- Budgets de build : initial ≤ 500KB warning, composant style ≤ 8KB warning

#### Added — T2 : Système de contenu statique

- **ContentService** : chargement asynchrone des fichiers Markdown via HttpClient, parsing frontmatter YAML avec js-yaml, extraction hiérarchie headings (h1–h4), aplatissement en `TocEntry[]` pour le composant TOC. Gestion des erreurs (fichier introuvable, YAML invalide)
- **TocService** : service réactif Signals (`entries()` et `activeId()`) partagé entre MarkdownRenderer et TableOfContents — découplage producteur/consommateur
- **MarkdownRendererComponent** : rendu ngx-markdown avec pre-processing (callouts `:::info`/`:::warning`/`:::tip`/`:::danger`), injection d'ancres HTML, post-processing (lazy-load Mermaid.js, coloration Prism.js). Gère 4 états : loading (shimmer), error, empty, success
- **TableOfContentsComponent** : scroll-spy via `IntersectionObserver`, indentation hiérarchique, navigation fluide, animation d'entrée stagger
- **Thème Prism.js dark custom** (183 lignes) : tokens dans la palette 6 couleurs uniquement, line numbers, bouton copier avec hover glow ambré
- **Page démo `/demo-markdown`** : illustration du pipeline complet — titre dégradé texte, callouts, tableaux, code colorisé, diagrammes Mermaid
- **Contenu** : `src/content/demo.md` — premier fichier Markdown du wiki
- Dépendances ajoutées : `ngx-markdown`, `marked`, `prismjs`, `mermaid` (lazy-load), `js-yaml`
- 194 tests Jasmine/Karma, coverage 89.5%

### Phase CONTENU (T3–T12) — Pages

#### Added — T3 : Page d'accueil interactive

- **Carte interactive SwarmGraph** (D3.js) : graphe force-directed des 9 agents avec connexions animées, zoom/pan, tooltips au survol. Nœuds apparaissent en stagger, connexions se tracent progressivement
- **Grille hexagonale Canvas** (HexGrid) : arrière-plan avec hexagones pulsant lentement (opacité 0.03–0.06), illumination en #F0A522 au scroll. Métaphore de la ruche = swarm
- Titre hero avec dégradé texte (ambre → blanc), sous-titre, CTA
- Résumé exécutif avec statistiques clés (9 agents, 26 skills, 4 catégories MCP)
- Navigation visuelle vers les sections principales
- Animations GSAP : parallaxe multi-vitesses, texte qui se révèle au scroll, compteurs animés

#### Added — T4 : Page Problème & Innovation

- Analyse Avant/Après (développement sans swarm vs avec)
- Comparaison détaillée vs systèmes agentiques classiques (Claude Code, Cursor, Devin, CrewAI, Aider)
- 7 piliers d'innovation détaillés
- Analyse des coûts (Swarm ~1,25 $/session vs Claude Max 100 $/mois)
- Modèles d'IA utilisés (DeepSeek V4 Pro + Gemini Flash Lite)
- Limites du système (structurelles, architecturales, par agent)
- Section « Pour qui » ciblant recruteurs, tech leads, managers
- Animations scroll-driven : barres de comparaison, compteurs

#### Added — T5+T6 : Pages Agents (9 agents)

- **AgentsListComponent** : grille asymétrique, carte par agent avec rôle + icône + résumé
- **AgentDetailComponent** : template fixe (rôle, responsabilités, contraintes, outils MCP, routes, exemple)
- 9 fichiers Markdown dans `src/content/agents/` : orchestrateur, front, back, planner, contract, tester, reviewer, writer, search
- Frontmatter YAML obligatoire (title, description, order)
- Navigation par ID (`/agents/:id`)
- Animation d'entrée stagger sur la liste, pipeline visuel sur la fiche détail

#### Added — T7 : Page Workflow

- Arbre de décision interactif des 5 routes (DIRECT → SIMPLE → ADAPT → MEDIUM → FULL)
- Diagramme Mermaid du pipeline complet (pre-search → classification → planification → implémentation → tests → revue → merge)
- Gates qualité documentées (tester PASS, reviewer APPROVE)
- Intégration Git (issues → branches → PR → merge via finish.ts)
- Fichiers système (.swarm-queue.json, .agent-memory.json)
- Animation : étapes qui se highlight au scroll

#### Added — T8+T9 : Pages Skills (26 skills)

- **SkillsListComponent** : grille avec filtres par catégorie, carte par skill avec icône + description
- **SkillDetailComponent** : template Markdown chargé depuis `src/content/skills/`
- 26 fichiers Markdown : ui-ux-pro-max, tests-create, graphify, admin-panel, audit-gamification, audit-global, audit-implementation, audit-marketing, audit-production, audit-security, audit-uxui, background-images, customize-opencode, dispatching-parallel-agents, documentation-create, documentation-update, executing-plans, finishing-a-development-branch, receiving-code-review, requesting-code-review, subagent-driven-development, test-driven-development, tests-run, using-git-worktrees, writing-plans, writing-skills
- Navigation par ID (`/skills/:id`)

#### Added — T10 : Pages Outils MCP

- **McpToolsComponent** : 4 catégories (Supabase, Vercel, Render, Playwright) avec listing complet des outils
- Route `/outils-mcp` — lazy loading par feature
- Documentation des paramètres, types, descriptions pour chaque outil

#### Added — T12 : Page Standards

- Standards Apple-grade documentés (typo, couleurs, animations, layout, responsive)
- Conventions de code (Angular, TypeScript, SCSS)
- Philosophie de test (Jasmine/Karma, Playwright)
- Processus de documentation (CHANGELOG, ARCHITECTURE.md, README.md)
- Contenu Markdown avec composants Angular embarqués
- Route `/normes`

### Phase POLISH (T13–T15) — Expérience

#### Added — T13 : Recherche Cmd+K

- **SearchService** : index Fuse.js fuzzy search, chargement asynchrone des 36 fichiers Markdown, extraction frontmatter + headings
- **ContentRegistry** : registre exhaustif de tous les fichiers `.md` avec mapping `sourcePath → route → section`
- **SearchModalComponent** : overlay CDK Overlay, raccourci Cmd+K / Ctrl+K, résultats en temps réel avec debounce 200ms, navigation clavier circulaire, highlight des termes matchés
- États gérés : indexation (skeleton shimmer), résultats, aucun résultat, erreur réseau
- Accessibilité : `role="dialog"`, `aria-activedescendant`, focus trapping

#### Added — T14 : Animations globales GSAP + Signature visuelle

- **AnimationService** : singleton applicatif chargé en lazy-load GSAP + ScrollTrigger
- API unifiée : `revealOnScroll()`, `animateCounter()`, `staggerChildren()`, `parallaxElement()`, `killAll()`
- Transitions de page (fade + translateY 8px→0, 400ms, cubic-bezier)
- Stagger sur toutes les listes (cards agents/skills, sections contenu)
- Scroll-triggered reveal pour chaque section (threshold 0.15)
- Animations hover premium sur cartes (translateY -2px + glow ambré)
- Parallaxe multi-vitesses sur éléments décoratifs
- Grille hexagonale Canvas avec pulsation + illumination interactive
- Respect `prefers-reduced-motion` : désactivation complète si activé
- Easings custom : `cubic-bezier(0.25, 0.46, 0.45, 0.94)` naturel, `cubic-bezier(0.22, 1, 0.36, 1)` rebond organique

#### Added — T15 : Responsive mobile

- Sidebar → slide-over gauche avec overlay semi-transparent + blur
- TOC → accordéon pliable en haut de page sur mobile
- Layout 1 colonne fluide en dessous de 768px
- Polices via `clamp()` — pas de breakpoints brutaux
- Tableaux Markdown → scroll horizontal
- Diagrammes Mermaid → zoomables
- Touch targets ≥ 44×44px (Apple HIG)
- Composant mobile header : hamburger 44×44px, breadcrumbs conditionnels
- Tests Playwright sur iPhone 14

### Phase QUALITÉ (T16–T18) — Fiabilité

#### Added — T16 : Tests unitaires

- 194 tests Jasmine/Karma, coverage 89.5%
- Composants testés : tous les layout (header, sidebar, breadcrumbs), tous les shared (MarkdownRenderer, TableOfContents, SearchModal)
- Services testés : ContentService, TocService, SearchService, AnimationService
- Models testés : tous les modèles TypeScript avec specs
- Routes testées : app.routes, toutes les routes de feature
- États testés : loading, empty, error, success pour chaque composant async

#### Added — T17 : Tests E2E Playwright

- 16 fichiers de specs E2E
- Scénarios : navigation complète (full-navigation.spec.ts), homepage (homepage.spec.ts, homepage-animations.spec.ts), agents (agents.spec.ts), skills (skills.spec.ts), recherche (search.spec.ts), workflow (workflow.spec.ts), contenu Markdown (content.spec.ts, markdown-agent-skill.spec.ts), MCP tools (mcp-tools.spec.ts), problem-innovation (problem-innovation.spec.ts), standards (standards.spec.ts), about (about.spec.ts), layout (layout.spec.ts), responsive (responsive-cross-section.spec.ts), liens morts (dead-links.spec.ts)
- 2 projets Playwright : Desktop Chrome + iPhone 14
- Config : `colorScheme: 'dark'`, serveur web Angular intégré, retry CI

#### Added — T18 : Audit accessibilité

- Contrastes vérifiés WCAG AA (palette dark : texte `#F5F0EB` sur fond `#3A3530` = ratio ≥ 7:1)
- Navigation clavier complète (Tab, Enter, Escape, flèches)
- Labels ARIA sur tous les composants interactifs
- Structure sémantique HTML5 : `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`
- Skip-to-content link
- `:focus-visible` visible sur tous les éléments interactifs
- Touch targets ≥ 44×44px vérifiés
- Scrollbar custom dark

### Phase LIVRAISON (T19–T20) — Production

#### Added — T19 : Déploiement Vercel

- Configuration `vercel.json` : build command `ng build`, output directory `dist/swarm-wiki/browser`, framework Angular
- SPA rewrites : toutes les routes → `/index.html`
- `.vercelignore` pour exclure fichiers inutiles du déploiement
- Domaine : `swarm-wiki.vercel.app`
- Déploiement automatique sur merge main via GitHub Actions
- Pipeline CI/CD : lint → test → build → deploy

#### Added — T20 : Documentation

- `README.md` : présentation projet, stack technique, setup local, commandes, structure, conventions, déploiement
- `ARCHITECTURE.md` : décisions techniques avec justifications (Angular 19, Tailwind v4, CDK, Signals, lazy loading, Fuse.js, Vercel, Cabinet Grotesk + Satoshi), structure détaillée du projet, flux de données, routes, système de contenu (ContentService, TocService, MarkdownRenderer, TOC, Prism.js), design system (palette, élévation, typographie, animations), tests, build & déploiement
- `CHANGELOG.md` : historique complet v1.0.0 structuré par phase (SOCLE, CONTENU, POLISH, QUALITÉ, LIVRAISON)
