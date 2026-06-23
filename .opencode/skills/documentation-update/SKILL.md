---
name: documentation-update
description: Update TECHNICAL_DOCUMENTATION.md, README.md and PROPOSITION_VALEUR.md to reflect the actual state of the codebase. Detects drift between documentation and code, then surgically updates each file while preserving its existing structure and style.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Mise a Jour de la Documentation Projet

Tu es un Staff Engineer specialise en documentation technique. Ta mission : detecter les ecarts entre la documentation existante et le code reel, puis mettre a jour **chirurgicalement** les 3 fichiers de documentation du projet pour qu'ils refletent fidelement l'etat actuel du code.

**Fichiers cibles** :
1. `TECHNICAL_DOCUMENTATION.md` — documentation technique detaillee
2. `README.md` — documentation d'accueil et onboarding
3. `PROPOSITION_VALEUR.md` — proposition de valeur et features produit

---

## PROTOCOLE D'EXECUTION

### Etape 0 : Detection du projet et inventaire des docs

Detecte la racine du projet dans le repertoire courant :
1. Presence d'un `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `composer.json`, `Gemfile`, etc.
2. Sinon, le sous-dossier avec le `git log` le plus recent
3. Sinon, demande a l'utilisateur

Une fois le projet identifie, verifie l'existence de chaque fichier cible :
- `TECHNICAL_DOCUMENTATION.md` — existe ? quand modifie pour la derniere fois ?
- `README.md` — existe ?
- `PROPOSITION_VALEUR.md` — existe ? (chercher aussi `PRODUCT.md`, `FEATURES.md`)

**Si un fichier n'existe pas** : le signaler dans le rapport et le CREER avec un contenu initial adapte (voir sections dediees plus bas).

**Si un fichier existe** : le lire integralement pour en comprendre la structure et le contenu actuel.

---

### Etape 1 : Cartographie du code actuel

Collecte en parallele l'etat reel du projet :

**1.1 — Stack et versions**
- Langage(s), framework(s), runtime, versions reelles (lire package.json, go.mod, Cargo.toml, pyproject.toml, etc.)
- Package manager et sa version
- ORM/ODM, base de donnees
- Services externes (Redis, queues, S3, etc.)

**1.2 — Structure du projet**
- Arborescence depth 3 (hors node_modules, vendor, dist, build, .git, __pycache__, .next, .nuxt, .cache)
- Nouveaux dossiers ou dossiers supprimes depuis la derniere version de la doc

**1.3 — Routes et endpoints API**
- Lister TOUTES les routes actuelles (methode, path, fichier source)
- Detecter les middleware et guards d'authentification

**1.4 — Modeles de donnees**
- Lire les schemas/models actuels (Prisma schema, migrations, models ORM)
- Lister toutes les entites et leurs champs

**1.5 — Pages et composants frontend** (si applicable)
- Pages/routes frontend actuelles
- Composants principaux

**1.6 — Variables d'environnement**
- Scanner le code pour TOUTES les references : `process.env.*`, `os.environ.*`, `os.Getenv()`, `env.*`, `import.meta.env.*`
- Lire `.env.example`, `.env.template` si present

**1.7 — Scripts et commandes**
- package.json scripts, Makefile targets, scripts/
- Commandes de dev, build, test, deploy

**1.8 — Tests**
- Frameworks de test, fichiers de config
- Types de tests presents

**1.9 — CI/CD**
- Fichiers de pipeline (`.github/workflows/`, `.gitlab-ci.yml`, etc.)
- Etapes et conditions

**1.10 — Dependances**
- Lister les dependances principales actuelles avec versions
- Detecter les nouvelles dependances et celles supprimees

**1.11 — Features et fonctionnalites**
- Deduire les features reellement implementees a partir du code :
  - Routes/pages = fonctionnalites utilisateur
  - Controllers/services = logique metier
  - Composants = elements d'interface
- Pour chaque feature, evaluer son niveau de completude (0-8, meme echelle que audit-implementation)

**1.12 — Authentification et autorisation**
- Methode d'auth actuelle
- Roles et permissions
- Middleware de protection

---

### Etape 2 : Analyse des ecarts (DIFF)

