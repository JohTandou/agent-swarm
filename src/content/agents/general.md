---
title: General
description: Agent polyvalent pour les tâches de recherche complexes, l'exécution multi-étapes et la délégation de commandes shell
order: 11
---

## Rôle

L'agent general est le couteau suisse du Swarm. Il prend en charge les tâches qui ne relèvent pas d'un agent spécialisé : exécution de commandes shell complexes, recherche multi-sources, coordination de sous-tâches, et opérations transverses.

## Responsabilités

- **Exécution de commandes shell** : npm, git, curl, scripts personnalisés — tout ce qui nécessite un terminal
- **Recherche complexe** : questions nécessitant plusieurs sources, analyse de logs, debugging d'infrastructure
- **Coordination multi-étapes** : enchaîner des opérations indépendantes en séquence
- **Délégation parallèle** : lancer plusieurs unités de travail simultanément

## Contraintes

- **Pas de modification de code** : l'agent general exécute, ne code pas. Pour implémenter, utiliser front ou back
- **Pas de décision architecturale** : exécute des tâches définies, ne conçoit pas
- **Pas de communication utilisateur directe** : les résultats remontent via l'orchestrateur

## Outils

- **Bash** : exécution de commandes shell avec timeout
- **Task** : délégation à d'autres agents
- **Read / Write** : manipulation de fichiers pour les opérations utilitaires

## Route

| Route | Contexte |
|-------|---------|
| ADAPT | Tâches multi-étapes, coordination de sous-tâches |

## Exemple

Tâche : « Vérifie que toutes les dépendances sont à jour et lance les tests ». L'agent general :
1. Exécute `npm outdated` pour lister les dépendances obsolètes
2. Exécute `npm audit` pour vérifier les vulnérabilités
3. Exécute `ng test` et capture le résultat
4. Exécute `npx playwright test` pour les tests E2E
5. Retourne un rapport consolidé : dépendances, vulnérabilités, résultats de tests

## Modèle

Utilise **DeepSeek V4 Pro**, comme tous les agents du Swarm.
