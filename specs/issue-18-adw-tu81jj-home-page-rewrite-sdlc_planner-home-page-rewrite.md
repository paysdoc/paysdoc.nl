# Feature: Home Page Rewrite

## Metadata
issueNumber: `18`
adwId: `tu81jj-home-page-rewrite`
issueJson: `{"number":18,"title":"Home page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the Home page to target non-technical founders. New hero section with AI-powered headline, professional headshot, and InterestForm CTA. Updated capability cards written in business language.\n\nRefer to the Home Page Rewrite (Module 4) in the parent PRD.\n\n**End-to-end behavior**: A non-technical founder lands on the homepage and sees a professional hero with Martin's headshot, a clear value proposition about AI-powered software engineering, and a form to register interest. Below, capability cards explain what Paysdoc offers in plain business terms — no engineering jargon, no emoji icons.\n\n## Acceptance criteria\n\n- [ ] Hero section: AI-powered headline, subtitle in business language, professional headshot displayed\n- [ ] InterestForm integrated as the primary CTA in the hero\n- [ ] Capability cards rewritten for non-technical audience (no \"PR\", \"CI/CD\", \"webhook\" terminology)\n- [ ] No emoji icons on capability cards — brand-consistent styling instead\n- [ ] Page is responsive on mobile\n- [ ] \"Book a Discovery Call\" and \"View Services\" buttons replaced with new CTAs\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette, fonts, and headshot asset)\n- Blocked by #17 (interest capture — needs InterestForm component)\n\n## User stories addressed\n\n- User story 1 (understand what Paysdoc offers in plain language)\n- User story 2 (register interest in the pilot)\n- User story 4 (see the face of the person behind Paysdoc)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:30Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the Home page (`src/app/page.tsx`) to target non-technical founders as the primary audience. The current page uses engineering jargon ("Multi-agent workflows", "PR", "webhook-driven automation") and emoji icons on capability cards. The rewrite replaces the hero section with a professional layout featuring Martin's headshot, an "AI-Powered Software Engineering" headline with business-language subtitle, and the InterestForm as the primary CTA. The capability cards below the hero are rewritten in plain business language with brand-consistent styling instead of emoji icons.

## User Story
As a non-technical founder visiting paysdoc.nl
I want to see a professional homepage with a clear value proposition, the consultant's photo, and an easy way to register my interest
So that I can understand what Paysdoc offers and take the next step without needing technical knowledge

## Problem Statement
The current homepage speaks to engineers — it mentions "pull requests", "webhook-driven automation", "CI/CD", and "multi-agent workflows". Non-technical founders (the primary target audience) cannot understand what Paysdoc offers. The hero uses generic link buttons ("Book a Discovery Call", "View Services") that don't match the current offering. Capability cards use emoji icons which are inconsistent with the professional brand identity. There is no professional headshot to build trust.

## Solution Statement
Rewrite the Hero component to include Martin's professional headshot, a business-language headline and subtitle, and the InterestForm component as the primary CTA. Rewrite the capability cards in `src/app/page.tsx` to use plain business language (e.g., "Faster Time to Market" instead of "Full SDLC Automation") and replace emoji icons with brand-consistent styled indicators using the burgundy/magenta palette. Remove the "Book a Discovery Call" and "View Services" buttons entirely.

## Relevant Files
Use these files to implement the feature:

- `src/app/page.tsx` — The home page. Contains the `skills` array with emoji icons and engineering jargon. Must be rewritten with new capability cards in business language.
- `src/components/Hero.tsx` — The hero component. Currently has a text-only layout with "Book a Discovery Call" and "View Services" links. Must be rewritten with headshot, new headline/subtitle, and InterestForm.
- `src/components/SkillCard.tsx` — The capability card component. Currently renders emoji via `{icon}` as a text div. Must be updated to render a brand-styled visual indicator instead of emoji.
- `src/components/InterestForm.tsx` — The interest capture form component (already implemented via #17). Will be imported into the new Hero.
- `src/app/globals.css` — Brand CSS variables (burgundy/magenta palette). Reference for styling the updated components.
- `src/app/layout.tsx` — Root layout with metadata. The `description` meta tag should be updated to reflect the new business-focused positioning.
- `public/images/headshot.jpg` — Martin's professional headshot (already present from #16).
- `.claude/commands/test_e2e.md` — E2E test runner instructions. Read when executing E2E tests.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Brand rebrand documentation. Reference for brand colors and styling conventions.
- `app_docs/feature-ncd0ia-interest-capture-api.md` — Interest capture documentation. Reference for InterestForm usage patterns.

### New Files
- `e2e-tests/test_home_page_rewrite.md` — E2E test plan for validating the home page rewrite.

## Implementation Plan
### Phase 1: Foundation
Update the SkillCard component to support brand-styled visual indicators instead of emoji icons. This is the foundational change since both the card data and the component need to agree on how icons are rendered.

### Phase 2: Core Implementation
Rewrite the Hero component with the new layout: professional headshot (using Next.js Image), business-focused headline and subtitle, and InterestForm as the primary CTA. Then rewrite the home page's capability cards data to use plain business language. Update the layout metadata description.

### Phase 3: Integration
Verify responsiveness on mobile. Ensure the InterestForm works correctly in the hero context. Create and run E2E tests to validate all acceptance criteria.

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E test plan
- Create `e2e-tests/test_home_page_rewrite.md` with test steps that validate:
  - Hero displays "AI-Powered Software Engineering" headline
  - Hero subtitle uses business language (no jargon)
  - Professional headshot image is visible in the hero
  - InterestForm (email input + submit button) is present in the hero
  - No "Book a Discovery Call" button exists
  - No "View Services" button exists
  - Capability cards are present with business-language titles
  - No emoji icons visible on capability cards
  - Page is responsive (test at mobile viewport width)
  - Screenshot captures at desktop and mobile widths

### Step 2: Update SkillCard component
- Modify `src/components/SkillCard.tsx`:
  - Change the `icon` prop from rendering emoji text to rendering a brand-styled visual element
  - Use a simple decorative accent bar or dot using `var(--accent)` color instead of emoji
  - Keep the card's existing border, hover, and layout styles
  - Ensure the component remains clean and minimal

### Step 3: Rewrite the Hero component
- Modify `src/components/Hero.tsx`:
  - Add `'use client'` directive (needed because InterestForm is a client component used here, or make Hero a server component that renders InterestForm as a child — evaluate which is cleaner)
  - Import `Image` from `next/image` for the headshot
  - Import `InterestForm` from `@/components/InterestForm`
  - Create a two-column layout (text left, headshot right) that stacks vertically on mobile
  - Left column: headline "AI-Powered Software Engineering", subtitle in business language targeting non-technical founders (e.g., "Turn your business idea into production-ready software. Expert engineering powered by AI, with nearly 30 years of experience behind every decision."), and the InterestForm below the subtitle
  - Right column: `headshot.jpg` displayed as a professional circular or rounded image
  - Remove the "Book a Discovery Call" and "View Services" Link buttons entirely
  - Remove the `next/link` import (no longer needed)
  - Ensure responsive: on mobile, stack headshot above or below the text content

### Step 4: Rewrite capability cards data
- Modify `src/app/page.tsx`:
  - Replace the `skills` array with new capability cards written for non-technical founders
  - Example cards (adjust wording as needed):
    - "Faster Time to Market" — "Go from idea to working software in weeks, not months. AI accelerates development while experienced engineers ensure quality."
    - "Built-In Quality Assurance" — "Every feature is automatically tested and reviewed before delivery. No shortcuts, no technical debt surprises."
    - "Transparent Progress" — "See exactly what's being built and why. Clear updates in plain language, not engineering reports."
    - "Scalable from Day One" — "Architecture designed to grow with your business. Start small, scale confidently as your user base grows."
    - "Full-Stack Capability" — "From database to user interface, one team handles everything. No coordination headaches between multiple vendors."
    - "Nearly 30 Years of Experience" — "Proven track record across banking, retail, energy, and government. Enterprise-grade expertise applied to your startup."
  - Remove emoji icons from card data — use a neutral placeholder or omit the icon field if SkillCard no longer needs it
  - Update the section heading from "What I Build" to something business-appropriate, e.g., "Why Paysdoc"

### Step 5: Update layout metadata
- Modify `src/app/layout.tsx`:
  - Update the `description` in the `metadata` export to reflect the new business-focused positioning
  - E.g.: "AI-powered software engineering with nearly 30 years of full-stack expertise. From idea to production-ready software for non-technical founders."

### Step 6: Run validation commands
- Run `npm run lint` to check for code quality issues
- Run `npx tsc --noEmit` to verify TypeScript types
- Run `npm run build` to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `e2e-tests/test_home_page_rewrite.md` test file to validate this functionality works

## Testing Strategy
### Edge Cases
- Headshot image missing or broken — verify Next.js Image handles alt text gracefully
- InterestForm submission from hero context — ensure API call works identically to other placements (Contact page)
- Very long email addresses in InterestForm should not break the hero layout
- Dark mode: verify headshot, cards, and hero text are readable in both light and dark modes
- Mobile viewport: verify the hero stacks correctly and headshot doesn't overflow

## Acceptance Criteria
- Hero section displays "AI-Powered Software Engineering" headline
- Hero subtitle uses business language — no "PR", "CI/CD", "webhook", "pipeline" terminology
- Professional headshot (`headshot.jpg`) is visible in the hero section
- InterestForm is integrated as the primary CTA in the hero (email input + submit button)
- Capability cards are rewritten for non-technical audience — no engineering jargon
- No emoji icons on capability cards — brand-consistent styling instead
- "Book a Discovery Call" button is removed
- "View Services" button is removed
- Page is responsive on mobile (hero stacks, cards reflow)
- InterestForm submission works (email sent, success message displayed)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Type-check all TypeScript files
- `npm run build` — Build the application to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `e2e-tests/test_home_page_rewrite.md` test file to validate this functionality works

## Notes
- This feature depends on #16 (brand rebrand) and #17 (interest capture) which are already merged. The burgundy palette, Euphemia UCAS font, headshot asset, and InterestForm component are all available.
- The SkillCard component is also used implicitly by name — if other pages reference it, ensure the icon prop change is backward-compatible or update all callers. Currently only `src/app/page.tsx` uses SkillCard.
- The PRD (Module 4) specifies the hero headline as "AI-Powered Software Engineering" — use this exact wording.
- Keep copy concise. Non-technical founders scan quickly — avoid walls of text.
- The `InterestForm` is a `'use client'` component. If Hero remains a server component, InterestForm can still be composed inside it as a client island. No need to make Hero a client component unless it needs its own state.
