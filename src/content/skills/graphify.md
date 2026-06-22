---
title: Graphify (analyse)
description: Transforme code, documentation, papiers et images en graphes de connaissances interactifs
category: audit
order: 3
author: Joh Tandou
---

## Rôle

Graphify convertit n'importe quelle entrée (code source, documentation, articles scientifiques, images) en un graphe de connaissances structuré. Il applique ensuite un clustering par communautés pour révéler les relations cachées entre les concepts.

## Pipeline de transformation

1. **Input** : code, docs, articles, images
2. **Extraction** : entités, relations, concepts clés
3. **Graphe** : construction du knowledge graph
4. **Clustering** : communautés thématiques
5. **Output** : HTML + JSON + rapport d'audit

## Formats de sortie

### HTML interactif
Visualisation du graphe avec navigation, zoom, filtrage par communauté. Interface exploratoire complète.

### JSON structuré
Données brutes du graphe pour intégration dans d'autres outils ou analyses programmatiques.

### Rapport d'audit
Analyse des communautés détectées, métriques du graphe (densité, centralité), recommandations.

## Cas d'usage

- Cartographier les dépendances d'un codebase complexe
- Visualiser la structure d'une documentation technique
- Analyser les relations entre concepts dans un article
- Détecter les patterns architecturaux émergents
- Identifier les zones de fort couplage dans un projet

## Exemple

```
Input : documentation Swarm Wiki (20+ fichiers Markdown)
→ Graphify extrait agents, skills, concepts clés
→ Construit un graphe avec 45 nœuds et 120 relations
→ Détecte 4 communautés : agents build, agents qualité, skills création, workflow
→ Génère HTML interactif + JSON + rapport
```
