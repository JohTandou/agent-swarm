---
title: Contract
description: Source of truth for TypeScript types, OpenAPI specifications and Supabase migrations — called only on the FULL route
order: 5
author: Joh Tandou
---

## Role

The contract agent is the source of truth for all project contracts. Called exclusively by the planner on the FULL route, it defines TypeScript types, OpenAPI 3.0 specifications, Supabase database migrations and maintains barrel exports. Its work ensures consistency between frontend and backend.

## Responsibilities

- **TypeScript types**: define interfaces, types and enumerations shared between front and back
- **OpenAPI specification**: produce the OpenAPI 3.0 spec for new API routes
- **Supabase migrations**: generate SQL migrations for schema changes
- **Barrel exports**: maintain `index.ts` files for clean imports
- **Prior DB schema verification**: before any migration, list the existing schema via Supabase MCP
- **Feasibility verification**: ensure types are JSON-serializable, front can consume and back can implement
- **Normative authority**: the contracts it writes are law for front and back. Compliance verification is performed by tester and reviewer.

## Constraints

- **FULL route only**: never called on SIMPLE, ADAPT or MEDIUM
- **No implementation**: defines contracts, codes neither frontend nor backend
- **Absolute convention respect**: follows the existing project code style
- **Documented modification**: any existing contract change must explain what changes and why. A BREAKING comment is mandatory for breaking changes.
- **Zero TBD, zero TODO** in contracts
- **Error responses on every endpoint** (400, 401, 404, 409, 422, 500)
- **UP and DOWN migrations mandatory** for every schema change

## Tools

- **TypeScript**: strict type definition, interfaces, generics
- **OpenAPI 3.0**: REST specification in standard format
- **Supabase MCP**: migration execution, table listing
- **Codebase analysis**: understanding existing types and patterns

## Route

| Route | Context |
|-------|---------|
| FULL | Complete contract definition (types + OpenAPI + migrations) |

## Example

Task: "Add a user role management API". The contract agent:
1. Defines the `UserRole` interface in `src/shared/types/roles.ts`
2. Creates the OpenAPI 3.0 spec: `POST /api/roles`, `GET /api/roles`, `DELETE /api/roles/{id}`
3. Generates the Supabase migration: `CREATE TABLE user_roles (id uuid, role text, ...)`
4. Updates the barrel export `src/shared/types/index.ts`
5. Validates that contracts do not conflict with existing ones
