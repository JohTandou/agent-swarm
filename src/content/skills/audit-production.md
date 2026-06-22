---
title: Audit Production-Readiness
description: Vérification exhaustive de la readiness pour la production : sécurité, fiabilité, performance, observabilité, infrastructure
category: audit
order: 8
author: Joh Tandou
---

## Rôle

L'audit de production-readiness vérifie qu'une application est véritablement prête pour un déploiement en production. Il couvre la sécurité (vulnérabilités, bonnes pratiques), la fiabilité (gestion d'erreurs, résilience), la performance (temps de réponse, optimisation), l'observabilité (logs, monitoring, alerting) et l'infrastructure (scalabilité, déploiement, rollback).

## Cas d'usage

- **Pré-lancement** : dernière vérification avant mise en production
- **Incident post-mortem** : analyser pourquoi une application a échoué en production
- **Amélioration infrastructure** : identifier les faiblesses de l'infrastructure actuelle
- **Revue de sécurité** : coupler sécurité et fiabilité dans un même audit

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur veut vérifier si son application est prête pour la production
- Une question de fiabilité, sécurité ou performance en production est posée

## Entrées

- Configuration de déploiement (Docker, K8s, Vercel, etc.)
- Codebase backend et frontend
- Logs et métriques de production si disponibles

## Sorties

- Rapport de readiness avec score global et par dimension
- Liste des blocages critiques avant mise en production
- Plan d'action pour atteindre le niveau de production-readiness requis
