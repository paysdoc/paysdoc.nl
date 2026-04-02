# E2E Test Plan: About Page — Consultant Profile

## Test: About page loads

**Steps:**
1. Navigate to `/about`
2. Verify the page loads with HTTP 200 and no error messages

**Expected:** Page renders without errors.

---

## Test: Headshot image is visible

**Steps:**
1. Navigate to `/about`
2. Locate an `<img>` element with `alt` containing "Martin Koster"

**Expected:** The headshot image is visible on the page.

---

## Test: Consultant name is displayed

**Steps:**
1. Navigate to `/about`
2. Check for the text "Martin Koster" in an `<h1>` heading

**Expected:** "Martin Koster" appears as the primary heading.

---

## Test: Experience positioning

**Steps:**
1. Navigate to `/about`
2. Check for the text "nearly 30 years" anywhere on the page

**Expected:** The phrase "nearly 30 years" is present.

---

## Test: Industries are listed

**Steps:**
1. Navigate to `/about`
2. Verify the following industry keywords appear on the page (case-insensitive):
   - "banking"
   - "retail"
   - "energy"
   - "government"
   - "airline"

**Expected:** All five industry keywords are present.

---

## Test: Project highlights are present

**Steps:**
1. Navigate to `/about`
2. Verify the following project/client references appear on the page:
   - "BMG" or "ING"
   - "Nike EMEA" or "Nike"
   - "Alliander"
   - "Ministry of Infrastructure"

**Expected:** All four project highlights are present.

---

## Test: Technology expertise section

**Steps:**
1. Navigate to `/about`
2. Locate a section with heading "Technology Expertise" or similar
3. Verify the following technologies are listed:
   - "TypeScript"
   - "JavaScript"
   - "Java"
   - "React"
   - "Node.js"
   - "Spring Boot"

**Expected:** All six technologies are listed.

---

## Test: Languages section

**Steps:**
1. Navigate to `/about`
2. Locate a section with heading "Languages" or similar
3. Verify the following languages are listed:
   - "English"
   - "German"
   - "Dutch"
   - "Afrikaans"

**Expected:** All four languages are listed.

---

## Test: No ADW/agent terminology

**Steps:**
1. Navigate to `/about`
2. Inspect the full page text for any of the following terms (case-insensitive):
   - "ADW"
   - "AI Developer Workflow"
   - "agent"
   - "webhook"
   - "issue-to-PR"
   - "pipeline"
   - "orchestrat"

**Expected:** None of these terms appear anywhere on the page.

---

## Test: Light mode rendering

**Steps:**
1. Set browser color scheme to light mode
2. Navigate to `/about`
3. Take a screenshot

**Expected:** Page renders correctly; text is readable against the light background; accent colors (burgundy/magenta) are visible.

---

## Test: Dark mode rendering

**Steps:**
1. Set browser color scheme to dark mode
2. Navigate to `/about`
3. Take a screenshot

**Expected:** Page renders correctly; text is readable against the dark background; accent colors are visible.

---

## Test: Mobile responsiveness

**Steps:**
1. Set browser viewport to 375px wide (mobile)
2. Navigate to `/about`
3. Take a screenshot

**Expected:** Page content stacks vertically and is readable without horizontal overflow.

---

## Screenshots

Capture screenshots at the following breakpoints:
- Desktop (1280px wide) — light mode
- Desktop (1280px wide) — dark mode
- Mobile (375px wide)
