---
name: documentation-create
description: Generate comprehensive, detailed technical documentation for the project in the current working directory. Outputs a complete TECHNICAL_DOCUMENTATION.md file covering architecture, stack, structure, APIs, data models, configuration, deployment, and developer onboarding.
allowed-tools: Read, Grep, Glob, Bash
---

# Generation de Documentation Technique Complete

Tu es un Staff Engineer specialise en documentation technique. Ta mission : generer un fichier `TECHNICAL_DOCUMENTATION.md` exhaustif, precis et immediatement utile pour tout developpeur qui rejoint le projet ou doit le maintenir.

---

## PROTOCOLE D'EXECUTION

### Etape 0 : Detection automatique du projet

Detecte la racine du projet dans le repertoire courant :
1. Presence d'un `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `composer.json`, `Gemfile`, etc. a la racine
2. Sinon, le sous-dossier avec le `git log` le plus recent
3. Sinon, demande a l'utilisateur

Une fois le projet identifie, travaille EXCLUSIVEMENT dans ce repertoire.

### Etape 1 : Cartographie complete du projet (phase de collecte)

Collecte en parallele toutes les informations necessaires :

**1.1 — Identite du projet**
- Nom du projet (package.json name, go.mod module, Cargo.toml [package], etc.)
- Description (README.md intro, package.json description)
- Version actuelle
- Licence
- URL du repo (git remote)

**1.2 — Stack technique**
- Langage(s) principal/principaux + versions
- Framework(s) + versions
- Runtime (Node.js, Deno, Bun, Python, Go, Rust, Java, etc.) + version
- Package manager (npm, yarn, pnpm, bun, pip, poetry, cargo, etc.)
- Base de donnees (detecter par ORM, schemas, migrations, docker-compose)
- Services externes (Redis, RabbitMQ, Elasticsearch, S3, etc. — detecter dans config/docker-compose/env)

**1.3 — Architecture et structure des dossiers**
- Arborescence depth 3 (hors node_modules, vendor, dist, build, .git, __pycache__, .next, .nuxt)
- Identifier le pattern architectural : MVC, Clean Architecture, Hexagonal, Feature-based, etc.
- Monorepo ou mono-projet ? Si monorepo : lister les packages/apps et leurs roles

**1.4 — Points d'entree**
- Fichier(s) d'entree principal (main.ts, index.ts, app.py, main.go, etc.)
- Scripts disponibles (package.json scripts, Makefile targets, scripts/, etc.)
- Commandes de demarrage (dev, build, test, lint, deploy)

**1.5 — Configuration**
- Variables d'environnement : lire `.env.example`, `.env.template`, `.env.local.example`, ou les references `process.env.*`, `os.environ`, `os.Getenv`, etc.
- Fichiers de configuration : tsconfig, eslint, prettier, biome, webpack, vite, next.config, docker-compose, nginx, etc.
- Feature flags ou toggles detectes

**1.6 — Base de donnees et modeles de donnees**
- ORM/ODM utilise (Prisma, TypeORM, Drizzle, SQLAlchemy, GORM, ActiveRecord, Mongoose, etc.)
- Schema de la DB : lire les fichiers de schema, migrations, models
- Relations entre entites
- Seeders/fixtures

**1.7 — API et routes**
- Type d'API : REST, GraphQL, gRPC, tRPC, WebSocket
- Lister TOUTES les routes/endpoints avec : methode HTTP, path, description, auth requise
- Middleware et intercepteurs
- Schemas de validation des requetes/reponses (Zod, Joi, class-validator, Pydantic, etc.)
- Documentation API existante (OpenAPI/Swagger, GraphQL schema)

**1.8 — Frontend (si applicable)**
- Pages/routes frontend
- Composants principaux et leur role
- State management (Redux, Zustand, Pinia, Context, signals, etc.)
- Systeme de design / UI library (Tailwind, Material UI, Shadcn, Radix, etc.)
- Gestion de l'authentification cote client

**1.9 — Authentification et autorisation**
- Methode d'auth : JWT, session, OAuth, API key, etc.
- Fournisseur : Clerk, Auth0, NextAuth, Passport, custom, etc.
- Roles et permissions detectes
- Middleware d'auth et guards

