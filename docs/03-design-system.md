# Design System — "Mountain West Professional"

## Positioning
Premium law-firm modernism: the opposite of cartoon PI (no red/yellow, no gavel clip-art, no stock handshake photos). Deep navy authority + warm paper + restrained gold, with quiet motion that feels expensive.

## Tokens
| Token | Value | Use |
|---|---|---|
| navy | #003756 | Brand primary (sampled from official Whiteford logo assets) |
| navy-deep | #02243A | Hero/section backgrounds |
| navy-ink | #021B2C | Body text on light |
| paper | #F7F5F1 | Page background (warm, not sterile white) |
| gold | #C6A15B / soft #D9BC85 | Single accent: CTAs, hairlines, markers |
| sky | #8FB8D4 | Secondary accent (mountain-sky), eyebrows on dark |
| slateblue | #3E6079 | Muted labels on light |

Type: **Fraunces Variable** (display serif with real character — headlines, numerals) + **Archivo Variable** (grotesk body). Self-hosted via @fontsource (no Google Fonts request, GDPR-clean, build-safe). Deliberately NOT Inter (the #1 AI-design tell).

## Motion system (CSS-first, ~2KB of JS total)
- **Reveal-on-scroll**: IntersectionObserver toggles a class; 700ms translate+fade, expo-out curve, staggered delays
- **Hero ridgelines**: two layered SVG mountain silhouettes with 36s/52s drift loops (parallax depth without scroll-jacking)
- **Sky glow**: 9s breathing radial gradient
- **Gold hairline**: scaleX grow-in under every H1
- **CTA sheen**: hover-triggered specular sweep
- **FAQ accordion**: pure `<details>` + CSS grid-rows animation (zero JS, accessible by default)
- **prefers-reduced-motion**: every animation removed at the media-query level, not JS
- No Framer Motion → first-load JS stays ~102-111KB and CWV stays green

## Shared components
SiteHeader (sticky, logo + phone CTA + mobile nav) · AnimatedHero · TrustBar · ProcessSteps (4-step) · LawContext (THE single source of legal figures — cap cards + citations) · AttorneyCards (real headshots, jurisdiction-accurate titles) · Faq (schema-paired) · CtaBand (estimator push) · SiteFooter (NAP + attorney-advertising block) · EstimatorWidget (8-step client flow)

## Landing-page template composition
Hero → TrustBar → intro prose (first para enlarged) → localFacts callout (gold-rule aside) → 3 content sections → LawContext → ProcessSteps → AttorneyCards → FAQ → CtaBand → related-links grid. Content JSON drives everything; legal figures render ONLY from LawContext (compliance architecture).

## Compliance-by-architecture
Content agents were structurally barred from writing statutes/figures; one vetted component carries them all. One edit updates 100 pages when law changes (inflation adjustments begin 2028 — this will matter).
