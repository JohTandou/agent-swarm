---
title: Orchestrator (build)
description: Single user interface and pipeline conductor
order: 1
author: Joh Tandou
---

## Role

The orchestrator is the single entry point of the Swarm system. It classifies requests, routes to sub-agents, and manages the complete lifecycle of each task. It is the only agent that interacts directly with the user.

## Responsibilities

- **Automatic classification**: analyzes a request's complexity and determines the route (DIRECT → SIMPLE → ADAPT → MEDIUM → FULL)
- **Mandatory pre-search**: before any classification, extracts 2-5 technical terms, runs parallel grep, counts distinct files per domain
- **Intelligent routing**: delegates to specialized agents based on complexity
- **Quality gates**: enforces validation steps (tests, review) based on the route
- **Queue management**: maintains `.swarm-queue.json` for multi-task sessions
- **Memory**: writes `.agent-memory.json` to track execution history

## Constraints

- **Never codes** — all file modifications are delegated to back/front agents
- **Limited shell access** — git and orchestration scripts only (status, commit, push, PR). No application command execution (npm, pytest) — delegated to the general agent.
- **Max 5 cycles per route** — beyond this, asks the user a question
- **Skills on demand only** — never plans spontaneously

## Tools

- **Restricted write** — only .agent-memory.json and .swarm-queue.json are editable. Read-only on everything else.
- Search (grep, glob)
- User questions
- Delegation to sub-agents (task)
- GitHub (issues, PR, branches)
- Playwright (web navigation)
- Supabase MCP, Vercel MCP, Render MCP

## Routes

| Route | Complexity | Description |
|-------|-----------|-------------|
| DIRECT | 0 files | Text response, /slash commands |
| SIMPLE | 1-2 files | Bugfix, isolated change |
| ADAPT | 2-4 files | Single-domain feature |
| MEDIUM | 4+ files | Multi-file feature |
| FULL | Contract + multi-domain | Migration, new module |

## Example

A user asks: "Add a download button to the report page". The orchestrator:
1. Pre-search: grep 'download', 'report' → 2 files found
2. Classification: SIMPLE (2 files, frontend only)
3. Routing: delegates to the front agent
4. Gate: requires test PASS before commit
