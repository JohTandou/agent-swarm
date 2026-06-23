---
name: audit-global
description: Perform a comprehensive global audit of the application in the current working directory covering implementation completeness, production-readiness, security, performance, code quality, and marketing/SEO.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit Global Complet

Tu es un Principal Engineer & CTO fractional. Realise un audit global exhaustif de l'application dans le repertoire courant couvrant TOUS les aspects : implementation, production-readiness, securite, qualite, performance, SEO.

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
- **Type** : SPA, SSR, API, CLI, mobile, monolithe, microservices
- **Structure** : `ls -R` depth 2 pour comprendre l'arborescence
- **Taille** : nombre de fichiers source (hors node_modules, vendor, dist, build)
- **Git** : dernier commit, nombre de contributeurs, age du projet
- **Docs produit** : chercher `PROPOSITION_VALEUR.md`, `PRODUCT.md`, `FEATURES.md`, `README.md`

A partir de la stack detectee, IGNORE les sections non pertinentes du reste de l'audit. Exemples :
- API pure → ignorer Frontend/SEO
- SPA sans backend → ignorer Backend/DB
- CLI → ignorer Frontend/SEO/Performance web
- Pas de Docker → ignorer sections Docker/Container

---

## MODULE 1 : IMPLEMENTATION DES FEATURES

> Objectif : mesurer l'ecart vision produit ↔ code reel

**Si un fichier de proposition de valeur existe** (`PROPOSITION_VALEUR.md`, `PRODUCT.md`, `FEATURES.md`, ou section "Features" du `README.md`) :

1. Extrais chaque feature/promesse distincte
2. Pour chacune, cherche dans le code (grep mots-cles, routes, composants, controllers, models)
3. Evalue sur cette echelle :

| Score | Label | Critere |
|-------|-------|---------|
| 0 | Absente | Aucune trace |
| 1 | Placeholder | Fichier cree, contenu vide/TODO |
| 2 | Squelette | Structure sans logique |
| 3 | Un seul cote | Backend OU frontend, pas les deux |
| 4 | Partiel | Front+back existent, integration incomplete |
| 5 | MVP | Fonctionne de bout en bout, manque edge cases |
| 6 | Complet | Gere erreurs et cas limites |
| 7 | Production-ready | Complet + tests + validation robuste |

**Si aucun fichier produit n'existe** : analyse les routes/pages/endpoints pour deduire les features et evalue leur completude.

---

## MODULE 2 : QUALITE DU CODE

1. **Patterns & architecture** : separation des concerns, DRY, SOLID, patterns coherents entre fichiers
2. **Dette technique** : chercher avec regex `TODO|FIXME|HACK|XXX|WORKAROUND|TEMP|@deprecated`
3. **Code mort** : exports non importes, routes non referencees, composants orphelins
4. **Typage** : TypeScript strict ? Types `any` ? Schemas de validation (zod, joi, yup) ?
5. **Linting & formatage** : ESLint/Prettier/Biome/Ruff configures ? Regles strictes ?
6. **Conventions** : nommage coherent, structure de dossiers logique

---

## MODULE 3 : SECURITE

Cherche avec des regex concretes :

```
# Secrets en dur
(api[_-]?key|secret|password|token|credential)\s*[:=]\s*['"][^'"]{8,}
(sk-|pk-|AKIA|ghp_|gho_|github_pat_)
Bearer\s+[A-Za-z0-9\-._~+/]+=*

# .env commite
git ls-files | grep -i '\.env$'
```

Puis evalue :
- **Secrets** : en dur dans le code ? `.env` dans git ? `.gitignore` correct ?
- **Dependances** : `npm audit` / vulnerabilites connues, lock file present
- **Inputs** : validation/sanitization des donnees utilisateur
- **Auth** : mecanisme d'authentification et autorisation
- **Headers** : CSP, CORS, HSTS, rate limiting
- **Docker** : image minimale, non-root, pas de `latest`
- **HTTPS** : force en production

---

## MODULE 4 : FIABILITE & RESILIENCE

- **Gestion d'erreurs** : try/catch, error boundaries, unhandled rejections
- **Graceful shutdown** : SIGTERM/SIGINT geres
- **Timeouts** : configures sur HTTP/DB/services externes
- **Retry/Circuit breaker** : pour les appels externes
- **DB** : connection pooling, migrations versionnees, transactions
- **Pages d'erreur** : 404, 500 personnalisees

---

## MODULE 5 : PERFORMANCE

Adapte a la stack :

**Si frontend** :
- Bundle size, code splitting, lazy loading
- Images : format moderne (WebP/AVIF), lazy load, dimensions
- Fonts : preload, font-display
- Cache : Service Worker, Cache-Control

**Si backend** :
- Connection pooling, caching (Redis/in-memory)
- Pagination, requetes N+1
- Compression (gzip/brotli)
- Index DB sur colonnes filtrees/jointes

---

## MODULE 6 : OBSERVABILITE

- **Logging** : logger structure (pas `console.log` en prod), niveaux, pas de PII
- **Health checks** : endpoint `/health` ou `/ready`
- **Error tracking** : Sentry/Bugsnag/Rollbar configure
- **Monitoring** : metriques exposees, APM
- **Tracing** : correlation IDs, request tracing

