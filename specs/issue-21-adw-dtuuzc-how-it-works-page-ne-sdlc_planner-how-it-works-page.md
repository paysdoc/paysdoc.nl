# Feature: How It Works Page

## Metadata
issueNumber: `21`
adwId: `dtuuzc-how-it-works-page-ne`
issueJson: `{"number":21,"title":"How It Works page (new)","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nA new page at `/how-it-works` that teases the upcoming ADW-as-a-service offering. High-level three-phase concept written for non-technical readers, with clear \"coming soon\" framing and an InterestForm CTA.\n\nRefer to the How It Works Page (Module 7) in the parent PRD.\n\n**End-to-end behavior**: A visitor navigates to \"How It Works\" from the navbar and sees a teaser page explaining AI-assisted development with experienced human oversight. Three phases are presented at a high level: (1) collaborative onboarding, (2) AI-driven development, (3) expert quality assurance. The page makes clear this is coming soon and invites the visitor to register interest via the InterestForm.\n\n## Acceptance criteria\n\n- [ ] New page at `/how-it-works` with appropriate metadata\n- [ ] Three-phase concept explained in business language (no engineering jargon)\n- [ ] Clear \"coming soon\" / teaser framing — does not promise features that are not yet available\n- [ ] InterestForm integrated as CTA\n- [ ] Page is responsive on mobile\n- [ ] Accessible from the navbar \"How It Works\" link (added in #16)\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette, fonts, and navbar link)\n- Blocked by #17 (interest capture — needs InterestForm component)\n\n## User stories addressed\n\n- User story 7 (understand at a high level how AI-assisted development works)\n- User story 2 (register interest in the pilot)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:50Z","comments":[],"actionableComment":null}`

## Feature Description
A new marketing page at `/how-it-works` that teases the upcoming ADW-as-a-service (AI-powered development) offering. The page explains a three-phase concept — collaborative onboarding, AI-driven development, and expert quality assurance — in business-friendly language for non-technical founders. It uses clear "coming soon" framing and includes an InterestForm CTA so visitors can register their interest in the pilot program.

This page builds on dependencies already delivered: the burgundy brand palette and navbar "How It Works" link from #16, and the InterestForm component from #17.

## User Story
As a non-technical founder visiting the site
I want to understand at a high level how AI-assisted development works
So that I can decide if it is relevant to my project and register my interest in the pilot

## Problem Statement
The site currently lacks an explanation of how the AI-powered development service works. Visitors who see the "AI-Powered Development (Pilot)" teaser on the Services page have no way to learn more about the process before deciding to register interest. A dedicated page is needed to bridge this gap and build confidence in the offering.

