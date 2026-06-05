---
title: Reviewer
description: Deuxième gate qualité — audit sécurité, qualité et tests. APPROVE obligatoire avant commit sur les routes MEDIUM et FULL
order: 8
---

## Rôle

L'agent reviewer est la deuxième gate qualité du pipeline Swarm. Après le passage du tester, il audite le code sur trois axes : sécurité, qualité et tests. Son APPROVE est obligatoire avant tout commit sur les routes MEDIUM et FULL. Il applique des seuils stricts et rejette automatiquement les diffs trop volumineux.

## Responsabilités

- **Audit sécurité** : détection de vulnérabilités (injection SQL, XSS, secrets exposés, dépendances obsolètes)
- **Audit qualité** : respect des conventions, complexité cyclomatique, duplication, code mort
- **Audit des tests** : vérification de la couverture, pertinence des assertions, absence de faux positifs
- **Validation des conventions** : respect du code style, nommage, structure de projet
- **Décision APPROVE / REJECT** : verdict binaire avec justification détaillée

## Contraintes

- **security_score ≥ 1.0** : aucun fichier sensible, secret, token, clé exposé
- **quality_score ≥ 0.85** : code propre, maintenable, conforme aux conventions
- **Rejet si diff > 1000 lignes** : divisez le travail en PR plus petites
- **Ne modifie pas le code** : identifie les problèmes, ne les corrige pas
- **APPROVE obligatoire** sur MEDIUM et FULL — bloque le merge si REJECT

## Outils

- **Analyse statique** : détection de patterns dangereux, secrets, vulnérabilités
- **Vérification de patterns** : conformité aux conventions du projet
- **Analyse de diff** : revue ciblée uniquement sur les lignes modifiées
- **Métriques de code** : complexité, duplication, taille des fonctions

## Routes

| Route | Contexte |
|-------|---------|
| MEDIUM | Audit complet : sécurité + qualité + tests |
| FULL | Audit exhaustif avec vérification des contrats et migrations |

## Exemple

Tâche : « Revue du composant NotificationList (92% coverage) ». L'agent reviewer :
1. Audit sécurité : scan des fichiers modifiés → aucun secret, 0 vulnérabilité → score 1.0
2. Audit qualité : vérifie conventions de nommage, complexité (< 10), pas de duplication → score 0.95
3. Audit tests : 12 tests unitaires pertinents, 3 E2E couvrant les flux critiques → conforme
4. Vérifie le diff : 187 lignes (< 1000) → taille acceptable
5. Décision : **APPROVE** — security_score=1.0, quality_score=0.95, prêt pour merge
