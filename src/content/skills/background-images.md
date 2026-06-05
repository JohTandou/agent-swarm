---
title: Images de Fond
description: Analyse l'application, identifie les pages qui bénéficieraient d'images de fond et génère des prompts optimaux pour GPT Image
category: creation
order: 12
---

## Rôle

Le skill background-images analyse l'application dans le répertoire courant pour identifier les pages qui gagneraient à avoir des images de fond. Pour chaque page identifiée, il génère un prompt optimisé en anglais destiné à GPT Image 1.5, décrivant précisément l'image à créer en fonction du contenu, du ton et du design system de la page.

## Cas d'usage

- **Embellissement visuel** : ajouter de la profondeur aux pages qui manquent d'impact visuel
- **Cohérence thématique** : créer des images de fond alignées avec le design system
- **Lancement produit** : générer des visuels pour les landing pages
- **Rebranding** : produire de nouvelles images cohérentes avec une nouvelle identité

## Déclencheurs

L'agent planner charge ce skill quand :
- L'utilisateur veut améliorer l'impact visuel de ses pages avec des images de fond
- Une question d'illustration ou de visuels est posée

## Entrées

- Application dans le répertoire courant (pages, design system, contenu)
- Palette de couleurs et direction artistique
- Éventuelles contraintes de style ou de format

## Sorties

- Liste des pages bénéficiant d'images de fond, avec justification
- Prompts GPT Image 1.5 optimisés pour chaque page identifiée
- Recommandations d'intégration (position, overlay, responsive)
