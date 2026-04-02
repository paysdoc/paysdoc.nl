# Feature: Services Page Rewrite

## Metadata
issueNumber: `20`
adwId: `6q5dst-services-page-rewrit`
issueJson: `{"number":20,"title":"Services page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the Services page to present two distinct service tiers: (1) AI-Powered Development pilot as a coming-soon teaser, and (2) Full-Stack Consulting as an available-now offering. List industries served for credibility.\n\nRefer to the Services Page Rewrite (Module 6) in the parent PRD.\n\n**End-to-end behavior**: A visitor navigates to the Services page and sees two clear offerings. The AI-Powered Development card explains the concept (AI builds, experienced engineer oversees quality) and is marked as a pilot with a nudge to register interest. The Full-Stack Consulting card presents traditional consulting with nearly 30 years of track record and lists industries served. The visitor understands both options and their availability.\n\n## Acceptance criteria\n\n- [ ] AI-Powered Development service card: teaser/coming soon framing, concept explanation in business language, nudge to register interest\n- [ ] Full-Stack Consulting service card: available now, nearly 30 years experience, industries served\n- [ ] Industries listed for credibility (banking, retail, energy, government, airline)\n- [ ] No engineering jargon — written for non-technical founders\n- [ ] Existing \"Book a Discovery Call\" CTA removed or replaced\n- [ ] Page is responsive on mobile\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette and fonts)\n\n## User stories addressed\n\n- User story 1 (understand what Paysdoc offers in plain language)\n- User story 6 (understand difference between AI offering and traditional consulting)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:41Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the Services page (`/services`) to replace three technically-worded service cards with two clearly differentiated service tiers targeting non-technical founders:

1. **AI-Powered Development (Pilot)** — a coming-soon teaser explaining the concept (AI builds your application, an experienced engineer oversees quality and minimises technical debt) with a nudge to register interest for the reduced-rate pilot.
2. **Full-Stack Consulting (Available Now)** — traditional consulting backed by nearly 30 years of experience across banking, retail, energy, government, and airline industries.

The page removes the "Book a Discovery Call" CTA button and replaces it with contextual calls-to-action on each card. All copy uses business language — no engineering jargon.

## User Story
As a non-technical founder visiting the Services page
I want to see two clearly differentiated service offerings written in plain language
So that I can understand what Paysdoc offers and choose the right service for my needs

## Problem Statement
The current Services page presents three technically-worded cards ("AI Development Workflow Setup", "Custom Agent Development", "TypeScript Architecture & Consulting") using engineering jargon ("issue-to-PR pipelines", "multi-agent orchestration", "webhook integration"). Non-technical founders — the primary audience — cannot understand or evaluate these offerings. There is no distinction between what's available now and what's coming soon, and the generic "Book a Discovery Call" CTA doesn't guide visitors toward a specific action.

## Solution Statement
Replace the three technical service cards with two distinct cards that clearly communicate availability and value:

- The **AI-Powered Development** card uses coming-soon framing with a brief, jargon-free explanation of the concept and a link to register interest (leveraging the existing InterestForm on `/contact`).
- The **Full-Stack Consulting** card emphasises immediate availability, nearly 30 years of track record, and lists industries served for credibility.
- A shared "Industries We've Worked In" section provides additional credibility below the cards.
- The "Book a Discovery Call" CTA is removed entirely, replaced by per-card contextual CTAs.

## Relevant Files
Use these files to implement the feature:

- `src/app/services/page.tsx` — the Services page to be rewritten; currently renders three technical ServiceCards and a "Book a Discovery Call" link
- `src/components/ServiceCard.tsx` — existing card component (title, description, features list); will be extended with optional props for status badges and CTA variants
- `src/components/InterestForm.tsx` — existing interest capture form component; the AI-Powered Development card will link to `/contact` where this form lives
- `src/app/globals.css` — CSS variables (`--accent`, `--accent-secondary`, `--border`, `--card-bg`, `--muted`) used for styling cards
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — documents the burgundy/magenta palette and brand styling (dependency #16, already merged)
- `app_docs/feature-ncd0ia-interest-capture-api.md` — documents the interest capture API and InterestForm component
- `.claude/commands/test_e2e.md` — E2E test runner instructions
- `.claude/commands/e2e-examples/test_basic_query.md` — E2E test example format (directory may not exist; use `e2e-tests/test_brand_rebrand.md` as format reference)

### New Files
- `e2e-tests/test_services_page.md` — E2E test plan to validate the rewritten Services page

## Implementation Plan
### Phase 1: Foundation
Extend the `ServiceCard` component to support the two new card variants. The current component accepts `title`, `description`, and `features` props. It needs optional props for:
- A status badge (e.g., "Coming Soon — Pilot", "Available Now")
- A CTA button/link at the bottom of the card (text + href)
- Badge styling variant (to visually distinguish pilot vs available)

This keeps the existing component backwards-compatible while enabling the new page layout.

### Phase 2: Core Implementation
Rewrite `src/app/services/page.tsx`:
- Replace the three-card grid with a two-card responsive grid (`md:grid-cols-2`)
- AI-Powered Development card: "Coming Soon — Pilot" badge, plain-language concept explanation, features written for non-technical readers, CTA linking to `/contact` to register interest
- Full-Stack Consulting card: "Available Now" badge, nearly 30 years experience narrative, features/capabilities in business language, CTA linking to `/contact`
- Add an "Industries We've Worked In" section below the cards listing banking, retail, energy, government, and airline
- Remove the "Book a Discovery Call" link entirely
- Update page metadata/subtitle for the new positioning

### Phase 3: Integration
Verify the page integrates with the existing brand styling (burgundy/magenta palette, Euphemia UCAS font), navigation (Navbar "Services" link), and responsive layout. Ensure mobile responsiveness with single-column stacking on small screens.

## Step by Step Tasks

### Step 1: Create E2E Test Plan
- Create `e2e-tests/test_services_page.md` with test steps that validate all acceptance criteria
- Include steps for: verifying both cards, checking badge text, confirming industries list, verifying no "Book a Discovery Call" button, checking mobile responsiveness
- Use the format from `e2e-tests/test_brand_rebrand.md` as reference

### Step 2: Extend ServiceCard Component
- Read `src/components/ServiceCard.tsx`
- Add optional props to the `ServiceCardProps` interface:
  - `badge?: string` — text for a status badge (e.g., "Coming Soon — Pilot")
  - `badgeVariant?: 'pilot' | 'available'` — styling variant for the badge
  - `ctaText?: string` — CTA button label
  - `ctaHref?: string` — CTA button link target
- Render the badge at the top of the card when provided:
  - `pilot` variant: muted/secondary background with `--accent-secondary` color
  - `available` variant: accent background with `--accent` color
- Render a CTA link at the bottom of the card when `ctaText` and `ctaHref` are provided
- Ensure existing usage (if any other page uses ServiceCard without new props) still works

### Step 3: Rewrite Services Page
- Read `src/app/services/page.tsx`
- Replace the `services` array and page content entirely
- New page structure:
  1. **Page header**: "Our Services" heading with a subtitle targeting non-technical founders (e.g., "Whether you're looking for cutting-edge AI-powered development or seasoned consulting expertise, we have the right solution for your project.")
  2. **Two-card grid** (`grid-cols-1 md:grid-cols-2 gap-8`):
     - **AI-Powered Development** card:
       - Badge: "Coming Soon — Pilot"
       - Badge variant: `pilot`
       - Description: Business-language explanation of the concept — AI builds your application while an experienced engineer oversees every step, ensuring quality and minimising technical debt
       - Features (jargon-free):
         - "Your application built by AI, guided by an experienced engineer"
         - "Quality oversight at every step — no corners cut"
         - "Reduced pilot rate for early adopters"
         - "Faster delivery without sacrificing reliability"
       - CTA: "Register your interest" linking to `/contact`
     - **Full-Stack Consulting** card:
       - Badge: "Available Now"
       - Badge variant: `available`
       - Description: Nearly 30 years of hands-on experience delivering software solutions across some of the world's most demanding industries
       - Features (jargon-free):
         - "Nearly 30 years of software engineering experience"
         - "Proven track record in banking, retail, energy, and government"
         - "Full project lifecycle — from architecture to delivery"
         - "TypeScript, Java, React, and modern web technologies"
       - CTA: "Get in touch" linking to `/contact`
  3. **Industries section** below the cards:
     - Heading: "Industries We've Worked In"
     - List/grid of industries: Banking, Retail, Energy, Government, Airline
     - Brief, credibility-building presentation (could be simple badges or a styled list)
- Remove the "Book a Discovery Call" `<Link>` entirely
- Keep the `Metadata` export with title "Services"

### Step 4: Run Validation Commands
- Run `npm run lint` to check code quality
- Run `npx tsc --noEmit` to verify TypeScript correctness
- Run `npm run build` to ensure no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_services_page.md` to validate the feature end-to-end

