---
title: Création de Documentation
description: Génère une documentation technique complète : architecture, stack, structure, APIs, modèles de données, configuration, déploiement
category: creation
order: 13
---

## Rôle

Le skill documentation-create génère un fichier TECHNICAL_DOCUMENTATION.md exhaustif pour le projet dans le répertoire courant. Il couvre l'architecture logicielle, la stack technique, la structure du projet, les APIs exposées, les modèles de données, la configuration, le déploiement et l'onboarding des développeurs. Le document est structuré pour servir de référence unique aux équipes techniques.

## Cas d'usage

- **Nouveau projet** : créer la documentation technique initiale
- **Onboarding développeur** : fournir une référence complète aux nouveaux membres
- **Due diligence** : documenter un projet avant transfert ou audit
- **Open source** : préparer la documentation pour une publication publique

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur demande la génération de documentation technique complète
- Une tâche de documentation exhaustive est assignée

## Entrées

- Codebase complet du projet
- Fichiers de configuration et scripts de build
- Documentation existante partielle

## Sorties

- Fichier TECHNICAL_DOCUMENTATION.md complet et structuré
- Sections : architecture, stack, structure, APIs, data models, config, déploiement, onboarding
- Document maintenable et facile à mettre à jour
