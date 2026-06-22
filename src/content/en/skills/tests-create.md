---
title: Tests Create (quality)
description: Optimal generation of unit, functional, integration and E2E tests
category: creation
order: 2
author: Joh Tandou
---

## Role

Tests Create analyzes the codebase to identify all testable units, then generates complete test files following the project's existing test conventions and infrastructure.

## Types of Generated Tests

### Unit Tests
- Pure functions, services, utilities
- Isolated components with mocks
- Pipes, directives, guards
- Edge case and error coverage

### Functional Tests
- Complete business flows
- End-to-end user scenarios
- Business rule validation

### Integration Tests
- Inter-service communication
- Parent/child component interactions
- Integration with APIs and databases

### E2E Tests
- Complete user journeys
- Multi-page navigation
- Cross-browser validation

## Respected Conventions

- Existing test framework (Jest, Playwright, Cypress, etc.)
- Project naming conventions
- File and folder structure
- Mock and fixture patterns
- Configured coverage threshold (80% minimum)

## Process

1. Codebase analysis to identify testable units
2. Existing test framework detection
3. Test file generation with correct structure
4. Relevant test case inclusion (happy path, edge cases, errors)
5. Configuration of necessary mocks and stubs

## Example

```typescript
// Auto-generated for an Angular service
describe('ContentService', () => {
  it('should load a Markdown document', () => {
    // Test with HttpClient mock
  });

  it('should handle loading errors', () => {
    // Error case test
  });
});
```
