# Feature: Home Page Rewrite

## Metadata
issueNumber: `18`
adwId: `camc0h-home-page-rewrite`
issueJson: `{"number":18,"title":"Home page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the Home page to target non-technical founders. New hero section with AI-powered headline, professional headshot, and InterestForm CTA. Updated capability cards written in business language.\n\nRefer to the Home Page Rewrite (Module 4) in the parent PRD.\n\n**End-to-end behavior**: A non-technical founder lands on the homepage and sees a professional hero with Martin's headshot, a clear value proposition about AI-powered software engineering, and a form to register interest. Below, capability cards explain what Paysdoc offers in plain business terms — no engineering jargon, no emoji icons.\n\n## Acceptance criteria\n\n- [ ] Hero section: AI-powered headline, subtitle in business language, professional headshot displayed\n- [ ] InterestForm integrated as the primary CTA in the hero\n- [ ] Capability cards rewritten for non-technical audience (no \"PR\", \"CI/CD\", \"webhook\" terminology)\n- [ ] No emoji icons on capability cards — brand-consistent styling instead\n- [ ] Page is responsive on mobile\n- [ ] \"Book a Discovery Call\" and \"View Services\" buttons replaced with new CTAs\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette, fonts, and headshot asset)\n- Blocked by #17 (interest capture — needs InterestForm component)\n\n## User stories addressed\n\n- User story 1 (understand what Paysdoc offers in plain language)\n- User story 2 (register interest in the pilot)\n- User story 4 (see the face of the person behind Paysdoc)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:30Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the Home page to target non-technical founders instead of engineers. The current page uses technical jargon ("PR", "CI/CD", "webhook", "issue-to-PR pipeline") and emoji icons that don't match the Paysdoc brand. The rewrite introduces a professional hero section with Martin's headshot, an AI-powered headline in business language, the InterestForm as the primary CTA, and capability cards rewritten for a non-technical audience using brand-consistent styling instead of emoji icons.

## User Story
As a non-technical founder visiting the site
I want to see a clear value proposition in plain language with a professional profile and an easy way to register interest
So that I can quickly understand what Paysdoc offers and express interest in the AI-powered development pilot

## Problem Statement
The current home page speaks to engineers, not to the target audience of non-technical founders. It uses technical terminology ("AI Agent Orchestration", "Full SDLC Automation", "GitHub Integration", "webhook-driven automation"), emoji icons (🤖, 🔄, 🛠, 🌐, 🧪, 📋), and generic CTA buttons ("Book a Discovery Call", "View Services") that don't drive toward the pilot interest capture goal. There is no professional headshot or personal credibility element.

## Solution Statement
Rewrite the Hero component to display Martin's professional headshot alongside an AI-powered headline and business-language subtitle, with InterestForm embedded as the primary CTA. Replace the current technical SkillCard data with business-focused capability cards (no emoji icons, no engineering jargon) that explain what Paysdoc delivers in terms a founder understands. Update the SkillCard component to render a brand-styled accent element instead of an emoji icon.

## Relevant Files
Use these files to implement the feature:

- `src/app/page.tsx` — Home page; contains the skills data array and page layout. Must be rewritten with new business-focused capability data and updated section heading.
- `src/components/Hero.tsx` — Hero section; currently has technical subtitle and two Link CTAs. Must be rewritten with headshot, business-language copy, and InterestForm.
- `src/components/InterestForm.tsx` — Existing interest capture form component (from issue #17). Will be imported into the new Hero. No changes needed.
- `src/components/SkillCard.tsx` — Card component; currently renders an emoji icon. Must be updated to render a brand-consistent accent element instead of emoji.
- `src/app/globals.css` — CSS variables for brand colors. Reference only — no changes needed.
- `src/app/layout.tsx` — Root layout with Navbar/Footer. Reference only — no changes needed.
- `public/images/headshot.jpg` — Professional headshot (2100x1400 JPEG). Will be displayed in the Hero section.
- `specs/prd/website-rebrand-and-repositioning.md` — Parent PRD with Module 4 requirements. Reference for copy direction.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Brand rebrand docs. Reference for color variables and font.
- `app_docs/feature-ncd0ia-interest-capture-api.md` — Interest capture docs. Reference for InterestForm usage.
- `.claude/commands/test_e2e.md` — E2E test runner instructions. Read before running E2E tests.

### New Files
- `e2e-tests/test_home_page_rewrite.md` — E2E test plan validating the rewritten home page

## Implementation Plan
### Phase 1: Foundation
Update the SkillCard component to support brand-consistent styling instead of emoji icons. The component currently accepts an `icon: string` prop that renders emoji text. Replace this with an accent-styled visual element (e.g., a short burgundy/magenta accent bar or decorative element using CSS) so cards have brand-consistent visuals without emoji.

### Phase 2: Core Implementation
1. Rewrite the Hero component:
   - Add the professional headshot (`/images/headshot.jpg`) using Next.js `<Image>` with appropriate sizing and alt text
   - Update headline to "AI-Powered Software Engineering" (per PRD Module 4)
   - Write a business-language subtitle targeting non-technical founders (outcomes, not implementation details)
   - Replace the two Link buttons ("Book a Discovery Call", "View Services") with the InterestForm component
   - Layout: side-by-side on desktop (copy left, headshot right), stacked on mobile

2. Rewrite the home page capability data:
   - Replace the 6 technical skills with business-focused capabilities
   - Use plain language: what the client gets, not how it works technically
   - No terms like "PR", "CI/CD", "webhook", "SDLC", "E2E"
   - Update section heading from "What I Build" to something business-focused

### Phase 3: Integration
Verify the full page renders correctly with the InterestForm (client component) embedded in the Hero, the headshot image loads properly, capability cards display without emoji, and the page is responsive on mobile viewports.

## Step by Step Tasks

### Step 1: Create E2E Test Plan
- Create `e2e-tests/test_home_page_rewrite.md` with test steps validating:
  - Hero shows headshot image
  - Hero headline contains "AI-Powered Software Engineering"
  - Hero subtitle uses business language (no technical jargon)
  - InterestForm is present in the hero section (email input + submit button)
  - No "Book a Discovery Call" or "View Services" buttons exist
  - Capability cards section exists with business-focused content
  - No emoji icons visible on capability cards
  - Page is responsive at mobile viewport (375px width)
  - Screenshots captured at key validation points

### Step 2: Update SkillCard Component
- Modify `src/components/SkillCard.tsx`:
  - Remove the `icon: string` prop from the interface
  - Replace the emoji `<div className="text-3xl mb-4">{icon}</div>` with a brand-styled accent element (a short horizontal bar using `var(--accent)` background color)
  - Keep the title and description rendering unchanged
  - Ensure the card retains its existing hover and border styling

### Step 3: Rewrite Hero Component
- Modify `src/components/Hero.tsx`:
  - Add `'use client'` directive (not needed — InterestForm is already a client component and can be composed in a server component; Hero itself needs no client-side logic)
  - Import `Image` from `next/image`
  - Import `InterestForm` from `@/components/InterestForm`
  - Replace the current content with a two-column layout:
    - Left column: headline "AI-Powered Software Engineering", subtitle in business language (e.g., "Your ideas, built by AI — guided by nearly 30 years of engineering experience. From concept to working software, faster than you thought possible."), InterestForm below the subtitle with a short prompt (e.g., "Join the pilot programme")
    - Right column: `<Image src="/images/headshot.jpg" alt="Martin Koster — Paysdoc founder" width={400} height={400} className="rounded-2xl" />` with object-cover styling
  - Use responsive classes: `flex flex-col md:flex-row` for the two-column layout, image stacks below text on mobile
  - Remove the two Link buttons ("Book a Discovery Call", "View Services") entirely
  - Remove the `import Link from 'next/link'` import

### Step 4: Rewrite Home Page Capability Data
- Modify `src/app/page.tsx`:
  - Import `InterestForm` is NOT needed here (it's in Hero)
  - Replace the `skills` array with business-focused capabilities, for example:
    1. **AI-Built Software** — "Your application developed by AI agents, with an experienced engineer ensuring quality at every step. Ship faster without compromising on reliability."
    2. **From Idea to Product** — "Describe what you need in plain language. We handle the architecture, development, testing, and deployment — you stay focused on your business."
    3. **Experienced Oversight** — "Nearly 30 years of hands-on development across banking, retail, energy, and government. Your project benefits from deep technical experience — without needing to speak the language."
    4. **Rapid Delivery** — "AI-powered workflows compress months of development into weeks. Get a working product in front of your users sooner."
    5. **Transparent Process** — "See exactly what's being built and why. Regular updates, clear documentation, and no surprises."
    6. **Pilot Programme** — "Be among the first to experience AI-powered development with personalised attention. Limited spots available at a reduced rate."
  - Remove the `icon` property from each skill object (since SkillCard no longer accepts it)
  - Update the section heading from "What I Build" to "What You Get"

### Step 5: Run Validation Commands
- Run `npm run lint` to check for linting errors
- Run `npx tsc --noEmit` to check for TypeScript errors
- Run `npm run build` to verify the production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_home_page_rewrite.md` to validate the feature end-to-end

