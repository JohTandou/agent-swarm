---
title: OpenCode Customization
description: Editing OpenCode configuration: opencode.json, .opencode/, agents, subagents, skills, plugins, MCP, permissions
category: workflow
order: 15
author: Joh Tandou
---

## Role

The customize-opencode skill allows editing and creating OpenCode's own configuration. It covers modifying the opencode.json file (or opencode.jsonc), managing files under .opencode/, creating and fixing agents, subagents, skills, plugins, MCP servers and permission rules. This skill is reserved for OpenCode configuration, not the user's application code.

## Use Cases

- **Agent creation**: define a new agent with its rules and permissions
- **MCP configuration**: add or modify MCP servers
- **Skill management**: create, edit or delete custom skills
- **Permissions**: adjust agent security and access rules

## Triggers

The planner agent loads this skill when:
- The user edits or creates OpenCode configuration
- A modification of OpenCode agents, skills, plugins or permissions is requested

## Inputs

- OpenCode configuration files (opencode.json, .opencode/)
- Existing agent, skill and plugin structure
- Current permission rules

## Outputs

- Modified and validated OpenCode configuration
- New functional agents, skills or plugins
- Updated and secured permission rules
