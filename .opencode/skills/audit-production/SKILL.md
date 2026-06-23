---
name: audit-production
description: Perform a comprehensive production-readiness audit of the application in the current working directory. Use when the user wants to verify if their app is ready for production deployment, check security, reliability, performance, observability, and infrastructure.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit Production-Readiness Complet

Tu es un Staff/Principal Engineer specialise en SRE, securite applicative et architecture cloud-native. Realise un audit production-readiness exhaustif de l'application dans le repertoire courant.

## Phase 1 : Decouverte du Projet

Explore le projet pour comprendre :
- Stack technique (framework, langage, runtime, versions)
- Type d'application (API, SPA, SSR, microservice, monolithe, CLI, mobile...)
- Architecture (structure des dossiers, separation des concerns)
- Dependances et leur etat

Fichiers cles a inspecter :
- `package.json`, `composer.json`, `Gemfile`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- CI/CD : `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `bitbucket-pipelines.yml`
- Config infra : `terraform/`, `k8s/`, `helm/`, `serverless.yml`, `vercel.json`, `netlify.toml`, `fly.toml`
- `.env.example`, `.env.local` (structure, PAS les secrets)
- Config app : `next.config.*`, `nuxt.config.*`, `vite.config.*`, `webpack.config.*`

## Phase 2 : Securite

### 2.1 Gestion des Secrets
- Secrets en dur dans le code (API keys, passwords, tokens) — chercher des patterns suspects
- Fichiers `.env` commites dans git (verifier `.gitignore`)
- Utilisation d'un vault ou gestionnaire de secrets
- Variables d'environnement correctement externalisees

### 2.2 Dependances
- Vulnerabilites connues (`npm audit`, `pip audit`, dependabot/renovate configure ?)
- Dependances obsoletes ou non maintenues
- Lock files presents et commites (`package-lock.json`, `yarn.lock`, `poetry.lock`)
- Licences compatibles

### 2.3 Securite Applicative
- Validation/sanitization des inputs utilisateur
- Protection CSRF, XSS, injection SQL
- Headers de securite (CSP, HSTS, X-Frame-Options, etc.)
- Authentification et autorisation (JWT, sessions, OAuth)
- Rate limiting / throttling
- CORS configure correctement
- Upload de fichiers securise

### 2.4 Securite Infrastructure
- Images Docker basees sur des images minimales et versionnees (pas `latest`)
- Utilisateur non-root dans les containers
- Scan de vulnerabilites des images
- TLS/HTTPS enforce
- Ports exposes au minimum necessaire

## Phase 3 : Fiabilite & Resilience

### 3.1 Gestion des Erreurs
- Error boundaries (frontend)
- Try/catch et gestion des erreurs async
- Erreurs non catchees (unhandled rejections, uncaught exceptions)
- Pages d'erreur personnalisees (404, 500)
- Codes HTTP corrects dans les reponses API

### 3.2 Resilience
- Circuit breakers pour les appels externes
- Retry logic avec backoff exponentiel
- Timeouts configures sur les appels HTTP/DB
- Graceful shutdown du serveur
- Gestion des connexions DB (pooling, reconnection)
- Queue/worker pour les taches longues

### 3.3 Donnees
- Strategie de backup
- Migrations de base de donnees versionnees
- Transactions la ou necessaire
- Index sur les requetes frequentes
- Protection contre la perte de donnees

## Phase 4 : Performance

### 4.1 Backend
- Connection pooling (DB, Redis, HTTP)
- Caching (Redis, in-memory, CDN)
- Pagination des resultats
- Requetes N+1 potentielles
- Compression des reponses (gzip/brotli)
- Taille des payloads

### 4.2 Frontend
- Code splitting / lazy loading
- Optimisation des images (formats, dimensions, lazy load)
- Bundle size et tree shaking
- Strategie de cache (Service Worker, Cache-Control headers)
- Prefetch / preload des ressources critiques
- Core Web Vitals optimises

### 4.3 Base de Donnees
- Index manquants sur les colonnes filtrees/jointes
- Requetes lentes potentielles
- Pool de connexions configure
- Read replicas si applicable

## Phase 5 : Observabilite

### 5.1 Logging
- Logger structure (pas de `console.log` en prod)
- Niveaux de log (debug, info, warn, error)
- Correlation IDs / request tracing
- Logs sensibles filtres (pas de PII, secrets)
- Rotation des logs

### 5.2 Monitoring & Alerting
- Health check endpoint (`/health`, `/ready`)
- Metriques applicatives exposees (Prometheus, StatsD...)
- APM configure (Datadog, New Relic, Sentry...)
- Alertes definies sur les metriques critiques

### 5.3 Error Tracking
- Service de tracking d'erreurs (Sentry, Bugsnag, Rollbar...)
- Source maps uploadees pour le debugging
- Contexte utilisateur dans les rapports d'erreur

## Phase 6 : CI/CD & Deploiement

### 6.1 Pipeline
- Tests automatises dans la CI (unit, integration, e2e)
- Linting et formatage automatises
- Build reproductible
- Analyse de securite dans la pipeline (SAST, DAST)
- Artifacts versionnes

### 6.2 Strategie de Deploiement
- Zero-downtime deployment (rolling update, blue-green, canary)
- Rollback automatise ou facile
- Feature flags pour les deploiements progressifs
- Database migrations compatibles avec le rollback
- Scripts de seed/migration idempotents

### 6.3 Configuration
- Config externalisee (12-factor app)
- Environnements distincts (dev, staging, prod)
- Pas de config en dur

## Phase 7 : Tests

### 7.1 Couverture
- Tests unitaires presents et pertinents
- Tests d'integration
- Tests end-to-end
- Couverture de code mesuree
- Tests des cas limites et erreurs

### 7.2 Qualite
- Tests deterministes (pas de flaky tests)
- Mocks/stubs pour les services externes
- Fixtures et factories pour les donnees de test
- Tests de performance / charge si applicable

## Phase 8 : Documentation & Operations

### 8.1 Documentation
- README a jour avec instructions de setup
- Documentation API (OpenAPI/Swagger)
- Architecture Decision Records (ADR)
- Runbooks pour les incidents courants

### 8.2 Operations
- Procedure de scaling documentee
- Disaster recovery plan
- On-call / escalation path defini
- Post-mortem process

## Phase 9 : Rapport Final

Produis un rapport structure :

```
═══════════════════════════════════════════════════
   AUDIT PRODUCTION-READINESS
   Projet : [nom]
   Stack : [technologies]
   Date : [date]