**1.10 — Tests**
- Framework(s) de test : Jest, Vitest, Mocha, Pytest, Go test, etc.
- Types de tests presents : unit, integration, e2e
- Fichiers de config de test
- Couverture configuree ?
- Comment lancer les tests

**1.11 — CI/CD et deploiement**
- Pipeline CI : GitHub Actions, GitLab CI, CircleCI, etc. — lire les fichiers de workflow
- Etapes du pipeline : lint, test, build, deploy
- Plateforme de deploiement : Vercel, Netlify, AWS, GCP, Railway, Fly.io, Docker, K8s, etc.
- Dockerfiles et docker-compose : analyser les services, ports, volumes
- Infrastructure as Code (Terraform, Pulumi, CDK) si present

**1.12 — Dependances cles**
- Lister les dependances principales (pas toutes — les importantes) avec leur role dans le projet
- Dependances de dev notables (bundler, transpiler, linter, etc.)

---

### Etape 2 : Analyse approfondie

A partir des donnees collectees :

1. **Flux de donnees** : Trace le chemin d'une requete typique de bout en bout (client → frontend → API → service → DB → reponse)
2. **Patterns recurrents** : Identifie les conventions suivies dans le projet (nommage, structure des fichiers, patterns de code)
3. **Points d'attention** : Configurations speciales, workarounds, decisions architecturales non evidentes
4. **Services et communication** : Comment les differentes parties communiquent (HTTP, events, queues, WebSocket)

---

### Etape 3 : Generation du document TECHNICAL_DOCUMENTATION.md

Genere le fichier `TECHNICAL_DOCUMENTATION.md` a la racine du projet avec le contenu structure ci-dessous.

---

## FORMAT DU DOCUMENT TECHNICAL_DOCUMENTATION.md

```markdown
# Documentation Technique — [Nom du Projet]

> [Description courte du projet en 1-2 phrases]

**Version** : [version]
**Derniere mise a jour** : [date du jour]
**Stack principale** : [ex: Next.js 14 / TypeScript / PostgreSQL / Prisma]

---

## Table des matieres

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Structure du projet](#structure-du-projet)
5. [Installation et demarrage](#installation-et-demarrage)
6. [Variables d'environnement](#variables-denvironnement)
7. [Base de donnees](#base-de-donnees)
8. [API et routes](#api-et-routes)
9. [Frontend](#frontend)
10. [Authentification et autorisation](#authentification-et-autorisation)
11. [Tests](#tests)
12. [CI/CD et deploiement](#cicd-et-deploiement)
13. [Dependances principales](#dependances-principales)
14. [Flux de donnees](#flux-de-donnees)
15. [Conventions et patterns](#conventions-et-patterns)
16. [Points d'attention](#points-dattention)

---

## 1. Vue d'ensemble

[Description detaillee du projet : objectif, contexte, public cible, principales fonctionnalites]

**Type d'application** : [SPA / SSR / API REST / CLI / Monorepo / etc.]
**Statut** : [Production / Staging / Developpement]

---

## 2. Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Langage | [ex: TypeScript] | [version] |
| Framework | [ex: Next.js] | [version] |
| Runtime | [ex: Node.js] | [version] |
| Base de donnees | [ex: PostgreSQL] | [version] |
| ORM | [ex: Prisma] | [version] |
| Cache | [ex: Redis] | [version si applicable] |
| UI | [ex: Tailwind CSS + Shadcn/ui] | [version] |
| Auth | [ex: NextAuth.js] | [version] |
| Tests | [ex: Vitest + Playwright] | [version] |
| CI/CD | [ex: GitHub Actions] | — |
| Deploiement | [ex: Vercel] | — |
| Package manager | [ex: pnpm] | [version] |

---

## 3. Architecture

### Pattern architectural

[Decrire le pattern : MVC, Clean Architecture, Feature-based modules, etc.]
[Expliquer les couches et leurs responsabilites]

### Diagramme de haut niveau

```
[Diagramme ASCII montrant les composants principaux et leurs interactions]
Exemple :
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Next.js │────▶│  Prisma  │────▶ PostgreSQL
│ (Browser)│◀────│  (API +  │◀────│  (ORM)   │
└──────────┘     │   SSR)   │     └──────────┘
                 └────┬─────┘
                      │
                 ┌────▼─────┐
                 │  Redis   │
                 │ (Cache)  │
                 └──────────┘
