---
title: Mise à Jour de Documentation
description: Met à jour TECHNICAL_DOCUMENTATION.md, README.md et PROPOSITION_VALEUR.md en détectant la dérive entre la documentation et le code
category: documentation
order: 23
---

## Rôle

Le skill documentation-update maintient la documentation du projet en synchronisation avec le code. Il détecte la dérive entre les fichiers de documentation (TECHNICAL_DOCUMENTATION.md, README.md, PROPOSITION_VALEUR.md) et l'état réel du codebase, puis applique des corrections chirurgicales pour réaligner la documentation, tout en préservant la structure et le style existants de chaque fichier.

## Cas d'usage

- **Après un sprint** : mettre à jour la documentation après plusieurs semaines de développement
- **Pré-release** : vérifier que la documentation reflète la version livrée
- **Nouveau contributeur** : s'assurer que la doc est fiable pour l'onboarding
- **Audit documentation** : détecter et corriger les informations obsolètes

## Déclencheurs

L'agent planner charge ce skill quand :
- La documentation doit être réalignée avec le code
- L'utilisateur constate des incohérences dans la documentation

## Entrées

- Fichiers de documentation existants (TECHNICAL_DOCUMENTATION.md, README.md, PROPOSITION_VALEUR.md)
- Codebase actuel
- Historique des modifications récentes

## Sorties

- Analyse de dérive : sections obsolètes, manquantes, incorrectes
- Fichiers de documentation mis à jour et réalignés
- Rapport des modifications apportées à chaque fichier
