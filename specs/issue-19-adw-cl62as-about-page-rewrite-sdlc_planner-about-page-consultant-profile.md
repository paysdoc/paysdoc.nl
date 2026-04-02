# Feature: About Page — Consultant Profile Rewrite

## Metadata
issueNumber: `19`
adwId: `cl62as-about-page-rewrite`
issueJson: `{"number":19,"title":"About page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the About page from an ADW product description to a professional consultant profile. Showcase nearly 30 years of experience, industries served, key project highlights, and technical expertise.\n\nRefer to the About Page Rewrite (Module 5) in the parent PRD.\n\n**End-to-end behavior**: A visitor navigates to the About page and sees a professional profile of Martin Koster — nearly 30 years of full-stack development experience across banking (BMG/ING, ABSA), retail (Nike EMEA), energy (Alliander), government (Ministry of Infrastructure). Technology expertise, languages spoken, and project highlights are presented clearly without revealing sensitive client details.\n\n## Acceptance criteria\n\n- [ ] Professional profile with \"nearly 30 years of experience\" positioning\n- [ ] Industries listed: banking, retail, energy, government, airline\n- [ ] Key project highlights: BMG/ING (payments systems), Nike EMEA (business intelligence), Alliander (infrastructure migration), Ministry of Infrastructure (systems modernisation)\n- [ ] No IP-sensitive project details\n- [ ] Technology expertise summary (TypeScript, JavaScript, Java, React, Node.js, Spring Boot, etc.)\n- [ ] Languages: English, German, Dutch, Afrikaans\n- [ ] All content written for a non-technical audience\n- [ ] No references to ADW architecture or agent internals\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette and fonts)\n\n## User stories addressed\n\n- User story 5 (see consultant's track record)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:35Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the About page (`src/app/about/page.tsx`) from its current ADW-focused product description into a professional consultant profile for Martin Koster. The page will showcase nearly 30 years of full-stack development experience, industries served, key project highlights, technology expertise, and languages spoken. All content is written for a non-technical audience (founders, decision-makers) without referencing ADW internals or IP-sensitive project details.

## User Story
As a visitor
I want to see the consultant's professional profile, track record, and expertise
So that I can assess credibility and decide whether to engage Paysdoc for my project

## Problem Statement
The current About page describes the ADW product in technical language ("autonomous software development systems", "modular TypeScript architecture", "composable workflow phases"). This alienates the target audience of non-technical founders and fails to build trust by showcasing the consultant's extensive real-world experience. There is no mention of industries, project highlights, languages spoken, or years of experience.

## Solution Statement
Replace the entire About page content with a professional consultant profile. Structure the page into clearly scannable sections: an introductory profile summary, industry experience with project highlights, technology expertise, and languages spoken. Use the existing CSS variable system (`var(--foreground)`, `var(--muted)`, `var(--accent)`, `var(--card-bg)`, `var(--border)`) and Tailwind utility classes to maintain consistency with the rest of the site. Include the professional headshot (`public/images/headshot.jpg`) to build personal trust.

## Relevant Files
Use these files to implement the feature:

- `src/app/about/page.tsx` — The About page to be rewritten. Currently contains ADW-focused content that must be completely replaced with the consultant profile.
- `src/app/globals.css` — CSS custom properties (burgundy/magenta palette, light/dark mode). Read-only reference for available color variables.
- `src/app/layout.tsx` — Root layout wrapping all pages (Navbar + Footer). Read-only reference for page structure.
- `src/components/ServiceCard.tsx` — Existing card component pattern with title, description, features list. Reference for card styling conventions.
- `src/components/SkillCard.tsx` — Existing card component with icon, title, description. Reference for card styling conventions.
- `src/app/services/page.tsx` — Example of a content page using cards and consistent styling. Reference for page structure patterns.
- `src/app/page.tsx` — Home page for reference on overall styling patterns and component usage.
- `specs/prd/website-rebrand-and-repositioning.md` — Parent PRD, Module 5 defines the About page requirements.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Brand rebrand documentation; confirms the burgundy/magenta palette and Euphemia UCAS font are in place.
- `.claude/commands/test_e2e.md` — E2E test runner instructions.

### New Files
- `e2e-tests/test_about_page_profile.md` — E2E test plan for validating the About page consultant profile content and layout.

## Implementation Plan
### Phase 1: Foundation
Review the existing About page, CSS variables, and component patterns to understand the styling conventions. Confirm the headshot image is available at `public/images/headshot.jpg`. Plan the page sections: profile header with headshot, experience summary, industry/project highlights, technology expertise, and languages.

### Phase 2: Core Implementation
Rewrite `src/app/about/page.tsx` with the following sections:
1. **Profile header**: Headshot image, name "Martin Koster", title "Full-Stack Developer & Consultant", and a summary paragraph positioning nearly 30 years of experience.
2. **Industries & Project Highlights**: Cards or styled sections for each industry — banking (BMG/ING payments systems, ABSA), retail (Nike EMEA business intelligence), energy (Alliander infrastructure migration), government (Ministry of Infrastructure systems modernisation), airline. High-level descriptions only, no IP-sensitive details.
3. **Technology Expertise**: A summary of core technologies — TypeScript, JavaScript, Java, React, Node.js, Spring Boot, and others.
4. **Languages**: English, German, Dutch, Afrikaans.
5. Update the page metadata title and description for SEO.

### Phase 3: Integration
Verify the page integrates with the existing layout (Navbar, Footer), inherits the burgundy/magenta palette, and renders correctly in both light and dark modes. Run lint, type-check, and build to ensure zero regressions.

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E test plan
- Create `e2e-tests/test_about_page_profile.md` with test steps that validate:
  - The About page loads at `/about`
  - Headshot image is visible
  - "Martin Koster" name is displayed
  - "nearly 30 years" or equivalent experience text is present
  - Industries are listed: banking, retail, energy, government, airline
  - Project highlights are present: BMG/ING, Nike EMEA, Alliander, Ministry of Infrastructure
  - Technology expertise section lists TypeScript, JavaScript, Java, React, Node.js, Spring Boot
  - Languages section lists English, German, Dutch, Afrikaans
  - No references to "ADW", "agent", "webhook", "issue-to-PR", or other technical ADW terminology
  - Page renders correctly in both light and dark mode
  - Screenshots are captured for validation

### Step 2: Rewrite the About page
- Open `src/app/about/page.tsx`
- Replace the entire page content with the consultant profile
- Structure the page as a React Server Component (no `"use client"` directive needed — this is static content)
- **Profile header section**:
  - Import `Image` from `next/image`
  - Render the headshot image (`/images/headshot.jpg`) with appropriate sizing, rounded styling, and alt text
  - Display "Martin Koster" as the primary heading
  - Display "Full-Stack Developer & Consultant" as a subtitle
  - Write a 2-3 sentence summary paragraph: nearly 30 years of experience, worked across banking, retail, energy, government, and airline industries, delivering robust software solutions
- **Industries & Project Highlights section**:
  - Use a section heading "Industries & Project Highlights"
  - Create styled cards or list items for each industry with a brief, non-technical project description:
    - **Banking** — BMG/ING: Payments systems development; ABSA: Banking solutions
    - **Retail** — Nike EMEA: Business intelligence and reporting
    - **Energy** — Alliander: Infrastructure migration and modernisation
    - **Government** — Ministry of Infrastructure and Water Management: Systems modernisation
    - **Airline** — Include without specific client name if none is available
  - Keep descriptions high-level, no IP-sensitive details
- **Technology Expertise section**:
  - Section heading "Technology Expertise"
  - Group technologies logically: Languages (TypeScript, JavaScript, Java), Frontend (React, Next.js), Backend (Node.js, Spring Boot), and any other relevant categories
  - Use a clean visual layout (tags, grid, or grouped list)
- **Languages section**:
  - Section heading "Languages"
  - List: English, German, Dutch, Afrikaans
- Use existing CSS variables: `var(--foreground)`, `var(--muted)`, `var(--accent)`, `var(--card-bg)`, `var(--border)`
- Use Tailwind utility classes consistent with other pages (`max-w-3xl` or `max-w-5xl`, `mx-auto`, `px-6`, `py-20`)
- Update the `Metadata` export: `title: 'About — Martin Koster'` and add a `description` for SEO

### Step 3: Validate content compliance
- Review the written content to ensure:
  - No references to "ADW", "AI Developer Workflow", "agent", "webhook", "issue-to-PR", "pipeline", or any technical ADW terminology
  - No IP-sensitive project details (no revenue figures, no proprietary system names beyond what's publicly known)
  - All content is understandable by a non-technical audience
  - "nearly 30 years of experience" positioning is present

### Step 4: Run validation commands
- Run `npm run lint` — zero errors
- Run `npx tsc --noEmit` — zero type errors
- Run `npm run build` — successful build with no errors
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_about_page_profile.md` to validate the About page content and layout

