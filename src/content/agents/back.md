---
title: Back
description: Implémente le backend, génère scripts/crons/configs, respecte la spec OpenAPI — inactif sur ce projet
order: 6
---

## Rôle

L'agent back implémente la logique serveur : APIs REST, scripts, crons, configurations. Il respecte strictement la spécification OpenAPI définie par l'agent contract sur la route FULL. Sur les routes SIMPLE/ADAPT/MEDIUM, il génère des scripts et configurations autonomes.

> ⚠️ **Sur Swarm Wiki, l'agent back est inactif.** Ce projet est 100% statique (Angular, pas de backend).

## Responsabilités

- **Implémentation d'APIs** : endpoints REST selon la spec OpenAPI
- **Scripts et crons** : tâches automatisées, jobs planifiés
- **Configuration** : variables d'environnement, fichiers de config
- **Migrations** : appliquer les migrations Supabase définies par contract
- **Tests d'intégration** : tester les endpoints et la logique métier

## Contraintes

- **Respect absolu de la spec OpenAPI** sur la route FULL
- **S'appuie sur context7** pour la documentation des frameworks backend
- **Dépend de Supabase MCP** pour le schéma DB — si Supabase est down, l'agent est bloqué
- **Déclenché uniquement si le projet a un backend**

## Outils

- FastAPI / Python (framework principal)
- Supabase MCP (base de données)
- context7 (documentation)
- uvicorn (serveur)

## Routes

| Route | Contexte |
|-------|---------|
| SIMPLE | Scripts, configs, crons |
| ADAPT | Backend mono-fichier |
| MEDIUM | Backend multi-fichiers |
| FULL | Parallèle avec front, respecte contrats |

## Exemple

Tâche : « Ajoute un endpoint d'upload de fichier ». L'agent back :
1. Lit la spec OpenAPI : `POST /api/upload` avec multipart/form-data
2. Implémente l'endpoint avec validation du type MIME et limite de taille
3. Ajoute le stockage Supabase Storage
4. Écrit les tests d'intégration (fichier valide, type invalide, taille excessive)
5. Lance `pytest` → 12/12 PASS
