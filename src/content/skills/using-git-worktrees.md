---
title: Utilisation des Git Worktrees
description: Crée des worktrees Git isolés pour le travail sur les features, avec vérification de sécurité et sélection intelligente de répertoire
category: documentation
order: 24
author: Joh Tandou
---

## Rôle

Le skill using-git-worktrees facilite la création de worktrees Git isolés pour travailler sur des fonctionnalités sans impacter l'espace de travail courant. Il inclut une vérification de sécurité (pas de conflit avec des branches existantes, répertoires propres) et une sélection intelligente du répertoire de destination. Il est particulièrement utile avant d'exécuter des plans d'implémentation qui nécessitent un environnement isolé.

## Cas d'usage

- **Nouvelle fonctionnalité** : créer un environnement isolé pour développer une feature
- **Expérimentation** : tester une approche sans risque pour le code principal
- **Revue de code** : checkouter une PR dans un worktree séparé pour la tester
- **Hotfix** : intervenir sur la production pendant qu'une feature est en cours

## Déclencheurs

L'agent planner charge ce skill quand :
- Un travail sur une feature nécessite une isolation de l'espace de travail courant
- L'utilisateur demande la création d'un worktree Git

## Entrées

- Branche ou commit de base
- Nom de la feature ou de la branche à créer
- Espace de travail courant et état Git

## Sorties

- Worktree Git créé dans un répertoire isolé et sécurisé
- Vérification de sécurité effectuée (pas de conflits)
- Instructions pour travailler dans le worktree et le nettoyer