## Testing Strategy
### Edge Cases
- Dark mode rendering: ensure all text remains readable against the dark background with the burgundy/magenta accent colors
- Long industry/project descriptions: verify they don't break card layouts on narrow screens
- Headshot image missing or slow to load: `next/image` handles lazy loading and fallback alt text
- Mobile responsiveness: verify the page is readable on small screens (the layout should stack vertically)

## Acceptance Criteria
- [ ] Professional profile with "nearly 30 years of experience" positioning is displayed
- [ ] Industries listed: banking, retail, energy, government, airline
- [ ] Key project highlights present: BMG/ING (payments systems), Nike EMEA (business intelligence), Alliander (infrastructure migration), Ministry of Infrastructure (systems modernisation)
- [ ] No IP-sensitive project details are revealed
- [ ] Technology expertise summary includes: TypeScript, JavaScript, Java, React, Node.js, Spring Boot
- [ ] Languages listed: English, German, Dutch, Afrikaans
- [ ] All content is written for a non-technical audience
- [ ] No references to ADW architecture, agents, or internals anywhere on the page
- [ ] Headshot image is displayed on the page
- [ ] Page renders correctly in both light and dark mode
- [ ] Page uses the established burgundy/magenta palette and Euphemia UCAS font
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass with zero errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build validation
npm run build

# Verify no ADW/agent references remain on the About page
grep -i "adw\|agent\|webhook\|issue-to-pr\|pipeline\|orchestrat" src/app/about/page.tsx
# Should return empty output (no matches)
```

Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_about_page_profile.md` to validate this functionality works.

## Notes
- The headshot image already exists at `public/images/headshot.jpg` — no need to source it.
- This feature depends on #16 (brand rebrand) which is already merged — the burgundy/magenta palette and Euphemia UCAS font are in place.
- The page is entirely static content with no client-side interactivity — no `"use client"` directive is needed.
- No new libraries are required for this feature.
- Content should use business-friendly language. Avoid engineering jargon like "PR", "CI/CD", "webhook", "pipeline" on this public-facing page. Use terms like "project", "delivery", "solution", "system" instead.
