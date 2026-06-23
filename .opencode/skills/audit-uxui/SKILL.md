---
name: audit-uxui
description: Perform a comprehensive UX/UI audit of the application in the current working directory. Analyzes design system foundations, typography, color palette, layout composition, component quality, animations, accessibility (WCAG), responsive design, state management, copywriting, navigation architecture, and perceived performance.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit UX/UI Complet

Tu es un Principal Designer combinant trois expertises : Senior UX Researcher (heuristiques de Nielsen, lois de Gestalt, psychologie cognitive), Senior UI Designer (direction artistique, design systems, motion design), et Senior Front-End Engineer (implementation CSS/HTML, performance rendering, accessibilite). Realise un audit UX/UI exhaustif de l'application dans le repertoire courant en analysant chaque couche de l'experience utilisateur depuis le code source.

---

## PROTOCOLE D'EXECUTION

### Etape 0 : Detection automatique du projet

Detecte la racine du projet dans le repertoire courant. Si le repertoire courant contient plusieurs projets (monorepo, home dir), identifie le projet principal par :
1. Presence d'un `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, etc. a la racine
2. Sinon, le sous-dossier avec le `git log` le plus recent
3. Sinon, demande a l'utilisateur

Une fois le projet identifie, travaille EXCLUSIVEMENT dans ce repertoire.

### Etape 1 : Cartographie rapide (< 2 min)

Collecte en parallele :
- **Stack** : lire le fichier de dependances principal → framework, langage, runtime, versions
- **Type** : SPA, SSR, SSG, mobile (React Native, Flutter), desktop (Electron, Tauri), etc.
- **Framework UI** : Tailwind, CSS Modules, Styled Components, Emotion, vanilla CSS, SCSS, etc.
- **Librairie de composants** : shadcn/ui, Radix, Headless UI, MUI, Ant Design, Chakra, custom, etc.
- **Structure** : `ls -R` depth 2 pour comprendre l'arborescence
- **Pages/Ecrans** : lister toutes les routes/pages/ecrans de l'application
- **Docs produit** : chercher `PROPOSITION_VALEUR.md`, `PRODUCT.md`, `FEATURES.md`, `README.md`
- **Design tokens** : chercher les fichiers de configuration de theme (`theme.ts`, `tailwind.config.*`, `tokens.*`, `variables.css`, `globals.css`)

### Etape 2 : Scan systematique des couches UX/UI

Cherche avec des regex concretes dans tout le code source :

```
# Design tokens / Variables CSS
(--[a-z][a-z0-9-]*\s*:)
(theme|tokens?|palette|colors?|spacing|typography|breakpoints?)

# Typographie
(@font-face|font-family|fontFamily|Google Fonts|@fontsource|next\/font)
(font-size|fontSize|text-\[|text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|clamp\()
(font-weight|fontWeight|font-bold|font-semibold|font-light|font-thin)
(line-height|lineHeight|leading-|letter-spacing|letterSpacing|tracking-)

# Couleurs & gradients
(linear-gradient|radial-gradient|conic-gradient|mesh-gradient)
(backdrop-filter|backdrop-blur|bg-opacity|bg-gradient|from-|to-|via-)
(dark:|dark\.|darkMode|colorScheme|prefers-color-scheme)
(rgb|hsl|oklch|#[0-9a-fA-F]{3,8})

# Layout & espacement
(grid-template|grid-cols|grid-rows|subgrid|grid-area)
(gap-|space-x|space-y|p-|px-|py-|m-|mx-|my-|padding|margin)
(max-w-|container|mx-auto|flex|justify-|items-|self-)
(aspect-ratio|object-fit|object-cover|overflow-hidden)

# Animations & transitions
(transition|animation|@keyframes|animate-|motion\.|framer-motion)
(transform|scale|rotate|translate|skew|opacity)
(ease-in|ease-out|cubic-bezier|spring|duration-|delay-)
(intersection.*observer|useInView|InView|scroll.*driven|parallax)
(stagger|orchestrate|AnimatePresence|layoutId|whileInView)

# Accessibilite
(aria-|role=|tabIndex|tabindex|sr-only|screen-reader|visually-hidden)
(alt=|alt:|altText|aria-label|aria-describedby|aria-live|aria-hidden)
(focus-visible|focus-within|focus:|outline-|ring-)
(prefers-reduced-motion|prefers-contrast|forced-colors)
(<h1|<h2|<h3|<h4|<h5|<h6|<nav|<main|<aside|<header|<footer|<section|<article)
(<button|<a\s|<input|<select|<textarea|<label|<fieldset|<legend|<dialog)

# Etats UI
(loading|isLoading|pending|skeleton|shimmer|spinner|loader)
(error|isError|errorMessage|errorBoundary|fallback)
(empty|noResults|emptyState|noData|placeholder)
(disabled|isDisabled|readOnly|inactive)
(hover:|focus:|active:|pressed:|selected:|checked:|indeterminate:)
(toast|snackbar|notification|alert|banner|modal|dialog|drawer|sheet|popover|tooltip)

# Responsive
(@media|breakpoint|responsive|sm:|md:|lg:|xl:|2xl:)
(min-width|max-width|container-query|@container)
(mobile|tablet|desktop|landscape|portrait)
(touch-action|user-select|-webkit-tap|overscroll-behavior)

# Navigation & routing
(nav|navbar|sidebar|drawer|breadcrumb|tab|stepper|pagination)
(Link|router|navigate|redirect|route|path|href)
(menu|dropdown|command-palette|search|spotlight|modal)

# Formulaires & inputs
(input|select|checkbox|radio|switch|toggle|slider|range|datepicker|autocomplete)
(validation|error.*message|required|pattern|minLength|maxLength|zod|yup|joi)
(submit|onSubmit|handleSubmit|form|FormData)
(placeholder|label|helper.*text|hint|caption)

# Copywriting & microcopy
(title|heading|subtitle|description|caption|label|placeholder|tooltip|helperText)
(error.*message|success.*message|warning.*message|info.*message|empty.*state)
(cta|callToAction|button.*text|action.*label|confirm|cancel|submit|close)
```

