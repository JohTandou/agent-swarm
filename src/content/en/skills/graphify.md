---
title: Graphify (analysis)
description: Transforms code, documentation, papers and images into interactive knowledge graphs
category: audit
order: 3
author: Joh Tandou
---

## Role

Graphify converts any input (source code, documentation, academic papers, images) into a structured knowledge graph. It then applies community-based clustering to reveal hidden relationships between concepts.

## Transformation Pipeline

1. **Input**: code, docs, papers, images
2. **Extraction**: entities, relationships, key concepts
3. **Graph**: knowledge graph construction
4. **Clustering**: thematic communities
5. **Output**: HTML + JSON + audit report

## Output Formats

### Interactive HTML
Graph visualization with navigation, zoom, community filtering. Complete exploratory interface.

### Structured JSON
Raw graph data for integration into other tools or programmatic analysis.

### Audit Report
Analysis of detected communities, graph metrics (density, centrality), recommendations.

## Use Cases

- Map dependencies of a complex codebase
- Visualize the structure of technical documentation
- Analyze relationships between concepts in an article
- Detect emerging architectural patterns
- Identify high-coupling areas in a project

## Example

```
Input: Swarm Wiki documentation (20+ Markdown files)
→ Graphify extracts agents, skills, key concepts
→ Builds a graph with 45 nodes and 120 relationships
→ Detects 4 communities: build agents, quality agents, creation skills, workflow
→ Generates interactive HTML + JSON + report
```
