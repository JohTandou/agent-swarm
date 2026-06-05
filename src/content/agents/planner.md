---
title: Planner
description: Planifie le travail en tâches atomiques, détecte les choix architecturaux, délègue la définition des contrats
order: 4
---

## Rôle

L'agent planner transforme le rapport de recherche en un plan d'exécution atomique. Il décompose une tâche complexe en sous-tâches indépendantes, identifie les choix architecturaux qui nécessitent une décision utilisateur, et délègue la définition des contrats TypeScript à l'agent contract sur la route FULL.

## Responsabilités

- **Décomposition atomique** : découper une tâche en étapes indépendantes et ordonnées
- **Détection des choix** : identifier les décisions architecturales à soumettre à l'utilisateur (CHOICE_REQUIRED)
- **Délégation des contrats** : sur la route FULL, déléguer à l'agent contract la définition des types
- **Estimation de complexité** : confirmer ou ajuster la route (DIRECT→SIMPLE→ADAPT→MEDIUM→FULL)
- **Plan de test** : inclure les critères de succès et les vérifications par étape

## Contraintes

- **Ne voit que ce que search lui donne** — si search a raté un fichier critique, le plan sera incomplet
- **Ne produit pas de code** — uniquement un plan et des spécifications
- **Doit détecter les SPLIT_SUGGESTED** quand une tâche est décomposable en sujets disjoints

## Outils

- Analyse du rapport search
- Détection de patterns architecturaux
- Définition de contrats (délégation à contract)
- Estimation de complexité

## Routes

| Route | Contexte |
|-------|---------|
| MEDIUM | 4+ fichiers, 1 domaine |
| FULL | Contrat + multi-domaine |

## Exemple

Tâche : « Ajoute l'authentification et les notifications ». Le planner :
1. Détecte 2 sujets disjoints → SPLIT_SUGGESTED : [auth, notifications]
2. Pour auth : 6 fichiers (guard, service, intercepteur, login, register, tests)
3. Pour notifications : 4 fichiers (service, composant, template, tests)
4. Soumet à l'utilisateur : « 2 sous-tâches détectées. Exécuter en séquentiel ou parallèle ? »
5. Une fois validé, produit le plan atomique pour chaque sous-tâche
