---
title: Search
description: Read-only codebase analysis agent — pattern detection, context7 documentation, dependency mapping
order: 2
author: Joh Tandou
---

## Role

The search agent is the first agent activated by the orchestrator on any route classified ADAPT or above. It analyzes the codebase in read-only mode, detects existing patterns, consults context7 documentation, and provides a structured report to the planner. It never modifies a single file.

## Responsibilities

- **Codebase analysis**: explore the project to understand structure, conventions and dependencies
- **Prior graphify analysis (if available)**: mandatory reading of `graphify-out/GRAPH_REPORT.md` and `graph.json` to identify relevant communities and nodes before any exploration
- **Pattern detection**: identify recurring patterns (components, services, styles) to guide implementation
- **Context7 documentation**: consult up-to-date documentation for used libraries and frameworks
- **Dependency mapping**: trace the import graph and relationships between modules
- **Structured report**: produce an analysis report usable by the planner
- **Negative search**: systematically document what was expected but not found (absence of evidence ≠ evidence of absence)
- **Final self-assessment**: assign a confidence score (0.0-1.0) to each finding, flag unverified assumptions

## Constraints

- **Absolute read-only**: never modifies a single file, no write/edit/delete
- **Does not verify its hypotheses**: identifies possible patterns, does not validate them — that is the planner's role
- **No architectural decision**: does not propose solutions, only maps the existing
- **Does not communicate with the user**: interactions only via the internal pipeline

## Tools

- **Grep**: pattern search in the codebase
- **Glob**: filename pattern search
- **Read**: file and directory reading
- **context7**: technical documentation consultation (resolve + query)
- **webfetch**: external web content retrieval

## Routes

| Route | Context |
|-------|---------|
| ADAPT | Light analysis, single file or isolated module |
| MEDIUM | Multi-file analysis, cross-cutting pattern detection |
| FULL | Exhaustive analysis, complete dependency mapping |

## Example

Task: "Add a real-time notification system". The search agent:
1. Runs `grep` to detect existing WebSocket/SSE usage
2. Uses `glob` to find existing communication services
3. Consults context7 documentation for the Supabase Realtime API
4. Maps imports and dependencies between concerned modules
5. Produces a report: detected patterns, identified dependencies, applicable documentation