```

### Communication entre services

[Si plusieurs services : decrire le protocole (HTTP, gRPC, events, queues)]

---

## 4. Structure du projet

```
[Arborescence du projet depth 2-3, avec annotations sur le role de chaque dossier]
Exemple :
project-root/
├── src/
│   ├── app/              # Routes et pages Next.js (App Router)
│   ├── components/       # Composants React reutilisables
│   │   ├── ui/           # Composants UI primitifs (Shadcn)
│   │   └── features/     # Composants metier
│   ├── lib/              # Utilitaires et helpers
│   ├── server/           # Logique serveur (API, services, DB)
│   │   ├── api/          # Route handlers API
│   │   ├── services/     # Business logic
│   │   └── db/           # Configuration et schemas DB
│   └── types/            # Types TypeScript partages
├── prisma/               # Schema et migrations Prisma
├── public/               # Assets statiques
├── tests/                # Tests (unit, integration, e2e)
├── .github/              # CI/CD workflows
└── docker-compose.yml    # Services Docker (DB, Redis, etc.)
```

---

## 5. Installation et demarrage

### Pre-requis

- [Runtime] version >= [min version]
- [Package manager]
- [DB] (ou Docker)
- [Autres pre-requis]

### Installation

```bash
# Cloner le repository
git clone [url]
cd [project-name]

