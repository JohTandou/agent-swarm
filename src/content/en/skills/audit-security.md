---
title: Security Audit
description: Targeted vulnerability audit: SQL injection, prompt injection, context poisoning
category: audit
order: 9
author: Joh Tandou
---

## Role

The security audit focuses exclusively on three classes of critical vulnerabilities: SQL injection (unparameterized queries, misconfigured ORM), prompt injection (user-manipulable LLM prompts, jailbreaking) and context poisoning (manipulation of agent contextual memory, untrusted external data). It does not cover other attack vectors.

## Use Cases

- **LLM security**: verify that a conversational agent is not vulnerable to prompt injections
- **Database audit**: detect SQL queries vulnerable to injection
- **Context protection**: ensure agent context cannot be poisoned by external data
- **Targeted code review**: exclusive focus on these three vulnerabilities

## Triggers

The planner agent loads this skill when:
- A targeted SQL injection, prompt or context security audit is requested
- The user expresses specific concern about these three vectors

## Inputs

- Codebase (SQL queries, LLM handlers, context management)
- API and external integration configuration
- Security logs if available

## Outputs

- Vulnerability report classified by severity (critical, high, medium)
- Precise technical fixes for each detected vulnerability
- Hardening recommendations to prevent regressions
