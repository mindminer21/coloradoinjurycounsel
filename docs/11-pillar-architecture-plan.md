# Pillar Architecture Plan

Status: IMPLEMENTED — DRAFT pending Jeff's attorney review
Authoritative as of: 2026-07-22

## Decision

This document is the single source of truth for the acquisition site's content-pillar URL architecture. The live inventory at implementation time contained exactly 100 legacy JSON pages. The restructure preserves every legacy page as content, assigns exactly one pillar type, and gives it one canonical destination. New audience spokes are marked `draft-new` in `content/pillar-map.json`.

## URL contract

- Problem: `/{problem}/`
- Audience: `/for/{audience}/`
- Location: `/{city}/{problem-lawyer}/`

Never assign an old flat URL to different content. Every one of the 100 legacy flat paths has a permanent HTTP 301 redirect in `docs/redirect-map.json`, loaded by `next.config.mjs`.

## Implemented inventory

- Problem pillars: 55
- Audience pillars: 3
- Location pillars: 45
- Total rendered pillar pages: 103
- Legacy HTTP 301 redirects: 100

The exact per-page classification, destination, topic relationship, hub relationship, and review status are recorded in `content/pillar-map.json`. That machine-readable file controls routing, breadcrumbs, sitemap output, internal links, and `llms.txt`.

## Hub and spoke behavior

Every problem page is a hub within its topic. It renders its source overview content, links to same-topic audience and location spokes, links across to sibling problem hubs, and links to the site's lead magnets. Audience and location spokes link back to their parent topic hub and across to siblings. The practice-areas index links to every pillar page, providing a second crawl path and an orphan-page safety net.

## Lead magnets

- `/case-estimator` (Colorado Case Value Snapshot) links to selected problem, audience, and location pillars; every pillar links back to it.
- `/game-plan` (Claim Game Plan) links to selected problem, audience, and location pillars; every pillar links back to it.

## Compliance and release gates

- Legal figures remain exclusively in `components/LawContext.tsx`; content JSON and new connective copy contain no legal figures.
- No outcome promises, superlatives, invented results, or credential claims are introduced.
- New customer-facing audience and connective copy is labeled DRAFT pending attorney review.
- The layout robots directive, `X-Robots-Tag` header, `robots.ts`, and password middleware remain in place.
- Indexing is outside this implementation and must not be requested until Jeff separately authorizes it after attorney review.

## Verification contract

Before production deployment and push to `main`:

1. Run the structural tests to prove exact classification, route uniqueness, redirect completeness, renderability, legal-figure separation, and no orphans.
2. Run a clean `npm run build`.
3. Start the production build and spot-check at least ten randomly selected legacy paths for HTTP 301 redirects to their documented destinations.
4. Confirm the password gate and all noindex layers remain active.
5. Deploy to Vercel production only after all checks pass.