## Solution Statement
Create a new page at `/how-it-works` following the existing page conventions (Next.js App Router, server component with metadata export, Tailwind CSS utility classes using CSS custom properties). The page will present three phases of AI-assisted development in accessible, non-technical language with clear "coming soon" positioning. An InterestForm CTA is placed at the bottom to convert interested visitors. The navbar already links to this route (added in #16).

## Relevant Files
Use these files to implement the feature:

- `src/app/layout.tsx` — Root layout that wraps all pages with Navbar, Footer, and Providers. No changes needed but important for understanding the page shell.
- `src/app/globals.css` — CSS custom properties (--accent, --muted, --border, --card-bg, etc.) and font definitions used for styling.
- `src/app/contact/page.tsx` — Reference for how InterestForm is imported and used on a page. Pattern to follow for the CTA section.
- `src/app/services/page.tsx` — Reference for page structure, metadata export, and card-based layout patterns.
- `src/app/about/page.tsx` — Reference for simple content page structure with text sections.
- `src/components/InterestForm.tsx` — The reusable client component for email interest capture. Import and render on the new page.
- `src/components/Navbar.tsx` — Already contains "How It Works" link at `/how-it-works`. No changes needed.
- `specs/prd/website-rebrand-and-repositioning.md` — Parent PRD, Module 7 defines the How It Works page requirements.
- `.claude/commands/test_e2e.md` — E2E test runner instructions for validating the page.
- `e2e-tests/test_brand_rebrand.md` — E2E test example for reference on test format.
- `e2e-tests/test_interest_capture.md` — E2E test example for InterestForm testing patterns.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Brand rebrand documentation (conditional: working with color palette, CSS variables).
- `app_docs/feature-ncd0ia-interest-capture-api.md` — Interest capture documentation (conditional: working with InterestForm component).

### New Files
- `src/app/how-it-works/page.tsx` — The new How It Works page component.
- `e2e-tests/test_how_it_works.md` — E2E test plan for the How It Works page.

## Implementation Plan
### Phase 1: Foundation
Create the E2E test file that defines the expected behavior of the How It Works page. This test-first approach ensures clear acceptance criteria are documented before implementation begins.

### Phase 2: Core Implementation
Create the new page at `src/app/how-it-works/page.tsx` as a React Server Component. The page will:
- Export metadata with title "How It Works"
- Present a hero section with a headline and "coming soon" subtitle
- Display three phase cards explaining the AI-assisted development process in business language
- Include an InterestForm CTA section at the bottom
- Use existing CSS custom properties and Tailwind utility classes for consistent styling
- Be fully responsive using the existing grid/flex patterns

### Phase 3: Integration
The page integrates naturally with the existing site:
- The navbar already links to `/how-it-works` (added in #16)
- The InterestForm component is already built and available (from #17)
- The page uses the same layout (Navbar, Footer, Providers) via the root layout
- No additional routing, API, or database changes are needed

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E test file
- Create `e2e-tests/test_how_it_works.md` with test steps that validate:
  - Page loads at `/how-it-works` without errors
  - Page title/metadata is set correctly
  - A headline about AI-assisted development is visible
  - "Coming soon" or teaser framing text is present
  - Three phases are displayed: (1) collaborative onboarding, (2) AI-driven development, (3) expert quality assurance
  - Each phase has a heading and description in business language (no engineering jargon)
  - InterestForm is present with email input and submit button
  - Page is accessible from the navbar "How It Works" link
  - Page is responsive (check mobile viewport)
  - Screenshots are captured at key points
- Follow the format of existing E2E tests (`e2e-tests/test_brand_rebrand.md`, `e2e-tests/test_interest_capture.md`)

### Step 2: Create the How It Works page
- Create `src/app/how-it-works/page.tsx`
- Export metadata: `{ title: 'How It Works' }`
- Structure the page with these sections:
  1. **Hero section**: Headline (e.g., "How AI-Powered Development Works"), subtitle with "coming soon" / teaser framing explaining this is an upcoming service, and a brief intro paragraph
  2. **Three-phase section**: Three cards/blocks explaining the process:
     - Phase 1: Collaborative Onboarding — we learn about your business, goals, and requirements together
     - Phase 2: AI-Driven Development — AI builds your application while an experienced engineer guides the process
     - Phase 3: Expert Quality Assurance — every deliverable is reviewed by a senior developer with nearly 30 years of experience
  3. **CTA section**: Import and render `InterestForm` with supporting text inviting visitors to register interest
- Use business-friendly language throughout — no engineering jargon (no "PR", "CI/CD", "webhook", "pipeline")
- Follow existing page patterns:
  - `max-w-5xl mx-auto px-6 py-20` for container
  - `text-[var(--muted)]` for secondary text
  - `text-[var(--foreground)]` for emphasis
  - `text-[var(--accent)]` for accent elements
  - `border-[var(--border)]` and `bg-[var(--card-bg)]` for cards
- Ensure responsive layout: single column on mobile, multi-column grid on larger screens

### Step 3: Run validation commands
- Run `npm run lint` to check for code quality issues
- Run `npx tsc --noEmit` to verify TypeScript types
- Run `npm run build` to verify the build succeeds with zero errors
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `e2e-tests/test_how_it_works.md` test file to validate this functionality works

## Testing Strategy
### Edge Cases
- Page renders correctly with no JavaScript (server component, so content should be in initial HTML except for InterestForm which is a client component)
- Page displays correctly in both light and dark mode (uses CSS custom properties that handle both)
- Long phase descriptions don't break the card layout on small screens
- InterestForm submission works correctly from this page (same component as Contact page)
- Navbar "How It Works" link correctly highlights as active when on this page (pathname matching already handled in Navbar component)

## Acceptance Criteria
- New page is accessible at `/how-it-works` and renders without errors
- Page has appropriate metadata (title: "How It Works")
- Three phases are clearly presented: collaborative onboarding, AI-driven development, expert quality assurance
- All copy uses business-friendly language — no engineering jargon
- "Coming soon" / teaser framing is clearly visible — does not promise features that are not yet available
- InterestForm is rendered and functional as a CTA
- Page is responsive on mobile viewports
- Navbar "How It Works" link navigates to this page and shows active state
- Page passes lint, type check, and build without errors
- E2E test passes all steps

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Lint check
npm run lint

# TypeScript type check
npx tsc --noEmit

# Build verification
npm run build
```

Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `e2e-tests/test_how_it_works.md` test file to validate this functionality works.

## Notes
- The navbar already contains the "How It Works" link pointing to `/how-it-works` (delivered in #16). No navbar changes needed.
- The InterestForm component is fully built and functional (delivered in #17). Simply import and render it.
- All copy must target non-technical founders as the primary audience per the parent PRD. Avoid terms like "PR", "CI/CD", "webhook", "issue-to-PR pipeline", "SDLC".
- The three phases should be described at a high level without committing to implementation specifics that may change, per Module 7 of the PRD.
- The page is a server component by default (no "use client" directive needed) — only InterestForm brings in client-side interactivity.
- No new libraries or dependencies are required for this feature.