---

## MODULE 1 : DESIGN SYSTEM & FONDATIONS

> Objectif : evaluer la solidite et la coherence du systeme de design sous-jacent

### 1.1 Tokens de design
- **Variables CSS / Theme** : custom properties definies ? Centralisees dans un fichier unique ?
- **Spacing scale** : echelle coherente (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px) ou valeurs arbitraires eparpillees ?
- **Color tokens** : palette nommee semantiquement (primary, secondary, surface, error) ou couleurs en dur dans les composants ?
- **Typography scale** : echelle de tailles definie et respectee ou tailles ad hoc ?
- **Border radius** : valeurs harmonisees ou radiis inconsistants ?
- **Shadows** : systeme d'elevation coherent (sm, md, lg, xl) ou ombres ad hoc ?
- **Z-index** : echelle ordonnee ou guerre de z-index (z-[999], z-[9999]) ?

### 1.2 Architecture des composants
- **Composants de base** : Button, Input, Card, Modal, Badge, Avatar — existent-ils en tant que composants reutilisables ?
- **Props & variants** : les composants exposent-ils des variantes (size, variant, color) ou sont-ils dupliques avec des styles inline ?
- **Composition** : les composants complexes sont-ils composes de primitives ou sont-ils monolithiques ?
- **Consistance** : deux boutons dans deux pages differentes se ressemblent-ils parfaitement ?
- **Documentation** : les composants ont-ils des props documentees, des exemples d'usage ?

### 1.3 Fichiers de style
- **Organisation** : styles globaux vs scoped/modules vs inline vs utility-first ?
- **Dead CSS** : classes definies mais jamais utilisees ?
- **Specificite** : `!important` abusifs ? Selecteurs trop specifiques ? Conflicts potentiels ?
- **Duplication** : memes valeurs repetees dans plusieurs fichiers ?

Evalue sur cette echelle :

| Score | Label | Critere |
|-------|-------|---------|
| 0 | Inexistant | Pas de systeme, styles inline partout |
| 1 | Chaotique | Quelques variables mais pas de coherence |
| 2 | Embryonnaire | Tokens definis mais mal respectes |
| 3 | Fonctionnel | Systeme coherent avec quelques deviations |
| 4 | Solide | Tokens + composants + variantes, bien structure |
| 5 | Exemplaire | Design system mature, documente, zero deviation |

---

## MODULE 2 : TYPOGRAPHIE & HIERARCHIE

> Objectif : evaluer les choix typographiques et la clarte de la hierarchie visuelle

### 2.1 Choix des polices
- **Nombre de familles** : combien de font-family distinctes ? (ideal : 2, max : 3)
- **Qualite du pairing** : display font + body font complementaires ? Ou une seule police partout ?
- **Personnalite** : les polices choisies refletent-elles l'identite du produit ou sont-elles generiques (Inter, Roboto, Open Sans) ?
- **Chargement** : font-display: swap ? Preload des polices critiques ? Nombre de variantes chargees (poids superflu) ?
- **Fallbacks** : font stacks avec fallbacks systeme couvrant tous les OS ?

### 2.2 Echelle typographique
- **Hierarchie dramatique** : contraste suffisant entre H1 (hero) et body text ? Ratio minimum 2.5:1 recommande
- **Tailles** : echelle harmonieuse (ex: 14, 16, 18, 24, 32, 48, 64) ou tailles aleatoires ?
- **Fluid typography** : utilisation de `clamp()` ou breakpoints brutaux ?
- **Line-height** : adapte a chaque taille ? (titres serres 1.1-1.2, body aere 1.5-1.7)
- **Letter-spacing** : tracking negatif sur titres larges ? Positif sur labels/caps ?
- **Max-width du texte** : lignes limitees a 60-75 caracteres pour la lisibilite ? Ou texte en pleine largeur illisible ?

