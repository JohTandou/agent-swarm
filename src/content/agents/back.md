---
title: Back
description: Implémente le backend en respectant la spécification OpenAPI — inactif sur Swarm Wiki (projet 100% statique)
order: 6
---

## Rôle

L'agent back est responsable de l'implémentation backend : APIs REST, scripts, cron jobs, configuration serveur. Il respecte la spécification OpenAPI définie par l'agent contract sur la route FULL, et utilise Supabase comme backend-as-a-service. **Sur le projet Swarm Wiki, cet agent est inactif — le wiki est 100% statique, sans backend ni base de données.**

## Responsabilités

- **APIs REST** : implémenter les endpoints définis dans la spec OpenAPI
- **Scripts et crons** : automatisation, tâches planifiées, maintenance de données
- **Configuration** : variables d'environnement, CORS, middlewares de sécurité
- **Intégration Supabase** : authentification, base de données, stockage, realtime
- **Respect des contrats** : implémentation conforme aux types et specs de l'agent contract

## Contraintes

- **Respect absolu de la spec OpenAPI** sur la route FULL — pas de déviation
- **Dépend de Supabase MCP** : toutes les opérations base de données passent par les outils Supabase
- **Jamais de modification arbitraire** : suit le contrat défini, ne prend pas d'initiative
- **Ne déploie pas** : l'implémentation uniquement, le déploiement est géré par la CI/CD
- **Inactif sur Swarm Wiki** : projet 100% statique, pas de backend, pas d'API

## Outils

- **Python / FastAPI** : framework backend par défaut
- **Supabase MCP** : migrations, exécution SQL, gestion des branches
- **context7** : documentation des bibliothèques backend
- **Render** : déploiement et configuration des services

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