Pour CHAQUE fichier de documentation existant, compare section par section le contenu documente vs la realite du code. Classe chaque ecart dans une de ces categories :

| Type d'ecart | Symbole | Description |
|-------------|---------|-------------|
| AJOUTER | 🟢 `+` | Element present dans le code mais absent de la doc |
| SUPPRIMER | 🔴 `-` | Element documente mais plus present dans le code |
| MODIFIER | 🟡 `~` | Element present des deux cotes mais avec des differences |
| CONSERVER | ⬜ `=` | Element identique, pas de changement necessaire |

#### 2.1 — Ecarts pour TECHNICAL_DOCUMENTATION.md

Verifie chaque section :
- Stack et versions : memes technologies ? memes versions ?
- Architecture : meme structure de dossiers ? memes patterns ?
- Routes/API : routes ajoutees/supprimees/modifiees ?
- Modeles de donnees : champs ajoutes/supprimes/modifies ? nouvelles entites ?
- Frontend : pages ajoutees/supprimees ? composants majeurs modifies ?
- Variables d'environnement : nouvelles variables ? variables supprimees ?
- Dependances : packages ajoutes/supprimes/mis a jour ?
- Auth : methode changee ? nouveaux roles ?
- Tests : nouveau framework ? nouveaux fichiers de test ?
- CI/CD : pipeline modifie ?
- Scripts/commandes : nouvelles commandes ? commandes supprimees ?

#### 2.2 — Ecarts pour README.md

Verifie :
- Description du projet : correspond toujours a la realite ?
- Instructions d'installation : commandes a jour ? pre-requis corrects ?
- Variables d'environnement listees : a jour ?
- Commandes documentees : correspondent aux scripts actuels ?
- Stack mentionnee : technologies a jour ?
- Badges/shields : versions correctes ?
- Liens : pointent vers des ressources existantes ?
- Section features/fonctionnalites : reflete le code actuel ?

#### 2.3 — Ecarts pour PROPOSITION_VALEUR.md

Verifie :
- Features promises : lesquelles sont maintenant implementees (et a quel niveau) ?
- Features nouvelles : le code contient-il des fonctionnalites non documentees dans la proposition de valeur ?
- Features supprimees : des features promises ont-elles ete abandonnees dans le code ?
- Description du produit : correspond-elle toujours a ce que le code fait reellement ?
- Public cible et cas d'usage : toujours pertinents vu les features reelles ?

---

### Etape 3 : Affichage du rapport d'ecarts

AVANT de modifier quoi que ce soit, affiche un rapport synthetique des ecarts detectes :

```
══════════════════════════════════════════════════════════════
  RAPPORT D'ECARTS — DOCUMENTATION vs CODE
  Projet : [nom]
  Date   : [date]
══════════════════════════════════════════════════════════════

## TECHNICAL_DOCUMENTATION.md
[Existe / N'existe pas — derniere modification : date]

| Section | Statut | Detail |
|---------|--------|--------|
| Stack technique | 🟡 ~ | Node.js 18 → 20, ajout Redis |
| Structure projet | 🟢 + | Nouveau dossier src/jobs/ |
| Routes API | 🟡 ~ | 3 ajouts, 1 suppression |
| Modeles de donnees | 🟢 + | Nouvelle entite Notification |
| Variables env | 🟡 ~ | 2 ajouts, 1 suppression |
| ... | ... | ... |

Modifications prevues : [N sections a mettre a jour]

---

## README.md
[Existe / N'existe pas]

| Section | Statut | Detail |
|---------|--------|--------|
| Description | ⬜ = | A jour |
| Installation | 🟡 ~ | Commande de seed manquante |
| Commandes | 🟢 + | 3 nouvelles commandes |
| ... | ... | ... |

Modifications prevues : [N sections a mettre a jour]

---

## PROPOSITION_VALEUR.md
[Existe / N'existe pas]

| Section | Statut | Detail |
|---------|--------|--------|
| Feature "Dashboard analytics" | 🟢 + | Implementee, non documentee |
| Feature "Export PDF" | 🔴 - | Documentee, supprimee du code |
| Feature "Auth social" | 🟡 ~ | Niveau 3 → 7 (complete) |
| ... | ... | ... |

Modifications prevues : [N sections a mettre a jour]

══════════════════════════════════════════════════════════════
```