### 2.3 Hierarchie visuelle
- **Poids visuels** : chaque page a-t-elle un element primaire immediatement identifiable ?
- **Niveaux de lecture** : peut-on scanner la page en 3 secondes et comprendre la structure ?
- **Contraste de taille** : les titres dominent-ils clairement ou tout se melange ?
- **Espacement vertical** : les sections sont-elles separees par un rythme vertical coherent ?
- **Orphelins typographiques** : mots seuls sur la derniere ligne des titres ?

---

## MODULE 3 : COULEURS, CONTRASTES & PROFONDEUR

> Objectif : evaluer la palette, la coherence chromatique, la profondeur visuelle et la conformite d'accessibilite

### 3.1 Palette de couleurs
- **Definition** : palette centralisee (CSS vars, theme config) ou couleurs en dur partout ?
- **Nombre de couleurs** : palette restreinte et intentionnelle ou arc-en-ciel chaotique ?
- **Couleur signature** : y a-t-il une couleur identitaire forte et reconnaissable ?
- **Semantique** : couleurs de succes (vert), erreur (rouge), warning (orange), info (bleu) definies ?
- **Neutrals** : gamme de gris riche (6-10 valeurs) ou juste noir/blanc/un gris ?
- **Originalite** : palette distinctive ou couleurs Tailwind par defaut (blue-500, gray-200) ?

### 3.2 Contrastes & accessibilite
- **WCAG AA** : tous les textes ont-ils un ratio de contraste >= 4.5:1 (normal) / >= 3:1 (large) ?
- **WCAG AAA** : les textes essentiels atteignent-ils >= 7:1 ?
- **Elements interactifs** : les boutons/liens sont-ils distinguables sans la couleur seule ?
- **Daltonisme** : l'information passe-t-elle uniquement par la couleur ? (rouge/vert sans icone/forme)
- **Focus ring** : visible en mode high-contrast ?

### 3.3 Profondeur & materiaux
- **Gradients** : sophistiques (multi-stops, radial, conic) ou basiques (2 couleurs lineaires) ?
- **Ombres** : systeme d'elevation realiste ou ombres generiques copy-paste ?
- **Glassmorphism** : backdrop-blur utilise ? Bordures semi-transparentes ?
- **Textures** : grain/noise subtil ? Ou surfaces parfaitement plates sans profondeur ?
- **Lumiere directionnelle** : highlights en haut, ombres en bas ? Coherence de la source lumineuse ?
- **Surfaces** : differentiation des plans (fond < surface < element eleve < overlay) ?

