# Services Page Rewrite

**ADW ID:** 6q5dst-services-page-rewrit
**Date:** 2026-04-02
**Specification:** specs/issue-20-adw-2jhq2i-services-page-rewrit-sdlc_planner-services-page-rewrite.md

## Overview

The Services page (`/services`) was rewritten to present two distinct service tiers — AI-Powered Development (pilot/coming soon) and Full-Stack Consulting (available now) — replacing the previous three-column technical offering. All copy was rewritten in plain business language targeting non-technical founders, and an industries section was added for credibility.

## What Was Built

- **Two-tier service layout**: replaced three engineering-jargon cards with two business-focused service cards in a responsive two-column grid
- **AI-Powered Development card**: "Coming Soon — Pilot" badge, business-language description, four plain-language features, "Register your interest" CTA linking to `/contact`
- **Full-Stack Consulting card**: "Available Now" badge, nearly 30 years experience description, four business-language features, "Get in touch" CTA linking to `/contact`
- **Industries section**: pill-style tags for Banking, Retail, Energy, Government, and Airline beneath the cards
- **Removed**: "Book a Discovery Call" CTA link and the `Link` import from the page
- **Extended `ServiceCard` component**: additive props for badge, badge variant, and CTA link

## Technical Implementation

### Files Modified

- `src/app/services/page.tsx`: replaced three-service array with two service tier objects; changed grid from `md:grid-cols-3` to `md:grid-cols-2`; removed "Book a Discovery Call" CTA; added industries array and pill-tag section; updated page intro copy
- `src/components/ServiceCard.tsx`: added optional props `badge`, `badgeVariant` (`'pilot' | 'available'`), `ctaText`, `ctaHref`; added badge rendering with variant-based inline style; added CTA `Link` at bottom; added `flex flex-col` and `flex-1` on features list for card height alignment

### Key Changes

- `ServiceCard` badge styling uses CSS variables: `var(--accent)` for "available" variant and `var(--accent-secondary)` for "pilot" variant — fully consistent with the burgundy/magenta brand palette
- Card layout uses `flex flex-col` with `flex-1` on the features list so CTAs align at the bottom regardless of feature count
- Industries rendered as `flex flex-wrap gap-3` pill tags with `border-[var(--border)]` and `bg-[var(--card-bg)]` for brand consistency
- All engineering jargon removed: no "webhook", "CI/CD", "monorepo", "orchestration", "PR", or "pipeline" on the page
- The `InterestForm` is not embedded on the services page; instead the AI card links to `/contact` where the form already lives, keeping the services page a pure Server Component

## How to Use

1. Visit `/services` to see the two service cards side-by-side on desktop (stacked on mobile)
2. Click **Register your interest** on the AI-Powered Development card to navigate to `/contact` and submit the interest form
3. Click **Get in touch** on the Full-Stack Consulting card to navigate to `/contact` for a consulting enquiry
4. The industries section below the cards is informational — no interaction required

## Configuration

No new environment variables or configuration required. The page uses existing CSS custom properties defined in `src/app/globals.css` (`--accent`, `--accent-secondary`, `--accent-hover`, `--muted`, `--border`, `--card-bg`).

## Testing

Run the E2E test plan at `e2e-tests/test_services_page.md` which validates:
- Both service cards are visible with correct badges and copy
- "Register your interest" link points to `/contact`
- Industries (Banking, Retail, Energy, Government, Airline) are listed
- No engineering jargon present
- "Book a Discovery Call" CTA is absent
- Responsive layout at desktop and mobile viewports

Standard validation commands:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Notes

- `ServiceCard` extension is fully additive — the new props are all optional and default to no-op rendering, so any future page using `ServiceCard` without badges/CTAs is unaffected
- The `badgeVariant` type is a literal union (`'pilot' | 'available'`) enforced at compile time; new variants require updating the interface and the `badgeStyle` conditional in `ServiceCard.tsx`
- The features/services.feature BDD scenario file was added as part of this ADW cycle for future regression testing
