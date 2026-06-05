---
title: Writer
description: Met à jour CHANGELOG, ARCHITECTURE.md et README après chaque commit — documentation vivante
order: 9
---

## Rôle

L'agent writer est le dernier maillon du pipeline Swarm. Après le merge d'une tâche, il met à jour la documentation du projet pour refléter les changements. Il garantit que CHANGELOG, ARCHITECTURE.md et README restent synchronisés avec le code réel.

## Responsabilités

- **CHANGELOG.md** : ajouter une entrée pour chaque tâche complétée (format Keep a Changelog)
- **ARCHITECTURE.md** : documenter les nouvelles décisions, structures, flux de données
- **README.md** : mettre à jour la stack, les commandes, la structure du projet
- **Détection de dérive** : identifier les écarts entre la documentation et le code
- **Mise à jour chirurgicale** : ne modifier que ce qui a changé, préserver le style existant

## Contraintes

- **Déclenché sur MEDIUM** (si endpoint/page public) et **FULL** (toujours)
- **Ne modifie jamais AGENTS.md ni PLAN.md** (réservés à l'humain)
- **Documentation en français**, cohérente avec le ton du projet
- **Écrit pour être lu par search** au prochain run (via AGENTS.md)

## Outils

- Lecture/écriture de fichiers Markdown
- Analyse de diff Git
- Détection de patterns de documentation
- Format Keep a Changelog

## Routes

| Route | Contexte |
|-------|---------|
| MEDIUM | Si endpoint/page public |
| FULL | Toujours |

## Exemple

Après le merge de T5 (Pages Agents) :
1. CHANGELOG : ajoute l'entrée T5 avec 11 composants, 259 tests, coverage 92%
2. ARCHITECTURE : documente le pattern ContentService + MarkdownRenderer pour les fiches agent
3. README : met à jour la liste des features (/agents, /agents/:id) et le nombre de tests (259)
4. Vérifie qu'AGENTS.md et PLAN.md n'ont pas dérivé → pas de modification nécessaire
