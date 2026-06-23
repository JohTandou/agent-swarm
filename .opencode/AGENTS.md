# Multi-Agent Architecture

This document defines the pipeline agent architecture and the tools they are authorized to use.

---

## Pipeline Agents

| Agent | Responsibility | Constraints |
|---|---|---|
| **build** | Orchestrator: classification, routing, gates, final commit | Restricted editing (`.agent-memory.json` only) |
| **search** | Codebase analysis, dependency mapping, framework docs (Context7) | Absolute read-only |
| **planner** | Planning, architectural choices, submitting decisions to user | Read-only, never codes |
| **contract** | TypeScript types, OpenAPI spec, Supabase migrations | FULL route only |
| **front** | UI implementation (Magic/21st.dev), React components, MCP integration | Uses MCP magic_* and context7_* |
| **back** | Backend implementation, API, database (Supabase) | Uses MCP supabase_* and context7_* |
| **tester** | Generates missing tests, runs targeted tests, measures coverage (≥80%) | Additive only, never modifies production code |
| **reviewer** | Security gate, quality, test audit before commit | MEDIUM/FULL routes only, after tester PASS |
| **writer** | Updates CHANGELOG, API.md, ARCHITECTURE.md, README | Triggered on MEDIUM (public endpoint), FULL, /docs |

---

## Available Tools

> **NOTE**: MCP tools (21st.dev, Supabase, Vercel, Render, Playwright, Context7) are the **primary and native** interface for agents. The only remaining bash wrapper is `mcp-playwright.sh` for E2E test execution (`npx playwright test`), which has no MCP equivalent. Raw CLI commands (`supabase db push`, `vercel deploy`, `npx playwright test`) remain prohibited.

### Playwright Wrapper

| Script | Service | Usage |
|---|---|---|
| `mcp-playwright.sh` | Playwright | E2E tests (`--run`), UI mode (`--ui`), debug (`--debug`), report (`--report`) |

Other services (Supabase, Vercel, Render, 21st.dev) are exclusively accessible via their native MCP tools.

---

## Script Reference

### `mcp-playwright.sh`

End-to-end tests via `npx playwright`.

```bash
# Run all tests
~/.opencode/scripts/mcp-playwright.sh --run

# Run a specific test file
~/.opencode/scripts/mcp-playwright.sh --run "tests/login.spec.ts"

# Open UI mode
~/.opencode/scripts/mcp-playwright.sh --ui

# Debug mode
~/.opencode/scripts/mcp-playwright.sh --debug

# Display the latest HTML report
~/.opencode/scripts/mcp-playwright.sh --report
```

**Prerequisites**: `npx` available, `@playwright/test` installed in the project.
**Returns**: JSON (`--run` mode), or structured message (interactive modes).

---

## Logging

The Playwright wrapper writes logs to `/tmp/mcp-playwright.log`.

---

## Conventions

1. **Native MCP for everything**: Supabase, Vercel, Render, 21st.dev, Context7 are accessible via their native MCP tools. Never use direct CLI commands.
2. **Playwright wrapper only**: `mcp-playwright.sh` for `npx playwright test` (no MCP equivalent).
3. **Check return JSON**: Each script returns structured JSON. Check the `status` field.
4. **Working directory**: Execute scripts from the project root.

---

## Architecture Diagram

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  front  │   │  back   │   │ tester  │   │reviewer │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Native MCP tools   │
                    │ + mcp-playwright.sh  │
                    └──────────┬──────────┘
                               │
          ┌──────────┬─────────┼──────────┬──────────┐
          │          │         │          │          │
     ┌────▼────┐ ┌───▼───┐ ┌──▼──┐  ┌────▼────┐ ┌───▼───┐
     │ 21st.dev│ │Supabase│ │Vercel│  │ Render  │ │Playwright│
     │  (MCP)  │ │ (MCP)  │ │(MCP) │  │ (MCP)   │ │(wrapper)│
     └─────────┘ └───────┘ └─────┘  └─────────┘ └─────────┘
```
