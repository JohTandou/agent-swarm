---
title: Implementation Audit
description: Verifies alignment between PROPOSITION_VALEUR.md and the actual codebase (backend and frontend)
category: audit
order: 6
author: Joh Tandou
---

## Role

The implementation audit confronts the documented value proposition (PROPOSITION_VALEUR.md) with the reality of the codebase. It identifies promised but absent features, partial implementations, and divergences between the product vision and delivered code, both on the backend and frontend side.

## Use Cases

- **Product-code alignment**: verify that what is sold is actually implemented
- **Functional debt**: identify documented but undelivered features
- **Roadmap validation**: prioritize developments based on observed gaps
- **Team communication**: align the product vision with the actual state of the code

## Triggers

The planner agent loads this skill when:
- The user wants to verify alignment between their value proposition and their code
- A functional coverage question is raised

## Inputs

- PROPOSITION_VALEUR.md (business source of truth)
- Frontend and backend codebase
- Technical documentation (ARCHITECTURE.md, API.md)

## Outputs

- Coverage matrix: promised feature → implementation status
- Gap report with severity (critical, major, minor)
- Recommendations to close identified gaps
