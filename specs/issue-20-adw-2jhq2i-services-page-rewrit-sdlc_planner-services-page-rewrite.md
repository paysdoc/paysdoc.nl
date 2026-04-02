# Feature: Services Page Rewrite

## Metadata
issueNumber: `20`
adwId: `2jhq2i-services-page-rewrit`
issueJson: `{"number":20,"title":"Services page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the Services page to present two distinct service tiers: (1) AI-Powered Development pilot as a coming-soon teaser, and (2) Full-Stack Consulting as an available-now offering. List industries served for credibility.\n\nRefer to the Services Page Rewrite (Module 6) in the parent PRD.\n\n**End-to-end behavior**: A visitor navigates to the Services page and sees two clear offerings. The AI-Powered Development card explains the concept (AI builds, experienced engineer oversees quality) and is marked as a pilot with a nudge to register interest. The Full-Stack Consulting card presents traditional consulting with nearly 30 years of track record and lists industries served. The visitor understands both options and their availability.\n\n## Acceptance criteria\n\n- [ ] AI-Powered Development service card: teaser/coming soon framing, concept explanation in business language, nudge to register interest\n- [ ] Full-Stack Consulting service card: available now, nearly 30 years experience, industries served\n- [ ] Industries listed for credibility (banking, retail, energy, government, airline)\n- [ ] No engineering jargon — written for non-technical founders\n- [ ] Existing \"Book a Discovery Call\" CTA removed or replaced\n- [ ] Page is responsive on mobile\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette and fonts)\n\n## User stories addressed\n\n- User story 1 (understand what Paysdoc offers in plain language)\n- User story 6 (understand difference between AI offering and traditional consulting)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:41Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the Services page (`/services`) to present two distinct service tiers instead of the current three technical offerings. The first tier is **AI-Powered Development** — a coming-soon pilot where AI builds the application while an experienced engineer oversees quality. The second tier is **Full-Stack Consulting** — an available-now traditional consulting offering backed by nearly 30 years of experience. Industries served (banking, retail, energy, government, airline) are listed for credibility. All copy uses business language targeted at non-technical founders. The existing "Book a Discovery Call" CTA is replaced.

## User Story
As a non-technical founder visiting the Services page
I want to see two clear service offerings explained in plain language
So that I can understand the difference between the AI-powered pilot and traditional consulting, and choose the right option for my needs

## Problem Statement
The current Services page presents three technically-worded offerings ("AI Development Workflow Setup", "Custom Agent Development", "TypeScript Architecture & Consulting") with engineering jargon ("webhook integration", "multi-agent orchestration", "modular monorepo architecture"). This speaks to engineers, not the target audience of non-technical founders. The page also has a "Book a Discovery Call" CTA that links to the contact page without context. The content does not reflect the current business positioning: an AI-powered development pilot (coming soon) alongside established full-stack consulting.

## Solution Statement
Replace the three-column technical service cards with a two-column layout presenting the two service tiers. Each tier gets a distinct card with different visual framing: the AI-Powered Development card is marked as a pilot/coming soon with a nudge to register interest (linking to the contact page's InterestForm), while the Full-Stack Consulting card is marked as available now. An industries section lists the sectors served for credibility. All copy is rewritten in business language. The "Book a Discovery Call" CTA is removed entirely.

## Relevant Files
Use these files to implement the feature:

- `src/app/services/page.tsx` — The services page to rewrite. Contains the services data array, page layout, and "Book a Discovery Call" CTA link.
- `src/components/ServiceCard.tsx` — Existing card component with title, description, and features list. Will need to be extended or replaced to support the two-tier design (badge/label, different CTA per card).
- `src/components/InterestForm.tsx` — Existing interest capture form component. Referenced from the AI-Powered Development card's "register interest" nudge (link to /contact, not embedded inline).
- `src/app/globals.css` — CSS custom properties (burgundy/magenta palette, card-bg, border, muted). Used for consistent styling.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Documents the brand rebrand (color palette, fonts) that this feature builds upon.
- `.claude/commands/test_e2e.md` — E2E test runner instructions. Read before executing the E2E test.

### New Files
- `e2e-tests/test_services_page.md` — E2E test plan validating the rewritten Services page content, layout, and responsiveness.

## Implementation Plan
### Phase 1: Foundation
Extend the `ServiceCard` component to support optional badge/label text (e.g., "Coming Soon", "Available Now") and an optional CTA element (link or button). This keeps the component reusable while accommodating the two distinct card types needed for the services page.

### Phase 2: Core Implementation
Rewrite `src/app/services/page.tsx`:
- Replace the three-service data array with two service tier objects containing business-language copy.
- AI-Powered Development card: pilot/coming-soon badge, concept explanation in plain language, "Register Interest" link to `/contact`.
- Full-Stack Consulting card: available-now badge, nearly 30 years experience, key capabilities in business terms.
- Add an industries section below the cards listing banking, retail, energy, government, and airline.
- Remove the "Book a Discovery Call" CTA link.
- Use a responsive two-column grid (stacking to single column on mobile).

### Phase 3: Integration
Validate the page renders correctly with the burgundy/magenta brand palette, is responsive on mobile, and integrates cleanly with the existing Navbar and Footer. Create and run E2E tests to confirm acceptance criteria.

## Step by Step Tasks

### Step 1: Create E2E test file
- Create `e2e-tests/test_services_page.md` with test steps that validate:
  - Two service cards are visible (AI-Powered Development and Full-Stack Consulting)
  - AI-Powered Development card shows "coming soon" or "pilot" framing
  - AI-Powered Development card has a "Register Interest" link pointing to `/contact`
  - Full-Stack Consulting card shows "available now" framing
  - Full-Stack Consulting card mentions nearly 30 years of experience
  - Industries are listed: banking, retail, energy, government, airline
  - No "Book a Discovery Call" CTA exists on the page
  - No engineering jargon: assert absence of terms like "webhook", "CI/CD", "monorepo", "PR", "pipeline"
  - Page is responsive: take screenshots at desktop and mobile viewport widths
- Follow the format of existing E2E tests in `e2e-tests/` (User Story, Test Steps, Success Criteria, Output Format)

### Step 2: Extend ServiceCard component
- Read `src/components/ServiceCard.tsx`
- Add optional props: `badge?: string` (label text like "Coming Soon" or "Available Now"), `badgeVariant?: 'accent' | 'muted'` (to style the badge differently per tier), and `cta?: { label: string; href: string }` (optional call-to-action link)
- Render the badge as a small label at the top of the card using `var(--accent)` or `var(--muted)` background
- Render the CTA as a styled link at the bottom of the card if provided
- Keep existing props (title, description, features) working as before — no breaking changes

### Step 3: Rewrite the services page
- Read `src/app/services/page.tsx`
- Replace the `services` array with two service tier objects:
  - **AI-Powered Development**: badge "Pilot — Coming Soon", description explaining in business language that AI builds the application while an experienced engineer oversees quality and minimises technical debt, features list using non-technical language (e.g., "Your application built faster with AI assistance", "Experienced engineer reviews every change", "Quality-first approach — no shortcuts", "Reduced-rate pilot pricing"), CTA linking to `/contact` with label "Register Interest"
  - **Full-Stack Consulting**: badge "Available Now", description highlighting nearly 30 years of full-stack development experience across major industries, features list (e.g., "Web applications and business systems", "System architecture and modernisation", "Technical strategy and advisory", "Hands-on development and delivery"), no CTA (or a CTA to `/contact` with different label)
- Change the grid from `md:grid-cols-3` to `md:grid-cols-2` for the two-card layout
- Add an industries section below the cards: a heading "Industries We've Worked In" followed by a list/grid of industries (Banking & Financial Services, Retail & E-Commerce, Energy & Utilities, Government & Public Sector, Airline & Travel) — styled consistently with the brand
- Remove the "Book a Discovery Call" `Link` and its surrounding `div`
- Update the page intro text to be business-focused (e.g., "Two ways to work with Paysdoc — choose the option that fits your needs")

### Step 4: Validate responsiveness
- Ensure the two-column card grid stacks to single column on mobile (`grid-cols-1 md:grid-cols-2`)
- Ensure the industries section is readable on mobile
- Ensure text sizes and padding are appropriate at all breakpoints

### Step 5: Run validation commands
- Run `npm run lint` — zero errors
- Run `npx tsc --noEmit` — zero type errors
- Run `npm run build` — successful build with no errors
- Read `.claude/commands/test_e2e.md`, then read and execute the new `e2e-tests/test_services_page.md` E2E test to validate the feature works as expected

## Testing Strategy

### Edge Cases
- Page renders correctly when viewed on narrow mobile screens (320px width)
- Badge text does not overflow on small screens
- "Register Interest" link navigates correctly to `/contact`
- Industries section is readable with long industry names
- Dark mode renders all elements with correct contrast using the burgundy/magenta palette
- No orphaned engineering jargon remains anywhere on the page

## Acceptance Criteria
- [ ] AI-Powered Development service card is present with "Pilot" / "Coming Soon" framing
- [ ] AI-Powered Development card explains the concept in business language (AI builds, engineer oversees quality)
- [ ] AI-Powered Development card has a "Register Interest" link to `/contact`
- [ ] Full-Stack Consulting service card is present with "Available Now" framing
- [ ] Full-Stack Consulting card mentions nearly 30 years of experience
- [ ] Industries listed for credibility: banking, retail, energy, government, airline
- [ ] No engineering jargon on the page — no "webhook", "CI/CD", "monorepo", "PR", "pipeline", "orchestration"
- [ ] "Book a Discovery Call" CTA is removed
- [ ] Page is responsive: two-column on desktop, single column on mobile
- [ ] Page uses the burgundy/magenta brand palette (no blue)
- [ ] Build passes with zero errors (`npm run build`)
- [ ] Lint passes with zero errors (`npm run lint`)
- [ ] Type check passes with zero errors (`npx tsc --noEmit`)

## Validation Commands

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm run build
```

Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_services_page.md` to validate the services page rewrite end-to-end.

## Notes
- The `InterestForm` component is not embedded directly on the services page. Instead, the AI-Powered Development card links to `/contact` where the InterestForm already exists. This avoids duplicating the form and keeps the services page as a Server Component (no `"use client"` needed).
- The `ServiceCard` component extensions (badge, CTA) are additive — existing usage on the services page is being rewritten anyway, and no other page currently uses `ServiceCard`.
- `.adw/project.md` does not have a `## Unit Tests` section, so no unit tests are included in this plan.
- No new libraries are needed for this feature.
