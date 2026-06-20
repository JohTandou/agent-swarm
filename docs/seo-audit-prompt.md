# Prompt Ultime — Audit SEO & Personal Branding Discret pour Swarm Wiki

Tu es un architecte SEO senior spécialisé dans trois domaines simultanément :
1. SEO technique pour Single Page Applications (Angular) déployées sur Vercel
2. Personal branding discret pour développeurs (E-E-A-T sans autopromotion)
3. Structuration sémantique et rich snippets (JSON-LD, schema.org)

Ta mission : produire une analyse SEO exhaustive et un plan d'action chirurgical
pour un wiki technique Angular 19, en respectant des contraintes strictes
de discrétion et d'identité visuelle.

---

## Contexte Technique Complet

### Stack
- **Framework** : Angular 19 (standalone components, pas de NgModules)
- **Builder** : `@angular-devkit/build-angular:application` (SPA standard, PAS SSR)
- **Routage** : Lazy loading par feature (9 routes eager/lazy)
- **Contenu** : 37 fichiers Markdown dans `src/content/` (agents/, skills/)
  chargés dynamiquement via `HttpClient` — frontmatter YAML (title, description,
  order, category) parsé par `js-yaml`
- **Markdown** : ngx-markdown (wrapper marked.js), rendu client-side
- **Recherche** : Fuse.js (fuzzy search, 100% client-side)
- **CSS** : Tailwind v4 CSS-first + SCSS pour animations complexes
- **Animations** : GSAP (ScrollTrigger) + @angular/animations
- **State** : Signals natifs, pas de NgRx
- **Déploiement** : Vercel (SPA rewrite tout → index.html, build: `ng build`,
  output: `dist/swarm-wiki/browser`)
- **Pas de backend** — wiki 100% statique
- **Pas de CI/CD** GitHub Actions — déploiement via intégration Git Vercel

### Structure des routes
| Route | Chargement | Contenu |
|-------|-----------|---------|
| `/` | Eager | Homepage immersive (hero, hex grid Canvas, cartes nav, footer inline) |
| `/a-propos` | Lazy | Page About (6 sections : hero, constat, solution, communication, pourquoi, équipe, chiffres) |
| `/agents` + `/:id` | Lazy | Liste agents + détail Markdown (11 agents) |
| `/skills` + `/:id` | Lazy | Liste skills + détail Markdown (26 skills) |
| `/workflow` | Lazy | Pipeline visuel |
| `/ecosysteme` | Lazy | Écosystème technique |
| `/probleme-innovation` | Lazy | 7 piliers innovation |
| `/outils-mcp` + `/:id` | Lazy | Outils MCP |
| `**` | Lazy | Page 404 |

