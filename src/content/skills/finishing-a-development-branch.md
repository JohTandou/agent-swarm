---
title: Finalisation de Branche
description: Guide la complétion du travail de développement : options structurées pour merge, PR ou cleanup
category: workflow
order: 18
author: Joh Tandou
---

## Rôle

Le skill finishing-a-development-branch intervient quand l'implémentation est terminée et tous les tests passent. Il guide la décision sur la meilleure façon d'intégrer le travail : merge direct, pull request avec review, ou cleanup avant intégration. Il présente des options structurées et exécute l'option choisie de manière sécurisée.

## Cas d'usage

- **Fin de feature** : décider comment intégrer une branche de fonctionnalité terminée
- **Pré-merge** : vérifier que tout est prêt avant d'intégrer
- **Cleanup** : nettoyer une branche avant de la merger
- **Workflow d'équipe** : standardiser le processus de finalisation

## Déclencheurs

L'agent planner charge ce skill quand :
- L'implémentation est complète et les tests passent
- L'utilisateur demande comment finaliser et intégrer son travail

## Entrées

- Branche de développement avec le travail terminé
- Résultats des tests (tous passants)
- Historique des commits et diff avec la base

## Sorties

- Options structurées : merge direct, PR, cleanup
- Exécution de l'option choisie (merge, création de PR, etc.)
- Branche intégrée et nettoyée
