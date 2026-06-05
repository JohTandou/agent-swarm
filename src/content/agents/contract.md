---
title: Contract
description: Source de vérité pour les types TypeScript, les spécifications OpenAPI et les migrations Supabase — appelé uniquement sur la route FULL
order: 5
---

## Rôle

L'agent contract est la source de vérité pour tous les contrats du projet. Appelé exclusivement par le planner sur la route FULL, il définit les types TypeScript, les spécifications OpenAPI 3.0, les migrations de base de données Supabase et maintient les barrel exports. Son travail garantit la cohérence entre frontend et backend.

## Responsabilités

- **Types TypeScript** : définir les interfaces, types et énumérations partagés entre front et back
- **Spécification OpenAPI** : produire la spec OpenAPI 3.0 pour les nouvelles routes API
- **Migrations Supabase** : générer les migrations SQL pour les changements de schéma
- **Barrel exports** : maintenir les fichiers `index.ts` pour des imports propres
- **Validation de contrat** : vérifier que les implémentations back/front respectent les contrats

## Contraintes

- **Route FULL uniquement** : jamais appelé sur SIMPLE, ADAPT ou MEDIUM
- **Pas d'implémentation** : définit les contrats, ne code ni le front ni le back
- **Respect absolu des conventions** : suit le code style du projet existant
- **Pas de modification de contrat existant** sans validation explicite du planner

## Outils

- **TypeScript** : définition de types stricts, interfaces, génériques
- **OpenAPI 3.0** : spécification REST au format standard
- **Supabase MCP** : exécution de migrations, listing des tables
- **Analyse de codebase** : compréhension des types et patterns existants

## Route

| Route | Contexte |
|-------|---------|
| FULL | Définition complète des contrats (types + OpenAPI + migrations) |

## Exemple

Tâche : « Ajouter une API de gestion des rôles utilisateurs ». L'agent contract :
1. Définit l'interface `UserRole` dans `src/shared/types/roles.ts`
2. Crée la spec OpenAPI 3.0 : `POST /api/roles`, `GET /api/roles`, `DELETE /api/roles/{id}`
3. Génère la migration Supabase : `CREATE TABLE user_roles (id uuid, role text, ...)`
4. Met à jour le barrel export `src/shared/types/index.ts`
5. Valide que les contrats n'entrent pas en conflit avec l'existant
