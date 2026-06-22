---
title: Test Execution
description: Runs all tests of the application, detects test infrastructure, analyzes failures and produces a report with actionable fixes
category: creation
order: 14
author: Joh Tandou
---

## Role

The tests-run skill executes all the application's tests in the current directory. It automatically detects the test infrastructure in place (Jest, Vitest, Playwright, Cypress, etc.), runs unit, functional, integration and E2E tests, analyzes each failure granularly, and produces a clear report with actionable fixes for each error.

## Use Cases

- **CI/CD**: run the test suite in a pipeline
- **Pre-commit**: validate that no regression has been introduced
- **Collective debugging**: get a consolidated report of all failures
- **Coverage**: measure test coverage and identify untested areas

## Triggers

The planner agent loads this skill when:
- The user requests test execution
- A code quality check is needed before merge

## Inputs

- Codebase with existing tests
- Test framework configuration
- Configured coverage threshold

## Outputs

- Execution report: passed, failed, skipped tests
- Detailed analysis of each failure with stack trace
- Actionable fixes for each error category
- Coverage metrics by module
