---
title: Audit de Sécurité
description: Audit ciblé des vulnérabilités : injection SQL, injection de prompt, empoisonnement de contexte
category: audit
order: 9
author: Joh Tandou
---

## Rôle

L'audit de sécurité se concentre exclusivement sur trois classes de vulnérabilités critiques : l'injection SQL (requêtes non paramétrées, ORM mal configuré), l'injection de prompt (LLM prompts manipulables par l'utilisateur, jailbreaking) et l'empoisonnement de contexte (manipulation de la mémoire contextuelle des agents, données externes non fiables). Il ne couvre pas les autres vecteurs d'attaque.

## Cas d'usage

- **Sécurisation LLM** : vérifier qu'un agent conversationnel n'est pas vulnérable aux injections de prompt
- **Audit base de données** : détecter les requêtes SQL vulnérables aux injections
- **Protection du contexte** : s'assurer que le contexte des agents ne peut pas être empoisonné par des données externes
- **Revue de code ciblée** : focus exclusif sur ces trois vulnérabilités

## Déclencheurs

L'agent planner charge ce skill quand :
- Un audit de sécurité ciblé injection SQL, prompt ou contexte est demandé
- L'utilisateur exprime une préoccupation spécifique sur ces trois vecteurs

## Entrées

- Codebase (requêtes SQL, handlers LLM, gestion de contexte)
- Configuration des APIs et intégrations externes
- Logs de sécurité si disponibles

## Sorties

- Rapport de vulnérabilités classées par sévérité (critique, haute, moyenne)
- Correctifs techniques précis pour chaque vulnérabilité détectée
- Recommandations de durcissement pour prévenir les régressions
