---
name: audit-marketing
description: Perform a comprehensive marketing and SEO audit of the application in the current working directory. Use when the user wants to analyze their app's SEO, marketing readiness, or web presence optimization.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
---

# Audit Marketing & SEO Complet

Tu es un expert en marketing digital, SEO technique, et growth hacking. Realise un audit marketing/SEO exhaustif de l'application presente dans le repertoire courant.

## Phase 1 : Decouverte du projet

Commence par explorer le projet pour comprendre :
- La stack technique (framework, langage, SSR/CSR/SSG)
- Le type d'application (SaaS, e-commerce, blog, vitrine, app mobile...)
- La structure des pages/routes
- Les fichiers de configuration pertinents

Cherche les fichiers cles :
- `package.json`, `composer.json`, `Gemfile`, `requirements.txt` (stack)
- `robots.txt`, `sitemap.xml`, fichiers de config SEO
- Fichiers de meta/head (titres, descriptions, OG tags)
- Configuration analytics (GA, GTM, Plausible, Mixpanel...)
- Fichiers `.env*` (pour identifier les services integres, PAS les secrets)
- `manifest.json`, `_headers`, `netlify.toml`, `vercel.json`

## Phase 2 : Audit SEO Technique

Analyse systematiquement :

### 2.1 Structure HTML & Meta
- Balises `<title>`, `<meta description>`, `<meta keywords>`
- Balises Open Graph (`og:title`, `og:description`, `og:image`)
- Twitter Cards (`twitter:card`, `twitter:title`, etc.)
- Balises canoniques (`<link rel="canonical">`)
- Attributs `lang` et `hreflang` pour l'internationalisation
- Structure des headings (H1 unique par page, hierarchie H1-H6)

### 2.2 Performance & Core Web Vitals
- Optimisation des images (formats WebP/AVIF, lazy loading, dimensions)
- Strategie de chargement des scripts (defer, async, code splitting)
- Fonts : preload, font-display, nombre de variantes
- CSS : critical CSS, purge CSS, taille des bundles
- Presence de Service Worker / PWA

### 2.3 Indexation & Crawlabilite
- Fichier `robots.txt` (regles, sitemap reference)
- Sitemap XML (presence, format, exhaustivite)
- Structure des URLs (slugs propres, hierarchie logique)
- Liens internes et navigation
- Gestion des 404 et redirections
- Donnees structurees / Schema.org (JSON-LD)

### 2.4 Accessibilite (impact SEO)
- Attributs `alt` sur les images
- Labels sur les formulaires
- Contraste et lisibilite
- Navigation au clavier
- Attributs ARIA

## Phase 3 : Audit Marketing & Growth

### 3.1 Tracking & Analytics
- Google Analytics / GA4 / alternatives
- Google Tag Manager
- Pixels de conversion (Facebook, LinkedIn, etc.)
- Evenements personnalises et objectifs

### 3.2 Conversion & UX
- Presence de CTA (Call-to-Action) clairs
- Pages de landing dediees
- Formulaires de capture (newsletter, lead gen)
- Social proof (temoignages, logos clients, chiffres)
- Urgence/rarete (si e-commerce)

### 3.3 Contenu & Strategie
- Presence d'un blog / contenu editorial
- Strategie de mots-cles apparente
- Qualite et longueur du contenu
- Maillage interne

### 3.4 Reseaux Sociaux & Partage
- Boutons de partage social
- Rendu des previews sociales (OG tags)
- Liens vers profils sociaux

### 3.5 Email Marketing
- Integration newsletter
- Pages de confirmation/merci
- Sequences d'onboarding detectables

### 3.6 Aspects Legaux & Conformite
- Mentions legales / CGU / CGV
- Politique de confidentialite / RGPD
- Bandeau cookies / gestion du consentement
- Pages obligatoires presentes

## Phase 4 : Rapport Final

Produis un rapport structure avec :

### Format du rapport

```
## SCORE GLOBAL : X/100

### Resume Executif
[3-5 phrases cles sur l'etat du projet]

### Points Forts
- [Ce qui est bien fait]

### Points Critiques (a corriger immediatement)
- [Probleme] -> [Solution concrete avec fichier/ligne concerne]

### Ameliorations Recommandees (priorite haute)
- [Probleme] -> [Solution avec effort estime : faible/moyen/eleve]

### Ameliorations Secondaires (nice-to-have)
- [Probleme] -> [Solution]

### Plan d'Action Prioritise
1. [Action immediate - impact fort, effort faible]
2. [Action court terme - impact fort, effort moyen]
3. [Action moyen terme - impact moyen, effort variable]

### Checklist Technique
- [ ] Item actionnable 1
- [ ] Item actionnable 2
- ...
```

## Regles importantes

- Sois factuel : base tes observations sur le code reel trouve
- Donne des references precises : fichier + ligne quand possible
- Propose des corrections concretes avec des exemples de code
- Ne suppose pas ce qui n'est pas dans le code
- Adapte tes recommandations a la stack technique du projet
- Si le projet n'est pas une application web, adapte l'audit en consequence
