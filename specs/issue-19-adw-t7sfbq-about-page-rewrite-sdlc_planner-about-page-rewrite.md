# Feature: About Page Rewrite

## Metadata
issueNumber: `19`
adwId: `t7sfbq-about-page-rewrite`
issueJson: `{"number":19,"title":"About page rewrite","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nRewrite the About page from an ADW product description to a professional consultant profile. Showcase nearly 30 years of experience, industries served, key project highlights, and technical expertise.\n\nRefer to the About Page Rewrite (Module 5) in the parent PRD.\n\n**End-to-end behavior**: A visitor navigates to the About page and sees a professional profile of Martin Koster — nearly 30 years of full-stack development experience across banking (BMG/ING, ABSA), retail (Nike EMEA), energy (Alliander), government (Ministry of Infrastructure). Technology expertise, languages spoken, and project highlights are presented clearly without revealing sensitive client details.\n\n## Acceptance criteria\n\n- [ ] Professional profile with \"nearly 30 years of experience\" positioning\n- [ ] Industries listed: banking, retail, energy, government, airline\n- [ ] Key project highlights: BMG/ING (payments systems), Nike EMEA (business intelligence), Alliander (infrastructure migration), Ministry of Infrastructure (systems modernisation)\n- [ ] No IP-sensitive project details\n- [ ] Technology expertise summary (TypeScript, JavaScript, Java, React, Node.js, Spring Boot, etc.)\n- [ ] Languages: English, German, Dutch, Afrikaans\n- [ ] All content written for a non-technical audience\n- [ ] No references to ADW architecture or agent internals\n\n## Blocked by\n\n- Blocked by #16 (brand rebrand — needs burgundy palette and fonts)\n\n## User stories addressed\n\n- User story 5 (see consultant's track record)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:35Z","comments":[],"actionableComment":null}`

## Feature Description
Rewrite the About page (`src/app/about/page.tsx`) from an ADW product description to a professional consultant profile for Martin Koster. The current page describes the AI Developer Workflow system with technical language about agents, pipelines, and orchestration. The new page must present a credible professional profile showcasing nearly 30 years of full-stack development experience across major industries, key project highlights (written at a high level without IP-sensitive details), technology expertise, and languages spoken — all written for a non-technical audience.

## User Story
As a visitor evaluating Paysdoc
I want to see the consultant's professional track record, industries, and expertise
So that I can assess credibility and decide whether to engage for my project

## Problem Statement
The current About page positions Paysdoc as an AI/ADW automation product, using deeply technical language ("modular TypeScript architecture", "composable workflow phases", "SDLC pipelines"). Non-technical founders — the primary audience — cannot assess the consultant's credibility or experience from this content. There is no mention of industries served, project history, or years of experience.

## Solution Statement
Replace the entire About page content with a professional consultant profile structured into clear sections: an introduction with "nearly 30 years of experience" positioning, industries served with key project highlights, a technology expertise summary, and languages spoken. Use the existing page layout patterns (CSS custom properties, Tailwind utility classes) and keep all content at a high level suitable for non-technical readers.

## Relevant Files
Use these files to implement the feature:

- `src/app/about/page.tsx` — The About page to be rewritten. Currently contains ADW-focused content that must be entirely replaced with the professional consultant profile.
- `src/app/globals.css` — CSS custom properties (--foreground, --muted, --accent, --border, --card-bg) used for consistent theming. Read-only reference for styling.
- `src/app/layout.tsx` — Root layout wrapping all pages with Navbar, Footer, and Providers. Read-only reference for page structure.
- `src/components/ServiceCard.tsx` — Example of a card component pattern with border, bg, and list items. Reference pattern for any card-style sections.
- `src/app/services/page.tsx` — Example of a content page using data arrays and card components. Reference pattern for page structure.
- `public/images/headshot.jpg` — Professional headshot photo available for use on the About page.
- `app_docs/feature-37wzob-brand-rebrand-styling.md` — Documents the brand rebrand (burgundy palette, Euphemia UCAS font) that this page must use. Read for reference.
- `.claude/commands/test_e2e.md` — E2E test runner instructions. Read when executing the E2E test.
- `.claude/commands/e2e-examples/test_basic_query.md` — E2E test example format (if available, otherwise use `e2e-tests/test_brand_rebrand.md` as reference).

