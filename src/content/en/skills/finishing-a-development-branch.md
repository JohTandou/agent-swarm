---
title: Branch Finalization
description: Guides the completion of development work: structured options for merge, PR or cleanup
category: workflow
order: 18
author: Joh Tandou
---

## Role

The finishing-a-development-branch skill intervenes when implementation is complete and all tests pass. It guides the decision on the best way to integrate the work: direct merge, pull request with review, or cleanup before integration. It presents structured options and executes the chosen option securely.

## Use Cases

- **Feature completion**: decide how to integrate a completed feature branch
- **Pre-merge**: verify everything is ready before integrating
- **Cleanup**: clean a branch before merging
- **Team workflow**: standardize the finalization process

## Triggers

The planner agent loads this skill when:
- Implementation is complete and tests pass
- The user asks how to finalize and integrate their work

## Inputs

- Development branch with completed work
- Test results (all passing)
- Commit history and diff with base

## Outputs

- Structured options: direct merge, PR, cleanup
- Execution of the chosen option (merge, PR creation, etc.)
- Integrated and cleaned branch
