# Feature: Brand Rebrand — Styling, Assets, Navbar, Footer

## Metadata
issueNumber: `16`
adwId: `37wzob-brand-rebrand-stylin`
issueJson: `{"number":16,"title":"Brand rebrand: styling, assets, navbar, footer","body":"## Parent PRD\n\n`specs/prd/website-rebrand-and-repositioning.md`\n\n## What to build\n\nApply the Paysdoc huisstijl to the website end-to-end: burgundy/magenta color palette, self-hosted Euphemia UCAS font, logo icon in the navbar, updated favicon, and a redesigned footer with business details.\n\nThis is the visual foundation that all other issues build on. Refer to the Brand Rebrand module (Module 1) in the parent PRD for full details.\n\n**End-to-end behavior**: A visitor lands on any page and sees the Paysdoc brand identity — burgundy/magenta colors, Euphemia UCAS typography, logo icon + styled \"PAYSDOC consultancy\" text in the navbar, and a footer with GitHub, LinkedIn, KVK number (50250574), and Voorburg address. Both light and dark mode render correctly with the new palette.\n\n## Acceptance criteria\n\n- [ ] Euphemia UCAS font files (Regular, Bold, Italic) are self-hosted in `public/fonts/` and loaded via `@font-face`\n- [ ] CSS variables in `globals.css` use burgundy/magenta palette for both light and dark mode\n- [ ] `logo-simpel.png` is in `public/` and rendered in the Navbar alongside styled \"PAYSDOC consultancy\" text\n- [ ] Headshot photo is copied to `public/` (ready for use by other issues)\n- [ ] `favicon.ico` replaced with the Paysdoc favicon from huisstijl\n- [ ] Navbar includes \"How It Works\" link\n- [ ] Dashboard/Admin links only visible to authenticated users\n- [ ] Footer includes LinkedIn link, KVK number (50250574), and Voorburg address\n- [ ] Light mode and dark mode both render correctly with the new palette\n- [ ] No remaining references to the old blue (#2563eb) color scheme\n\n## Blocked by\n\nNone — can start immediately.\n\n## User stories addressed\n\n- User story 3 (professional, consistent visual identity)\n- User story 9 (responsive and readable)\n- User story 10 (dark mode with Paysdoc brand)\n- User story 12 (Login/Dashboard hidden from unauthenticated visitors)\n- User story 14 (KVK and address in footer)\n- User story 15 (Paysdoc logo in navbar)\n- User story 17 (custom font without layout shift)","state":"OPEN","author":"paysdoc","labels":[],"createdAt":"2026-04-02T17:46:08Z","comments":[],"actionableComment":null}`

