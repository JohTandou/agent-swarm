---
title: Subagent-Driven Development
description: Executes implementation plans with independent tasks in the current session
category: workflow
order: 21
author: Joh Tandou
---

## Role

The subagent-driven-development skill orchestrates the execution of implementation plans by delegating independent tasks to specialized sub-agents. Within the current session, it breaks down the plan into atomic work units, assigns them to appropriate agents (front, back, tester), and coordinates their results to produce a coherent deliverable.

## Use Cases

- **Complex plans**: execute a multi-component plan with specialized agents
- **Parallelization**: accelerate development by distributing tasks
- **Specialization**: entrust each task type to the most competent agent
- **Single session**: do everything in the same session without context switching

## Triggers

The planner agent loads this skill when:
- An implementation plan with independent tasks must be executed
- The user wants to parallelize development in the current session

## Inputs

- Implementation plan with atomic tasks
- Available agents and their specialties
- Codebase and project context

## Outputs

- Tasks executed in parallel by appropriate sub-agents
- Consolidated and coherent results
- Execution report with each task's status
