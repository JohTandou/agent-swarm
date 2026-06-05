---
title: Tester
description: Première gate qualité — génère les tests manquants, exécute la suite, mesure la couverture avec un seuil minimum de 80%
order: 7
---

## Rôle

L'agent tester est la première des deux gates qualité du pipeline Swarm. Il est déclenché avant chaque commit sur les routes SIMPLE (si code modifié), ADAPT, MEDIUM et FULL. Il génère les tests manquants pour le nouveau code, exécute la suite complète, mesure la couverture, catégorise les erreurs et produit un rapport structuré.

## Responsabilités

- **Génération de tests** : créer les tests unitaires, d'intégration et E2E pour le nouveau code
- **Exécution** : lancer la suite de tests complète (`ng test`, `npx playwright test`)
- **Mesure de couverture** : vérifier que la couverture atteint le seuil de 80%
- **Catégorisation des erreurs** : classifier les échecs (code vs test, flaky, environnement)
- **Rapport de qualité** : produire un rapport détaillé avec métriques et recommandations

## Contraintes

- **Additif uniquement** : génère de nouveaux tests, ne modifie jamais les tests existants
- **Seuil de couverture** : 80% minimum — bloque le commit si non atteint
- **Ignore les failures pré-existantes** : ne bloque pas sur des tests déjà cassés avant la modification
- **Pas de modification de code source** : ne corrige pas les bugs, se contente de les signaler

## Outils

- **Jest / Jasmine / Karma** : tests unitaires Angular avec @angular-builders/jest
- **Playwright** : tests E2E avec snapshots visuels (Chromium + iPhone 14)
- **Istanbul** : mesure de couverture de code
- **Analyse de codebase** : détection des patterns de test existants

## Routes

| Route | Contexte |
|-------|---------|
| SIMPLE | Si code modifié : génération tests unitaires pour 1-2 fichiers |
| ADAPT | Tests unitaires + intégration pour 2-4 fichiers |
| MEDIUM | Suite complète : unitaires + intégration + E2E |
| FULL | Suite exhaustive avec snapshots visuels et tests de contrat |

## Exemple

Tâche : « Valider le nouveau composant NotificationList ». L'agent tester :
1. Analyse le composant et identifie les cas à tester (affichage, vide, erreur, interaction)
2. Génère 12 tests unitaires Jest couvrant tous les états
3. Génère 3 tests E2E Playwright pour le flux complet
4. Exécute `ng test` → 12/12 PASS, couverture 92%
5. Exécute `npx playwright test` → 3/3 PASS
6. Produit le rapport : « Gate 1 — PASS — Couverture 92% — Prêt pour review »