## Feature Description
Apply the Paysdoc huisstijl (brand identity) to the website end-to-end. This involves replacing the current blue (#2563eb) color scheme with the burgundy/magenta palette from the brand kit, self-hosting the Euphemia UCAS font, updating the Navbar to show the Paysdoc logo icon alongside styled "PAYSDOC consultancy" text, replacing the favicon, adding a "How It Works" navigation link, and redesigning the Footer with LinkedIn, KVK number (50250574), and Voorburg address. Both light and dark mode must render correctly with the new palette.

## User Story
As a visitor to paysdoc.nl
I want to see a professional, consistent Paysdoc brand identity across all pages
So that I trust the company and recognize it as a credible consultancy

## Problem Statement
The website currently uses a generic blue (#2563eb) color scheme, the default Geist font, and a minimal footer without business details. There is no brand identity — no logo, no custom typography, no company registration or address. This undermines trust and recognition for a professional consultancy.

## Solution Statement
Replace the entire visual foundation with the Paysdoc huisstijl: self-host Euphemia UCAS fonts, define burgundy/magenta CSS custom properties for light and dark mode, render the logo icon in the navbar with styled brand text, update the favicon, add navigation for "How It Works", ensure auth-gated links remain hidden for unauthenticated users, and fill the footer with complete business details (LinkedIn, GitHub, KVK, address).

## Relevant Files
Use these files to implement the feature:

### Existing Files to Modify
- `src/app/globals.css` — CSS custom properties defining the color palette; replace blue values with burgundy/magenta for both light and dark mode; add `@font-face` declarations for Euphemia UCAS
- `src/app/layout.tsx` — Root layout; replace Geist font loading with local Euphemia UCAS font, update CSS variable names and body class
- `src/components/Navbar.tsx` — Replace text logo with `logo-simpel.png` image + styled "PAYSDOC consultancy" text; add "How It Works" link; ensure Dashboard/Admin links stay auth-gated (already the case)
- `src/components/Footer.tsx` — Add LinkedIn link, KVK number (50250574), Voorburg address
- `src/components/Hero.tsx` — Uses `var(--accent)` for CTA button; verify it picks up new palette (no changes expected)
- `src/components/ServiceCard.tsx` — Uses `var(--accent)` for checkmarks; verify it picks up new palette (no changes expected)
- `src/components/SkillCard.tsx` — Uses `var(--accent)` for hover border; verify it picks up new palette (no changes expected)
- `src/app/favicon.ico` — Replace with Paysdoc favicon from huisstijl
- `next.config.ts` — May need to update if image domains or font config changes (unlikely)
- `.claude/commands/test_e2e.md` — Reference for E2E test runner execution
- `app_docs/feature-id4hh3-auth-bootstrap-social-login.md` — Reference for Navbar auth state patterns (modifying Navbar auth behavior)

### New Files
- `public/fonts/EuphemiaUCAS-Regular.ttf` — Self-hosted font file (copied from `~/Downloads/huisstijl/Euphemia-UCAS/Euphemia UCAS Regular 2.6.6.ttf`)
- `public/fonts/EuphemiaUCAS-Bold.ttf` — Self-hosted font file (copied from `~/Downloads/huisstijl/Euphemia-UCAS/Euphemia UCAS Bold 2.6.6.ttf`)
- `public/fonts/EuphemiaUCAS-Italic.ttf` — Self-hosted font file (copied from `~/Downloads/huisstijl/Euphemia-UCAS/Euphemia UCAS Italic 2.6.6.ttf`)
- `public/logo-simpel.png` — Logo icon (copied from `~/Downloads/huisstijl/finals/logo/logo-simpel.png`)
- `e2e-tests/test_brand_rebrand.md` — E2E test to validate the brand rebrand visually

### Source Assets (from `~/Downloads/huisstijl/`)
- `Euphemia-UCAS/Euphemia UCAS Regular 2.6.6.ttf` — Regular weight font
- `Euphemia-UCAS/Euphemia UCAS Bold 2.6.6.ttf` — Bold weight font
- `Euphemia-UCAS/Euphemia UCAS Italic 2.6.6.ttf` — Italic font
- `finals/logo/logo-simpel.png` — Brand logo icon (burgundy slash + magenta "pc" letters)
- `finals/logo/favicon.ico` — Paysdoc favicon
- `finals/visitekaartjes/Visitekaart_voorkant.jpg` — Business card reference for brand text styling ("PAYSDOC consultancy" with letter-spacing)
- `finals/briefpapier/briefpapier-RGB.jpg` — Letterhead reference showing address: v/d Wervestraat 31, 2274 VE Voorburg

### Brand Color Reference (extracted from visual assets)
Light mode:
- `--accent` (primary magenta): `#c2185b` — bright magenta from the "pc" letters in the logo
- `--accent-hover`: `#a01548` — darker magenta for hover states
- `--accent-secondary` (burgundy): `#7b2d5e` — dark burgundy from the slash in the logo
- `--foreground`: `#1a0a1e` — near-black with slight purple tint for text
- `--background`: `#ffffff` — white
- `--muted`: `#6b7280` — keep neutral gray for readability
- `--border`: `#e5e7eb` — keep neutral border
- `--card-bg`: `#f9fafb` — keep neutral card background

Dark mode:
- `--accent`: `#e91e80` — brighter magenta for dark backgrounds
- `--accent-hover`: `#f06292` — lighter magenta for hover on dark
- `--accent-secondary`: `#a04d7e` — lighter burgundy for dark mode
- `--foreground`: `#ededed` — light text
- `--background`: `#0a0a0a` — near-black
- `--muted`: `#9ca3af` — keep neutral gray
- `--border`: `#27272a` — keep dark border
- `--card-bg`: `#18181b` — keep dark card background

## Implementation Plan
### Phase 1: Foundation — Assets & Font
Copy the brand assets (fonts, logo, favicon) into the project's `public/` directory. Define `@font-face` rules in `globals.css` for Euphemia UCAS (Regular, Bold, Italic). Remove the Geist font loading from `layout.tsx` and wire up Euphemia UCAS as the default sans-serif font via CSS variables.

### Phase 2: Core Implementation — Color Palette & Components
Replace all CSS custom property values in `globals.css` from the blue palette to the burgundy/magenta palette for both light and dark mode. Update the Navbar to render `logo-simpel.png` alongside styled "PAYSDOC consultancy" text and add the "How It Works" navigation link. Redesign the Footer to include LinkedIn, GitHub, KVK number, and Voorburg address. Verify all components that reference `var(--accent)` render correctly with the new color.

### Phase 3: Integration — Cleanup & Verification
Search the entire codebase for any remaining references to the old blue color (`#2563eb`, `#1d4ed8`, `#3b82f6`, `#60a5fa`). Verify that light mode and dark mode both render correctly. Confirm auth-gated links (Dashboard/Admin) remain hidden from unauthenticated users. Run lint and build to ensure zero regressions.

## Step by Step Tasks
Execute every step in order, top to bottom.

### Step 1: Create E2E Test Plan
- Create `e2e-tests/test_brand_rebrand.md` with test steps to validate:
  - Homepage loads and shows the Paysdoc logo icon in the navbar
  - "PAYSDOC consultancy" text is visible next to the logo
  - "How It Works" link is present in the navbar
  - No "Dashboard" or "Admin" link is visible when unauthenticated
  - Footer contains "LinkedIn" link, KVK number "50250574", and "Voorburg" text
  - Background and accent colors are burgundy/magenta (not blue)
  - Take screenshots for light mode homepage, navbar close-up, and footer

### Step 2: Copy Brand Assets to Public Directory
- Create `public/fonts/` directory
- Copy font files from `~/Downloads/huisstijl/Euphemia-UCAS/` to `public/fonts/`:
  - `Euphemia UCAS Regular 2.6.6.ttf` → `public/fonts/EuphemiaUCAS-Regular.ttf`
  - `Euphemia UCAS Bold 2.6.6.ttf` → `public/fonts/EuphemiaUCAS-Bold.ttf`
  - `Euphemia UCAS Italic 2.6.6.ttf` → `public/fonts/EuphemiaUCAS-Italic.ttf`
- Copy `~/Downloads/huisstijl/finals/logo/logo-simpel.png` → `public/logo-simpel.png`
- Copy `~/Downloads/huisstijl/finals/logo/favicon.ico` → `src/app/favicon.ico` (replacing existing)
- Note: Headshot photo was not found in `~/Downloads/huisstijl/`. Ask the user to provide the headshot file location, or skip this acceptance criterion for now and log it as a follow-up.

### Step 3: Set Up Euphemia UCAS Font via @font-face
- In `src/app/globals.css`, add `@font-face` declarations before the `:root` block:
  ```css
  @font-face {
    font-family: 'Euphemia UCAS';
    src: url('/fonts/EuphemiaUCAS-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Euphemia UCAS';
    src: url('/fonts/EuphemiaUCAS-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Euphemia UCAS';
    src: url('/fonts/EuphemiaUCAS-Italic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
  ```
- Update the `@theme inline` block to use `'Euphemia UCAS'` as the `--font-sans` value instead of `var(--font-geist-sans)`
- Update the `body` rule to set `font-family: 'Euphemia UCAS', Arial, Helvetica, sans-serif`

### Step 4: Update Layout to Remove Geist Font
- In `src/app/layout.tsx`:
  - Remove the `Geist` and `Geist_Mono` imports from `next/font/google`
  - Remove the `geistSans` and `geistMono` const declarations
  - Remove `${geistSans.variable} ${geistMono.variable}` from the `<body>` className
  - The font is now handled via `@font-face` in globals.css, so no font variable classes are needed on the body

### Step 5: Replace Color Palette in globals.css
- In `src/app/globals.css`, update the `:root` block for light mode:
  ```css
  :root {
    --background: #ffffff;
    --foreground: #1a0a1e;
    --accent: #c2185b;
    --accent-hover: #a01548;
    --accent-secondary: #7b2d5e;
    --muted: #6b7280;
    --border: #e5e7eb;
    --card-bg: #f9fafb;
  }
  ```
- Update the `@media (prefers-color-scheme: dark)` block:
  ```css
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --accent: #e91e80;
    --accent-hover: #f06292;
    --accent-secondary: #a04d7e;
    --muted: #9ca3af;
    --border: #27272a;
    --card-bg: #18181b;
  }
  ```

### Step 6: Update Navbar — Logo, Brand Text, "How It Works" Link
- In `src/components/Navbar.tsx`:
  - Add `"How It Works"` to the `links` array: `{ href: '/how-it-works', label: 'How It Works' }`
  - Replace the text logo `<Link>` with an image + text combo:
    - Render `<Image src="/logo-simpel.png" alt="Paysdoc logo" width={32} height={32} />` using next/image (already imported)
    - Next to the image, render styled text: "PAYSDOC" in uppercase with letter-spacing (tracking-widest) and "consultancy" in smaller text below or inline, matching the brand card style
  - Verify that Dashboard link in the dropdown and Login link behavior remain unchanged (already auth-gated)
  - Remove the old `paysdoc<span>.nl</span>` text logo

### Step 7: Redesign Footer with Business Details
- In `src/components/Footer.tsx`:
  - Keep the existing copyright line but update to "PAYSDOC consultancy"
  - Add a LinkedIn link: `https://www.linkedin.com/company/paysdoc` (or personal LinkedIn — verify with user)
  - Keep the existing GitHub link
  - Add KVK number: `KVK 50250574`
  - Add address: `v/d Wervestraat 31, 2274 VE Voorburg`
  - Keep the Contact link
  - Organize the footer into logical sections (brand info with address on one side, links on the other)

### Step 8: Verify No Remaining Old Blue References
- Search the entire `src/` directory for hex codes: `#2563eb`, `#1d4ed8`, `#3b82f6`, `#60a5fa`
- Search for Tailwind blue classes: `blue-600`, `blue-700`, `blue-500`, `blue-400`
- If any are found, replace with the appropriate burgundy/magenta equivalent
- Verify `globals.css` no longer contains any blue hex values

### Step 9: Verify Light and Dark Mode Rendering
- Review all components that use `var(--accent)`:
  - `src/components/Hero.tsx` — CTA button bg and hover
  - `src/components/ServiceCard.tsx` — checkmark color
  - `src/components/SkillCard.tsx` — hover border color
  - `src/components/Navbar.tsx` — active link color, avatar fallback bg
  - `src/app/about/page.tsx` — link color
- Confirm these all use CSS variables (not hardcoded colors) so they automatically pick up the new palette
- No code changes expected in these files if they only use `var(--accent)` — the globals.css change handles it

### Step 10: Run Validation Commands
- Run `npm run lint` to check for code quality issues
- Run `npx tsc --noEmit` to verify TypeScript types
- Run `npm run build` to verify no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute the `e2e-tests/test_brand_rebrand.md` E2E test to validate visually

## Testing Strategy
### Edge Cases
- Dark mode renders burgundy/magenta accent on dark background with sufficient contrast
- Logo image renders at appropriate size on mobile viewports (navbar may need responsive adjustments)
- Font files load correctly and `font-display: swap` prevents invisible text during load
- "How It Works" link navigates without error (even if the page is a 404 until built by a future issue — the link should exist)
- Footer does not overflow on narrow mobile screens with the added business details
- Authenticated users still see the Dashboard dropdown with no visual regression

## Acceptance Criteria
- [ ] Euphemia UCAS font files (Regular, Bold, Italic) are self-hosted in `public/fonts/` and loaded via `@font-face` with `font-display: swap`
- [ ] CSS variables in `globals.css` use burgundy/magenta palette for both light and dark mode — no blue (#2563eb) remains
- [ ] `logo-simpel.png` is in `public/` and rendered in the Navbar alongside styled "PAYSDOC consultancy" text
- [ ] `favicon.ico` replaced with the Paysdoc favicon from huisstijl
- [ ] Navbar includes "How It Works" link
- [ ] Dashboard/Admin links only visible to authenticated users (no regression from existing behavior)
- [ ] Footer includes LinkedIn link, KVK number (50250574), and Voorburg address (v/d Wervestraat 31, 2274 VE Voorburg)
- [ ] Light mode and dark mode both render correctly with the new palette
- [ ] No remaining references to the old blue (#2563eb, #1d4ed8, #3b82f6, #60a5fa) color scheme in `src/`
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass with zero errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run lint` — Run linter to check for code quality issues
- `npx tsc --noEmit` — Run TypeScript type checker to verify no type errors
- `npm run build` — Build the application to verify no build errors
- `grep -r "#2563eb\|#1d4ed8\|#3b82f6\|#60a5fa\|blue-600\|blue-700\|blue-500\|blue-400" src/` — Verify no remaining old blue color references (should return empty)
- Read `.claude/commands/test_e2e.md`, then read and execute `e2e-tests/test_brand_rebrand.md` E2E test to validate this functionality works

## Notes
- **Headshot photo**: The issue acceptance criteria mention copying a headshot photo to `public/`. No headshot photo was found in `~/Downloads/huisstijl/`. Ask the user where the headshot file is located, or defer this single criterion to a follow-up task.
- **"How It Works" page**: The navbar will link to `/how-it-works`, but this page does not exist yet. The link will produce a 404 until a future issue builds that page. This is intentional per the acceptance criteria which only require the link, not the page.
- **LinkedIn URL**: The footer should link to the Paysdoc LinkedIn. The exact URL needs confirmation — use `https://www.linkedin.com/in/martinkoster` or `https://www.linkedin.com/company/paysdoc` as appropriate. Verify with the user.
- **Geist font removal**: The Geist font imports from `next/font/google` will be fully removed from `layout.tsx`. If any component relies on `var(--font-geist-mono)` for code blocks, it will fall back to the system monospace font. This is acceptable since the site has no code block UI.
- **Brand color precision**: The hex values in this plan are extracted visually from the brand assets (logo, business card, letterhead). If the huisstijl manual specifies exact hex values, those should take precedence. The manual PDF could not be read due to missing `poppler-utils` tooling.
- **No new library needed**: All changes use existing Next.js, React, and CSS capabilities. No `npm install` required.