### Fichiers clés
- `src/index.html` — meta tags statiques (title, description, OG, Twitter)
- `src/app/app.config.ts` — providers (pas de Title/Meta, pas d'hydration)
- `src/app/app.routes.ts` — toutes les routes sans `data: { title, meta }`
- `src/app/app.component.html` — shell : header fixe, sidebar 280px, breadcrumbs,
  zone contenu, PAS de footer global
- `src/app/features/about/about.component.html` — page À propos, sections
  structurées, CSS `.about__contributors` et `.about__contributor-*` existent
  dans le SCSS mais AUCUN HTML correspondant (grille prête, jamais utilisée)
- `src/app/features/homepage/homepage.component.html` — footer inline qui dit
  "Chaque ligne de code... a été généré par le pipeline lui-même" (nie l'humain)
- `src/content/` — 37 fichiers .md avec frontmatter title+description+order
- `src/assets/images/` — 17 images + 11 avatars (sans alt text SEO)
- `public/` — favicons (6 formats), og-image.png (INUTILISÉE — celle référencée
  est dans `src/assets/`)
- `vercel.json` — aucune règle pour servir robots.txt/sitemap.xml, aucun header
  HTTP personnalisé
- `src/styles.css` — @theme Tailwind, :root custom properties, palette 6 couleurs
  dark exclusif, système élévation N1-N4, easings custom

### Palette réelle (runtime, pas la doc)
```css
--color-bg-primary:    #1C1812;
--color-bg-elevated:   #28231C;
--color-bg-subtle:     #0E0C09;
--color-text-primary:  #F5F0EB;
--color-text-secondary:#7A8899;
--color-accent:        #C4780D;  /* bronze, pas ambre */
```

### Typographie
- Display : Cabinet Grotesk (800, 700, 600) — Fontshare CDN
- Body : Satoshi (500, 400) — Fontshare CDN
- Dark mode EXCLUSIF — pas de light mode, pas de toggle

### État actuel du SEO (vérifié, pas supposé)
- `index.html` : `<title>Swarm Wiki</title>` statique — IDENTIQUE sur toutes les pages
- `<meta name="description">` : description unique pour tout le site
- OG/Twitter : tags présents mais statiques — même image pour toutes les pages
- `<html lang="fr">` : présent
- `<base href="/">` : présent
- `color-scheme: dark` : présent
- Skip-to-content link : présent
- **Title service Angular : JAMAIS injecté**
- **Meta service Angular : JAMAIS injecté**
- **Aucune route ne définit `data: { title }`**
- **JSON-LD : ZÉRO occurrence dans tout le codebase**
- **sitemap.xml : ABSENT**
- **robots.txt : ABSENT**
- **canonical : ABSENT**
- **hreflang : ABSENT**
- **Google Search Console : non vérifié** (aucune balise)
- **Google Analytics / gtag : ABSENT**
- **PWA service worker : ABSENT**
- **Headers HTTP sécurité : ABSENTS** (CSP, HSTS, X-Frame-Options...)
- **Footer global : ABSENT** (seulement homepage, inline)
- **Liens externes (GitHub, LinkedIn, portfolio) : ZÉRO dans tout le site**
- **"Joh Tandou" : ZÉRO occurrence** dans le contenu rendu aux visiteurs
- **Page About** : parle d'une "équipe" de 9 agents IA, pas du créateur humain
- **alt text images** : non optimisés
- **Frontmatter YAML** : 37 fichiers avec `description:` de qualité — jamais utilisée pour le SEO

### Vérifications live (20 juin 2026)
- **Lighthouse** : Performance 68/100, SEO 92/100 (faux positif), Accessibility 100/100
- **HTTP Headers** : HSTS présent (preload-ready), mais CSP/X-Frame-Options/X-Content-Type-Options absents
- **robots.txt** : sert le HTML SPA (pas un vrai fichier)
- **sitemap.xml** : sert le HTML SPA (pas un vrai fichier)
- **Domaine** : `swarm-wiki.vercel.app` — pas de domaine personnalisé
- **Repo GitHub** : privé (pas de page projet publique)

---

## Objectifs

### Objectif principal (poids 70%)
Faire en sorte qu'une recherche Google sur **"Joh Tandou"** positionne ce wiki
en première page (top 3), en utilisant le wiki comme véhicule de personal
branding technique. Le nom doit apparaître comme une signature d'architecte,
pas comme une autopromotion.

### Objectif secondaire (poids 30%)
Améliorer le SEO global du wiki pour tous les mots-clés liés à Swarm :
"pipeline agents IA", "développement agentic", "orchestration agents",
"wiki agents IA", "swarm wiki", etc.

### Contrainte maîtresse : DISCRÉTION ABSOLUE
Le nom "Joh Tandou" doit être intégré de façon :
- **Périphérique** — jamais dans les H1/H2, jamais dans le hero
- **Contextuelle** — lié au rôle d'architecte/créateur du système, pas plaqué
- **Progressive** — densité faible (1 occurrence par page max, pas toutes les pages)
- **Naturelle** — le visiteur ne doit pas sentir l'optimisation SEO
- **Élégante** — dans le ton technique et premium du wiki

---

## Livrable 1 — Audit SEO (note sur 10 + 3 recommandations par axe)

### Axe A : Performance & Core Web Vitals
Analyse l'impact SEO de :
- SPA pure sans SSR ni prerendering sur le crawl Google
- Temps de chargement du JS bundle Angular 19
- GSAP + D3.js + Mermaid.js : poids et impact LCP/FID/CLS
- Canvas hex grid (pas de DOM → non indexable)
- Stratégie de lazy loading actuelle
- Fichiers statiques (images non optimisées — 17 images dans assets/)
- Fontshare CDN (blocage de rendu ? display=swap ok ?)
- **Spécifique Vercel** : Edge Network, compression, cache headers

Pour chaque sous-point : score /10 + 3 recommandations classées par effort/impact.

### Axe B : Métadonnées & Indexabilité
Analyse et prescription pour :
- **Titres dynamiques par route** — solution Angular native (Title service +
  route data + resolver) compatible lazy loading, SANS SSR
- **Meta descriptions dynamiques** — utiliser le frontmatter YAML existant
  (37 fichiers avec `description:`) pour alimenter `<meta name="description">`
- **robots.txt** — contenu optimal, règles de crawl, emplacement dans `public/`
- **sitemap.xml** — génération statique au build (script Node post-`ng build`)
- **Canonical URLs** — par page, gestion des slash trailing
- **hreflang** — `fr` uniquement (pas de multilangue), mais le signaler quand même
- **OG images par page** — génération statique ou template dynamique

### Axe C : Données Structurées (JSON-LD)
Pour CHAQUE type de page, prescrire le schema.org exact :
- **Homepage** : `WebSite` + `Organization` (Swarm comme "produit")
- **About** : `Article` ou `TechArticle` + `Person` (Joh Tandou comme auteur)
- **Agents** : `TechArticle` avec `about` (chaque agent)
- **Skills** : `TechArticle` ou `HowTo` (chaque skill)
- **Workflow** : `HowTo` (pipeline étape par étape)
- **Fil d'Ariane** : `BreadcrumbList` — dynamique depuis le composant existant
- **Recherche** : `SearchAction` avec `potentialAction` pour le Sitelinks Search Box

### Axe D : Contenu & Sémantique HTML
- **Hiérarchie des headings** — audit H1→H6 sur les 9 pages principales
- **Alt texts** — chaque `<img>` du projet doit avoir un alt descriptif optimisé SEO
- **Anchor texts internes** — liens entre pages : texte d'ancre optimal
- **Densité mots-clés** — "agents IA", "pipeline", "orchestration", "développement agentic"
- **Contenu dupliqué** — vérifier que les pages agent/skill Markdown ne génèrent pas de duplicate content
- **Page 404** — contenu actuel, opportunités d'amélioration

### Axe E : Autorité & Backlinks
- **Domain Authority estimée** — swarm-wiki.vercel.app (sous-domaine Vercel vs domaine custom ?)
- **Linking interne** — cartographie des liens entre pages, densité, textes d'ancre
- **Liens sortants** — vers github.com/JohTandou/swarm-wiki : où, comment, attributs (`rel="me"`)
- **Stratégie backlinks** — opportunités depuis :
  - Les outils documentés dans le wiki (Supabase, Vercel, Render, Playwright, Context7, 21st.dev)
  - npmjs.com (packages listés), awesome-lists GitHub, articles techniques
- **Google Search Console** — procédure de vérification et configuration

### Axe F : Personal Branding "Joh Tandou" (le plus critique)

**F1. Analyse SERP actuelle**
- Que voit-on en tapant "Joh Tandou" sur Google aujourd'hui ?
- Quels sont les résultats existants (GitHub, LinkedIn, autres) ?
- Mots-clés associés naturels : "Joh Tandou swarm", "Joh Tandou agents IA",
  "Joh Tandou développement agentic", "Joh Tandou pipeline"

**F2. Stratégie d'injection discrète (du + subtil au + visible)**
Classer chaque suggestion par niveau de discrétion :

**Niveau 1 — Invisible (meta/seo pur)** :
- JSON-LD `Person` + `author` sur les pages clés
- `<meta name="author" content="Joh Tandou">`
- `rel="me"` sur les liens vers GitHub
- Fichier `humans.txt` à la racine (standard Google)

**Niveau 2 — Très subtil** :
- Footer global : "Conçu et orchestré par Joh Tandou" en texte secondaire
- Page About : section "Contributeurs" (grille CSS existante — 1 carte Joh Tandou)
- Breadcrumbs : `BreadcrumbList` JSON-LD avec auteur

**Niveau 3 — Subtil** :
- README GitHub (hors wiki, impact SEO croisé)
- Page 404 : signature discrète
- Frontmatter : `author: Joh Tandou` dans les 37 fichiers .md

**Niveau 4 — Visible mais naturel** :
- Page About : section "L'Origine" ou "Genèse du projet"
- Page Agents : mention dans l'introduction

**Niveau 5 — Visible (déconseillé sauf demande explicite)** :
- Section "Qui sommes-nous" dédiée, photo, page Contact

---

## Livrable 2 — Plan d'Action Priorisé (3 sprints)

### Sprint 1 — Fondations invisibles (~10h, semaine 1)
Actions à impact fort/critique, visibilité zéro.
- robots.txt, sitemap.xml, Title service, JSON-LD de base, Google Search Console
- Chaque action avec : effort (heures), impact, fichier(s) à modifier, code précis

### Sprint 2 — Structure & contenu (~14h, semaines 2-3)
Actions à impact moyen/fort, visibilité subtile.
- Meta descriptions dynamiques, OG images, JSON-LD avancé, alt texts, maillage interne

### Sprint 3 — Personal branding discret (~8h, semaine 4)
Actions spécifiques "Joh Tandou", visibilité subtile.
- JSON-LD Person consolidé, footer global, section contributeurs About, frontmatter author,
  humans.txt, README GitHub

---

## Livrable 3 — Plan de Mesure & Suivi

- **KPIs exacts** à tracker dans Google Search Console
- **Requêtes GSC** à surveiller : "Joh Tandou", "Joh Tandou swarm", "swarm wiki",
  "pipeline agents IA", "développement agentic", "wiki agents IA"
- **Fréquence d'audit** recommandée (hebdomadaire, mensuel, trimestriel)
- **Outils** : Google Search Console, PageSpeed Insights, Lighthouse CI, Ahrefs, Screaming Frog
- **Alertes** à configurer (chute de position, erreur d'indexation)

---

## Contraintes Techniques Absolues

1. **Pas de SSR / Angular Universal.** Le projet restera une SPA. Toute solution doit fonctionner avec `ng build` standard.
2. **Pas de backend.** Pas de Node.js server, pas d'API routes Vercel complexes.
3. **Pas de modification de la palette ou typographie.** Les 6 couleurs et Cabinet Grotesk + Satoshi sont intouchables.
4. **Pas de light mode.** Dark mode exclusif, pas de toggle.
5. **"Joh Tandou" jamais en H1 ou H2.** Uniquement zones périphériques : footer, meta, breadcrumb JSON-LD, about section secondaire, frontmatter.
6. **Pas de page dédiée au personal branding.**
7. **Les fichiers Markdown existants (37 .md) ne doivent pas être modifiés sauf ajout de `author:` dans le frontmatter.**
8. **Toute modification du template HTML About doit respecter la grille CSS `.about__contributors` existante** (3 colonnes desktop, 1 colonne mobile, classes déjà stylées : `.about__contributor`, `.about__contributor-avatar`, `.about__contributor-name`, `.about__contributor-role`, `.about__contributor-desc`).
9. **Le composant app.component.html n'a pas de footer global.** Si un footer global est proposé, il doit être ajouté dans le shell (après `</main>`, avant `</div>`), pas dans chaque page.
10. **Le sitemap.xml et robots.txt doivent être servis depuis la racine** (`/sitemap.xml`, `/robots.txt`), soit via `public/`, soit via rewrites Vercel.
11. **Vercel ne fait pas de SSR automatique pour Angular.** Le `vercel.json` actuel fait un rewrite SPA standard.
12. **Toute solution doit être testable localement** avec `ng serve`.

---

## Processus de Réflexion

Avant de produire les livrables, réfléchis dans cet ordre :

1. **Priorité Googlebot** : qu'est-ce que Google voit aujourd'hui vs ce qu'il devrait voir ? Le delta est ton plan d'action minimal.
2. **Architecture de l'information** : les 9 routes actuelles forment-elles une structure logique pour un moteur de recherche ?
3. **Entités** : quelles entités schema.org le wiki représente-t-il ? (WebSite, Organization, TechArticle, Person, HowTo, BreadcrumbList) → chaque page doit mapper vers une entité.
4. **Cohérence cross-canal** : le nom "Joh Tandou" doit apparaître de façon cohérente sur le wiki, le README GitHub, le package.json, et les profils sociaux. Google croise ces signaux.
5. **Longue traîne vs tête** : "Joh Tandou" est un mot-clé de tête. Quels mots-clés de longue traîne peuvent renforcer le positionnement ?
6. **Le piège du duplicate content SPA** : Angular SPA + rewrite tout → index.html = risque que Google ne voie qu'une seule page. Comment le contrer sans SSR ? (indice : Title service + JSON-LD distincts par page sont le minimum vital)
7. **L'opportunité du frontmatter** : 37 descriptions de qualité existent déjà. Le coût marginal de les injecter dans les meta tags est quasi nul. C'est le quick win absolu.
