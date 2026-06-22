---
title: Explore
description: Fast codebase exploration agent — glob and grep pattern search, structure analysis, read-only
order: 10
author: Joh Tandou
---

## Role

The explore agent is a lightweight utility agent for quick codebase discovery. Unlike search (which is exhaustive and triggered on ADAPT+ routes), explore is used for ad-hoc searches: finding files by pattern, locating code patterns, answering simple questions about project structure.

## Responsibilities

- **Pattern search**: glob patterns (`**/*.tsx`), grep regex (`function\s+\w+`)
- **Quick analysis**: answer simple questions about the codebase without exhaustive analysis
- **Structure discovery**: identify folders, files, and code organizations
- **Keyword search**: locate concepts, APIs, or patterns in the code

## Constraints

- **Absolute read-only**: never modifies a single file
- **Lightweight and fast**: no exhaustive analysis — for complex tasks, use the search agent
- **No decision**: does not propose architecture, only locates
- **Depth levels**: quick (basic search), medium (moderate exploration), very thorough (comprehensive multi-location analysis)

## Tools

- **Glob**: filename pattern search
- **Grep**: regex content search
- **Read**: file and directory reading

## Route

| Route | Context |
|-------|---------|
| SIMPLE | Ad-hoc search, 1-2 files |

## Example

Task: "Find all components that use the Toast service". The explore agent:
1. Runs `grep` for `ToastService` in all `.ts` files
2. Uses `glob` to find `*.component.ts` files importing ToastService
3. Returns the list of components with their locations
