---
title: Développement par Sous-Agents
description: Exécute des plans d'implémentation avec des tâches indépendantes dans la session courante
category: workflow
order: 21
author: Joh Tandou
---

## Rôle

Le skill subagent-driven-development orchestre l'exécution de plans d'implémentation en déléguant les tâches indépendantes à des sous-agents spécialisés. Dans la session courante, il découpe le plan en unités de travail atomiques, les assigne aux agents appropriés (front, back, tester), et coordonne leurs résultats pour produire un livrable cohérent.

## Cas d'usage

- **Plans complexes** : exécuter un plan multi-composants avec des agents spécialisés
- **Parallélisation** : accélérer le développement en répartissant les tâches
- **Spécialisation** : confier chaque type de tâche à l'agent le plus compétent
- **Session unique** : tout faire dans la même session sans changement de contexte

## Déclencheurs

L'agent planner charge ce skill quand :
- Un plan d'implémentation avec des tâches indépendantes doit être exécuté
- L'utilisateur veut paralléliser le développement dans la session courante

## Entrées

- Plan d'implémentation avec tâches atomiques
- Agents disponibles et leurs spécialités
- Codebase et contexte du projet

## Sorties

- Tâches exécutées en parallèle par les sous-agents appropriés
- Résultats consolidés et cohérents
- Rapport d'exécution avec statut de chaque tâche
