---
title: Personnalisation OpenCode
description: Édition de la configuration OpenCode : opencode.json, .opencode/, agents, subagents, skills, plugins, MCP, permissions
category: workflow
order: 15
author: Joh Tandou
---

## Rôle

Le skill customize-opencode permet d'éditer et de créer la configuration d'OpenCode elle-même. Il couvre la modification du fichier opencode.json (ou opencode.jsonc), la gestion des fichiers sous .opencode/, la création et la correction des agents, subagents, skills, plugins, serveurs MCP et règles de permissions. Ce skill est réservé à la configuration d'OpenCode, pas au code applicatif de l'utilisateur.

## Cas d'usage

- **Création d'agent** : définir un nouvel agent avec ses règles et permissions
- **Configuration MCP** : ajouter ou modifier des serveurs MCP
- **Gestion des skills** : créer, éditer ou supprimer des skills personnalisés
- **Permissions** : ajuster les règles de sécurité et d'accès des agents

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur édite ou crée la configuration d'OpenCode
- Une modification des agents, skills, plugins ou permissions OpenCode est demandée

## Entrées

- Fichiers de configuration OpenCode (opencode.json, .opencode/)
- Structure existante des agents, skills et plugins
- Règles de permission actuelles

## Sorties

- Configuration OpenCode modifiée et validée
- Nouveaux agents, skills ou plugins fonctionnels
- Règles de permission mises à jour et sécurisées
