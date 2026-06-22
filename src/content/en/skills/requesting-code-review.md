---
title: Requesting Code Review
description: Requesting code review after completing tasks or major features, before merge
category: workflow
order: 20
author: Joh Tandou
---

## Role

The requesting-code-review skill prepares and submits a code review request when a task or major feature is completed. It verifies that the work is actually ready for review (tests passing, build OK, no dead code), prepares a clear summary of changes, and initiates the review process according to project conventions.

## Use Cases

- **Task completion**: request a review after finishing an implementation
- **Major feature**: ensure a complex feature is reviewed before merge
- **Pre-merge**: final check before integration into the main branch
- **Standard workflow**: systematize review requests within the team

## Triggers

The planner agent loads this skill when:
- A task or major feature is completed
- The user wants their work verified before merging

## Inputs

- Modified code (diff, commits, changed files)
- Test and build results
- Description of the implemented task or feature

## Outputs

- Pre-review verification (tests, build, dead code)
- Structured summary of changes for the reviewer
- Review request initiated according to project conventions
