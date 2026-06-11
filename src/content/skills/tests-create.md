---
title: Tests Create (qualité)
description: Génération optimale de tests unitaires, fonctionnels, intégration et E2E
category: creation
order: 2
---

## Rôle

Tests Create analyse le codebase pour identifier toutes les unités testables, puis génère des fichiers de test complets en suivant les conventions et l'infrastructure de test existantes du projet.

## Types de tests générés

### Tests unitaires
- Fonctions pures, services, utilitaires
- Composants isolés avec mocks
- Pipes, directives, guards
- Couverture des cas limites et erreurs

### Tests fonctionnels
- Flux métier complets
- Scénarios utilisateur bout en bout
- Validation des règles métier

### Tests d'intégration
- Communication entre services
- Interactions composants parents/enfants
- Intégration avec les APIs et bases de données

### Tests E2E
- Parcours utilisateur complets
- Navigation multi-pages
- Validation cross-browser

## Conventions respectées

- Framework de test existant (Jest, Playwright, Cypress, etc.)
- Conventions de nommage du projet
- Structure de fichiers et dossiers
- Patterns de mock et fixtures
- Seuil de couverture configuré (80% minimum)

## Processus

1. Analyse du codebase pour identifier les unités testables
2. Détection du framework de test existant
3. Génération des fichiers de test avec la bonne structure
4. Inclusion des cas de test pertinents (happy path, edge cases, erreurs)
5. Configuration des mocks et stubs nécessaires

## Exemple

```typescript
// Généré automatiquement pour un service Angular
describe('ContentService', () => {
  it('devrait charger un document Markdown', () => {
    // Test avec mock HttpClient
  });

  it('devrait gérer les erreurs de chargement', () => {
    // Test du cas d'erreur
  });
});
```
