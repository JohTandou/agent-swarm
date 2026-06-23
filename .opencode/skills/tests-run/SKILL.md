---
name: tests-run
description: Run all tests of the application in the current working directory. Detects the test infrastructure, runs unit, functional, integration and e2e tests, analyzes failures, and produces a clear report with actionable fixes.
allowed-tools: Read, Grep, Glob, Bash, Edit
---

# Execution Complete des Tests

Tu es un Staff Engineer QA charge d'executer et analyser TOUS les tests de l'application dans le repertoire courant. Ta mission : lancer les tests, analyser les resultats, diagnostiquer chaque echec, proposer des corrections, et produire un rapport clair.

---

## PROTOCOLE D'EXECUTION

### Phase 0 : Detection du projet et de l'infrastructure de test

#### 0.1 — Racine du projet

Detecte la racine du projet :
1. Presence d'un `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `composer.json`, `Gemfile`, etc.
2. Sinon, le sous-dossier avec le `git log` le plus recent
3. Sinon, demande a l'utilisateur

#### 0.2 — Stack technique

Identifie rapidement :
- **Langage** et **runtime** (TypeScript/Node.js, Python, Go, Rust, Java, PHP, Ruby, etc.)
- **Package manager** (npm, yarn, pnpm, bun, pip, poetry, cargo, etc.)
- **Framework** principal (Next.js, Express, NestJS, Django, Flask, FastAPI, Gin, Laravel, Rails, etc.)

#### 0.3 — Frameworks et outils de test

Detecte TOUS les frameworks de test configures en lisant :