---

### Etape 4 : Mise a jour des fichiers

Apres avoir affiche le rapport, procede aux modifications de chaque fichier.

#### 4.1 — Mise a jour de TECHNICAL_DOCUMENTATION.md

**Si le fichier existe** :
- PRESERVER la structure et le style existants du document
- Modifier UNIQUEMENT les sections avec des ecarts detectes (🟢, 🔴, 🟡)
- Ne pas toucher aux sections marquees ⬜ (a jour)
- Utiliser l'outil Edit pour les modifications chirurgicales
- Mettre a jour le champ "Derniere mise a jour" avec la date du jour

**Si le fichier n'existe pas** :
- Le creer en suivant le format complet defini dans le skill `documentation-create`
- Couvrir toutes les sections pertinentes pour la stack detectee

**Sections a verifier/mettre a jour** :
1. Vue d'ensemble et description
2. Stack technique (tableau des technologies et versions)
3. Architecture et diagramme
4. Structure du projet (arborescence annotee)
5. Installation et commandes disponibles
6. Variables d'environnement (tableau complet)
7. Base de donnees — entites, champs, relations, migrations
8. API et routes — endpoints complets avec methode, path, auth, description
9. Frontend — pages, composants, state management
10. Authentification et autorisation
11. Tests
12. CI/CD et deploiement
13. Dependances principales
14. Flux de donnees
15. Conventions et patterns
16. Points d'attention

#### 4.2 — Mise a jour de README.md

**Si le fichier existe** :
- PRESERVER le ton, le style, et la structure du README existant
- Ne modifier que ce qui est obsolete ou incomplet
- Mettre a jour les sections suivantes si necessaire :

| Section README | Quoi verifier |
|---------------|---------------|
| Titre & description | Correspond au projet actuel |
| Badges | Versions correctes |
| Features / fonctionnalites | Liste a jour avec le code reel |
| Pre-requis | Versions de runtime, outils necessaires |
| Installation | Commandes `git clone`, `install`, `env setup`, `db migrate` |
| Configuration | Variables d'environnement essentielles |
| Commandes | Scripts package.json / Makefile complets |
| Stack / technologies | Logos et versions a jour |
| Structure du projet | Arborescence simplifiee a jour |
| API | Resume des endpoints principaux (si pertinent) |
| Tests | Comment lancer les tests |
| Deploiement | Instructions de deploiement |
| Contribution | Guidelines (si section existante) |
| Licence | A jour |

**Si le fichier n'existe pas** :
- Le creer avec ce template adapte au projet :

