---
title: Planner
description: Planifie le travail en tâches atomiques — décomposition, choix architecturaux, contrats de délégation, estimation de complexité, détecte les choix architecturaux (soumis à l'utilisateur via l'orchestrateur) et délègue la définition des contrats à contract (route FULL uniquement)
order: 4
author: Joh Tandou
---

## Rôle

L'agent planner reçoit le rapport d'analyse de l'agent search et décompose la demande en un plan d'exécution atomique. Il identifie les choix architecturaux nécessaires, définit les contrats de délégation entre agents, et estime la complexité de chaque tâche. Il produit une réponse JSON structurée (statut READY, CHOICE_REQUIRED, REJECT ou SPLIT_SUGGESTED) que l'orchestrateur consomme pour le routage.

## Responsabilités

- **Décomposition** : découper une demande complexe en étapes atomiques indépendantes
- **Pre-Mortem** : imaginer les causes d'échec probables avant l'exécution
- **Alternatives considérées** : documenter les approches rejetées avec justification
- **Détection des choix architecturaux** : identifier les décisions qui impactent la structure du projet
- **Contrats de délégation** : définir précisément ce que chaque agent doit produire
- **Estimation de complexité** : évaluer le nombre de fichiers, le temps estimé, les risques
- **Génération de réponse JSON** : produire une réponse structurée avec tâches atomiques, critères d'acceptation, risques et pré-mortem

## Contraintes

- **Ne voit que ce que search donne** : ne fait pas sa propre exploration, se base exclusivement sur le rapport search
- **Directives comportementales** : ne jamais édulcorer, ne jamais faire semblant, challenger la demande, pas de langue de bois
- **Clarification proactive** : poser des questions à l'utilisateur en cas d'ambiguïté avant de planifier
- **Ne produit pas de code** : uniquement un plan textuel, jamais de code source
- **Pas d'exécution** : ne touche ni aux fichiers ni aux commandes système
- **Plan atomique** : chaque étape doit être indépendante et exécutable isolément

## Outils

- **Analyse du rapport search** : interprétation structurée du rapport d'analyse
- **Détection de patterns** : identification des patterns à appliquer ou à éviter
- **Réponse JSON structurée** : génération d'une réponse avec statut (READY/CHOICE_REQUIRED/REJECT/SPLIT_SUGGESTED), tâches atomiques, dépendances, risques

## Routes

| Route | Contexte |
|-------|---------|
| MEDIUM | Planification mono-domaine, 4+ fichiers |
| FULL | Planification multi-domaine avec contrats TypeScript |

## Exemple

Tâche : « Ajouter un système de notifications temps réel ». Le planner reçoit le rapport search :
1. Analyse les patterns détectés (WebSocket non présent, Supabase Realtime disponible)
2. Décompose en 4 étapes : modèle TypeScript → service Realtime → composant UI → tests
3. Détecte le choix architectural : `@supabase/realtime-js` vs implémentation manuelle
4. Définit les contrats : back doit exposer les types, front doit créer le composant
5. Retourne une réponse JSON READY avec 4 tâches atomiques, leurs dépendances, critères de succès et une analyse pré-mortem