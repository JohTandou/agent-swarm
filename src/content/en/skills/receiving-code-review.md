---
title: Receiving Code Review
description: Receiving code review feedback with technical rigor, verification before implementing suggestions
category: workflow
order: 19
author: Joh Tandou
---

## Role

The receiving-code-review skill guides the reception and processing of code review feedback. It's not about blindly accepting all suggestions, but applying technical rigor: each remark is analyzed, verified, and either accepted with a correct implementation or rejected with solid technical justification. This skill ensures that post-review modifications do not degrade quality.

## Use Cases

- **PR review**: process comments received on a pull request
- **Team feedback**: respond to a tech lead's remarks
- **External review**: integrate feedback from an auditor or consultant
- **Continuous improvement**: learn from reviews for future developments

## Triggers

The planner agent loads this skill when:
- Code review feedback is received and must be processed
- The user is unsure about the technical validity of a suggestion

## Inputs

- Code review feedback (comments, suggestions, change requests)
- Code concerned by the review
- Technical project context

## Outputs

- Technical analysis of each remark (valid/invalid/to clarify)
- Implementation of valid suggestions
- Technical justification for rejected suggestions
- Updated code ready for a new review
