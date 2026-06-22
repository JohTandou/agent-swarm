---
title: Tester
description: First quality gate — generates missing tests, runs the suite, measures coverage with a minimum 80% threshold
order: 7
author: Joh Tandou
---

## Role

The tester agent is the first of two quality gates in the Swarm pipeline. It is triggered before each commit on SIMPLE (if code modified), ADAPT, MEDIUM and FULL routes. It generates missing tests for new code, runs the full suite, measures coverage, categorizes errors and produces a structured report.

## Responsibilities

- **Test generation**: create unit, integration and E2E tests for new code
- **Phase 0 — Generation**: identify scope via git diff, verify existing tests, respect project conventions, generate the missing layer. Never modify existing tests.
- **Granular categorization** (8 categories): BUG_FRONT, BUG_BACK, CONTRACT_VIOLATION, PLAN_ERROR, SPEC_ERROR, ENV_ERROR, FLAKY, TEST_BUG
- **Mandatory JSON format**: structured response with status, coverage_percent, failures (categorized), retry_target
- **Execution**: run the full test suite (`ng test`, `npx playwright test`)
- **Coverage measurement**: verify coverage reaches the 80% threshold
- **Error categorization**: classify failures (code vs test, flaky, environment)
- **Quality report**: produce a detailed report with metrics and recommendations

## Constraints

- **Additive only**: generates new tests, never modifies existing tests
- **Coverage threshold**: 80% minimum — blocks commit if not reached
- **Ignores pre-existing failures**: does not block on tests already broken before the change
- **No source code modification**: does not fix bugs, only reports them

## Tools

- **Vitest / Jest / Pytest**: unit tests based on project stack
- **Playwright**: multi-browser E2E tests (Chromium + iPhone 14)
- **Shell delegation**: all test commands go through the general agent via Task — the tester never runs commands directly
- **Codebase analysis**: detection of existing test patterns, identification of modified scope

## Routes

| Route | Context |
|-------|---------|
| SIMPLE | If code modified: unit test generation for 1-2 files |
| ADAPT | Unit + integration tests for 2-4 files |
| MEDIUM | Full suite: unit + integration + E2E |
| FULL | Exhaustive suite with visual snapshots and contract tests |

## Example

Task: "Validate the new NotificationList component". The tester agent:
1. Analyzes the component and identifies cases to test (display, empty, error, interaction)
2. Generates 12 Jest unit tests covering all states
3. Generates 3 Playwright E2E tests for the full flow
4. Runs `ng test` → 12/12 PASS, coverage 92%
5. Runs `npx playwright test` → 3/3 PASS
6. Produces the report: "Gate 1 — PASS — Coverage 92% — Ready for review"