## Testing Strategy
### Edge Cases
- Headshot image loading failure — `<Image>` should have meaningful `alt` text as fallback
- InterestForm submission from the hero (already tested via issue #17, but verify it works in the new location)
- Very long email addresses in InterestForm within the hero layout (should not break the layout)
- Mobile viewport: hero columns stack correctly, headshot scales appropriately
- Dark mode: headshot, accent bars on cards, and InterestForm all render correctly

## Acceptance Criteria
- [ ] Hero section displays headline "AI-Powered Software Engineering"
- [ ] Hero subtitle uses business language — no "PR", "CI/CD", "webhook", "SDLC", "E2E" terms
- [ ] Professional headshot (`/images/headshot.jpg`) is visible in the hero section
- [ ] InterestForm is embedded in the hero as the primary CTA
- [ ] "Book a Discovery Call" and "View Services" buttons are removed
- [ ] Capability cards use business-focused language (no engineering jargon)
- [ ] No emoji icons on capability cards — brand-consistent accent styling instead
- [ ] Page is responsive: hero stacks vertically on mobile, cards reflow
- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run build` succeeds

## Validation Commands

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Production build
npm run build
```

- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_home_page_rewrite.md` to validate the feature end-to-end

## Notes
- The headshot image is 2100x1400px — Next.js `<Image>` will handle responsive sizing and optimization. Use `width` and `height` props for aspect ratio hint and let CSS control the rendered size.
- The SkillCard `icon` prop removal is a breaking change for any other page using SkillCard. Currently only `src/app/page.tsx` uses it, so this is safe.
- Copy in the plan (headlines, subtitles, card text) is directional — the implementer may adjust wording while maintaining the business-language, no-jargon constraint.
- No new npm packages are needed.
- The `InterestForm` component is a `'use client'` component. It can be composed inside a Server Component (Hero) without making Hero a client component — Next.js handles this automatically.
