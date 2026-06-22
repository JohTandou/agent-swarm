---
title: Production-Readiness Audit
description: Exhaustive verification of production readiness: security, reliability, performance, observability, infrastructure
category: audit
order: 8
author: Joh Tandou
---

## Role

The production-readiness audit verifies that an application is truly ready for production deployment. It covers security (vulnerabilities, best practices), reliability (error handling, resilience), performance (response times, optimization), observability (logs, monitoring, alerting) and infrastructure (scalability, deployment, rollback).

## Use Cases

- **Pre-launch**: final check before production deployment
- **Post-mortem incident**: analyze why an application failed in production
- **Infrastructure improvement**: identify weaknesses in the current infrastructure
- **Security review**: combine security and reliability in a single audit

## Triggers

The planner agent loads this skill when:
- The user wants to verify if their application is ready for production
- A question about reliability, security or performance in production is asked

## Inputs

- Deployment configuration (Docker, K8s, Vercel, etc.)
- Backend and frontend codebase
- Production logs and metrics if available

## Outputs

- Readiness report with overall and per-dimension scores
- List of critical blockers before production deployment
- Action plan to reach the required production-readiness level
