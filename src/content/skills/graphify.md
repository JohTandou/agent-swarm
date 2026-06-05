---
title: Graphify
description: Transforme n'importe quelle entrée (code, docs, papiers, images) en graphe de connaissances interactif
category: workflow
order: 3
---

## Rôle

Graphify est un skill d'analyse qui transforme des entrées complexes (code source, documentation, articles scientifiques, images) en un graphe de connaissances. Il détecte les entités, les relations, les clusters thématiques, et produit une visualisation HTML interactive + un rapport d'audit.

## Cas d'usage

- **Cartographier** un codebase complexe
- **Analyser** les dépendances entre modules
- **Visualiser** l'architecture d'un système
- **Auditer** la cohérence d'une base de code

## Déclencheurs

L'agent search ou planner peut charger ce skill pour :
- Comprendre la structure d'un nouveau projet
- Identifier les clusters de code interdépendants
- Générer une carte visuelle pour le onboarding

## Entrées

- Code source (fichiers .ts, .py, .js...)
- Documentation (fichiers .md)
- Spécifications (fichiers .yaml, .json)

## Sorties

- Graphe HTML interactif (D3.js)
- Fichier JSON des entités et relations
- Rapport d'audit (clusters, densité, centralité)
