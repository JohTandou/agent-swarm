---
title: Documentation Creation
description: Generates comprehensive technical documentation: architecture, stack, structure, APIs, data models, configuration, deployment
category: creation
order: 13
author: Joh Tandou
---

## Role

The documentation-create skill generates an exhaustive TECHNICAL_DOCUMENTATION.md file for the project in the current directory. It covers software architecture, tech stack, project structure, exposed APIs, data models, configuration, deployment and developer onboarding. The document is structured to serve as a single reference for technical teams.

## Use Cases

- **New project**: create the initial technical documentation
- **Developer onboarding**: provide a complete reference for new team members
- **Due diligence**: document a project before transfer or audit
- **Open source**: prepare documentation for public release

## Triggers

The planner agent loads this skill when:
- The user requests comprehensive technical documentation generation
- An exhaustive documentation task is assigned

## Inputs

- Complete project codebase
- Configuration files and build scripts
- Existing partial documentation

## Outputs

- Complete and structured TECHNICAL_DOCUMENTATION.md file
- Sections: architecture, stack, structure, APIs, data models, config, deployment, onboarding
- Maintainable and easy-to-update document
