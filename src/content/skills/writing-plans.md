---
title: Rédaction de Plans
description: Écrit des plans d'implémentation pour les spécifications multi-étapes, avant de toucher au code
category: documentation
order: 25
author: Joh Tandou
---

## Rôle

Le skill writing-plans transforme des spécifications ou des exigences en plans d'implémentation détaillés. Avant qu'une seule ligne de code ne soit écrite, il analyse les besoins, découpe le travail en étapes atomiques, identifie les dépendances, estime la complexité, et produit un document de plan structuré qui servira de feuille de route aux agents d'exécution.

## Cas d'usage

- **Nouvelle fonctionnalité** : planifier l'implémentation avant de coder
- **Spécification complexe** : décomposer un cahier des charges en tâches gérables
- **Estimation** : évaluer l'effort nécessaire avant de s'engager
- **Alignement équipe** : partager un plan clair avec toutes les parties prenantes

## Déclencheurs

L'agent planner charge ce skill quand :
- Une spécification ou des exigences multi-étapes sont fournies
- L'utilisateur veut planifier avant d'implémenter

## Entrées

- Spécifications fonctionnelles ou techniques
- Contexte du projet (architecture, stack, conventions)
- Contraintes (délais, ressources, dépendances externes)

## Sorties

- Plan d'implémentation structuré avec étapes atomiques
- Dépendances identifiées entre les étapes
- Estimation de complexité et points d'attention
- Critères de succès pour chaque étape