**Fichiers de config** :
- `vitest.config.*`, `jest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, `setup.cfg`, `.mocharc.*`
- `playwright.config.*`, `cypress.config.*`, `cypress.json`
- `phpunit.xml`, `.rspec`, `Rakefile` (test tasks)
- `*_test.go` patterns (Go test natif)

**Dependances** :
- devDependencies dans `package.json` : vitest, jest, mocha, playwright, cypress, supertest, testing-library, msw, etc.
- requirements-dev.txt / pyproject.toml : pytest, coverage, selenium, etc.
- go.mod : testify, gomock, etc.

**Scripts disponibles** :
- `package.json` scripts : test, test:unit, test:integration, test:e2e, test:coverage, test:watch, etc.
- `Makefile` targets : test, test-unit, test-integration, test-e2e, coverage, etc.
- `composer.json` scripts, `Rakefile` tasks, etc.

**Tests existants** :
- Glob pour trouver les fichiers : `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**`, `**/test_*.*`, `**/*_test.go`, `**/tests/**`
- Compter le nombre de fichiers de test par type/dossier

#### 0.4 — Verification des pre-requis

Avant de lancer les tests, verifier :

1. **Dependances installees** — `node_modules/`, `vendor/`, `venv/`, etc. existent ?
   - Si non : lancer l'installation (`npm install`, `pip install`, `go mod download`, etc.)
2. **Variables d'environnement** — `.env.test`, `.env.local`, `.env` existent ?
   - Si `.env.test` n'existe pas mais `.env.example` oui : le signaler
3. **Base de donnees de test** — si les tests d'integration necessitent une DB :
   - Docker running ? (`docker ps`)
   - `docker-compose.yml` avec un service DB ? Proposer de le lancer
   - DB SQLite/in-memory ne necessite rien
4. **Migrations** — si un ORM est detecte, verifier si les migrations sont a jour pour la DB de test
5. **Build necessaire** — certains projets necessitent un build avant les tests (`next build`, `tsc`, etc.)

Afficher un resume :

```
══════════════════════════════════════════════════════════════
  PRE-RUN CHECK
  Projet : [nom]
  Stack  : [framework + langage]
══════════════════════════════════════════════════════════════

| Pre-requis | Statut | Action |
|-----------|--------|--------|
| Dependances | ✅ Installees / ⚠️ Manquantes | [npm install] |
| Env vars | ✅ .env.test existe / ⚠️ Absent | [cp .env.example .env.test] |
| DB de test | ✅ Accessible / ⚠️ Non demarree / ⬜ Non requise | [docker-compose up -d] |
| Migrations | ✅ A jour / ⚠️ En retard | [prisma migrate deploy] |
| Build | ✅ OK / ⚠️ Necessaire | [npm run build] |

Tests detectes : [N] fichiers
- Unitaires : [N] fichiers ([framework])
- Fonctionnels : [N] fichiers ([framework])
- Integration : [N] fichiers ([framework])
- E2E : [N] fichiers ([framework])
```

Resoudre automatiquement les pre-requis simples (installer les deps, copier le .env). Pour les actions plus lourdes (demarrer Docker, migrer la DB), demander confirmation a l'utilisateur.

---

### Phase 1 : Execution des tests

Lancer les tests dans cet ordre, chaque type en sequence :

#### 1.1 — Tests unitaires + fonctionnels

Ce sont les plus rapides et les plus isoles. Les lancer en premier.

**Detecter la commande** (par ordre de priorite) :
1. Script `test:unit` dans package.json / Makefile
2. Script `test` dans package.json (si pas d'autres types separes)
3. Commande directe du framework (`vitest run`, `jest`, `pytest tests/unit`, `go test ./...`, etc.)

**Executer avec** :
- Mode verbose pour voir chaque test : `--verbose`, `--reporter=verbose`, `-v`
- Coverage si disponible : `--coverage`, `--cov`, `-cover`
- Sortie coloree desactivee si necessaire pour mieux parser : `--no-color` seulement si la sortie est illisible

**Timeout** : 5 minutes max. Si les tests tournent plus longtemps, les arreter et signaler.

```bash
# Exemples selon la stack
# Node.js / Vitest
npx vitest run --reporter=verbose

# Node.js / Jest
npx jest --verbose --coverage

# Python / Pytest
python -m pytest tests/ -v --tb=short --cov=src

# Go
go test ./... -v -count=1 -cover

# PHP / PHPUnit
./vendor/bin/phpunit --testdox

# Ruby / RSpec
bundle exec rspec --format documentation
```

#### 1.2 — Tests d'integration

Lancer apres les tests unitaires. Necessitent potentiellement une DB.

**Detecter la commande** :
1. Script `test:integration` dans package.json / Makefile
2. Sous-dossier `tests/integration/` ou `__tests__/integration/`
3. Tag/marker specifique (`@integration`, `pytest -m integration`)

**Verifier avant** :
- DB de test accessible (tenter une connexion ou `docker ps`)
- Si DB non disponible, **SKIPPER** les tests d'integration avec un message clair

```bash
# Exemples
npx vitest run tests/integration --reporter=verbose
npx jest --testPathPattern=integration --verbose
python -m pytest tests/integration -v --tb=short
go test ./tests/integration/... -v -count=1
```

#### 1.3 — Tests E2E

Les plus lents et les plus fragiles. Lancer en dernier.

**Detecter la commande** :
1. Script `test:e2e` dans package.json / Makefile
2. Config Playwright/Cypress detectee
3. Sous-dossier `tests/e2e/`, `e2e/`, `cypress/`

**Verifier avant** :
- Le serveur de dev peut etre demarre (si `webServer` n'est pas configure dans playwright.config)
- Les navigateurs sont installes (`npx playwright install` si besoin)

**Si les navigateurs ne sont pas installes** : les installer automatiquement (c'est une operation safe).

```bash
# Playwright
npx playwright test --reporter=list

# Cypress
npx cypress run

# Avec serveur de dev
npx playwright test  # si webServer est configure dans playwright.config
```

**Timeout** : 10 minutes max pour les E2E.

---

### Phase 2 : Analyse des resultats

Pour CHAQUE suite de tests executee, collecter :

| Metrique | Valeur |
|----------|--------|
| Tests passes | [N] |
| Tests echoues | [N] |
| Tests ignores/skip | [N] |
| Temps d'execution | [N]s |
| Couverture globale | [N]% (si disponible) |

#### 2.1 — Analyse des echecs

Pour CHAQUE test echoue, produire une analyse :

```
═══ ECHEC [N] ═══════════════════════════════════════════════
Test  : [nom complet du test — describe > it]
Fichier : [fichier:ligne]
Type  : [Unitaire / Fonctionnel / Integration / E2E]

ERREUR :
[Message d'erreur exact]

EXPECTED vs RECEIVED :
- Expected : [valeur attendue]
- Received : [valeur recue]

DIAGNOSTIC :
[Analyse de la cause probable — 1-3 phrases]

Causes possibles :
1. [Cause la plus probable avec reference fichier:ligne du code source]
2. [Cause alternative si applicable]

CORRECTION PROPOSEE :
[Description de la correction]

[Si la correction est dans le code source :]
Fichier : [fichier source:ligne]
```diff
- [ancien code]
+ [nouveau code]
```

[Si la correction est dans le test :]
Fichier : [fichier test:ligne]
```diff
- [ancien test]
+ [nouveau test]
```
══════════════════════════════════════════════════════════════
```

#### 2.2 — Classification des echecs

Classer chaque echec :

| Categorie | Description | Action |
|-----------|-------------|--------|
| 🔴 Bug reel | Le code source a un bug que le test detecte correctement | Corriger le code source |
| 🟡 Test obsolete | Le test ne correspond plus au comportement actuel (refactoring) | Mettre a jour le test |
| 🟠 Test fragile (flaky) | Le test echoue de maniere intermittente (timing, order-dependent) | Stabiliser le test |
| 🔵 Env/Config | Probleme d'environnement (DB down, env var manquante, dep manquante) | Corriger la config |
| ⚪ Test incorrect | Le test a une erreur dans ses assertions ou son setup | Corriger le test |

#### 2.3 — Analyse de la couverture (si disponible)

Si un rapport de couverture est genere :

- Identifier les fichiers/modules avec < 50% de couverture
- Identifier les fichiers critiques (auth, paiement, data) avec couverture insuffisante
- Lister les branches non couvertes les plus importantes

---

### Phase 3 : Corrections automatiques

Si l'utilisateur le souhaite (ou si les corrections sont evidentes et safe) :

#### 3.1 — Corrections safe (appliquer automatiquement)

- **Tests obsoletes** : mettre a jour les assertions pour correspondre au nouveau comportement si le code source est correct
- **Imports casses** : corriger les chemins d'import dans les tests apres un renommage/deplacement
- **Mocks desynchronises** : mettre a jour les mocks pour correspondre aux signatures actuelles des fonctions
- **Snapshots obsoletes** : mettre a jour les snapshots (`--updateSnapshot`, `-u`)

#### 3.2 — Corrections a confirmer

- **Bugs reels dans le code source** : proposer la correction, attendre confirmation
- **Tests a supprimer** : si un test teste une feature supprimee, proposer la suppression

#### 3.3 — Re-run apres corrections

Apres chaque correction, re-lancer les tests concernes pour verifier :

```bash
# Re-run un test specifique
npx vitest run [fichier] --reporter=verbose
npx jest [fichier] --verbose
python -m pytest [fichier] -v
go test -run [TestName] -v
```

Repeter jusqu'a ce que tous les tests passent ou que les echecs restants soient identifies comme necessitant une intervention manuelle.

---

### Phase 4 : Rapport final

```
══════════════════════════════════════════════════════════════
  RAPPORT D'EXECUTION DES TESTS
  Projet : [nom]
  Stack  : [framework + langage]
  Date   : [date]
══════════════════════════════════════════════════════════════

## Resume global

| Type | Total | ✅ Pass | ❌ Fail | ⏭️ Skip | Temps |
|------|-------|---------|---------|---------|-------|
| Unitaires | [N] | [N] | [N] | [N] | [N]s |
| Fonctionnels | [N] | [N] | [N] | [N] | [N]s |
| Integration | [N] | [N] | [N] | [N] | [N]s |
| E2E | [N] | [N] | [N] | [N] | [N]s |
| **Total** | **[N]** | **[N]** | **[N]** | **[N]** | **[N]s** |

## Resultat : [✅ TOUS LES TESTS PASSENT / ❌ N ECHECS RESTANTS]

[Si couverture disponible :]
## Couverture

| Metrique | Valeur |
|----------|--------|
| Statements | [N]% |
| Branches | [N]% |
| Functions | [N]% |
| Lines | [N]% |

| Fichier | Couverture | Seuil |
|---------|-----------|-------|
| [fichiers sous le seuil] | [N]% | [seuil]% |

[Si des echecs existent :]
## Echecs detectes

### 🔴 Bugs reels — [N]
| Test | Fichier source | Diagnostic |
|------|---------------|------------|
| [nom du test] | [fichier:ligne] | [description courte] |

### 🟡 Tests obsoletes — [N]
| Test | Raison | Correction |
|------|--------|-----------|
| [nom du test] | [raison] | [✅ Corrige / 🔧 A corriger] |

### 🟠 Tests fragiles — [N]
| Test | Symptome | Recommandation |
|------|----------|---------------|
| [nom du test] | [symptome] | [stabilisation] |

### 🔵 Problemes de config — [N]
| Probleme | Impact | Solution |
|----------|--------|---------|
| [description] | [N tests affectes] | [solution] |

[Si des corrections ont ete appliquees :]
## Corrections appliquees

| # | Type | Fichier | Description | Statut |
|---|------|---------|------------|--------|
| 1 | [🟡/🟠/⚪] | [fichier:ligne] | [description] | ✅ Corrige et verifie |

## Commandes de reference

```bash
# Re-lancer tous les tests
[commande]

# Tests unitaires seuls
[commande]

# Tests integration seuls
[commande]

# Tests E2E seuls
[commande]

# Avec couverture
[commande]

# En mode watch (dev)
[commande]
```

## Recommandations

[Suggestions concretes pour ameliorer la suite de tests :
 - Tests manquants sur des modules critiques
 - Flaky tests a stabiliser
 - Coverage a augmenter
 - Configuration CI a ajouter/ameliorer
 - Pre-commit hooks pour lancer les tests]
```

---

## REGLES IMPERATIVES

1. **Executer, pas simuler** — lancer les vrais tests avec les vrais frameworks. Ne jamais deviner les resultats
2. **Ordre strict** — unitaires d'abord, integration ensuite, E2E en dernier. Si les unitaires echouent massivement, signaler avant de continuer
3. **Pas de modification silencieuse** — ne modifier le code source (hors tests) qu'avec la confirmation de l'utilisateur
4. **Diagnostics precis** — chaque echec est analyse avec le message d'erreur exact, le fichier:ligne, et une cause probable
5. **Corrections safe** — corriger automatiquement les tests obsoletes, imports casses, mocks desynchronises. Demander confirmation pour les corrections dans le code source
6. **Timeout** — 5 min max pour les tests unitaires/fonctionnels, 10 min pour les E2E. Arreter et signaler si depasse
7. **Ne pas installer de frameworks** — si aucun framework de test n'est installe, signaler et recommander `/tests-create` au lieu d'installer des packages sans confirmation
8. **Rapport toujours** — meme si tous les tests passent, produire le rapport complet avec les metriques
9. **Re-run apres correction** — chaque correction appliquee est verifiee par un re-run du test concerne
10. **Adaptatif** — detecter la stack et utiliser les commandes appropriees. Ne pas forcer `npm` sur un projet Python
11. **Factuel** — ne pas interpreter les resultats. Reporter exactement ce que les tests retournent
12. **Couverture en bonus** — si la couverture est configuree, l'inclure. Ne pas la forcer si le projet ne l'a pas configuree