---

## MODULE 7 : CI/CD & DEPLOIEMENT

- **Pipeline** : GitHub Actions / GitLab CI / autre configure ?
- **Tests dans CI** : unit, integration, e2e automatises
- **Linting dans CI** : lint + format check
- **Build** : reproductible, artifacts versionnes
- **Deploy** : strategie (rolling, blue-green), rollback possible
- **Environnements** : dev/staging/prod separes, config externalisee (12-factor)

---

## MODULE 8 : TESTS

- **Presence** : fichiers de test trouves (`*.test.*`, `*.spec.*`, `__tests__/`, `tests/`)
- **Types** : unitaires, integration, e2e, snapshot
- **Couverture** : config de coverage presente, seuils definis
- **Qualite** : mocks pour services externes, fixtures, cas d'erreur testes
- **Runner** : Jest/Vitest/Mocha/Pytest/etc. configure

---

## MODULE 9 : SEO & MARKETING (si app web)

> Ignorer si API pure, CLI, ou app non-web

- **Meta tags** : title, description, OG, Twitter Cards par page
- **Structured data** : JSON-LD / Schema.org
- **Sitemap** : present et a jour
- **robots.txt** : present et correct
- **Performance web** : indicateurs Core Web Vitals
- **Analytics** : GA4/Plausible/autre integre
- **Accessibilite** : alt sur images, labels, ARIA

---

## MODULE 10 : DOCUMENTATION & OPS

- **README** : a jour, instructions de setup claires
- **API docs** : OpenAPI/Swagger si API
- **RGPD/Legal** : mentions legales, politique de confidentialite, bandeau cookies
- **Runbooks** : procedures d'incident documentees

---

## RAPPORT FINAL

Genere ce rapport en remplacant chaque placeholder :

```
══════════════════════════════════════════════════════════════
  AUDIT GLOBAL
  Projet : [nom du projet]
  Stack  : [framework + langage + runtime]
  Type   : [SPA / SSR / API / CLI / etc.]
  Taille : [N fichiers source]
  Date   : [date du jour]
══════════════════════════════════════════════════════════════

## SCORE GLOBAL : XX/100

| Module                | Score   | Barre                |
|-----------------------|---------|----------------------|
| Implementation        | XX/100  | [██████░░░░] XX%     |
| Qualite du code       | XX/100  | [██████░░░░] XX%     |
| Securite              | XX/100  | [██████░░░░] XX%     |
| Fiabilite             | XX/100  | [██████░░░░] XX%     |
| Performance           | XX/100  | [██████░░░░] XX%     |
| Observabilite         | XX/100  | [██████░░░░] XX%     |
| CI/CD                 | XX/100  | [██████░░░░] XX%     |
| Tests                 | XX/100  | [██████░░░░] XX%     |
| SEO/Marketing         | XX/100  | [██████░░░░] XX%     |
| Documentation         | XX/100  | [██████░░░░] XX%     |
```

### Si PROPOSITION_VALEUR.md existe — Matrice d'implementation :

```
| # | Feature               | Back | Front | Data | Integ | Score |
|---|-----------------------|------|-------|------|-------|-------|
| 1 | [nom]                 | [emoji] | [emoji] | [emoji] | [emoji] | X/7   |
Emojis : ✅ Complet | 🟡 Partiel | 🔴 Absent | ⬜ N/A
```

### BLOQUANTS — a corriger avant production
```
🔴 [Probleme] → [Solution concrete + fichier:ligne]
```

### RISQUES ELEVES — a traiter rapidement
```
🟠 [Probleme] → [Solution + fichier:ligne]
```

### AMELIORATIONS RECOMMANDEES
```
🟡 [Probleme] → [Solution + effort : faible/moyen/eleve]
```

### POINTS FORTS
```
🟢 [Ce qui est bien fait]
```

### PLAN D'ACTION

```
SPRINT 0 (avant production)
1. [ ] [action bloquante — fichier concerne]

SPRINT 1 (semaine 1 en prod)
1. [ ] [action prioritaire]

SPRINT 2+ (amelioration continue)
1. [ ] [action]
```

### CHECKLIST PRE-PRODUCTION
```
- [ ] Secrets externalises
- [ ] HTTPS enforce
- [ ] Health check fonctionnel
- [ ] Logging structure
- [ ] Error tracking actif
- [ ] CI/CD pipeline complete
- [ ] Tests critiques passent
- [ ] Monitoring actif
- [ ] Rollback procedure prete
- [ ] RGPD/compliance OK
```

---

## REGLES IMPERATIVES

1. **Factuel uniquement** — chaque affirmation s'appuie sur `fichier:ligne`
2. **Pas de suppositions** — si tu ne trouves pas, c'est "Absent", pas "Probablement present"
3. **Adaptatif** — ignore les modules non pertinents pour la stack detectee
4. **Pragmatique** — distingue bloquant vs nice-to-have
5. **Priorise** : securite > fiabilite > implementation > performance > reste
6. **Concret** — chaque probleme a une solution avec exemple de code si pertinent
