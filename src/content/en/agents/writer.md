---
title: Writer
description: Last link in the pipeline — updates CHANGELOG, API.md, ARCHITECTURE.md and README after each merge to keep documentation synchronized
order: 9
author: Joh Tandou
---

## Role

The writer agent is the last link in the Swarm pipeline. Triggered after each successful merge, it updates the project documentation: CHANGELOG, API.md, ARCHITECTURE.md and README. It detects drift between documentation and code to ensure documentation always reflects the actual state of the project.

## Responsibilities

- **CHANGELOG update**: add a structured entry (version, date, changes) after each merge
- **Graphify synchronization (MANDATORY)**: after each documentation update, check `graphify-out/graph.json` and trigger a rebuild if necessary
- **ARCHITECTURE.md update**: reflect structural changes (new modules, patterns)
- **README update**: maintain setup instructions, tech stack, prerequisites
- **Drift detection**: compare existing documentation with the actual codebase state
- **Targeted correction**: update only impacted sections, no full rewrite

## Constraints

- **Never modifies AGENTS.md**: this file is sacred, no modification allowed
- **Never modifies PLAN.md**: managed exclusively by the planner
- **Conditional triggering**: MEDIUM (if public page or endpoint) and FULL (always)
- **Preserves existing style**: adopts the tone and structure of pre-existing documentation
- **No invented content**: based exclusively on the merge diff

## Routes

| Route | Context |
|-------|---------|
| MEDIUM | Update if public page or exposed endpoint |
| FULL | Systematic update of all impacted documentation |

## Example

A merge of PR "Add notification system" is completed. The writer agent:
1. Analyzes the merge diff: new `NotificationService`, `NotificationList` component
2. Adds a CHANGELOG entry: `## [1.3.0] - 2026-06-05 — Real-time notification system`
3. Updates API.md: documentation of the new notification endpoint
4. Updates ARCHITECTURE.md: new section on the real-time communication pattern
5. Updates README: adds `@supabase/realtime-js` to dependencies
6. Verifies that no modification touched AGENTS.md or PLAN.md
7. Commit: "docs: update CHANGELOG and project documentation"
