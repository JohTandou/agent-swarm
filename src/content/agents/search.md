---
title: Search
description: Analyse le codebase, identifie les fichiers impactés, détecte les patterns et conventions
order: 2
---

## Rôle

L'agent search est le premier maillon de la chaîne d'analyse. Il explore le codebase pour identifier les fichiers impactés par une tâche, détecter les patterns et conventions existants, récupérer la documentation à jour des frameworks via context7, et cartographier les dépendances. C'est un agent de LECTURE SEULE — il ne modifie jamais de code.

## Responsabilités

- **Analyse du codebase** : identifier tous les fichiers pertinents pour une tâche donnée
- **Détection de patterns** : repérer les conventions de code, styles, architectures existantes
- **Documentation context7** : récupérer la documentation la plus récente des frameworks utilisés
- **Cartographie des dépendances** : tracer les imports et relations entre modules
- **Rapport de recherche** : produire un résumé structuré pour le planner

## Contraintes

- **Lecture seule absolue** — ne modifie aucun fichier
- **Ne peut pas vérifier ses hypothèses** en exécutant du code
- **Si le codebase est mal structuré**, l'analyse sera incomplète
- **Dépend de la qualité des patterns** détectés pour guider le planner

## Outils

- Grep, Glob (recherche de fichiers)
- Lecture de fichiers (Read)
- context7 (documentation frameworks)
- Analyse de code statique

## Routes

| Route | Contexte |
|-------|---------|
| ADAPT | 2-4 fichiers, 1 domaine |
| MEDIUM | 4+ fichiers, 1 domaine |
| FULL | Contrat + multi-domaine |

## Exemple

Tâche : « Ajoute un système de notifications ». L'agent search :
1. Grep 'notification', 'notify', 'alert' → 8 fichiers trouvés
2. Lit les composants existants pour détecter le pattern UI
3. Vérifie context7 pour la doc Angular des services
4. Cartographie les dépendances : NotificationService → HeaderComponent → AppModule
5. Rapport : « 8 fichiers impactés (4 front, 2 services, 1 modèle, 1 test). Pattern : service providedIn 'root' + composant standalone. Route suggérée : MEDIUM. »
