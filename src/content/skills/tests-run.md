---
title: Exécution des Tests
description: Exécute tous les tests de l'application, détecte l'infrastructure de test, analyse les échecs et produit un rapport avec correctifs actionnables
category: creation
order: 14
---

## Rôle

Le skill tests-run exécute l'ensemble des tests de l'application dans le répertoire courant. Il détecte automatiquement l'infrastructure de test en place (Jest, Vitest, Playwright, Cypress, etc.), lance les tests unitaires, fonctionnels, d'intégration et E2E, analyse chaque échec de manière granulaire, et produit un rapport clair avec des correctifs actionnables pour chaque erreur.

## Cas d'usage

- **CI/CD** : exécuter la suite de tests dans un pipeline
- **Pré-commit** : valider qu'aucune régression n'a été introduite
- **Debug collectif** : obtenir un rapport consolidé de tous les échecs
- **Couverture** : mesurer la couverture de test et identifier les zones non testées

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur demande l'exécution des tests
- Une vérification de la qualité du code est nécessaire avant merge

## Entrées

- Codebase avec tests existants
- Configuration des frameworks de test
- Seuil de couverture configuré

## Sorties

- Rapport d'exécution : tests passés, échoués, ignorés
- Analyse détaillée de chaque échec avec stack trace
- Correctifs actionnables pour chaque catégorie d'erreur
- Métriques de couverture par module
