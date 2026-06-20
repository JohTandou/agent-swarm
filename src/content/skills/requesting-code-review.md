---
title: Demande de Code Review
description: Demande de code review après complétion de tâches ou fonctionnalités majeures, avant merge
category: workflow
order: 20
author: Joh Tandou
---

## Rôle

Le skill requesting-code-review prépare et soumet une demande de code review quand une tâche ou une fonctionnalité majeure est terminée. Il vérifie que le travail est effectivement prêt pour la review (tests passants, build OK, pas de code mort), prépare un résumé clair des changements, et initie le processus de review selon les conventions du projet.

## Cas d'usage

- **Fin de tâche** : demander une review après avoir terminé une implémentation
- **Fonctionnalité majeure** : s'assurer qu'une feature complexe est revue avant merge
- **Pré-merge** : dernière vérification avant intégration dans la branche principale
- **Workflow standard** : systématiser les demandes de review dans l'équipe

## Déclencheurs

L'agent planner charge ce skill quand :
- Une tâche ou fonctionnalité majeure est terminée
- L'utilisateur veut faire vérifier son travail avant de merger

## Entrées

- Code modifié (diff, commits, fichiers changés)
- Résultats des tests et du build
- Description de la tâche ou fonctionnalité implémentée

## Sorties

- Vérification pré-review (tests, build, code mort)
- Résumé structuré des changements pour le reviewer
- Demande de review initiée selon les conventions du projet
