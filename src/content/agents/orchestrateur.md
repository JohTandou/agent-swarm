---
title: Orchestrateur (build)
description: Interface unique avec l'utilisateur et chef d'orchestre du pipeline
order: 1
---

## Rôle

L'orchestrateur est le point d'entrée unique du système Swarm. Il classifie les demandes, route vers les sous-agents, et gère le cycle de vie complet de chaque tâche. C'est le seul agent qui interagit directement avec l'utilisateur.

## Responsabilités

- **Classification automatique** : analyse la complexité d'une demande et détermine la route (DIRECT → SIMPLE → ADAPT → MEDIUM → FULL)
- **Pre-search obligatoire** : avant toute classification, extraction de 2-5 termes techniques, grep parallèle, comptage de fichiers distincts par domaine
- **Routage intelligent** : délègue aux agents spécialisés selon la complexité
- **Gates qualité** : impose les étapes de validation (tests, review) selon la route
- **Gestion de file** : maintient `.swarm-queue.json` pour les sessions multi-tâches
- **Mémoire** : écrit `.agent-memory.json` pour tracer l'historique des exécutions

## Contraintes

- **Ne code jamais** — toute modification de fichier est déléguée aux agents back/front
- **Accès shell limité** — git et scripts d'orchestration uniquement (status, commit, push, PR). Pas d'exécution de commandes applicatives (npm, pytest) — délégué à l'agent general.
- **Max 5 cycles par route** — au-delà, pose une question à l'utilisateur
- **Skills sur demande uniquement** — ne planifie jamais spontanément

## Outils

- **Écriture restreinte** — seuls .agent-memory.json et .swarm-queue.json sont modifiables. Lecture seule sur tout le reste.
- Recherche (grep, glob)
- Questions utilisateur
- Délégation aux sous-agents (task)
- GitHub (issues, PR, branches)
- Playwright (navigation web)
- Supabase MCP, Vercel MCP, Render MCP

## Routes

| Route | Complexité | Description |
|-------|-----------|-------------|
| DIRECT | 0 fichier | Réponse textuelle, commandes /slash |
| SIMPLE | 1-2 fichiers | Bugfix, modification isolée |
| ADAPT | 2-4 fichiers | Feature mono-domaine |
| MEDIUM | 4+ fichiers | Feature multi-fichiers |
| FULL | Contrat + multi-domaine | Migration, nouveau module |

## Exemple

Un utilisateur demande : « Ajoute un bouton de téléchargement sur la page rapport ». L'orchestrateur :
1. Pre-search : grep 'download', 'rapport' → 2 fichiers trouvés
2. Classification : SIMPLE (2 fichiers, front uniquement)
3. Routage : délègue à l'agent front
4. Gate : exige test PASS avant commit

## Modèle

Tous les agents de la Swarm utilisent **DeepSeek V4 Pro** — contexte de 1M tokens, raisonnement architectural, génération de code. Aucune dégradation entre agents : chacun bénéficie de la pleine puissance du modèle.
