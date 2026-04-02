# E2E Test: Services Page Rewrite

## Issue
GitHub Issue #20 — Services page rewrite

## Setup
- Start the dev server: `npm run dev`
- Open browser to `http://localhost:3000/services`

## Test Steps

### 1. Page Header
- [ ] The page heading "Our Services" is visible
- [ ] A subtitle targeting non-technical founders is visible below the heading

### 2. AI-Powered Development Card
- [ ] A card titled "AI-Powered Development" is visible on the page
- [ ] The card displays a "Coming Soon — Pilot" badge
- [ ] The card description explains the concept in business language (AI builds, engineer oversees)
- [ ] The card lists "Your application built by AI, guided by an experienced engineer"
- [ ] The card lists "Quality oversight at every step — no corners cut"
- [ ] The card lists "Reduced pilot rate for early adopters"
- [ ] The card lists "Faster delivery without sacrificing reliability"
- [ ] The card contains a "Register your interest" call-to-action link
- [ ] The "Register your interest" link points to `/contact`
- [ ] Screenshot: save as `screenshots/services-ai-card.png`

### 3. Full-Stack Consulting Card
- [ ] A card titled "Full-Stack Consulting" is visible on the page
- [ ] The card displays an "Available Now" badge
- [ ] The card description mentions nearly 30 years of experience
- [ ] The card lists "Nearly 30 years of software engineering experience"
- [ ] The card lists "Proven track record in banking, retail, energy, and government"
- [ ] The card lists "Full project lifecycle — from architecture to delivery"
- [ ] The card contains a "Get in touch" call-to-action link
- [ ] The "Get in touch" link points to `/contact`
- [ ] Screenshot: save as `screenshots/services-consulting-card.png`

### 4. Industries Section
- [ ] An "Industries We've Worked In" heading is visible below the cards
- [ ] "Banking" is listed as an industry
- [ ] "Retail" is listed as an industry
- [ ] "Energy" is listed as an industry
- [ ] "Government" is listed as an industry
- [ ] "Airline" is listed as an industry
- [ ] Screenshot: save as `screenshots/services-industries.png`

### 5. Removed CTA
- [ ] No "Book a Discovery Call" button or link is visible anywhere on the page

### 6. No Engineering Jargon
- [ ] The page does not contain the text "issue-to-PR"
- [ ] The page does not contain the text "webhook"
- [ ] The page does not contain the text "CI/CD"
- [ ] The page does not contain the text "multi-agent orchestration"
- [ ] The page does not contain the text "monorepo"
- [ ] The page does not contain the text "PR" as a standalone term

### 7. Mobile Responsiveness (375px viewport)
- [ ] Resize browser viewport to 375px wide
- [ ] The two service cards stack vertically (single column)
- [ ] All card content is readable without horizontal scrolling
- [ ] Industries section is fully visible
- [ ] Screenshot: save as `screenshots/services-mobile.png`

### 8. Desktop Layout (1280px viewport)
- [ ] At desktop width, the two service cards appear side-by-side (two columns)
- [ ] Both cards are equal height / aligned
- [ ] Screenshot: save as `screenshots/services-desktop.png`

### 9. Brand Styling Integration
- [ ] Card borders use the brand border color
- [ ] Badge on "Coming Soon — Pilot" card uses secondary accent color (purple/muted)
- [ ] Badge on "Available Now" card uses primary accent color (magenta/burgundy)
- [ ] CTA links use the accent color

## Expected Result
All checkboxes pass. Two distinct service cards visible. Industries section present. No "Book a Discovery Call" CTA. No engineering jargon. Responsive layout.

## Validation Commands
```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build

# Verify no engineering jargon in services page
grep -i "webhook\|CI/CD\|issue-to-PR\|pull request\|multi-agent\|orchestration\|monorepo" src/app/services/page.tsx
# Should return empty

# Verify "Book a Discovery Call" is removed
grep -i "Book a Discovery Call" src/app/services/page.tsx
# Should return empty
```
