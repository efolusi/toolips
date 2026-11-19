---
title: The Bauhaus design system
slug: the-bauhaus-design-system
date: 2026-05-10
author: Eli Khan
category: Design
read: 7
block: 1
featured: false
summary: Three blocks, three colors, one display typeface. The constraints behind a design system that doesn't melt under feature creep.
---

If you've used Toolips, you've noticed the blocks.

Teal. Butter. Clay. Black squares, white circles. They show up on the hub, in the tool tiles, in the blog cards, in the 404 page. They're the spine of the design system.

This post is about why we limited ourselves that hard.

## The constraints

- **Three palette blocks.** `--block-1` (teal), `--block-2` (butter), `--block-3` (clay). One accent: `--gold-500`. One ink: `--ink-900`. One paper: `--paper-100`. That's it.
- **One display typeface.** Bricolage Grotesque, weights 600 + 800. Body in Inter, mono in JetBrains Mono. No third display font, ever.
- **Tight letter-spacing.** Display copy: -0.04em. Body copy: 0. Mono: 0.05em letter-spacing all-caps for eyebrows. These three values cover everything.
- **No drop shadows.** Borders only. 1.5px solid. Sometimes 2px. Never blur, never alpha.
- **Sharp corners by default.** 0px radius for blocks. `--radius-22` (22px) for cards. `--radius-14` for inputs/buttons. Nothing in between.

## Why

Constraint is a productivity multiplier when you ship a lot. When a designer asks "what color should this PRO button be?", the answer is `var(--gold-500)`. When an engineer wires up a new tool, the icon block uses `var(--block-1|2|3)` based on the tool's `block` field. There's no decision to make.

The user gets a visual rhythm. After five tools they recognize the pattern. After ten they trust it.

## What we gave up

A lot. We gave up:

- Gradients. We thought about them. The mood board had some pretty ones. Then we shipped 40 tools without them and didn't miss them.
- Hero illustrations. Other tool sites use a custom SVG per tool. We use a colored block. Faster to design, faster to render, more recognizable.
- Dark mode subtlety. Our dark mode is just an inversion: same shapes, swapped ink/paper. No second palette. Lower fidelity, higher fidelity-to-itself.

## The takeaway

A design system that survives feature creep is one whose constraints are slightly too tight for the next feature. If the next feature can fit without breaking a rule, the system is wasting some of its design budget.

Three blocks. Three colors. One typeface. Done.
