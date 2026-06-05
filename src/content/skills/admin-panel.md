---
title: Panel d'Administration
description: Génère un panel d'administration complet et prêt pour la production : CRUD, analytics, gestion utilisateurs, contrôle d'accès par rôles
category: creation
order: 11
---

## Rôle

Le skill admin-panel analyse le codebase existant (backend, base de données, API, authentification) et génère un panel d'administration complet. Il inclut les opérations CRUD sur toutes les entités, des tableaux de bord analytiques, la gestion des utilisateurs et un contrôle d'accès basé sur les rôles (RBAC). Le résultat est un dashboard prêt pour la production, adapté à l'architecture du projet.

## Cas d'usage

- **Nouveau projet** : scaffolder un panel admin complet en une commande
- **Projet existant** : ajouter une interface d'administration à une API déjà en place
- **Migration** : remplacer un panel admin legacy par une version moderne
- **Prototypage rapide** : obtenir une interface de gestion fonctionnelle en quelques minutes

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur demande la génération d'un panel d'administration
- Une tâche d'interface de gestion backend est assignée

## Entrées

- Codebase existant (backend, schéma de base de données, API)
- Configuration d'authentification et rôles
- Spécifications des entités à administrer

## Sorties

- Dashboard admin complet avec CRUD pour chaque entité
- Pages d'analytics avec graphiques et métriques
- Gestion des utilisateurs et contrôle d'accès RBAC
- Code intégré et prêt pour la production
