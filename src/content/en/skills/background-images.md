---
title: Background Images
description: Analyzes the app, identifies pages that would benefit from background images and generates optimal prompts for GPT Image
category: creation
order: 12
author: Joh Tandou
---

## Role

The background-images skill analyzes the application in the current directory to identify pages that would benefit from background images. For each identified page, it generates an optimized English prompt for GPT Image 1.5, precisely describing the image to create based on the page's content, tone and design system.

## Use Cases

- **Visual enhancement**: add depth to pages lacking visual impact
- **Thematic consistency**: create background images aligned with the design system
- **Product launch**: generate visuals for landing pages
- **Rebranding**: produce new images consistent with a new identity

## Triggers

The planner agent loads this skill when:
- The user wants to improve the visual impact of their pages with background images
- A question about illustration or visuals is asked

## Inputs

- Application in the current directory (pages, design system, content)
- Color palette and artistic direction
- Possible style or format constraints

## Outputs

- List of pages benefiting from background images, with justification
- Optimized GPT Image 1.5 prompts for each identified page
- Integration recommendations (position, overlay, responsive)
