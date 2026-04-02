# How It Works Page

**ADW ID:** 8z0la0-how-it-works-page-ne
**Date:** 2026-04-02
**Specification:** specs/issue-21-adw-8z0la0-how-it-works-page-ne-sdlc_planner-how-it-works-page.md

## Overview

A new marketing page at `/how-it-works` that teases the upcoming AI-powered development service. It presents a three-phase concept — collaborative onboarding, AI-driven development, and expert quality assurance — in business-friendly language targeting non-technical founders. The page uses clear "coming soon" framing and includes an InterestForm CTA so visitors can register interest in the pilot program.

## What Was Built

- New Next.js server component page at `src/app/how-it-works/page.tsx`
- Hero section with headline, "coming soon" label, and introductory copy
- Three-phase grid layout with numbered cards (01, 02, 03) and business-language descriptions
- InterestForm CTA section at the bottom with supporting copy
- BDD feature file (`features/how-it-works-page.feature`) with regression and happy-path scenarios
- E2E test plan (`e2e-tests/test_how_it_works.md`) covering page load, content, responsiveness, and form submission

## Technical Implementation

### Files Modified

- `src/app/how-it-works/page.tsx`: New page — server component with metadata export, three-phase card grid, and InterestForm CTA
- `features/how-it-works-page.feature`: New BDD feature file with 7 scenarios tagged `@adw-8z0la0-how-it-works-page-ne`
- `e2e-tests/test_how_it_works.md`: New E2E test plan with 16 steps covering desktop and mobile viewports
- `specs/issue-21-adw-8z0la0-how-it-works-page-ne-sdlc_planner-how-it-works-page.md`: ADW plan (added)
- `specs/issue-21-adw-dtuuzc-how-it-works-page-ne-sdlc_planner-how-it-works-page.md`: ADW plan variant (added)
- `README.md`: Minor update

### Key Changes

- Page is a React Server Component — no `"use client"` directive. All copy is in the initial HTML; only the embedded `InterestForm` is a client component.
- Three phases are defined as a static `phases` array and rendered via `map`, keeping the data separate from the JSX.
- Styling follows existing page conventions: `max-w-5xl mx-auto px-6 py-20` container, CSS custom properties (`--accent`, `--muted`, `--border`, `--card-bg`) for colors, Tailwind responsive grid (`grid-cols-1 md:grid-cols-3`).
- "Coming soon" is surfaced via a small accent-colored label above the hero headline, plus explicit prose copy stating the service is not yet open to the public.
- No new dependencies, routes, API endpoints, or database changes — the page composes existing infrastructure (navbar link from #16, InterestForm from #17).

## How to Use

1. Navigate to `/how-it-works` in any browser (or click "How It Works" in the navbar).
2. Read the hero section to understand the service proposition and coming-soon status.
3. Scroll through the three phase cards to see how the process works at a high level.
4. Enter an email address in the InterestForm and submit to register interest in the pilot.

## Configuration

No additional configuration required. The page relies on:
- CSS custom properties defined in `src/app/globals.css` (already present)
- The `InterestForm` component and its `/api/interest` endpoint (delivered in #17)
- The `INTEREST_KV` Cloudflare KV namespace binding (configured as part of #17)

## Testing

Run the E2E test plan manually:

```bash
# Start the dev server
npm run dev

# Then follow the steps in e2e-tests/test_how_it_works.md
# Key checks:
#   - Page loads at /how-it-works with title "How It Works"
#   - Three phase headings are visible (Collaborative Onboarding, AI-Driven Development, Expert Quality Assurance)
#   - "Coming Soon" label is visible
#   - No engineering jargon (CI/CD, webhook, pipeline, SDLC, pull request) in copy
#   - InterestForm email input and submit work correctly
#   - Page is responsive at 375px mobile viewport
```

BDD scenarios in `features/how-it-works-page.feature` are tagged `@regression` for automated inclusion in regression runs.

## Notes

- The navbar "How It Works" link was added in #16 and already points to `/how-it-works` — no navbar changes needed.
- All copy targets non-technical founders as the primary audience. Avoid engineering terms if copy is ever updated.
- The three phases are described at a high level intentionally — they should not commit to implementation specifics that may change.
- Light and dark mode are handled automatically via CSS custom properties.
