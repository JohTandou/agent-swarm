---
title: Répartition d'Agents Parallèles
description: Pour 2+ tâches indépendantes sans état partagé ni dépendances séquentielles
category: workflow
order: 16
author: Joh Tandou
---

## Rôle

Le skill dispatching-parallel-agents est conçu pour les situations où plusieurs tâches indépendantes doivent être exécutées simultanément. Il identifie les tâches qui peuvent être parallélisées (absence d'état partagé, absence de dépendances séquentielles), les répartit entre les agents disponibles, et orchestre leur exécution concurrente pour maximiser la vélocité.

## Cas d'usage

- **Multi-fonctionnalités** : implémenter plusieurs features indépendantes en parallèle
- **Refactoring large** : appliquer des modifications sur plusieurs modules sans dépendances
- **Génération de contenu** : créer plusieurs fichiers ou documents simultanément
- **Tests parallèles** : exécuter des suites de test indépendantes en même temps

## Déclencheurs

L'agent planner charge ce skill quand :
- 2+ tâches indépendantes sont identifiées sans état partagé
- L'utilisateur demande une exécution parallèle de plusieurs tâches

## Entrées

- Liste des tâches à exécuter avec leurs contraintes
- Dépendances entre les tâches (pour vérifier l'indépendance)
- Agents disponibles et leurs capacités

## Sorties

- Plan d'exécution parallèle validé
- Tâches exécutées simultanément par les agents appropriés
- Rapport consolidé des résultats de chaque tâche