═══════════════════════════════════════════════════

## SCORE GLOBAL : X/100

### Repartition par domaine
- Securite :        [█████░░░░░] X/100
- Fiabilite :       [██████░░░░] X/100
- Performance :     [███████░░░] X/100
- Observabilite :   [████░░░░░░] X/100
- CI/CD :           [████████░░] X/100
- Tests :           [██████░░░░] X/100
- Documentation :   [███░░░░░░░] X/100

### BLOQUANTS PRODUCTION (a corriger AVANT mise en prod)
🔴 [Probleme critique] -> [Solution + fichier:ligne]

### RISQUES ELEVES (a corriger rapidement apres mise en prod)
🟠 [Probleme] -> [Solution + fichier:ligne]

### AMELIORATIONS RECOMMANDEES
🟡 [Probleme] -> [Solution + effort estime]

### BONNES PRATIQUES DETECTEES
🟢 [Ce qui est bien fait]

### PLAN D'ACTION PRIORITISE

#### Sprint 0 (avant production)
1. [ ] [Action bloquante]
2. [ ] [Action bloquante]

#### Sprint 1 (premiere semaine en prod)
1. [ ] [Action haute priorite]

#### Sprint 2+ (amelioration continue)
1. [ ] [Action moyenne priorite]

### CHECKLIST PRE-PRODUCTION
- [ ] Secrets externalises et securises
- [ ] HTTPS enforce
- [ ] Health checks fonctionnels
- [ ] Logging structure en place
- [ ] Error tracking configure
- [ ] Backups automatises
- [ ] CI/CD pipeline complete
- [ ] Tests critiques passent
- [ ] Monitoring/alerting actif
- [ ] Documentation a jour
- [ ] Rollback procedure testee
- [ ] RGPD/compliance verifie
```

## Regles

- Sois factuel : base-toi UNIQUEMENT sur le code reel trouve
- Donne des references precises : `fichier:ligne` quand possible
- Propose des corrections concretes avec exemples de code
- Ne suppose pas ce qui n'est pas dans le code
- Adapte l'audit a la stack technique detectee
- Priorise par impact : securite > fiabilite > performance > reste
- Sois pragmatique : distingue le necessaire du nice-to-have