# Installer les dependances
[commande d'install]

# Configurer l'environnement
cp .env.example .env
# Editer .env avec vos valeurs

# Initialiser la base de donnees
[commande de migration/seed]
```

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `[cmd dev]` | Demarrer en mode developpement |
| `[cmd build]` | Builder pour la production |
| `[cmd start]` | Demarrer en production |
| `[cmd test]` | Lancer les tests |
| `[cmd lint]` | Lancer le linter |
| `[cmd db:migrate]` | Appliquer les migrations |
| `[cmd db:seed]` | Seeder la base de donnees |
[Ajouter toutes les commandes detectees dans package.json scripts, Makefile, etc.]

---

## 6. Variables d'environnement

| Variable | Description | Requis | Defaut | Exemple |
|----------|-------------|--------|--------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | Oui | — | `postgresql://user:pass@localhost:5432/db` |
| `[VAR]` | [description] | [Oui/Non] | [defaut ou —] | [exemple] |
[Lister TOUTES les variables d'environnement detectees dans le code]

> **Note** : Ne jamais committer le fichier `.env`. Utiliser `.env.example` comme template.

---

## 7. Base de donnees

### SGBD

[PostgreSQL / MySQL / MongoDB / SQLite / etc.] via [ORM/ODM]

### Schema des entites

[Pour chaque entite/model principal :]

#### [NomEntite]

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | UUID / Int | PK, auto | Identifiant unique |
| `[champ]` | [type] | [contraintes] | [description] |

**Relations** :
- [NomEntite] → [AutreEntite] : [type de relation (1:N, N:M, 1:1)]

### Diagramme des relations

```
[Diagramme ASCII des relations entre entites]
User 1──N Post
User 1──N Comment
Post 1──N Comment
Post N──M Tag
```

### Migrations

- Emplacement : `[chemin des migrations]`
- Commande : `[commande pour migrer]`
- Derniere migration : `[nom ou date]`

### Seeds / Fixtures

- Emplacement : `[chemin]`
- Commande : `[commande pour seeder]`

---

## 8. API et routes

### Type d'API : [REST / GraphQL / tRPC / gRPC]

### Authentification des requetes

[Decrire comment authentifier les requetes : header Bearer, cookie, API key, etc.]

### Endpoints

[Grouper par domaine/ressource]

#### [Ressource 1] — `[/api/resource]`

| Methode | Endpoint | Description | Auth | Body/Params |
|---------|----------|-------------|------|-------------|
| GET | `/api/resource` | Lister les resources | [Oui/Non] | `?page=1&limit=20` |
| GET | `/api/resource/:id` | Obtenir une resource | [Oui/Non] | — |
| POST | `/api/resource` | Creer une resource | Oui | `{ name, ... }` |
| PUT | `/api/resource/:id` | Modifier une resource | Oui | `{ name, ... }` |
| DELETE | `/api/resource/:id` | Supprimer une resource | Oui | — |

[Repeter pour chaque groupe de routes]

### Middleware

| Middleware | Fichier | Description |
|-----------|---------|-------------|
| [nom] | `[fichier:ligne]` | [description] |

### Validation des requetes

[Decrire le systeme de validation : Zod schemas, class-validator, Joi, Pydantic, etc.]
[Lister les schemas principaux et leur emplacement]

### Gestion des erreurs API

[Format des erreurs retournees, codes HTTP utilises, structure de la reponse d'erreur]

---

## 9. Frontend

> [Ignorer cette section si le projet est une API pure, CLI, ou n'a pas de frontend]

### Framework et rendu

[Next.js App Router / Pages Router, React SPA, Vue/Nuxt, Svelte/SvelteKit, etc.]
[Mode de rendu : SSR, SSG, CSR, ISR, hybride]

### Pages et routes

| Route | Page/Composant | Description | Auth requise |
|-------|---------------|-------------|--------------|
| `/` | `[fichier]` | Page d'accueil | Non |
| `/dashboard` | `[fichier]` | Tableau de bord | Oui |
[Lister toutes les routes/pages]

### Composants principaux

[Lister les composants cles avec leur role et emplacement]

| Composant | Fichier | Description |
|-----------|---------|-------------|
| `[Nom]` | `[chemin]` | [role] |

### State Management

[Decrire la solution de gestion d'etat : Redux, Zustand, Pinia, Context, etc.]
[Stores/slices principaux et leur contenu]

### Styles et UI

- Framework CSS : [Tailwind / CSS Modules / Styled Components / etc.]
- Bibliotheque UI : [Shadcn/ui / Material UI / Ant Design / etc.]
- Theme : [systeme de theming, dark mode, etc.]

---

## 10. Authentification et autorisation

### Methode d'authentification

[JWT / Session / OAuth 2.0 / API Key / etc.]
[Fournisseur : Clerk / Auth0 / NextAuth / Passport / custom]

### Flux d'authentification

```
[Diagramme ASCII du flux d'auth]
1. User → Login form → POST /api/auth/login
2. Server → Verifie credentials → Genere JWT
3. Server → Set cookie httpOnly → Response 200
4. Client → Stocke en cookie → Redirect /dashboard
```

### Roles et permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| `admin` | Tout | Administrateur |
| `user` | CRUD propre | Utilisateur standard |
[Lister les roles detectes]

### Protection des routes

[Comment les routes sont protegees : middleware, guards, HOC, etc.]
[Fichiers concernes]

---

## 11. Tests

### Framework de test

| Type | Framework | Config |
|------|-----------|--------|
| Unitaire | [Jest/Vitest/etc.] | `[config file]` |
| Integration | [Jest/Vitest/etc.] | `[config file]` |
| E2E | [Playwright/Cypress/etc.] | `[config file]` |

### Lancer les tests

```bash
# Tous les tests
[commande]

# Tests unitaires
[commande]

# Tests e2e
[commande]

# Avec couverture
[commande]
```

### Structure des tests

```
[Arborescence des fichiers de test]
```

### Couverture

[Seuils configures, rapport de couverture, commande pour generer le rapport]

---

## 12. CI/CD et deploiement

### Pipeline CI

[Decrire chaque workflow/pipeline detecte]

#### [Nom du workflow] — `[fichier]`

```
[Diagramme ASCII du pipeline]
Push → Lint → Test → Build → Deploy
```

| Etape | Description | Condition |
|-------|-------------|-----------|
| Lint | [description] | [quand ca tourne] |
| Test | [description] | [quand ca tourne] |
| Build | [description] | [quand ca tourne] |
| Deploy | [description] | [quand ca tourne] |

### Deploiement

- **Plateforme** : [Vercel / AWS / GCP / etc.]
- **Strategie** : [Rolling / Blue-Green / Canary]
- **URL production** : [si detectee]
- **URL staging** : [si detectee]

### Docker

[Si Docker est utilise :]

```
[Services docker-compose avec ports et volumes]
```

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| [nom] | [image] | [port] | [description] |

---

## 13. Dependances principales

### Production

| Package | Version | Role dans le projet |
|---------|---------|---------------------|
| [nom] | [version] | [description concrere de l'usage dans CE projet] |

### Developpement

| Package | Version | Role |
|---------|---------|------|
| [nom] | [version] | [description] |

---

## 14. Flux de donnees

### Requete typique (exemple concret du projet)

```
[Diagramme ASCII d'un flux complet de bout en bout]

Exemple :
1. Browser → GET /dashboard
2. Next.js middleware → Verifie JWT cookie
3. Server Component → Appelle getServerSession()
4. Server Component → Appelle prisma.project.findMany({ where: { userId } })
5. Prisma → SELECT * FROM projects WHERE user_id = $1
6. PostgreSQL → Retourne les resultats
7. Server Component → Rend le HTML avec les donnees
8. Browser → Affiche le dashboard
```

### Flux d'ecriture (exemple concret)

```
[Diagramme d'un flux POST/PUT]
```

### Evenements et side-effects

[Webhooks, cron jobs, event listeners, queues, emails, notifications detectes]

---

## 15. Conventions et patterns

### Nommage

| Element | Convention | Exemple |
|---------|-----------|---------|
| Fichiers composants | [PascalCase/kebab-case] | `UserProfile.tsx` |
| Fichiers utilitaires | [camelCase/kebab-case] | `formatDate.ts` |
| Variables | [camelCase] | `userName` |
| Constantes | [UPPER_SNAKE] | `MAX_RETRIES` |
| Types/Interfaces | [PascalCase] | `UserProfile` |
| Routes API | [kebab-case] | `/api/user-profiles` |
[Adapter selon le langage et les conventions detectees]

### Patterns de code recurrents

[Decrire les patterns observes dans le code : comment les services sont structures, comment les erreurs sont gerees, etc.]

### Structure type d'un module/feature

```
[Template de la structure type d'un fichier ou module]
```

---

## 16. Points d'attention

### Decisions architecturales notables

[Choix techniques importants et leur justification si elle est documentee]

### Configurations speciales

[Configs non evidentes, workarounds, hacks documentes dans le code]

### Limitations connues

[Limitations detectees dans le code : TODO, FIXME, commentaires d'avertissement]

### Securite

[Points de securite a connaitre : endpoints publics, CORS config, rate limiting, etc.]
```

---

## REGLES IMPERATIVES

1. **Factuel uniquement** — chaque information provient du code reel. Reference `fichier:ligne` aussi souvent que possible.
2. **Pas de suppositions** — si une information n'est pas trouvee dans le code, indique "Non detecte" ou "Non configure". Ne jamais inventer.
3. **Adaptatif** — ignore les sections non pertinentes pour la stack detectee :
   - API pure → ignorer Frontend (section 9)
   - CLI → ignorer Frontend, API routes, Auth, DB si non applicable
   - SPA sans backend → ignorer Backend, DB
   - Monorepo → documenter chaque package/app separement dans les sections pertinentes
4. **Exhaustif sur les routes/API** — lister TOUS les endpoints, pas juste un echantillon
5. **Exhaustif sur les variables d'environnement** — lister TOUTES les variables, pas juste celles du .env.example
6. **Exhaustif sur les modeles de donnees** — lister TOUS les champs, pas juste les principaux
7. **Concret et actionable** — un nouveau developpeur doit pouvoir setup le projet et comprendre l'architecture en lisant ce document
8. **Ne pas inclure de valeurs sensibles** — jamais de vrais tokens, mots de passe, ou secrets dans la documentation. Utiliser des exemples generiques.
9. **Ecrire le fichier** — a la fin de l'analyse, ecris le fichier `TECHNICAL_DOCUMENTATION.md` a la racine du projet avec TOUT le contenu genere. Ne pas juste afficher le contenu.
10. **Langue** — rediger la documentation dans la meme langue que le README ou les commentaires du code. Si ambigue, rediger en francais.
