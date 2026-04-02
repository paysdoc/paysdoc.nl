# E2E Test: About Page — Professional Consultant Profile

## Issue
GitHub Issue #19 — About page rewrite

## User Story
As a visitor evaluating Paysdoc
I want to see the consultant's professional track record, industries, and expertise
So that I can assess credibility and decide whether to engage for my project

## Setup
- Start the dev server: `npm run dev`
- Open browser to `http://localhost:3000/about`

## Test Steps

### 1. Page loads without errors
- **Navigate** to `http://localhost:3000/about`
- **Verify** the page loads with HTTP 200 (no error page)
- **Verify** the Paysdoc navbar is visible at the top
- **Verify** the footer is visible at the bottom
- Screenshot: save as `screenshots/about-page-full.png`

### 2. Hero / Introduction section
- **Verify** "Martin Koster" appears as a prominent heading (`<h1>`)
- **Verify** "Full-Stack Developer" or "Consultant" subtitle text is visible
- **Verify** "nearly 30 years" text is present on the page
- **Verify** a professional headshot image is displayed (img with src containing "headshot")
- Screenshot: save as `screenshots/about-hero.png`

### 3. Industries & Experience section
- **Verify** a section heading containing "Industries" is visible
- **Verify** "Banking" is listed as an industry
- **Verify** "Retail" is listed as an industry
- **Verify** "Energy" is listed as an industry
- **Verify** "Government" is listed as an industry
- **Verify** "Airline" is listed as an industry
- Screenshot: save as `screenshots/about-industries.png`

### 4. Project highlights
- **Verify** "BMG" or "ING" is mentioned (payments systems / banking)
- **Verify** "Nike" is mentioned (retail / EMEA)
- **Verify** "Alliander" is mentioned (energy / infrastructure)
- **Verify** "Ministry of Infrastructure" is mentioned (government)

### 5. Technology expertise section
- **Verify** a section heading containing "Technology" or "Expertise" is visible
- **Verify** "TypeScript" is mentioned
- **Verify** "JavaScript" is mentioned
- **Verify** "Java" is mentioned
- **Verify** "React" is mentioned
- **Verify** "Node.js" is mentioned
- **Verify** "Spring Boot" is mentioned
- Screenshot: save as `screenshots/about-technology.png`

### 6. Languages section
- **Verify** a section heading "Languages" is visible
- **Verify** "English" is listed
- **Verify** "German" is listed
- **Verify** "Dutch" is listed
- **Verify** "Afrikaans" is listed
- Screenshot: save as `screenshots/about-languages.png`

### 7. No ADW / technical jargon references
- **Verify** the text "ADW" does NOT appear on the page
- **Verify** the word "agent" does NOT appear on the page (case-insensitive)
- **Verify** the word "pipeline" does NOT appear on the page (case-insensitive)
- **Verify** the word "SDLC" does NOT appear on the page
- **Verify** the word "orchestrat" does NOT appear on the page (case-insensitive)
- **Verify** the word "webhook" does NOT appear on the page (case-insensitive)

### 8. Brand palette — burgundy/magenta (no blue)
- **Verify** no blue (#2563eb, #1d4ed8, #3b82f6) color is used for accent or CTA elements
- **Verify** accent elements (checkmarks, headings) appear in the magenta/burgundy palette
- Screenshot: save as `screenshots/about-brand-palette.png`

### 9. Mobile viewport
- **Resize** browser to 375×812 (iPhone SE portrait)
- **Verify** the page is readable and cards/sections stack vertically
- **Verify** no horizontal scroll bar appears
- **Verify** headshot image is still visible and properly sized
- Screenshot: save as `screenshots/about-mobile.png`

### 10. Desktop viewport
- **Resize** browser to 1280×800 (desktop)
- **Verify** industry cards appear in a multi-column grid layout
- **Verify** content has appropriate max-width constraints (not stretched edge-to-edge)
- Screenshot: save as `screenshots/about-desktop.png`

## Success Criteria
- [ ] Page loads at `/about` without errors
- [ ] "Martin Koster" heading is displayed
- [ ] "nearly 30 years" text is present
- [ ] All five industries listed: banking, retail, energy, government, airline
- [ ] All four project highlights visible: BMG/ING, Nike EMEA, Alliander, Ministry of Infrastructure
- [ ] Technology section mentions TypeScript, JavaScript, Java, React, Node.js, Spring Boot
- [ ] Languages section lists English, German, Dutch, Afrikaans
- [ ] Professional headshot image is displayed
- [ ] Zero references to ADW, agent, pipeline, SDLC, orchestration, webhook
- [ ] Burgundy/magenta brand palette used (no blue)
- [ ] Page is readable on both mobile and desktop viewports

## Validation Commands
```bash
# Verify no ADW/agent references remain
grep -i "adw\|agent\|pipeline\|sdlc\|orchestrat\|webhook\|issue-to-pr" src/app/about/page.tsx
# Should return empty output

# Verify key content is present
grep -i "nearly 30 years" src/app/about/page.tsx
grep -i "banking\|retail\|energy\|government\|airline" src/app/about/page.tsx
grep -i "typescript\|javascript\|java\|react\|node.js\|spring boot" src/app/about/page.tsx
grep -i "english\|german\|dutch\|afrikaans" src/app/about/page.tsx

npm run lint
npx tsc --noEmit
npm run build
```
