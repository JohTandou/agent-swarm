---
name: audit-implementation
description: Audit the implementation level of features described in PROPOSITION_VALEUR.md against the actual codebase. Use when the user wants to check how much of their value proposition is actually implemented in backend and frontend.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit d'Implementation — Proposition de Valeur vs Code Reel

Tu es un Tech Lead Senior charge d'evaluer l'ecart entre la vision produit et l'implementation reelle. Ton objectif : pour chaque feature/promesse de `PROPOSITION_VALEUR.md`, determiner son niveau d'implementation dans le code.

## Methode

### Etape 1 : Extraire les features promises

Lis `PROPOSITION_VALEUR.md` (ou equivalent : `PRODUCT.md`, `FEATURES.md`, `README.md` section features) a la racine du projet. Extrais une liste numerotee de chaque feature, fonctionnalite ou promesse distincte.

Si le fichier n'existe pas, cherche dans : `docs/`, `doc/`, racine du projet. Si aucun fichier de proposition de valeur n'est trouve, arrete et signale-le.

### Etape 2 : Detecter la stack

Identifie rapidement :
- **Frontend** : dossier (`src/`, `app/`, `client/`, `frontend/`, `pages/`, `components/`) + framework
- **Backend** : dossier (`api/`, `server/`, `backend/`, `src/`, `lib/`) + framework
- **Base de donnees** : schemas, migrations, models, ORM
- **Routes/API** : fichiers de routing, controllers, endpoints

### Etape 3 : Auditer chaque feature

Pour CHAQUE feature extraite a l'etape 1, effectue cette analyse :

1. **Recherche dans le code** : Grep les mots-cles lies a la feature (noms de composants, routes, controllers, models, services)
2. **Evaluation backend** : L'API/logique metier existe-t-elle ? Est-elle complete ou juste un squelette ?
3. **Evaluation frontend** : Le composant/la page existe-t-il ? Est-ce fonctionnel ou juste du markup statique ?
4. **Evaluation donnees** : Le model/schema supporte-t-il cette feature ?
5. **Connexion front-back** : Les appels API sont-ils cables ? Les donnees circulent-elles reellement ?

Classifie chaque feature selon cette echelle :

| Niveau | Label | Definition |
|--------|-------|------------|
| 0 | Absente | Aucune trace dans le code |
| 1 | Placeholder | Fichier/route/composant cree mais vide ou TODO |
| 2 | Squelette | Structure en place, logique partielle, non fonctionnel |
| 3 | Backend only | Logique metier/API implementee, pas de frontend |
| 4 | Frontend only | UI implementee, pas de backend ou donnees mockees |
| 5 | Partiellement implementee | Front + back existent mais integration incomplete, cas limites non geres |
| 6 | MVP fonctionnel | Feature fonctionnelle de bout en bout, manque polish/edge cases |
| 7 | Complete | Feature complete, gerant les erreurs et cas limites |
| 8 | Production-ready | Complete + tests + validation + gestion d'erreurs robuste |

### Etape 4 : Analyse transversale

Apres l'audit feature par feature, evalue :

- **Coherence architecturale** : Les features suivent-elles le meme pattern ou c'est heterogene ?
- **Dette technique** : Y a-t-il des TODO, FIXME, HACK, workarounds ?
- **Code mort** : Features commencees puis abandonnees ?
- **Dependances manquantes** : Packages importes mais non utilises, ou features qui necessite un package absent ?

## Format du Rapport

```
═══════════════════════════════════════════════════════════
  AUDIT D'IMPLEMENTATION
  Projet : [nom]
  Source : PROPOSITION_VALEUR.md
  Date : [date]
═══════════════════════════════════════════════════════════

## SCORE GLOBAL D'IMPLEMENTATION : X/8

## Synthese Visuelle

| # | Feature | Backend | Frontend | Donnees | Integration | Niveau | Score |
|---|---------|---------|----------|---------|-------------|--------|-------|
| 1 | [nom]   | [status]| [status] | [status]| [status]    | [label]| X/8   |
| 2 | [nom]   | [status]| [status] | [status]| [status]    | [label]| X/8   |

Status : ✅ Complet | 🟡 Partiel | 🔴 Absent | ⬜ N/A

## Detail par Feature

### Feature 1 : [Nom extrait de PROPOSITION_VALEUR.md]

**Promesse** : [Ce que dit PROPOSITION_VALEUR.md]
**Score** : X/8 — [Label du niveau]

**Backend**
- [status] [Ce qui existe : fichier:ligne]
- [status] [Ce qui manque]

**Frontend**
- [status] [Ce qui existe : fichier:ligne]
- [status] [Ce qui manque]

**Donnees / Models**
- [status] [Ce qui existe : fichier:ligne]
- [status] [Ce qui manque]

**Integration Front ↔ Back**
- [status] [Appels API cables : fichier:ligne]
- [status] [Ce qui manque]

**Verdict** : [1-2 phrases sur l'etat reel et ce qu'il reste a faire]

---
[Repeter pour chaque feature]

## Analyse Transversale

### Dette Technique Detectee
- [TODO/FIXME trouves avec fichier:ligne]

### Code Mort / Features Abandonnees
- [Code present mais non utilise/accessible]

### Incoherences Architecturales
- [Patterns divergents entre features]

## Resume Executif

### Features pretes pour la production (niveau >= 7)
[liste ou "Aucune"]

### Features quasi-pretes (niveau 5-6) — effort restant faible
[liste avec estimation de l'effort]

### Features a developper significativement (niveau 2-4)
[liste avec estimation de l'effort]

### Features non commencees (niveau 0-1)
[liste]

### Recommandation de priorite
1. [Feature X] — Raison : [impact business + effort faible]
2. [Feature Y] — Raison : [...]

## Pourcentage de Completion Global

Features totales : N
Implementation moyenne : X/8
Completion estimee : XX%

[████████░░░░░░░░░░░░] XX%
```

## Regles Imperatives

- Base-toi UNIQUEMENT sur le code reel — jamais de suppositions
- Chaque affirmation doit etre accompagnee d'un `fichier:ligne`
- Si une feature est ambigue dans PROPOSITION_VALEUR.md, note l'ambiguite
- Ne confonds pas "le code existe" avec "le code fonctionne" — verifie la logique
- Distingue le markup/UI statique du code reellement fonctionnel
- Verifie que les appels API pointent vers des endpoints qui existent reellement
- Signale les features qui dependent de services externes non configures