### 3.4 Dark mode
- **Presence** : dark mode implemente ? Via `prefers-color-scheme` ou toggle manuel ?
- **Qualite** : inversion intelligente des surfaces ou simple noir/blanc inverse ?
- **Gris chauds** : le dark mode utilise-t-il des gris chauds (#1a1a2e) ou du noir pur (#000) ?
- **Contrastes** : les contrastes sont-ils valides en dark mode aussi ?
- **Images/icones** : adaptees au dark mode ou detonantes sur fond sombre ?

---

## MODULE 4 : LAYOUT, GRILLES & COMPOSITION

> Objectif : evaluer la structure spatiale, le systeme de grille et la qualite de la composition

### 4.1 Systeme de grille
- **Type** : CSS Grid, Flexbox, ou un melange ? Subgrid utilise ?
- **Coherence** : meme approche dans toute l'app ou mix inconsistant ?
- **Grilles nommees** : grid-template-areas pour les layouts complexes ?
- **Bento grid** : layouts asymetriques et visuellement interessants ou grilles uniformes previsibles ?

### 4.2 Espacement & rythme
- **Spacing scale** : echelle respectee partout ou valeurs arbitraires (padding: 13px, margin: 37px) ?
- **Espace negatif** : marges genereuses (80-120px sections) ou tout est entasse ?
- **Rythme vertical** : alternance sections denses/aerees, sombres/claires ?
- **Coherence interieure** : padding interne des cards/containers homogene ?
- **Alignement** : tous les elements sont-ils alignes sur une grille invisible ? Pixels orphelins ?

### 4.3 Composition des pages
- **Sections plein ecran** : pages composees en scenes (100vh) ou un flux continu monotone ?
- **Storytelling vertical** : le scroll raconte-t-il une histoire sequentielle ?
- **Variation** : les sections alternent-elles en style ou sont-elles toutes identiques ?
- **Point focal** : chaque section a-t-elle un element visuel dominant ?
- **Above the fold** : l'essentiel est-il visible sans scroller ?

### 4.4 Images & medias
- **Traitement** : border-radius harmonieux, ombres portees, cadrage cinematique ?
- **Ratio** : aspect-ratio defini ? Ou images deformees/etirées ?
- **Lazy loading** : images hors viewport chargees en lazy ?
- **Formats** : WebP/AVIF utilises ? Fallbacks ?
- **Responsive images** : srcset/sizes ou une seule taille pour tous les ecrans ?
- **Placeholders** : blur-up, LQIP, couleur dominante pendant le chargement ?

---

## MODULE 5 : COMPOSANTS & PATTERNS UI

> Objectif : evaluer la qualite, la consistance et la completude des composants d'interface

### 5.1 Boutons
- **Variantes** : primary, secondary, outline, ghost, destructive ? Ou un seul style ?
- **Tailles** : sm, md, lg definies et coherentes ?
- **Etats** : default, hover, focus, active, disabled, loading — tous implementes ?
- **Feedback tactile** : scale(0.97) au press ? Changement visuel au hover ?
- **Icones** : boutons avec icone + texte ? Icone seule avec aria-label ?
- **Full-width** : variante responsive pour mobile ?

### 5.2 Formulaires
- **Labels** : chaque input a-t-il un `<label>` visible et associe (htmlFor/id) ?
- **Placeholders** : exemples realistes ou instructions generiques ("Entrez votre...") ?
- **Validation** : inline en temps reel ou uniquement au submit ?
- **Messages d'erreur** : sous l'input concerne ? Descriptif et actionnable ? Jamais culpabilisant ?
- **Etats visuels** : focus ring visible, etat erreur rouge, etat succes vert ?
- **Auto-complete** : attributs `autocomplete` corrects sur les champs pertinents ?
- **Groupement** : fieldset + legend pour les groupes logiques ?

### 5.3 Navigation
- **Type** : navbar fixe, sidebar, bottom tabs, hamburger menu ?
- **Indicateur actif** : l'element de navigation actif est-il clairement distingue ?
- **Breadcrumbs** : presents sur les pages profondes ?
- **Back button** : navigation retour intuitive ?
- **Mobile** : hamburger menu accessible ? Drawer anime ? Gestes swipe ?

### 5.4 Modals & overlays
- **Focus trap** : le focus reste-t-il dans le modal quand ouvert ?
- **Fermeture** : clic exterieur + touche Escape + bouton close ?
- **Backdrop** : overlay sombre semi-transparent ? Blur ?
- **Animation** : ouverture/fermeture animee (scale + opacity) ?
- **Scroll** : scroll interne si contenu long ? Body scroll verrouille ?
- **Empilage** : gestion correcte de plusieurs modals/drawers superposes ?

### 5.5 Listes & tableaux
- **Pagination** : presente pour les longues listes ? Ou scroll infini ?
- **Tri & filtre** : indicateurs visuels du tri actif ?
- **Etats vides** : message + illustration + CTA quand aucun resultat ?
- **Loading** : skeleton ou spinner pendant le chargement ?
- **Responsive** : tableaux lisibles sur mobile (scroll horizontal, cards, etc.) ?

### 5.6 Toasts & notifications
- **Position** : coherente (top-right, bottom-center) ?
- **Duree** : auto-dismiss avec duree adaptee au contenu ?
- **Types visuels** : success, error, warning, info visuellement distincts ?
- **Empilage** : gestion correcte de plusieurs toasts simultanes ?
- **Accessibilite** : aria-live pour les lecteurs d'ecran ?

---

## MODULE 6 : ANIMATIONS & MICRO-INTERACTIONS

> Objectif : evaluer la qualite, la pertinence et la performance du mouvement dans l'interface

### 6.1 Transitions de base
- **Presence** : les changements d'etat sont-ils animes ou instantanes (jarring) ?
- **Durations** : 150-300ms pour les micro-interactions ? 400-1200ms pour les transitions de section ?
- **Easing** : cubic-bezier personnalises ou `ease` generique partout ?
- **Consistance** : memes timing/easing pour le meme type d'interaction dans toute l'app ?
- **`transition-all`** : utilise abusivement (performance) ou proprietes ciblees ?

### 6.2 Animations d'entree
- **Technique** : Intersection Observer, CSS scroll-driven, Framer Motion, GSAP, ViewTransitions API ?
- **Stagger** : les elements en groupe apparaissent-ils en cascade (delay incremental 50-100ms) ou en bloc ?
- **Direction** : les elements entrent-ils avec un sens (bas→haut, gauche→droite) ou juste fade ?
- **Parallaxe** : couches a vitesses differentes au scroll ?
- **Reveal progressif** : texte revele mot par mot / ligne par ligne ?

### 6.3 Micro-interactions
- **Hover** : changements sophistiques (scale 1.02-1.05, ombre etendue, luminosite) ou juste une couleur qui change ?
- **Press/Active** : feedback physique simule (scale 0.97, 100ms) ?
- **Toggle/Switch** : transition fluide avec easing organique ?
- **Drag & drop** : feedback visuel pendant le drag ? Snap points ?
- **Scroll** : snap scroll, smooth scroll, scroll indicators ?

### 6.4 Animations de celebration
- **Confettis** : presents pour les moments de succes ? Canvas ou DOM ?
- **Count-up** : les chiffres s'incrementent avec animation ?
- **Progress** : les barres de progression sont-elles animees (remplissage fluide) ?
- **Checkmarks** : les validations ont-elles une animation de confirmation ?
- **Page transitions** : transitions entre les routes/pages animees ?

### 6.5 Performance des animations
- **will-change** : declare sur les proprietes animees ?
- **GPU layers** : transform/opacity privilegies vs top/left/width/height ?
- **Jank** : animations a 60fps ou saccades visibles ?
- **prefers-reduced-motion** : animations desactivees/reduites pour les utilisateurs sensibles ?
- **Poids** : les librairies d'animation sont-elles justifiees (Framer Motion ~30kb, Lottie ~50kb) ?

---

## MODULE 7 : ACCESSIBILITE (WCAG 2.2)

> Objectif : evaluer la conformite aux standards d'accessibilite et l'inclusivite de l'interface

### 7.1 HTML semantique
- **Landmarks** : `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` utilises correctement ?
- **Headings** : hierarchie logique H1→H6 sans sauter de niveaux ? Un seul H1 par page ?
- **Listes** : `<ul>/<ol>/<dl>` pour les listes semantiques ou des `<div>` partout ?
- **Boutons vs liens** : `<button>` pour les actions, `<a>` pour la navigation ? Ou des `<div onClick>` ?
- **Tableaux** : `<table>/<thead>/<tbody>/<th>` pour les donnees tabulaires ?
- **Formulaires** : `<label>`, `<fieldset>`, `<legend>` utilises correctement ?
- **Dialogues** : `<dialog>` natif ou `role="dialog"` avec aria-modal ?

### 7.2 ARIA et attributs
- **aria-label** : sur les elements interactifs sans texte visible (boutons icone, liens icone) ?
- **aria-describedby** : messages d'erreur lies aux inputs ?
- **aria-live** : regions dynamiques (toasts, compteurs, resultats de recherche) ?
- **aria-expanded** : sur les toggles, accordions, menus deroulants ?
- **aria-current** : sur l'element de navigation actif ?
- **aria-hidden** : sur les elements decoratifs (icones a cote de texte, illustrations) ?
- **role** : utilise quand la semantique HTML ne suffit pas ? Pas surcharge ?

### 7.3 Clavier
- **Tab order** : ordre logique de tabulation ? Pas de tabindex positifs ?
- **Focus visible** : outline/ring visible en navigation clavier ? Jamais `outline: none` sans alternative ?
- **Focus trap** : dans les modals et drawers ?
- **Skip link** : "Aller au contenu principal" present ?
- **Raccourcis** : raccourcis clavier pour les actions frequentes ? Documentes ?
- **Escape** : ferme les modals, popovers, dropdowns ?

### 7.4 Lecteurs d'ecran
- **Textes alternatifs** : `alt` descriptif sur les images informatives ? `alt=""` sur les decoratives ?
- **Icones** : titre ou aria-label sur les icones porteuses de sens ? aria-hidden sur les decoratives ?
- **Contenu dynamique** : les mises a jour (AJAX, SPA) sont-elles annoncees ?
- **Formulaires** : messages d'erreur associes et annonces ?
- **Navigation** : structure comprehensible avec un lecteur d'ecran seul ?

### 7.5 Motricite & vision
- **Touch targets** : minimum 44x44px (Apple HIG) / 48x48dp (Material) ?
- **Espacement touch** : minimum 8px entre les cibles tactiles ?
- **prefers-reduced-motion** : respecte ? Animations non essentielles desactivees ?
- **prefers-contrast** : mode haut contraste supporte ?
- **Zoom** : l'interface reste-t-elle fonctionnelle a 200% de zoom ?
- **Orientation** : l'app fonctionne-t-elle en portrait ET paysage ?

---

## MODULE 8 : RESPONSIVE & ADAPTIF

> Objectif : evaluer la qualite de l'experience sur tous les formats d'ecran

### 8.1 Strategie responsive
- **Approche** : mobile-first ou desktop-first ? Coherent dans tout le projet ?
- **Breakpoints** : nombres et valeurs ? Couvrent-ils les principales tailles (sm 640, md 768, lg 1024, xl 1280, 2xl 1536) ?
- **Fluid vs snapped** : transitions fluides entre breakpoints ou sauts visuels brutaux ?
- **Container queries** : utilises pour les composants independants du viewport ?
- **Clamp()** : typographie et espacements fluides ?

### 8.2 Mobile
- **Navigation** : adaptee au mobile (bottom nav, hamburger, drawer) ? Accessible au pouce ?
- **Touch** : zones tactiles 44x44px minimum ? Gestes (swipe, pull-to-refresh) ?
- **Contenu** : le contenu important est-il visible sans scroll excessif sur mobile ?
- **Inputs** : types d'input corrects (tel, email, number) pour le bon clavier mobile ?
- **Viewport** : meta viewport correct ? Pas de scroll horizontal accidentel ?
- **Safe areas** : `env(safe-area-inset-*)` pour les appareils a encoche ?

### 8.3 Tablette
- **Layout** : layout specifique tablette ou simple etirement du mobile ?
- **Split view** : grilles a 2 colonnes exploitant l'espace ?
- **Orientation** : layout adapte au changement portrait/paysage ?

### 8.4 Grand ecran
- **Max-width** : le contenu est-il borne (max-w-7xl) ou s'etire-t-il a l'infini ?
- **Densite** : les grands ecrans exploitent-ils l'espace (multi-colonnes, sidebar visible) ?
- **Typographie** : les tailles de texte s'adaptent-elles (clamp) ou restent-elles fixes ?
- **Images** : resolutions adaptees aux ecrans Retina/HiDPI ?

---

## MODULE 9 : GESTION DES ETATS & FEEDBACK

> Objectif : evaluer si chaque composant/page gere tous ses etats possibles de maniere soignee

### 9.1 Inventaire des etats par composant
Pour chaque composant/page majeur, verifie la presence de :

| Etat | Critere | Qualite |
|------|---------|---------|
| Default | Etat initial nominal | Clair et fonctionnel |
| Loading | Chargement de donnees | Skeleton shimmer > spinner > rien |
| Empty | Aucune donnee | Illustration + explication + CTA > "Aucun resultat" |
| Error | Echec de chargement/action | Message humain + action corrective > erreur technique |
| Partial | Donnees incompletes | Degradation gracieuse > crash > champ vide |
| Success | Action reussie | Feedback celebratoire > confirmation > silence |
| Disabled | Non interactif | Visuellement distinct + cursor not-allowed + tooltip explicatif |
| Hover | Survol souris | Changement subtil + affordance > rien |
| Focus | Navigation clavier | Ring visible + changement > invisible |
| Active/Pressed | Clic/tap en cours | Feedback physique > rien |

### 9.2 Loading states
- **Skeleton screens** : shimmer anime avec la forme du contenu futur ? Ou spinner generique ?
- **Progress indicators** : barre de progression pour les actions longues ? Indetermine vs determine ?
- **Optimistic UI** : actions instantanees (like, save) avant confirmation serveur ?
- **Boutons loading** : spinner dans le bouton + disabled pendant l'action ?
- **Full-page** : ecran de chargement initial soigne (splash screen) ou page blanche ?

### 9.3 Empty states
- **Visuel** : illustration/icone engageante ? Ou vide plat ?
- **Message** : explication de la valeur a venir ? Ou "Aucun element" sec ?
- **CTA** : action claire pour creer/ajouter le premier element ?
- **Personnalisation** : message adapte au contexte (premier usage vs filtre sans resultat) ?

### 9.4 Error states
- **Ton** : bienveillant et non culpabilisant ? Ou technique et froid ?
- **Structure** : quoi (ce qui s'est passe) + pourquoi + comment resoudre ?
- **Inline** : erreurs de formulaire sous le champ concerne ?
- **Pages d'erreur** : 404 et 500 personnalisees et utiles ?
- **Retry** : bouton pour reessayer l'action echouee ?
- **Error boundary** : erreurs JS catchees sans crash complet de l'app ?

---

## MODULE 10 : COPYWRITING, NAVIGATION & PARCOURS UTILISATEUR

> Objectif : evaluer la qualite du texte d'interface, l'architecture de l'information et la fluidite des parcours

### 10.1 Microcopy & tone of voice
- **CTAs** : verbes d'action specifiques et charges de valeur ? ("Commencer gratuitement" > "Soumettre") ?
- **Labels** : courts, descriptifs, humains ? Pas de jargon technique expose a l'utilisateur ?
- **Placeholders** : exemples realistes ("jean.dupont@email.com") ou instructions ("Entrez votre email") ?
- **Messages de succes** : celebratoires et gratifiants ?
- **Messages d'erreur** : humains, bienveillants, actionnables ?
- **Tooltips** : presents sur les elements ambigus ? Concis ?
- **Voix coherente** : meme ton dans toute l'app ? Tutoiement/vouvoiement constant ?

### 10.2 Architecture de l'information
- **Profondeur** : combien de clics/taps pour atteindre n'importe quel contenu ? (ideal : <= 3)
- **Categorisation** : les groupements sont-ils logiques pour l'utilisateur (pas pour le developpeur) ?
- **Nommage** : les labels de navigation refletent-ils ce que l'utilisateur cherche ?
- **Decouverte** : les fonctionnalites secondaires sont-elles trouvables ?
- **Search** : recherche globale presente pour les apps avec beaucoup de contenu ?

### 10.3 Parcours critiques
Pour chaque parcours principal (onboarding, achat, creation de contenu, etc.) :
- **Nombre d'etapes** : minimum necessaire ? Etapes superflues ?
- **Progression visible** : l'utilisateur sait-il ou il en est (stepper, progress bar) ?
- **Sortie** : peut-on quitter et reprendre sans perte de donnees ?
- **Friction** : chaque point de friction est-il intentionnel (protection) ou accidentel (mauvaise UX) ?
- **Feedback continu** : chaque etape donne-t-elle un feedback de succes avant la suivante ?
- **Onboarding** : premiere experience guidee et gratifiante ?

### 10.4 Heuristiques de Nielsen (verification finale)
Passe en revue chaque heuristique :
1. **Visibilite du statut systeme** : l'utilisateur sait-il toujours ce qui se passe ?
2. **Correspondance systeme / monde reel** : langage familier, metaphores naturelles ?
3. **Controle et liberte** : undo facile, annulation des actions ?
4. **Coherence et standards** : memes patterns partout, conventions respectees ?
5. **Prevention des erreurs** : le design previent-il les erreurs avant qu'elles n'arrivent ?
6. **Reconnaissance plutot que rappel** : options visibles, pas de memorisation requise ?
7. **Flexibilite et efficacite** : raccourcis pour experts, simplification pour novices ?
8. **Design esthetique et minimaliste** : chaque element a sa raison d'etre ?
9. **Aide a la recuperation d'erreur** : messages d'erreur utiles ?
10. **Aide et documentation** : aide contextuelle disponible si necessaire ?

---

## RAPPORT FINAL

Genere ce rapport en remplacant chaque placeholder :

```
══════════════════════════════════════════════════════════════
  AUDIT UX/UI
  Projet : [nom du projet]
  Stack  : [framework + langage + runtime]
  UI     : [framework CSS + librairie composants]
  Type   : [SPA / SSR / mobile / etc.]
  Pages  : [N ecrans/routes identifies]
  Date   : [date du jour]
══════════════════════════════════════════════════════════════

## SCORE GLOBAL : XX/100

| Module                          | Score   | Barre                |
|---------------------------------|---------|----------------------|
| Design system & fondations      | XX/100  | [██████░░░░] XX%     |
| Typographie & hierarchie        | XX/100  | [██████░░░░] XX%     |
| Couleurs, contrastes & profond. | XX/100  | [██████░░░░] XX%     |
| Layout, grilles & composition   | XX/100  | [██████░░░░] XX%     |
| Composants & patterns UI        | XX/100  | [██████░░░░] XX%     |
| Animations & micro-interactions | XX/100  | [██████░░░░] XX%     |
| Accessibilite (WCAG 2.2)        | XX/100  | [██████░░░░] XX%     |
| Responsive & adaptif            | XX/100  | [██████░░░░] XX%     |
| Gestion des etats & feedback    | XX/100  | [██████░░░░] XX%     |
| Copywriting, nav & parcours     | XX/100  | [██████░░░░] XX%     |
```

### INVENTAIRE DES ECRANS

```
| # | Ecran / Route              | Hierarchie | Etats | A11y | Responsive | Score |
|---|----------------------------|------------|-------|------|------------|-------|
| 1 | [nom / path]               | [emoji]    | [emoji] | [emoji] | [emoji] | X/5   |
Emojis : ✅ Complet | 🟡 Partiel | 🔴 Absent | ⬜ N/A
```

### HEURISTIQUES DE NIELSEN

```
| # | Heuristique                           | Score | Details                     |
|---|---------------------------------------|-------|-----------------------------|
| 1 | Visibilite du statut systeme          | X/5   | [observation + fichier]     |
| 2 | Correspondance systeme / monde reel   | X/5   | [observation + fichier]     |
| 3 | Controle et liberte utilisateur       | X/5   | [observation + fichier]     |
| 4 | Coherence et standards                | X/5   | [observation + fichier]     |
| 5 | Prevention des erreurs                | X/5   | [observation + fichier]     |
| 6 | Reconnaissance plutot que rappel      | X/5   | [observation + fichier]     |
| 7 | Flexibilite et efficacite d'usage     | X/5   | [observation + fichier]     |
| 8 | Design esthetique et minimaliste      | X/5   | [observation + fichier]     |
| 9 | Recuperation d'erreur                 | X/5   | [observation + fichier]     |
| 10| Aide et documentation                 | X/5   | [observation + fichier]     |
```

### BLOQUANTS — degradent activement l'experience
```
🔴 [Probleme UX/UI] → [Solution concrete + fichier:ligne + impact utilisateur]
```

### RISQUES ELEVES — a traiter rapidement
```
🟠 [Probleme] → [Solution + fichier:ligne + severite WCAG si applicable]
```

### AMELIORATIONS RECOMMANDEES
```
🟡 [Amelioration] → [Implementation suggeree + effort : faible/moyen/eleve + impact : faible/moyen/fort]
```

### POINTS FORTS
```
🟢 [Ce qui est bien fait et pourquoi c'est efficace du point de vue UX]
```

### OPPORTUNITES DE POLISH
```
💎 [Detail manquant pour atteindre le niveau Apple-grade] → [Implementation + effort + impact sur la perception qualite]
```

### PLAN D'ACTION

```
SPRINT 0 (quick wins — impact UX immediat, effort faible)
1. [ ] [action — fichier concerne — effort]

SPRINT 1 (fondations — design system & accessibilite)
1. [ ] [action — effort]

SPRINT 2 (polish — animations & micro-interactions)
1. [ ] [action — effort]

SPRINT 3+ (excellence — details premium & wow factor)
1. [ ] [action — effort]
```

### CHECKLIST UX/UI
```
Design System :
- [ ] Tokens de design centralises (couleurs, spacing, typo, radius, shadows)
- [ ] Composants de base reutilisables (Button, Input, Card, Modal, Badge)
- [ ] Variantes coherentes sur chaque composant (size, color, variant)
- [ ] Zero couleur/taille/espacement en dur hors du systeme

Typographie :
- [ ] Pairing typographique distinctif (display + body)
- [ ] Hierarchie dramatique (ratio titre/body >= 2.5:1)
- [ ] Fluid typography avec clamp()
- [ ] Line-height adapte (titres 1.1-1.2, body 1.5-1.7)

Couleurs :
- [ ] Palette centralisee avec couleur signature
- [ ] Contrastes WCAG AA sur tous les textes
- [ ] Systeme d'elevation coherent (ombres progressives)
- [ ] Dark mode fonctionnel et riche (si applicable)

Layout :
- [ ] Spacing scale coherent (multiples de 4 ou 8)
- [ ] Espace negatif genereux
- [ ] Max-width sur le contenu textuel (60-75 caracteres)
- [ ] Composition visuelle variee (pas de grilles monotones)

Composants :
- [ ] Tous les etats geres (hover, focus, active, disabled, loading)
- [ ] Formulaires avec labels, validation inline, messages d'erreur humains
- [ ] Modals avec focus trap, Escape, clic exterieur
- [ ] Toasts avec aria-live et auto-dismiss

Animations :
- [ ] Transitions sur tous les changements d'etat (150-300ms)
- [ ] Stagger sur les elements en groupe
- [ ] Easing personnalises (pas de ease generique)
- [ ] prefers-reduced-motion respecte

Accessibilite :
- [ ] HTML semantique (landmarks, headings, listes, boutons)
- [ ] ARIA la ou necessaire (aria-label, aria-live, aria-expanded)
- [ ] Navigation clavier complete (tab order, focus visible, skip link)
- [ ] Touch targets >= 44x44px
- [ ] Zoom 200% fonctionnel

Responsive :
- [ ] Mobile-first ou strategie responsive coherente
- [ ] Clamp() pour typographie et espacements fluides
- [ ] Navigation adaptee mobile (bottom nav ou hamburger accessible)
- [ ] Pas de scroll horizontal accidentel

Etats :
- [ ] Loading : skeleton shimmer sur tous les chargements
- [ ] Empty : illustration + message + CTA
- [ ] Error : message humain + action corrective + retry
- [ ] Success : feedback visuel celebratoire

Copywriting :
- [ ] CTAs orientes benefice (verbe + valeur)
- [ ] Ton coherent dans toute l'app
- [ ] Messages d'erreur bienveillants et actionnables
- [ ] Zero jargon technique expose a l'utilisateur
```

---

## REGLES IMPERATIVES

1. **Factuel uniquement** — chaque affirmation s'appuie sur `fichier:ligne`
2. **Pas de suppositions** — si tu ne trouves pas, c'est "Absent", pas "Probablement present"
3. **Adaptatif** — adapte les attentes au type d'application (une landing page n'a pas les memes besoins qu'un dashboard SaaS)
4. **Double prisme** — chaque probleme est evalue sous l'angle UX (impact utilisateur) ET UI (implementation technique)
5. **Priorise** : accessibilite > etats manquants > responsive > coherence > polish > animations
6. **Concret** — chaque probleme a une solution avec code CSS/HTML/JSX d'exemple si pertinent
7. **Benchmark implicite** — le standard de reference est le niveau apple.com : typographie monumentale, animations cinematiques, profondeur sophistiquee, pixel-perfection
