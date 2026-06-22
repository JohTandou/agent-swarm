---
title: Test-Driven Development
description: TDD: write tests before implementation code for any feature or bugfix
category: workflow
order: 22
author: Joh Tandou
---

## Role

The test-driven-development skill applies the TDD (Test-Driven Development) methodology rigorously. Before writing implementation code, it generates tests that define the expected behavior. These tests first fail (red), then code is written to make them pass (green), and finally the code is refactored (refactor). This skill ensures every feature is tested from its conception.

## Use Cases

- **New feature**: define expected behavior before implementing
- **Bug fix**: write a test that reproduces the bug before fixing it
- **Refactoring**: ensure behavior remains identical after restructuring
- **Continuous quality**: maintain high test coverage systematically

## Triggers

The planner agent loads this skill when:
- A new feature or bug fix must be implemented
- The user wants to follow the TDD methodology

## Inputs

- Feature specification or bug description
- Existing codebase and test infrastructure
- Project test conventions

## Outputs

- Tests written first (red phase)
- Implementation code making tests pass (green phase)
- Refactored and optimized code (refactor phase)
- Coverage report for the feature
