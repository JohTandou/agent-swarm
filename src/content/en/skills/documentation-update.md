---
title: Documentation Update
description: Updates TECHNICAL_DOCUMENTATION.md, README.md and PROPOSITION_VALEUR.md by detecting drift between documentation and code
category: documentation
order: 23
author: Joh Tandou
---

## Role

The documentation-update skill keeps project documentation synchronized with the code. It detects drift between documentation files (TECHNICAL_DOCUMENTATION.md, README.md, PROPOSITION_VALEUR.md) and the actual codebase state, then applies surgical corrections to realign the documentation, while preserving the existing structure and style of each file.

## Use Cases

- **After a sprint**: update documentation after several weeks of development
- **Pre-release**: verify that documentation reflects the delivered version
- **New contributor**: ensure documentation is reliable for onboarding
- **Documentation audit**: detect and correct outdated information

## Triggers

The planner agent loads this skill when:
- Documentation must be realigned with the code
- The user notices inconsistencies in the documentation

## Inputs

- Existing documentation files (TECHNICAL_DOCUMENTATION.md, README.md, PROPOSITION_VALEUR.md)
- Current codebase
- Recent change history

## Outputs

- Drift analysis: outdated, missing, incorrect sections
- Updated and realigned documentation files
- Report of changes made to each file
