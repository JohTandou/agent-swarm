---
title: Tester
description: Génère les tests manquants, exécute la suite, mesure la couverture (seuil 80%) et catégorise les erreurs
order: 7
---

## Rôle

L'agent tester est la première gate qualité du pipeline Swarm. Il génère les tests manquants pour le code modifié, exécute TOUS les tests, mesure la couverture, et catégorise chaque échec pour permettre un retry granulaire. Son seuil de couverture est de 80% — en dessous, la tâche n'est pas validée.

## Responsabilités

- **Génération de tests** : créer les tests unitaires, d'intégration et E2E manquants
- **Exécution** : lancer la suite de tests complète (Jest/Karma + Playwright)
- **Mesure de couverture** : vérifier que le seuil de 80% est atteint
- **Catégorisation des erreurs** : classifier chaque échec (TEST_BUG, CODE_BUG, ENV, FLACKY, etc.)
- **Rapport de test** : produire un rapport JSON structuré avec coverage, failures, retry_target

## Contraintes

- **Additif uniquement** — ne modifie jamais un test existant
- **Si un test legacy est cassé**, il est signalé mais pas corrigé
- **Ne génère pas de tests triviaux** (pas de `expect(true).toBe(true)`)
- **Ignore les failures pré-existantes** — ne bloque pas sur du legacy cassé

## Outils

- Jest / Jasmine / Karma (tests unitaires)
- Playwright (tests E2E)
- Istanbul / coverage reporters
- Parsing de sortie de test

## Routes

| Route | Contexte |
|-------|---------|
| SIMPLE | Si code modifié |
| ADAPT | Si code modifié |
| MEDIUM | Obligatoire (gate qualité) |
| FULL | Obligatoire (gate qualité) |

## Exemple

Tâche MEDIUM : l'agent front a modifié 4 fichiers. Le tester :
1. Génère 12 tests pour `UserService` (non testé)
2. Génère 8 tests pour `UserProfileComponent` (non testé)
3. Exécute la suite complète : 247 tests, 245 passent, 2 échouent
4. Catégorise les 2 échecs : 1 TEST_BUG (test mal écrit, à corriger) + 1 CODE_BUG (race condition)
5. Rapport : coverage 87%, retry_target = CODE_BUG