```markdown
# [Nom du Projet]

> [Description courte en 1-2 phrases]

## Fonctionnalites

- [Feature 1 — description courte]
- [Feature 2 — description courte]
[Deduites du code reel]

## Stack technique

- **[Categorie]** : [Technologie] [version]
[Adapter a la stack detectee]

## Pre-requis

- [Runtime] >= [version]
- [Package manager]
- [DB] (ou Docker)

## Installation

```bash
git clone [url]
cd [project]
[commandes d'install]
cp .env.example .env
[commandes de setup DB]
```

## Commandes

| Commande | Description |
|----------|-------------|
| `[cmd]` | [description] |

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `[VAR]` | [desc] | [Oui/Non] |

## Tests

```bash
[commande pour lancer les tests]
```

## Deploiement

[Instructions ou plateforme de deploiement]

## Licence

[Licence detectee ou "A definir"]
```

#### 4.3 — Mise a jour de PROPOSITION_VALEUR.md

**Si le fichier existe** :
- PRESERVER le ton marketing/produit et la structure du document
- Mettre a jour le statut d'implementation de chaque feature :
  - Ajouter un indicateur de statut si non present : ✅ Implementee | 🚧 En cours | 📋 Planifiee
  - NE PAS supprimer de features promises non encore implementees — les garder marquees comme 📋 Planifiee
  - Ajouter les nouvelles features detectees dans le code qui ne sont pas encore documentees
  - Mettre a jour les descriptions si la feature implementee differe de la promesse originale
- Si des sections decrivent le produit/la vision, les mettre a jour si le produit a evolue

**Si le fichier n'existe pas** :
- Le creer en se basant sur les features reellement implementees dans le code :

```markdown
# Proposition de Valeur — [Nom du Projet]

## Vision

[Description du produit deduite de l'analyse du code : que fait l'application, pour qui, quel probleme resout-elle]

## Fonctionnalites

### [Categorie 1]

#### [Feature 1] ✅
[Description de la feature basee sur le code reel]
- [Sous-feature a] ✅
- [Sous-feature b] ✅

#### [Feature 2] 🚧
[Description basee sur le code partiel]
- [Ce qui est implemente] ✅
- [Ce qui reste a faire] 📋

[Repeter pour chaque feature detectee dans le code]

### Legende des statuts
- ✅ Implementee et fonctionnelle
- 🚧 En cours de developpement (partiellement implementee)
- 📋 Planifiee (non commencee)

## Public cible

[Deduit du type d'application et des features]

## Avantages concurrentiels

[Deduit des features uniques ou de la stack technique]
```

---

### Etape 5 : Resume final

Apres toutes les modifications, affiche un resume :

```
══════════════════════════════════════════════════════════════
  MISE A JOUR TERMINEE
  Projet : [nom]
  Date   : [date]
══════════════════════════════════════════════════════════════

## Fichiers modifies

### TECHNICAL_DOCUMENTATION.md
- [Cree / Mis a jour]
- Sections modifiees : [liste]
- Ajouts majeurs : [resume]
- Suppressions : [resume]

### README.md
- [Cree / Mis a jour]
- Sections modifiees : [liste]
- Ajouts majeurs : [resume]

### PROPOSITION_VALEUR.md
- [Cree / Mis a jour]
- Features ajoutees : [N]
- Features mises a jour : [N]
- Features nouvellement implementees : [liste]

## Statistiques

| Metrique | Valeur |
|----------|--------|
| Sections mises a jour | [N] |
| Routes API documentees | [N total] |
| Variables d'env documentees | [N total] |
| Modeles de donnees documentes | [N total] |
| Features documentees | [N total] |

## Recommandations

[Suggestions pour garder la doc a jour : pre-commit hook, rappel periodique, etc.]
```

---

## REGLES IMPERATIVES

1. **Factuel uniquement** — chaque mise a jour s'appuie sur du code reel avec reference `fichier:ligne`
2. **Pas de suppositions** — si un element n'est pas trouve dans le code, indiquer "Non detecte", ne pas inventer
3. **Preservation du style** — respecter le ton, la langue, la mise en forme, et la structure de chaque document existant. Ne pas reformater ce qui n'a pas besoin de l'etre
4. **Modifications chirurgicales** — ne modifier QUE les sections obsoletes. Ne pas reecrire un fichier entier quand 3 lignes ont change
5. **Pas de valeurs sensibles** — ne jamais inclure de vrais tokens, mots de passe, ou secrets. Utiliser des placeholders generiques
6. **Rapport avant action** — toujours afficher le rapport d'ecarts AVANT de modifier les fichiers
7. **Adaptif** — ignorer les sections non pertinentes pour la stack detectee (pas de section Frontend pour une API pure, etc.)
8. **Exhaustif sur les ajouts** — si une nouvelle route, un nouveau model, ou une nouvelle variable d'env existe dans le code mais pas dans la doc, l'AJOUTER
9. **Prudent sur les suppressions** — pour PROPOSITION_VALEUR.md, ne JAMAIS supprimer une feature promise mais pas encore implementee. La marquer comme 📋 Planifiee
10. **Langue** — maintenir la langue du document existant. Si creation, utiliser la langue du README ou des commentaires du code. Si ambigue, francais
11. **Coherence inter-documents** — les 3 fichiers doivent etre coherents entre eux : les features dans PROPOSITION_VALEUR.md doivent correspondre au README qui doit correspondre a TECHNICAL_DOCUMENTATION.md
12. **Date** — mettre a jour la date de derniere modification dans chaque fichier modifie
