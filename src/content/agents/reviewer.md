---
title: Reviewer
description: Gate de sécurité et qualité — vérifie le code ET les tests avant commit sur les routes MEDIUM/FULL
order: 8
---

## Rôle

L'agent reviewer est la deuxième gate qualité du pipeline Swarm. Après le tester, il audite le code modifié ET les tests générés. Il vérifie la sécurité, la qualité, les conventions, et la couverture de test. Son APPROVE est obligatoire avant tout commit sur les routes MEDIUM et FULL.

## Responsabilités

- **Audit de sécurité** : injection, secrets exposés, CSRF, auth manquante
- **Audit de qualité** : code mort, magic numbers, nommage, complexité, conventions
- **Audit des tests** : tests triviaux, fichiers non testés, assertions insuffisantes
- **Vérification des conventions** : palette, typographie, standalone, control flow
- **Décision** : APPROVE (merge autorisé) ou REJECT (liste précise des corrections)

## Contraintes

- **Intervient uniquement sur MEDIUM et FULL** — SIMPLE et ADAPT committent directement
- **Ne peut pas approuver si security_score < 1.0**
- **Ne peut pas approuver si quality_score < 0.85**
- **Rejette automatiquement** si diff > 1000 lignes ou > 30 fichiers
- **Le retry_target détermine** quel agent doit corriger (FRONT, BACK, TEST)

## Outils

- Analyse statique de code
- Vérification de patterns (regex, AST)
- Audit de dépendances (npm audit)
- Vérification de couverture de test

## Routes

| Route | Contexte |
|-------|---------|
| MEDIUM | Obligatoire (gate qualité) |
| FULL | Obligatoire (gate qualité) |

## Exemple

Après implémentation d'une feature MEDIUM :
1. Vérifie la sécurité : pas d'injection, pas de secrets → security_score 1.0 ✅
2. Vérifie la qualité : 2 magic numbers, 1 import inutilisé → quality_score 0.88 ✅
3. Vérifie les tests : 34 tests, 0 triviaux, tous les fichiers couverts → test_audit OK ✅
4. Décision : APPROVE
5. Le code peut être commité et mergé
