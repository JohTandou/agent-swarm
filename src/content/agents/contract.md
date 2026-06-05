---
title: Contract
description: Écrit les types TypeScript, la spec OpenAPI et les migrations Supabase — source de vérité absolue
order: 5
---

## Rôle

L'agent contract est la source de vérité pour les types et les interfaces. Il définit les contrats TypeScript que front et back doivent respecter, écrit la spécification OpenAPI pour les APIs, et génère les migrations Supabase. Appelé uniquement sur la route FULL par le planner.

## Responsabilités

- **Types TypeScript** : définir les interfaces, types, enums partagés entre front et back
- **Spécification OpenAPI** : documenter les endpoints REST avec schémas de requête/réponse
- **Migrations Supabase** : générer les scripts DDL (tables, index, RLS)
- **Barrel exports** : maintenir les fichiers index.ts pour des imports propres
- **Validation de cohérence** : vérifier que les types sont utilisés correctement par front et back

## Contraintes

- **Appelé uniquement sur la route FULL** — jamais sur SIMPLE, ADAPT ou MEDIUM
- **Appelé par le planner**, jamais directement
- **Les types sont la source de vérité** — front et back DOIVENT s'y conformer
- **Pas d'implémentation** — uniquement des définitions

## Outils

- TypeScript (interfaces, types, enums)
- OpenAPI 3.0 (spec YAML/JSON)
- Supabase MCP (migrations DDL)
- Validation de schéma

## Routes

| Route | Contexte |
|-------|---------|
| FULL | Contrat + multi-domaine (appelé par planner) |

## Exemple

Tâche FULL : « Ajoute un système de commentaires avec API ». L'agent contract :
1. Définit l'interface `Comment` (id, authorId, content, createdAt, postId)
2. Écrit le endpoint OpenAPI `POST /api/comments` avec schéma de requête
3. Génère la migration Supabase : table `comments` avec foreign keys et RLS
4. Exporte tout dans `src/app/shared/models/index.ts`
5. Front et back implémentent ensuite en parallèle, chacun lié par le contrat
