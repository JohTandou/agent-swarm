---
title: Développement Piloté par les Tests
description: TDD : écrire les tests avant le code d'implémentation pour toute fonctionnalité ou correction
category: workflow
order: 22
author: Joh Tandou
---

## Rôle

Le skill test-driven-development applique la méthodologie TDD (Test-Driven Development) de manière rigoureuse. Avant d'écrire le code d'implémentation, il génère les tests qui définissent le comportement attendu. Ces tests échouent d'abord (red), puis le code est écrit pour les faire passer (green), et enfin le code est refactoré (refactor). Ce skill garantit que chaque fonctionnalité est testée dès sa conception.

## Cas d'usage

- **Nouvelle fonctionnalité** : définir le comportement attendu avant d'implémenter
- **Correction de bug** : écrire un test qui reproduit le bug avant de le corriger
- **Refactoring** : s'assurer que le comportement reste identique après restructuration
- **Qualité continue** : maintenir une couverture de test élevée systématiquement

## Déclencheurs

L'agent planner charge ce skill quand :
- Une nouvelle fonctionnalité ou correction de bug doit être implémentée
- L'utilisateur veut suivre la méthodologie TDD

## Entrées

- Spécification de la fonctionnalité ou description du bug
- Codebase et infrastructure de test existante
- Conventions de test du projet

## Sorties

- Tests écrits en premier (phase red)
- Code d'implémentation faisant passer les tests (phase green)
- Code refactoré et optimisé (phase refactor)
- Rapport de couverture pour la fonctionnalité
