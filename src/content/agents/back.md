---
title: Back
description: Implémente le backend en respectant la spécification OpenAPI — scripts, crons et configuration serveur
order: 6
author: Joh Tandou
---

## Rôle

L'agent back est responsable de l'implémentation backend : APIs REST, scripts, cron jobs, configuration serveur. Il respecte la spécification OpenAPI définie par l'agent contract sur la route FULL, et utilise Supabase comme backend-as-a-service.

## Responsabilités

- **APIs REST** : implémenter les endpoints définis dans la spec OpenAPI
- **Scripts et crons** : automatisation, tâches planifiées, maintenance de données
- **Configuration** : variables d'environnement, CORS, middlewares de sécurité
- **Intégration Supabase** : authentification, base de données, stockage, realtime
- **Respect des contrats** : implémentation conforme aux types et specs de l'agent contract
- **Sécurité** : validation des inputs, jamais de secrets hardcodés, error handling explicite, rate limiting
- **Règle absolue** : ne crée JAMAIS de migrations DB — elles viennent exclusivement de contract

## Contraintes

- **Respect absolu de la spec OpenAPI** sur la route FULL — pas de déviation
- **Supabase MCP en lecture seule** (list_tables, get_table) — ne modifie jamais la DB. Les migrations sont exclusivement fournies par l'agent contract.
- **Jamais de modification arbitraire** : suit le contrat défini, ne prend pas d'initiative
- **Ne déploie pas** : l'implémentation uniquement, le déploiement est géré par la CI/CD
- **Inactif sur Swarm Wiki** : projet 100% statique, pas de backend, pas d'API

## Outils

- **Multi-langage** : s'adapte au stack du projet (Python/FastAPI, Node/Express, Go, Rust). Aucun framework imposé.
- **Supabase MCP** : migrations, exécution SQL, gestion des branches
- **context7** : documentation des bibliothèques backend

## Routes

| Route | Contexte |
|-------|---------|
| SIMPLE | Modification de script isolé, config |
| ADAPT | Nouveau endpoint simple, feature CRUD basique |
| MEDIUM | API multi-endpoints, logique métier complexe |
| FULL | Parallèle avec front, respecte les contrats OpenAPI |

## Exemple

Tâche : « Créer l'API de gestion des notifications ». L'agent back :
1. Lit la spec OpenAPI fournie par l'agent contract
2. Implémente les endpoints : `POST /api/notifications`, `GET /api/notifications`
3. Crée un script cron de nettoyage des notifications expirées
4. Configure les variables d'environnement (clé Supabase, limites de rate)
5. Valide que l'implémentation respecte exactement la spec OpenAPI