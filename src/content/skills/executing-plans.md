---
title: Exécution de Plans
description: Exécute un plan d'implémentation écrit dans une session séparée avec des points de contrôle de revue
category: workflow
order: 17
---

## Rôle

Le skill executing-plans prend en charge l'exécution d'un plan d'implémentation préalablement écrit. Il lit le plan, le découpe en étapes atomiques, exécute chaque étape dans l'ordre, et marque des points de contrôle (review checkpoints) où une validation est requise avant de continuer. Ce skill garantit que l'exécution reste fidèle au plan et que chaque jalon est validé.

## Cas d'usage

- **Plan complexes** : exécuter un plan d'implémentation multi-étapes
- **Revues incrémentales** : valider chaque étape avant de passer à la suivante
- **Travail asynchrone** : reprendre l'exécution d'un plan écrit dans une session précédente
- **Traçabilité** : garder un historique clair de ce qui a été fait et validé

## Déclencheurs

L'agent planner charge ce skill quand :
- Un plan d'implémentation écrit doit être exécuté
- L'utilisateur référence un plan existant à dérouler

## Entrées

- Plan d'implémentation écrit (fichier ou document)
- Contexte du projet et codebase actuel
- Critères de succès pour chaque étape

## Sorties

- Exécution étape par étape avec validation à chaque point de contrôle
- Rapport d'avancement après chaque jalon
- Livrables conformes au plan initial
