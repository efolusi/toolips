---
title: Why Pro stays small
slug: we-charge-four-dollars
date: 2026-04-28
author: Aria Vance
category: Product
read: 5
block: 3
featured: false
summary: Most tools in our category charge $20–60 per month. Toolips Pro starts at $6 monthly or $48 annually. Here's the math and the philosophy.
---

The Pro tier on Toolips is $6 a month, or $48 a year. Most of our competitors charge $20, $30, $60.

People sometimes ask us if we made a typo. We didn't. Here's the math.

## The math

A heavy Pro user runs ~500 tool calls a month. The vast majority are client-side (zero marginal cost to us). The remaining ~80 hit our backend (image processing, AI generation, security scans). Average compute + bandwidth cost per call: ~$0.004.

That's $0.32 of infrastructure per heavy user per month. Add Stripe fees ($0.30 + 2.9%), email, observability, and we're at about $0.85 in variable cost per Pro user. At $6/mo, we have enough margin to keep the product healthy without pricing out occasional users.

Multiply that by enough users and we cover the team. We don't need to multiply it by very many.

## The philosophy

Pricing high gates the product. Pricing low expands the market. Toolips is utility software. Pricing it like enterprise software would be a category error.

Our user is a freelancer fixing one PDF, a developer scripting a one-off, a student making a thumbnail. Charging them $30/mo means they don't subscribe. Charging them $6/mo means they do, and they tell their friend.

We'd rather have 10,000 users on a small plan than 1,000 users at $40. The product gets better when more people use it.

## What you don't get

- A dedicated account manager. Use the docs.
- A custom contract. Click "Subscribe" or don't.
- A 6-figure annual prepay. The pricing is the pricing.
- SAML. We do offer SSO via Google + GitHub. Workforce SSO is on the roadmap when we have a workforce to sell it to.

If you need any of the above, you're not our customer. That's fine.

## What you do get

- Every tool in the catalog, including the AI tools.
- No daily caps on exports or AI calls. Per-minute rate limits still apply, so nobody can flood the service.
- Batch resizing, delivered as one ZIP.
- The same tools over the REST API and MCP, with no daily cap.
- A clean conscience.

## When we raise prices

We won't raise prices on existing subscribers. New users may pay more in the future if costs change, but if you're paying $6 today you'll pay $6 forever.

That's the contract.
