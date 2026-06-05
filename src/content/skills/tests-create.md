---
title: Tests Create
description: Génère des tests unitaires, fonctionnels, d'intégration et E2E optimaux pour l'application
category: creation
order: 2
---

## Rôle

Tests Create analyse le codebase pour identifier toutes les unités testables, puis génère des fichiers de test complets en suivant les conventions existantes du projet. Il couvre les tests unitaires (Jest/Jasmine), les tests d'intégration, et les tests E2E (Playwright).

## Cas d'usage

- **Générer** les tests manquants pour un nouveau composant
- **Compléter** la couverture d'une feature existante
- **Migrer** des tests d'un framework à un autre
- **Auditer** la qualité des tests existants

## Déclencheurs

L'agent tester charge ce skill automatiquement quand :
- Du nouveau code est détecté sans tests correspondants
- La couverture est en dessous du seuil de 80%
- L'utilisateur demande explicitement des tests

## Entrées

- Fichiers source à tester
- Configuration de test existante (jest.config, karma.conf, playwright.config)
- Conventions de test du projet

## Sorties

- Fichiers `.spec.ts` avec tests unitaires
- Fichiers `.e2e.spec.ts` avec tests E2E
- Rapport de couverture
