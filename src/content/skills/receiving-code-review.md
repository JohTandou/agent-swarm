---
title: Réception de Code Review
description: Réception de feedback de code review avec rigueur technique, vérification avant implémentation des suggestions
category: workflow
order: 19
---

## Rôle

Le skill receiving-code-review guide la réception et le traitement du feedback de code review. Il ne s'agit pas d'accepter aveuglément toutes les suggestions, mais d'appliquer une rigueur technique : chaque remarque est analysée, vérifiée, et soit acceptée avec une implémentation correcte, soit rejetée avec une justification technique solide. Ce skill garantit que les modifications post-review ne dégradent pas la qualité.

## Cas d'usage

- **PR review** : traiter les commentaires reçus sur une pull request
- **Feedback équipe** : répondre aux remarques d'un lead technique
- **Revue externe** : intégrer le feedback d'un auditeur ou consultant
- **Amélioration continue** : tirer les leçons des reviews pour les prochains développements

## Déclencheurs

L'agent planner charge ce skill quand :
- Du feedback de code review est reçu et doit être traité
- L'utilisateur n'est pas sûr de la validité technique d'une suggestion

## Entrées

- Feedback de code review (commentaires, suggestions, demandes de changement)
- Code concerné par la review
- Contexte technique du projet

## Sorties

- Analyse technique de chaque remarque (valide/invalide/à clarifier)
- Implémentation des suggestions valides
- Justification technique pour les suggestions rejetées
- Code mis à jour et prêt pour une nouvelle review
