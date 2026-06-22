---
title: Planner
description: Plans work into atomic tasks — decomposition, architectural choices, delegation contracts, complexity estimation, detects architectural decisions (submitted to user via orchestrator) and delegates contract definition to contract (FULL route only)
order: 4
author: Joh Tandou
---

## Role

The planner agent receives the search agent's analysis report and breaks down the request into an atomic execution plan. It identifies necessary architectural choices, defines delegation contracts between agents, and estimates the complexity of each task. It produces a structured JSON response (status READY, CHOICE_REQUIRED, REJECT or SPLIT_SUGGESTED) that the orchestrator consumes for routing.

## Responsibilities

- **Decomposition**: break down a complex request into independent atomic steps
- **Pre-Mortem**: imagine likely failure causes before execution
- **Considered alternatives**: document rejected approaches with justification
- **Architectural choice detection**: identify decisions impacting project structure
- **Delegation contracts**: precisely define what each agent must produce
- **Complexity estimation**: evaluate file count, estimated time, risks
- **JSON response generation**: produce a structured response with atomic tasks, acceptance criteria, risks and pre-mortem

## Constraints

- **Sees only what search provides**: does not perform its own exploration, relies exclusively on the search report
- **Behavioral directives**: never sugarcoat, never pretend, challenge the request, no corporate speak
- **Proactive clarification**: ask the user questions in case of ambiguity before planning
- **Does not produce code**: text plan only, never source code
- **No execution**: touches neither files nor system commands
- **Atomic plan**: each step must be independent and executable in isolation

## Tools

- **Search report analysis**: structured interpretation of the analysis report
- **Pattern detection**: identification of patterns to apply or avoid
- **Structured JSON response**: generation of a response with status (READY/CHOICE_REQUIRED/REJECT/SPLIT_SUGGESTED), atomic tasks, dependencies, risks

## Routes

| Route | Context |
|-------|---------|
| MEDIUM | Single-domain planning, 4+ files |
| FULL | Multi-domain planning with TypeScript contracts |

## Example

Task: "Add a real-time notification system". The planner receives the search report:
1. Analyzes detected patterns (WebSocket not present, Supabase Realtime available)
2. Decomposes into 4 steps: TypeScript model → Realtime service → UI component → tests
3. Detects the architectural choice: `@supabase/realtime-js` vs manual implementation
4. Defines contracts: back must expose types, front must create the component
5. Returns a READY JSON response with 4 atomic tasks, their dependencies, success criteria and a pre-mortem analysis
