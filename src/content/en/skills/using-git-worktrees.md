---
title: Using Git Worktrees
description: Creates isolated Git worktrees for feature work, with security verification and smart directory selection
category: documentation
order: 24
author: Joh Tandou
---

## Role

The using-git-worktrees skill facilitates creating isolated Git worktrees for working on features without impacting the current workspace. It includes security verification (no conflict with existing branches, clean directories) and smart destination directory selection. It is particularly useful before executing implementation plans that require an isolated environment.

## Use Cases

- **New feature**: create an isolated environment to develop a feature
- **Experimentation**: test an approach without risk to the main code
- **Code review**: checkout a PR in a separate worktree for testing
- **Hotfix**: intervene on production while a feature is in progress

## Triggers

The planner agent loads this skill when:
- Feature work requires isolation from the current workspace
- The user requests Git worktree creation

## Inputs

- Base branch or commit
- Feature or branch name to create
- Current workspace and Git state

## Outputs

- Git worktree created in an isolated, secured directory
- Security verification performed (no conflicts)
- Instructions for working in the worktree and cleaning it up
