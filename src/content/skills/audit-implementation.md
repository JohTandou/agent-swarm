---
title: Audit d'Implémentation
description: Vérifie l'alignement entre PROPOSITION_VALEUR.md et le codebase réel (backend et frontend)
category: audit
order: 6
author: Joh Tandou
---

## Rôle

L'audit d'implémentation confronte la proposition de valeur documentée (PROPOSITION_VALEUR.md) à la réalité du codebase. Il identifie les fonctionnalités promises mais absentes, les implémentations partielles, et les divergences entre la vision produit et le code livré, tant côté backend que frontend.

## Cas d'usage

- **Alignement produit-code** : vérifier que ce qui est vendu est réellement implémenté
- **Dette fonctionnelle** : identifier les fonctionnalités documentées mais non livrées
- **Roadmap validation** : prioriser les développements en fonction des écarts constatés
- **Communication équipe** : aligner la vision produit avec l'état réel du code

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur veut vérifier l'alignement entre sa proposition de valeur et son code
- Une question de couverture fonctionnelle est soulevée

## Entrées

- PROPOSITION_VALEUR.md (source de vérité métier)
- Codebase frontend et backend
- Documentation technique (ARCHITECTURE.md, API.md)

## Sorties

- Matrice de couverture : fonctionnalité promise → statut d'implémentation
- Rapport d'écarts avec sévérité (critique, majeur, mineur)
- Recommandations pour combler les écarts identifiés