### New Files
- `e2e-tests/test_about_page.md` — E2E test plan validating the About page content and layout.

## Implementation Plan
### Phase 1: Foundation
No new components or infrastructure are needed. The brand rebrand (#16) has already established the burgundy/magenta palette, Euphemia UCAS font, and CSS custom properties. The About page is a server component (no client-side interactivity required), so no `"use client"` directive is needed. The professional headshot is already available at `public/images/headshot.jpg`.

### Phase 2: Core Implementation
Rewrite `src/app/about/page.tsx` with a structured professional profile:

1. **Hero/Introduction section**: Martin Koster's name as heading, "nearly 30 years of experience" subtitle, professional headshot image, brief introductory paragraph positioning as a full-stack developer and consultant.

2. **Industries & Project Highlights section**: A visually distinct section listing industries served with key project highlights for each:
   - Banking: BMG/ING (payments systems), ABSA
   - Retail: Nike EMEA (business intelligence)
   - Energy: Alliander (infrastructure migration)
   - Government: Ministry of Infrastructure (systems modernisation)
   - Airline (mentioned without specific client details)

3. **Technology Expertise section**: A summary of technical skills grouped logically — languages (TypeScript, JavaScript, Java), frontend (React), backend (Node.js, Spring Boot), and broader capabilities. Written for a non-technical audience (e.g. "Modern web technologies" rather than framework version numbers).

4. **Languages section**: English, German, Dutch, Afrikaans — presented as a simple list.

### Phase 3: Integration
The page integrates naturally with the existing layout — Navbar links already point to `/about`, the Footer and Providers wrap the page automatically via `layout.tsx`. Update the page metadata title and description for SEO. No routing changes needed.

## Step by Step Tasks

### Step 1: Create E2E test plan
- Create `e2e-tests/test_about_page.md` with test steps that validate:
  - Page loads at `/about` without errors
  - Martin Koster's name is displayed as a heading
  - "nearly 30 years" text is present
  - Industries are listed: banking, retail, energy, government, airline
  - Project highlights are visible: BMG/ING, Nike EMEA, Alliander, Ministry of Infrastructure
  - Technology expertise section mentions TypeScript, JavaScript, Java, React, Node.js, Spring Boot
  - Languages section lists English, German, Dutch, Afrikaans
  - Professional headshot image is displayed
  - No references to "ADW", "agent", "pipeline", "SDLC", "orchestration", or "webhook" appear on the page
  - Page uses the burgundy/magenta brand palette (no blue)
  - Content is readable and well-structured on desktop and mobile viewports
  - Screenshot steps at key sections

### Step 2: Rewrite the About page
- Open `src/app/about/page.tsx`
- Replace all existing content with the professional consultant profile
- Structure the page with these sections:

**Metadata**: Update `metadata` export with descriptive title ("About Martin Koster") and add a description meta tag for SEO.

**Introduction/Hero**:
- `<h1>` with "Martin Koster" 
- Subtitle: "Full-Stack Developer & Consultant"
- Professional headshot using `next/image` (`public/images/headshot.jpg`) with appropriate alt text, sized and rounded
- Introductory paragraph: nearly 30 years of experience, full-stack development, working with organisations from startups to enterprise across multiple industries

**Industries & Project Highlights**:
- Section heading: "Industries & Experience"
- Use card-style layout (following ServiceCard/SkillCard patterns with `--border`, `--card-bg` CSS variables)
- Each industry as a card with:
  - **Banking**: Payments systems and financial infrastructure at BMG/ING and ABSA
  - **Retail**: Business intelligence and data platforms at Nike EMEA
  - **Energy**: Infrastructure migration and modernisation at Alliander
  - **Government**: Systems modernisation at the Ministry of Infrastructure and Water Management
  - **Airline**: Operational systems (no specific client named)
- Keep descriptions high-level, no IP-sensitive details
- Written for non-technical audience (e.g., "built systems that process financial transactions" not "implemented JMS message queues")

**Technology Expertise**:
- Section heading: "Technology Expertise"
- Group technologies into digestible categories for non-technical readers:
  - Languages: TypeScript, JavaScript, Java
  - Frontend: React, Next.js
  - Backend: Node.js, Spring Boot
  - Also mention: cloud platforms, databases, CI/CD (at a high level)
- Use a clean layout (grid or list with accent-colored checkmarks following the ServiceCard pattern)

**Languages Spoken**:
- Section heading: "Languages"
- List: English, German, Dutch, Afrikaans
- Simple, clean presentation

**Styling requirements**:
- Use existing CSS custom properties: `var(--foreground)`, `var(--muted)`, `var(--accent)`, `var(--border)`, `var(--card-bg)`
- Follow the same `max-w-` container and `px-6 py-20` spacing pattern used by other pages
- Use `next/image` for the headshot with proper width/height and alt text
- Ensure responsive layout (single column on mobile, multi-column grid on desktop for cards)

### Step 3: Validate — run linter, type-check, and build
- Run `npm run lint` to check for code quality issues
- Run `npx tsc --noEmit` to verify TypeScript compiles without errors
- Run `npm run build` to confirm the production build succeeds with zero errors

### Step 4: Run E2E test
- Read `.claude/commands/test_e2e.md` for E2E test runner instructions
- Read and execute `e2e-tests/test_about_page.md` to validate the About page content and layout

## Testing Strategy

### Edge Cases
- Dark mode: verify all text remains readable against the dark background with the burgundy/magenta palette
- Mobile viewport: verify the page layout is readable and cards stack vertically on narrow screens
- Image loading: headshot should display with proper aspect ratio and not cause layout shift (use explicit width/height on `next/image`)
- No ADW references: ensure zero mentions of "ADW", "agent", "pipeline", "SDLC", "orchestration", "webhook", or "issue-to-PR" on the page

## Acceptance Criteria
- [ ] Professional profile with "nearly 30 years of experience" positioning is prominently displayed
- [ ] Industries listed: banking, retail, energy, government, airline
- [ ] Key project highlights visible: BMG/ING (payments systems), Nike EMEA (business intelligence), Alliander (infrastructure migration), Ministry of Infrastructure (systems modernisation)
- [ ] No IP-sensitive project details revealed
- [ ] Technology expertise summary includes TypeScript, JavaScript, Java, React, Node.js, Spring Boot
- [ ] Languages section lists English, German, Dutch, Afrikaans
- [ ] All content is written for a non-technical audience — no engineering jargon
- [ ] No references to ADW architecture, agent internals, pipelines, or webhooks
- [ ] Page uses the Paysdoc burgundy/magenta brand palette (CSS custom properties)
- [ ] Professional headshot is displayed
- [ ] Page builds, lints, and type-checks without errors
- [ ] E2E test `e2e-tests/test_about_page.md` passes

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Lint check
npm run lint

# TypeScript type-check
npx tsc --noEmit

# Production build
npm run build

# Verify no ADW/agent references remain on the About page
grep -i "adw\|agent\|pipeline\|sdlc\|orchestrat\|webhook\|issue-to-pr" src/app/about/page.tsx
# Should return empty output (exit code 1 = no matches = correct)

# Verify key content is present
grep -i "nearly 30 years" src/app/about/page.tsx
grep -i "banking\|retail\|energy\|government\|airline" src/app/about/page.tsx
grep -i "typescript\|javascript\|java\|react\|node.js\|spring boot" src/app/about/page.tsx
grep -i "english\|german\|dutch\|afrikaans" src/app/about/page.tsx
# All four should return matches
```

Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_about_page.md` to validate this functionality works.

## Notes
- The brand rebrand (#16) is a completed dependency — the burgundy/magenta palette, Euphemia UCAS font, and Navbar/Footer are already in place. No styling infrastructure work is needed.
- The professional headshot is already available at `public/images/headshot.jpg` — no asset copying required.
- The About page is a React Server Component (no `"use client"` directive needed) since it has no client-side interactivity.
- Content must be written for non-technical founders as the primary audience per the PRD. Avoid terms like "PR", "CI/CD", "webhook", "issue-to-PR pipeline", "orchestration".
- The airline industry is mentioned without naming a specific client, per the issue acceptance criteria.
- No new libraries are required for this feature.
