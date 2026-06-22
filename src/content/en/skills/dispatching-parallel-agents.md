---
title: Parallel Agent Dispatching
description: For 2+ independent tasks without shared state or sequential dependencies
category: workflow
order: 16
author: Joh Tandou
---

## Role

The dispatching-parallel-agents skill is designed for situations where multiple independent tasks must be executed simultaneously. It identifies tasks that can be parallelized (no shared state, no sequential dependencies), distributes them among available agents, and orchestrates their concurrent execution to maximize velocity.

## Use Cases

- **Multi-features**: implement several independent features in parallel
- **Large refactoring**: apply changes across multiple modules without dependencies
- **Content generation**: create multiple files or documents simultaneously
- **Parallel tests**: run independent test suites concurrently

## Triggers

The planner agent loads this skill when:
- 2+ independent tasks are identified without shared state
- The user requests parallel execution of multiple tasks

## Inputs

- List of tasks to execute with their constraints
- Dependencies between tasks (to verify independence)
- Available agents and their capabilities

## Outputs

- Validated parallel execution plan
- Tasks executed simultaneously by appropriate agents
- Consolidated report of each task's results
