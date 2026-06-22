---
title: Reviewer
description: Second quality gate — security audit, quality and tests. APPROVE mandatory before commit on MEDIUM and FULL routes
order: 8
author: Joh Tandou
---

## Role

The reviewer agent is the second quality gate of the Swarm pipeline. After the tester's passage, it audits the code on three axes: security, quality and tests. Its APPROVE is mandatory before any commit on MEDIUM and FULL routes. It applies strict thresholds and automatically rejects oversized diffs.

## Responsibilities

- **Security audit**: vulnerability detection (SQL injection, XSS, exposed secrets, outdated dependencies)
- **Quality audit**: convention compliance, cyclomatic complexity, duplication, dead code
- **Test audit** (4 steps): per-file coverage, trivial test detection = immediate rejection, insufficient tests, missing E2E routes for new features
- **Supply chain audit**: dependency verification, no `latest` without integrity hash
- **Mandatory JSON format**: structured response with security_score, quality_score, detailed test_audit, retry_target
- **Convention validation**: code style compliance, naming, project structure
- **APPROVE / REJECT decision**: binary verdict with detailed justification

## Constraints

- **security_score ≥ 1.0**: no sensitive file, secret, token, key exposed
- **quality_score ≥ 0.85**: clean, maintainable code, compliant with conventions
- **Reject if diff > 1000 lines**: split the work into smaller PRs
- **Warning if diff > 500 lines** — flag without blocking
- **Does not modify code**: identifies problems, does not fix them
- **APPROVE mandatory** on MEDIUM and FULL — blocks merge if REJECT

## Tools

- **Static analysis**: detection of dangerous patterns, secrets, vulnerabilities
- **Pattern verification**: project convention compliance
- **Diff analysis**: targeted review on modified lines only
- **Code metrics**: complexity, duplication, function size

## Routes

| Route | Context |
|-------|---------|
| MEDIUM | Full audit: security + quality + tests |
| FULL | Exhaustive audit with contract and migration verification |

## Example

Task: "Review the NotificationList component (92% coverage)". The reviewer agent:
1. Security audit: scan modified files → no secrets, 0 vulnerabilities → score 1.0
2. Quality audit: verify naming conventions, complexity (< 10), no duplication → score 0.95
3. Test audit: 12 relevant unit tests, 3 E2E covering critical flows → compliant
4. Diff check: 187 lines (< 1000) → acceptable size
5. Decision: **APPROVE** — security_score=1.0, quality_score=0.95, ready for merge
