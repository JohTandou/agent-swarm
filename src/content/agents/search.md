---
title: Search
description: Agent d'analyse de codebase en lecture seule — détection de patterns, documentation context7, cartographie des dépendances
order: 2
---

## Rôle

L'agent search est le premier agent activé par l'orchestrateur sur toute route classifiée ADAPT ou supérieure. Il analyse la codebase en lecture seule, détecte les patterns existants, consulte la documentation context7, et fournit un rapport structuré au planner. Il ne modifie jamais le moindre fichier.

## Responsabilités

- **Analyse de codebase** : explorer le projet pour comprendre la structure, les conventions et les dépendances
- **Analyse graphify préalable (si disponible)** : lecture obligatoire de `graphify-out/GRAPH_REPORT.md` et `graph.json` pour identifier les communautés et nœuds pertinents avant toute exploration
- **Détection de patterns** : identifier les patterns récurrents (composants, services, styles) pour guider l'implémentation
- **Documentation context7** : consulter la documentation à jour des bibliothèques et frameworks utilisés
- **Cartographie des dépendances** : tracer le graphe d'imports et les relations entre modules
- **Rapport structuré** : produire un rapport d'analyse exploitable par le planner
- **Recherche négative** : documenter systématiquement ce qui était attendu mais introuvable (absence de preuve ≠ preuve d'absence)
- **Auto-évaluation finale** : attribuer un score de confiance (0.0-1.0) à chaque finding, signaler les hypothèses non vérifiées

## Contraintes

- **Lecture seule absolue** : ne modifie jamais le moindre fichier, aucun write/edit/delete
- **Ne vérifie pas ses hypothèses** : identifie des patterns possibles, ne les valide pas — c'est le rôle du planner
- **Pas de décision architecturale** : ne propose pas de solution, ne fait que cartographier l'existant
- **Ne communique pas avec l'utilisateur** : interactions uniquement via le pipeline interne

## Outils

- **Grep** : recherche par motif dans la codebase
- **Glob** : recherche par pattern de nom de fichier
- **Read** : lecture de fichiers et dossiers
- **context7** : consultation de documentation technique (resolve + query)
- **webfetch** : récupération de contenu web externe

## Routes

| Route | Contexte |
|-------|---------|
| ADAPT | Analyse légère, fichier unique ou module isolé |
| MEDIUM | Analyse multi-fichiers, détection de patterns transverses |
| FULL | Analyse exhaustive, cartographie complète des dépendances |

## Exemple

Tâche : « Ajouter un système de notifications temps réel ». L'agent search :
1. Lance `grep` pour détecter les usages existants de WebSocket/SSE
2. Utilise `glob` pour trouver les services de communication existants
3. Consulte la documentation context7 pour l'API temps réel Supabase
4. Cartographie les imports et dépendances entre modules concernés
5. Produit un rapport : patterns détectés, dépendances identifiées, documentation applicable

## Modèle

Tous les agents de la Swarm utilisent **DeepSeek V4 Pro** — contexte de 1M tokens, raisonnement architectural, génération de code. Aucune dégradation entre agents : chacun bénéficie de la pleine puissance du modèle.
