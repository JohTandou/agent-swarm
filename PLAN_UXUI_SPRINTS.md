# Plan d'Amélioration UX/UI — Swarm Wiki

> Analyse comparative TopSeeker (8.6/10 Apple-grade) → Swarm Wiki (6.5/10)
> Date : 8 juin 2026 | Auteur : Audit croisé automatisé

---

## Contexte

Swarm Wiki est un wiki statique Angular 19 documentant le système Swarm (pipeline d'agents IA). Il a une identité visuelle forte (dark mode exclusif, palette 6 couleurs, Cabinet Grotesk + Satoshi, hex grid signature). Les sprints 0–2 ont posé des fondations solides (design tokens, boutons, disabled states, safe areas, bento grid basique, page Écosystème).

**TopSeeker** (johtnd/topseeker) est une plateforme SaaS de recherche d'emploi IA qui atteint un niveau Apple-grade confirmé (8.6/10) sur 12 catégories UX/UI. L'analyse ci-dessous identifie les éléments transférables et les priorise en 5 sprints.

---

## Comparatif par Catégorie

| Catégorie | TopSeeker | Swarm Wiki | Gap | Priorité |
|-----------|-----------|------------|-----|----------|
| Design System & Tokens | 9.0 | 7.0 | -2.0 | Haute |
| Animations & Micro-interactions | 9.5 | 7.0 | -2.5 | Haute |
| Composants & Patterns | 8.5 | 5.0 | **-3.5** | **Critique** |
| Layout & Composition | 9.0 | 7.0 | -2.0 | Moyenne |
| États & Feedback | 8.5 | 6.0 | -2.5 | Haute |
| Navigation & Architecture | 9.0 | 6.0 | -3.0 | Haute |
| Accessibilité | 7.5 | 7.0 | -0.5 | Basse |
| Performance UX | 7.0 | 7.0 | 0.0 | Basse |
| Copywriting & Micro-copy | 8.0 | 6.0 | -2.0 | Moyenne |
| Effets visuels premium | 9.5 | 7.0 | -2.5 | Haute |
| Mobile & Touch | 7.0 | 7.0 | 0.0 | Moyenne |
| Wow Factor | 10.0 | 6.0 | **-4.0** | **Critique** |

**Les deux gaps critiques :** Composants inexistants (5/10) et moments de surprise absents sur mobile (easter egg cassé).

---

## Philosophie du Plan

1. **Composants d'abord.** Sans bibliothèque de composants réutilisables, toute amélioration est fragile et dupliquée. C'est le sprint A, non négociable.
2. **Mobile n'est pas une version dégradée.** Le hex grid signature est invisible sur ~50% des visiteurs. Chaque sprint doit inclure une contrepartie mobile.
3. **Chaque pixel communique.** Un skeleton, un état vide, un message d'erreur — tout doit être intentionnel et premium.
4. **Le code sert l'expérience.** Éviter la sur-ingénierie. Privilégier CSS-first, GSAP là où c'est nécessaire, Canvas uniquement pour le hex grid.
5. **Pas de copie bête de TopSeeker.** Adapter au contexte (wiki statique, pas de backend, pas d'auth, pas de dashboard). Garder l'identité Swarm (brun profond, ambré, hexagones).

---

## Sprint A — Fondations Composants (Critique 🔴)

**Objectif :** Passer de 5/10 à 7.5/10 sur les composants. Créer une bibliothèque réutilisable avant que la duplication ne devienne ingérable.

### A.1 — `ui-button` (6 variants)
- **Variants :** primary (dégradé ambré), secondary (fond elevated + border), outline (border ambrée), ghost (transparent), destructive (rouge sémantique), icon (carré 44px)
- **Sizes :** sm (36px), md (44px), lg (52px)
- **États :** loading (dots animés + aria-busy), disabled (opacity 0.5 + not-allowed), active-press (scale 0.97)
- **Inspiration TopSeeker :** système CVA, shimmer-sweep au hover, aria-busy
- **Fichiers :** `src/app/shared/components/ui-button/`

### A.2 — `ui-card` (4 variants)
- **Variants :** default (N2 elevation), glass (backdrop-blur + border), hover (lift + glow au survol), bento (grid-column: span 2)
- **Inspiration TopSeeker :** card avec tilt 3D subtil (CSS uniquement, pas de JS)
- **Props :** padding, clickable (cursor-pointer + hover), highlight (bordure ambrée)
- **Fichiers :** `src/app/shared/components/ui-card/`

### A.3 — `ui-skeleton` (shimmer teinté)
- **Variants :** text (ligne), card (rectangle), circle (avatar), table-row
- **Animation :** shimmer avec dégradé ambré (pas gris fade)
- **Stagger automatique :** délai incrémental via CSS custom property `--skeleton-delay`
- **Remplace :** tous les blocs skeleton dupliqués dans workflow, ecosystem, homepage
- **Fichiers :** `src/app/shared/components/ui-skeleton/`

### A.4 — `ui-badge`
- **Variants :** default, success, warning, error, info
- **Sizes :** sm, md
- **Fichiers :** `src/app/shared/components/ui-badge/`

### A.5 — `ui-empty-state`
- **Illustration animée :** hexagone SVG avec pulse lent
- **Slots :** titre, description, action primaire (bouton), action secondaire (lien)
- **Remplace :** tous les messages "Aucun résultat" inexistants
- **Fichiers :** `src/app/shared/components/ui-empty-state/`

### A.6 — Refactoring
- Remplacer tous les boutons inline par `ui-button` dans les pages existantes
- Remplacer tous les skeletons dupliqués par `ui-skeleton`
- Remplacer les cartes par `ui-card`

---

## Sprint B — Design System Complétion & Effets Premium

**Objectif :** Passer de 7/10 à 8.5/10 sur le design system et les effets visuels.

### B.1 — Tokens CSS Complémentaires
- **Spacing system :** `--space-xs`(4px), `--space-sm`(8px), `--space-md`(16px), `--space-lg`(24px), `--space-xl`(32px), `--space-2xl`(48px), `--space-3xl`(64px)
- **Radius system :** `--radius-sm`(4px), `--radius-md`(8px), `--radius-lg`(12px), `--radius-xl`(16px), `--radius-2xl`(24px), `--radius-full`(9999px)
- **Z-Index system :** `--z-dropdown`(50), `--z-sticky`(100), `--z-overlay`(200), `--z-modal`(300), `--z-toast`(400)
- **Easings nommés :** `--ease-out-expo`, `--ease-out-quart`, `--ease-spring`
- **Durées standardisées :** `--duration-fast`(150ms), `--duration-normal`(250ms), `--duration-slow`(400ms), `--duration-cinematic`(800ms)
- **Fichier :** `src/styles.css` (section `:root`)

### B.2 — Grain Texture Globale
- **Inspiration TopSeeker :** pseudo-element `body::after` avec SVG noise, `opacity: 0.03`, `pointer-events: none`
- **Fichier :** `src/assets/textures/noise.svg` + `src/styles.css`

### B.3 — Système Hover/Press Global
- **`.hover-lift` :** translateY(-2px) + scale(1.02) + glow ambré
- **`.hover-glow` :** box-shadow 0 0 20px rgba(240,165,34,0.08)
- **`.active-press` :** scale(0.97) en 100ms
- **`.shimmer-sweep` :** pseudo-element avec gradient transparent→white/8→transparent, traverse au hover (500ms)
- **Fichier :** `src/styles/_interactions.scss`

### B.4 — Cursor Gradient (Homepage)
- **Inspiration TopSeeker :** radial-gradient qui suit la souris avec interpolation lerp
- **Désactivé :** mobile, touch, reduced-motion
- **Implémentation :** CSS custom property `--cursor-x`, `--cursor-y` mis à jour via `mousemove` listener
- **Fichier :** `src/app/features/homepage/homepage.component.ts`

---

## Sprint C — Animations Premium & Stagger Systématique

**Objectif :** Passer de 7/10 à 9/10 sur les animations. Chaque page doit avoir un storyboard d'animation.

### C.1 — Stagger Systématique
- **Toutes les pages :** remplacer les `.reveal-on-scroll` sans délai par un stagger avec `animation-delay: calc(var(--stagger-index) * 60ms)`
- **Directive Angular :** `appStaggerChildren` qui injecte `--stagger-index` via CSS custom property sur chaque enfant
- **Fichiers :** `src/app/shared/directives/stagger-children.directive.ts` + mise à jour de toutes les pages

### C.2 — Parallaxe 3D (Homepage)
- **Actuel :** 3 couches translateY uniquement
- **Cible :** ajouter `rotateX` (perspective 3D) et `scale` aux couches. La couche arrière scale 1.1→1, l'avant scale 0.95→1
- **Easing :** `--ease-out-expo`
- **Fichier :** `src/app/features/homepage/homepage.component.ts`

### C.3 — Card Hover Premium
- **Comportement :** translateY(-4px) + scale(1.03) + glow ambré + border lumineuse
- **Transition :** 250ms, ease-out
- **Utilisé sur :** toutes les cartes (agents, skills, ecosystem, workflow, mcp-tools)
- **Fichier :** intégré dans `ui-card`

### C.4 — Page Transitions
- **Animation :** fade + translateY(12px→0), 350ms, ease-out-expo
- **Angular :** utiliser `@angular/animations` avec `query(':enter')` et `query(':leave')` dans le route outlet
- **Reduced motion :** fade uniquement
- **Fichier :** `src/app/app.component.ts` (route animation)

### C.5 — Text Reveal (Hero Titles)
- **Animation :** chaque mot apparaît avec blur(4px)→0 + translateY(16px→0), stagger 80ms
- **Utilisé sur :** homepage hero, page headers
- **Implémentation :** directive `appTextReveal` ou GSAP SplitText
- **Fichier :** `src/app/shared/directives/text-reveal.directive.ts`

---

## Sprint D — Navigation Excellence & Mobile Premium

**Objectif :** Passer de 6/10 à 8/10 sur la navigation. Le mobile devient une expérience de première classe.

### D.1 — Breadcrumbs Dynamiques
- **Source :** router Angular, reconstruction du chemin
- **Design :** chevrons séparateurs, dernier élément non cliquable (grisé), accents ambrés sur les parents
- **Position :** sous le header, au-dessus du contenu principal
- **Fichiers :** `src/app/shared/components/breadcrumbs/`

### D.2 — Indicateur Actif Animé (Sidebar)
- **Inspiration TopSeeker :** barre gauche coulissante + fond subtil sur l'item actif
- **Transition :** 300ms ease-out-expo
- **Implémentation :** CSS uniquement — `::before` pseudo-element avec `transform: translateY(calc(var(--active-index) * 100%))` ou `view-transition` si supporté
- **Fichier :** `src/app/layout/sidebar/sidebar.component.scss`

### D.3 — Scroll Progress Bar
- **Position :** tout en haut de la page, 3px hauteur, dégradé ambré
- **Animation :** `scaleX` lié au scroll (0→1)
- **Fichier :** `src/app/shared/components/scroll-progress/`

### D.4 — Hexagones SVG Animés (Mobile)
- **Actuel :** SVG statique sans animation. Easter egg cassé sur mobile.
- **Cible :** SVG avec `<animate>` ou CSS animations — pulsation lente (opacity 0.03–0.06), certains s'illuminent en ambré, lignes de connexion subtiles
- **Easter egg mobile :** taper "swarm" illumine tous les hexagones SVG
- **Fichiers :** `src/app/features/homepage/hex-grid-mobile.component.ts`, `hex-grid-mobile.component.scss`

### D.5 — dvh (Dynamic Viewport Height)
- **Remplacer :** tous les `100vh` par `100dvh` pour gérer les barres d'adresse mobiles
- **Fichiers :** `src/styles.css`, tous les `*.scss` avec `vh`

### D.6 — Swipe-to-Dismiss (Sidebar Mobile)
- **Gesture :** swipe gauche pour fermer la sidebar sur mobile
- **Implémentation :** Hammer.js (léger) ou écouteur `touchstart`/`touchend` natif
- **Fichier :** `src/app/layout/sidebar/sidebar.component.ts`

---

## Sprint E — Polish, Moments & Copywriting

**Objectif :** Passer de 6/10 à 9/10 sur le wow factor. Atteindre le niveau "envie de partager".

### E.1 — Page 404 avec Personnalité
- **Design :** grand "404" en Cabinet Grotesk Extrabold avec dégradé ambré, hexagone décoratif
- **Copy :** « Cette page s'est perdue dans le swarm. Les agents sont à sa recherche. »
- **Actions :** « Retour à la ruche » (accueil) + « Explorer les agents » (/agents)
- **Fichiers :** `src/app/features/not-found/`

### E.2 — Empty States Chaleureux
- **Utiliser `ui-empty-state` partout :** résultats de recherche vides, liste de skills vide, etc.
- **Copy contextualisé :** pas juste « Aucun résultat » mais « Aucun agent ne correspond à cette recherche. Essayez "orchestrateur" ou "frontend". »
- **Fichiers :** mise à jour des pages existantes

### E.3 — Page /a-propos Complète
- **Contenu réel :** présentation du projet Swarm, l'équipe, la philosophie, les contributeurs
- **Design :** section hero avec stats, timeline du projet, carte des contributeurs
- **Fichiers :** `src/app/features/about/` (existant, à remplir)

### E.4 — Page /normes (Standards)
- **Contenu :** standards de code, conventions, processus de review, checklist de qualité
- **Design :** layout en accordéon ou tabs, code examples
- **Fichiers :** `src/app/features/standards/` (existant, à remplir)

### E.5 — Second Easter Egg
- **Idée :** séquence de clics sur le logo (3 clics rapides) → les hexagones forment un pattern spécial ou le thème s'inverse temporairement
- **Ou :** Konami code (↑↑↓↓←→←→BA) → animation de confettis ambrés + message
- **Fichier :** `src/app/shared/services/easter-egg.service.ts` (étendre l'existant)

### E.6 — Sparkle / Confetti Rewards
- **Déclencheur :** première visite, navigation vers une nouvelle section, complétion d'un "parcours"
- **Animation :** particules CSS uniquement (pas de canvas lourd), palette ambrée/or
- **Fichier :** `src/app/shared/components/sparkle-effect/`

### E.7 — Copywriting Review Globale
- **Revoir chaque texte :** titres de page, descriptions, messages d'erreur, labels, tooltips
- **Ton cible :** technique accessible, chaleureux, francophone naturel — « Les agents du Swarm » plutôt que « Le système Swarm »
- **Fichiers :** tous les `*.component.html` et `*.component.ts`

---

## Planning & Dépendances

```
Sprint A (composants) ← pas de dépendance
    ↓
Sprint B (design system) ← dépend de A (les composants utilisent les nouveaux tokens)
    ↓
Sprint C (animations) ← dépend de B (easings, durées)
    ↓
Sprint D (navigation) ← dépend de A (breadcrumbs utilisent ui-button, ui-badge)
    ↓
Sprint E (polish) ← dépend de A, B, C, D
```

**Temps estimé par sprint :** 2–3 sessions swarm (selon complexité des animations)

---

## Indicateurs de Succès

| Sprint | Métrique | Cible |
|--------|----------|-------|
| A | Nombre de composants réutilisables | 5 nouveaux |
| A | Lignes de markup dupliqué supprimées | -200 lignes |
| B | Tokens CSS documentés | 25+ tokens |
| B | Score effets premium | 7→8.5/10 |
| C | Pages avec stagger systématique | 5/5 pages |
| C | Score animations | 7→9/10 |
| D | Temps de chargement perçu mobile | -15% |
| D | Easter egg fonctionnel mobile | ✅ |
| E | Pages sans 404 | 0 |
| E | Score wow factor | 6→9/10 |
| Global | Score UX/UI global | 6.5→8.5/10 |

---

## Risques & Honnêteté

1. **La page /a-propos et /normes nécessitent du contenu réel.** Si le contenu n'est pas prêt, les pages seront des coquilles vides malgré un design premium. À discuter avant le sprint E.

2. **Le stagger systématique (sprint C) peut dégrader les performances** si mal implémenté (trop de `animation-delay` calculés). Utiliser `will-change` et limiter à 20 enfants max par conteneur.

3. **Le second easter egg ne doit pas être gimmick.** S'il n'apporte pas un vrai sourire, mieux vaut ne pas le faire. La barre est haute après le "swarm" sur les hexagones.

4. **Les composants (sprint A) sont un investissement initial lourd** (refactoring de toutes les pages existantes). Mais le coût de NE PAS le faire est exponentiel — chaque nouvelle page ajoute de la duplication.

5. **TopSeeker a Framer Motion, Swarm a GSAP.** Ce qui est trivial en React (layoutId, AnimatePresence) est plus complexe en Angular. Ne pas chercher à reproduire à l'identique — trouver l'équivalent Angular natif.
