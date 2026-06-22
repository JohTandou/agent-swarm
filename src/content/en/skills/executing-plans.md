---
title: Plan Execution
description: Executes a written implementation plan in a separate session with review checkpoints
category: workflow
order: 17
author: Joh Tandou
---

## Role

The executing-plans skill handles the execution of a previously written implementation plan. It reads the plan, breaks it down into atomic steps, executes each step in order, and sets review checkpoints where validation is required before continuing. This skill ensures execution stays faithful to the plan and each milestone is validated.

## Use Cases

- **Complex plans**: execute a multi-step implementation plan
- **Incremental reviews**: validate each step before moving to the next
- **Asynchronous work**: resume execution of a plan written in a previous session
- **Traceability**: keep a clear history of what was done and validated

## Triggers

The planner agent loads this skill when:
- A written implementation plan must be executed
- The user references an existing plan to follow

## Inputs

- Written implementation plan (file or document)
- Project context and current codebase
- Success criteria for each step

## Outputs

- Step-by-step execution with validation at each checkpoint
- Progress report after each milestone
- Deliverables conforming to the initial plan
