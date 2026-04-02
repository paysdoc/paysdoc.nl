# About Page — Consultant Profile Rewrite

**ADW ID:** cl62as-about-page-rewrite
**Date:** 2026-04-02
**Specification:** specs/issue-19-adw-cl62as-about-page-rewrite-sdlc_planner-about-page-consultant-profile.md

## Overview

The About page has been completely rewritten from an ADW product description into a professional consultant profile for Martin Koster. The page showcases nearly 30 years of full-stack development experience across banking, retail, energy, government, and airline industries, written for a non-technical audience of founders and decision-makers. All references to ADW internals, agents, and technical pipeline language have been removed.

## Screenshots

N/A — no screenshots were provided for this feature.

## What Was Built

- Profile header with headshot image, name, title, and experience summary paragraph
- Industries & Project Highlights section with cards for 5 sectors (banking, retail, energy, government, airline) and named project highlights
- Technology Expertise section grouped into 4 categories (Languages, Frontend, Backend, Practices)
- Languages section listing English, Dutch, German, and Afrikaans with proficiency levels
- Updated SEO metadata (title and description)
- E2E test plan at `e2e-tests/test_about_page_profile.md`

## Technical Implementation

### Files Modified

- `src/app/about/page.tsx`: Complete rewrite from ADW product page to consultant profile; added `Image` from `next/image`; page expanded from ~55 lines to ~170 lines
- `e2e-tests/test_about_page_profile.md`: New E2E test plan for validating profile content, layout, and absence of ADW references

### Key Changes

- **Static data arrays** — `industries`, `techGroups`, and `languages` are defined as typed constant arrays at module scope, keeping the JSX clean and declarative
- **Headshot integration** — `next/image` with `priority` flag renders `public/images/headshot.jpg` as a circular portrait (160×160, `rounded-full`, `border-[var(--border)]`) in a responsive flex header
- **Industry cards** — 2-column responsive grid (`grid-cols-1 md:grid-cols-2`) using `var(--card-bg)` and `var(--border)` CSS variables; each card lists sector icon, sector name, and client highlights
- **Tech tags** — 4-column responsive grid (`lg:grid-cols-4`) with accent-coloured group labels (`text-[var(--accent)] uppercase tracking-wider`)
- **Language pills** — flex-wrap row of pill badges with client/level pairs
- **SEO metadata** — `title: 'About — Martin Koster'` and a descriptive `description` field added to the `Metadata` export

## How to Use

1. Navigate to `/about` to view the consultant profile page.
2. The profile renders as a React Server Component — no client-side JavaScript is required.
3. Content is maintained directly in the `industries`, `techGroups`, and `languages` arrays in `src/app/about/page.tsx`.

To add a new industry or update a project highlight, edit the `industries` array:
```tsx
{
  sector: 'Finance',
  icon: '💳',
  highlights: [
    { client: 'Client Name', description: 'High-level project description.' },
  ],
}
```

To add a technology group, append to `techGroups`. To add a spoken language, append to `languages`.

## Configuration

No environment variables or configuration changes are required. The headshot image must exist at `public/images/headshot.jpg` (already present).

## Testing

Run the E2E test plan in `e2e-tests/test_about_page_profile.md` to validate:
- Page loads at `/about`
- Headshot, name, and experience summary are visible
- All 5 industry sectors and named project highlights are present
- Technology expertise and languages sections are complete
- No ADW/agent terminology appears anywhere on the page
- Light and dark mode render correctly

Run `npm run lint && npx tsc --noEmit && npm run build` to confirm zero regressions.

## Notes

- This feature depends on the brand rebrand (#16, already merged) — the burgundy/magenta CSS variables and Euphemia UCAS font must be present for correct rendering.
- The page is entirely static content; no `"use client"` directive is used.
- Airline industry entry intentionally omits a specific client name to avoid disclosing sensitive engagement details.
- Content deliberately avoids engineering jargon ("PR", "CI/CD", "webhook", "pipeline") throughout, using business-friendly language instead.
