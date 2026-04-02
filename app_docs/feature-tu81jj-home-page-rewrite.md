# Home Page Rewrite for Non-Technical Founders

**ADW ID:** tu81jj-home-page-rewrite
**Date:** 2026-04-02
**Specification:** specs/issue-18-adw-camc0h-home-page-rewrite-sdlc_planner-home-page-rewrite.md

## Overview

Rewrote the Paysdoc home page to target non-technical founders instead of engineers. The hero section now features Martin's professional headshot, an AI-powered headline in business language, and the InterestForm as the primary CTA. Capability cards were rewritten to eliminate engineering jargon and emoji icons, replaced with brand-consistent accent styling.

## What Was Built

- Redesigned hero section with two-column layout (copy left, headshot right) that stacks vertically on mobile
- Professional headshot (`/images/headshot.jpg`) displayed in the hero alongside headline and CTA
- InterestForm embedded directly in the hero as the primary call-to-action
- Removed "Book a Discovery Call" and "View Services" link buttons
- Six capability cards rewritten in plain business language (no "PR", "CI/CD", "webhook", "SDLC" terminology)
- Emoji icons replaced with a brand-consistent burgundy accent bar on each card
- Section heading updated from "What I Build" to "Why Paysdoc"

## Technical Implementation

### Files Modified

- `src/components/Hero.tsx`: Replaced `Link` buttons with `Image` (headshot) and `InterestForm`; added two-column flex layout with responsive stacking
- `src/components/SkillCard.tsx`: Removed `icon: string` prop; replaced emoji `<div>` with a `w-8 h-1` accent bar using `var(--accent)`
- `src/app/page.tsx`: Replaced `skills` array (technical, with emoji) with `capabilities` array (business-focused, no icons); updated section heading

### Key Changes

- **Hero layout**: `flex flex-col-reverse gap-12 sm:flex-row` — mobile shows headshot below copy, desktop places headshot to the right
- **Headshot**: `<Image>` with `width={260} height={260}`, `priority` flag for LCP optimization, `rounded-2xl object-cover` styling
- **SkillCard accent**: `<div className="w-8 h-1 rounded-full bg-[var(--accent)] mb-4" />` — a short pill-shaped bar using the brand burgundy/magenta accent color
- **Capability copy**: Business outcomes ("Faster Time to Market", "Built-In Quality Assurance", "Transparent Progress") rather than technical features
- **No new dependencies**: All changes use existing components, Next.js `Image`, and Tailwind utilities

## How to Use

1. Navigate to the home page (`/`) — the rewritten hero and capability cards are live
2. The InterestForm in the hero captures email addresses; submissions hit `POST /api/interest` and store to Cloudflare KV (see `app_docs/feature-ncd0ia-interest-capture-api.md`)
3. To update capability card copy, edit the `capabilities` array in `src/app/page.tsx`
4. To update hero copy or layout, edit `src/components/Hero.tsx`
5. To swap the headshot, replace `/public/images/headshot.jpg` (keep filename or update the `src` prop in Hero)

## Configuration

No new environment variables or configuration required. The InterestForm relies on `INTEREST_KV` Cloudflare KV binding already configured in `wrangler.jsonc`.

## Testing

```bash
# Lint and type checks
npm run lint
npx tsc --noEmit

# Production build
npm run build

# E2E test plan
# Read and execute: e2e-tests/test_home_page_rewrite.md
```

Key validations:
- Hero headline reads "AI-Powered Software Engineering"
- Headshot image renders at `/images/headshot.jpg`
- InterestForm is present in the hero section
- No "Book a Discovery Call" or "View Services" buttons exist
- No emoji icons visible on capability cards
- Page is responsive at 375px mobile viewport

## Notes

- The `SkillCard` `icon` prop removal is a breaking change — no other page uses this component so it is safe
- `InterestForm` is a `'use client'` component composed inside the `Hero` server component; Next.js handles this boundary automatically
- The headshot is 2100×1400px — Next.js `<Image>` handles responsive resizing and WebP conversion automatically
- The E2E test plan lives at `e2e-tests/test_home_page_rewrite.md`
