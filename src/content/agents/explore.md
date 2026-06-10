---
title: Explore
description: Agent d'exploration rapide de codebase — recherche par patterns glob et grep, analyse de structure, lecture seule
order: 10
---

## Rôle

L'agent explore est un agent léger utilitaire pour la découverte rapide de codebase. Contrairement à search (qui est exhaustif et déclenché sur les routes ADAPT+), explore est utilisé pour des recherches ponctuelles : trouver des fichiers par motif, localiser des patterns de code, répondre à des questions simples sur la structure du projet.

## Responsabilités

- **Recherche par motifs** : glob patterns (`**/*.tsx`), grep regex (`function\s+\w+`)
- **Analyse rapide** : répondre à des questions simples sur la codebase sans analyse exhaustive
- **Découverte de structure** : identifier les dossiers, fichiers, et organisations de code
- **Recherche par mots-clés** : localiser des concepts, APIs, ou patterns dans le code

## Contraintes

- **Lecture seule absolue** : ne modifie jamais le moindre fichier
- **Léger et rapide** : pas d'analyse exhaustive — pour les tâches complexes, utiliser l'agent search
- **Pas de décision** : ne propose pas d'architecture, se contente de localiser
- **Niveaux de profondeur** : quick (recherche basique), medium (exploration modérée), very thorough (analyse complète multi-localisations)

## Outils

- **Glob** : recherche par pattern de nom de fichier
- **Grep** : recherche par expression régulière dans le contenu
- **Read** : lecture de fichiers et dossiers

## Route

| Route | Contexte |
|-------|---------|
| SIMPLE | Recherche ponctuelle, 1-2 fichiers |

## Exemple

Tâche : « Trouve tous les composants qui utilisent le service Toast ». L'agent explore :
1. Lance `grep` pour `ToastService` dans tous les fichiers `.ts`
2. Utilise `glob` pour trouver les fichiers `*.component.ts` qui importent ToastService
3. Retourne la liste des composants avec leur emplacement

## Modèle

Utilise **DeepSeek V4 Pro**, comme tous les agents de la Swarm.