## Testing Strategy

### Edge Cases
- ServiceCard renders correctly when optional props (badge, CTA) are not provided (backwards compatibility)
- Page displays correctly on narrow mobile viewport (single column, no horizontal overflow)
- Long industry names don't break the layout
- Dark mode rendering: badge colors and card backgrounds adapt correctly
- "Register your interest" and "Get in touch" links navigate to `/contact` correctly

## Acceptance Criteria
- [ ] AI-Powered Development service card is visible with "Coming Soon — Pilot" badge, plain-language concept explanation, and a "Register your interest" CTA linking to `/contact`
- [ ] Full-Stack Consulting service card is visible with "Available Now" badge, nearly 30 years experience mention, and a "Get in touch" CTA linking to `/contact`
- [ ] Industries are listed on the page: Banking, Retail, Energy, Government, Airline
- [ ] All copy is written in business language — no terms like "PR", "CI/CD", "webhook", "issue-to-PR", "multi-agent orchestration"
- [ ] The "Book a Discovery Call" CTA button is removed
- [ ] Page is responsive: two-column grid on desktop, single column on mobile
- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] `npm run build` succeeds

## Validation Commands

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build

# Verify no engineering jargon leaked into the services page
grep -i "webhook\|CI/CD\|issue-to-PR\|pull request\|multi-agent\|orchestration\|monorepo" src/app/services/page.tsx
# Should return empty

# Verify "Book a Discovery Call" is removed
grep -i "Book a Discovery Call" src/app/services/page.tsx
# Should return empty
```

Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_services_page.md` to validate this functionality works.

## Notes
- The brand rebrand (issue #16) is already merged — the burgundy/magenta palette and Euphemia UCAS font are in place. This feature builds on that foundation.
- The InterestForm component already exists and is used on `/contact`. The AI-Powered Development card links to `/contact` rather than embedding the form inline, keeping the Services page as a Server Component (no `"use client"` needed).
- The existing `ServiceCard` component is extended rather than replaced, maintaining backwards compatibility.
- No new libraries are needed for this feature.
- Copy tone should match the parent PRD guidance: speak to non-technical founders, lead with business outcomes, avoid engineering terminology.
