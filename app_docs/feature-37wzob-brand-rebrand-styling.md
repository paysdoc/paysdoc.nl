# Brand Rebrand — Styling, Assets, Navbar, Footer

**ADW ID:** 37wzob-brand-rebrand-stylin
**Date:** 2026-04-02
**Specification:** specs/issue-16-adw-37wzob-brand-rebrand-stylin-sdlc_planner-brand-rebrand-styling.md

## Overview

Replaces the generic blue (#2563eb) color scheme and Geist font with the Paysdoc huisstijl: a burgundy/magenta palette, self-hosted Euphemia UCAS typography, and a redesigned Navbar and Footer with brand identity and business details. This is the visual foundation for the entire site.

## What Was Built

- Self-hosted Euphemia UCAS font (Regular, Bold, Italic) via `@font-face` with `font-display: swap`
- Burgundy/magenta CSS custom properties for both light and dark mode
- Navbar with `logo-simpel.png` logo icon and styled "PAYSDOC consultancy" brand text
- "How It Works" navigation link added to Navbar
- Footer redesigned with company name, address (v/d Wervestraat 31, 2274 VE Voorburg), KVK number (50250574), and LinkedIn link
- Updated `favicon.ico` with the Paysdoc favicon
- Geist font imports fully removed from `layout.tsx`
- All old blue (#2563eb, #3b82f6) references eliminated from the codebase

## Technical Implementation

### Files Modified

- `src/app/globals.css`: Added three `@font-face` declarations for Euphemia UCAS; replaced blue CSS variables with burgundy/magenta values for light and dark mode; switched `--font-sans` from Geist to Euphemia UCAS; updated `body` font-family
- `src/app/layout.tsx`: Removed `Geist` and `Geist_Mono` imports from `next/font/google`; removed font variable classes from `<body>` className
- `src/components/Navbar.tsx`: Replaced text logo with `<Image>` + brand text combo; added "How It Works" to nav links
- `src/components/Footer.tsx`: Added business info block (name, address, KVK); added LinkedIn link; added copyright line at bottom
- `src/app/favicon.ico`: Replaced with Paysdoc favicon from huisstijl

### New Files

- `public/fonts/EuphemiaUCAS-Regular.ttf`: Self-hosted Regular weight font (182 KB)
- `public/fonts/EuphemiaUCAS-Bold.ttf`: Self-hosted Bold weight font (183 KB)
- `public/fonts/EuphemiaUCAS-Italic.ttf`: Self-hosted Italic weight font (173 KB)
- `public/logo-simpel.png`: Brand logo icon (burgundy slash + magenta "pc" letters, 54 KB)
- `e2e-tests/test_brand_rebrand.md`: E2E test plan for visual brand validation

### Key Changes

- **Color palette**: Light mode uses `--accent: #c2185b` (magenta) and `--accent-secondary: #7b2d5e` (burgundy); dark mode uses `--accent: #e91e80` with lighter hover `#f06292`. All components using `var(--accent)` automatically inherit the new palette.
- **Typography**: Geist font is fully removed. Euphemia UCAS is loaded via static `@font-face` rules in `globals.css` — no Next.js font API involved. Font fallback chain: `'Euphemia UCAS', Arial, Helvetica, sans-serif`.
- **Navbar logo**: `<Image src="/logo-simpel.png" width={32} height={32}>` with a flex column showing "PAYSDOC" (tracking-widest, uppercase, bold) and "consultancy" (muted, xs) beneath.
- **Footer layout**: Two-column flex layout — left side has brand name, address, and KVK; right side has LinkedIn, GitHub, and Contact links. Copyright moves to a separate bottom row.
- **Auth gating**: Dashboard/Admin links remain unchanged and still require authentication — no regression introduced.

## How to Use

1. Visit any page on the site — the Euphemia UCAS font loads automatically via `globals.css`.
2. The Navbar shows the Paysdoc logo icon alongside "PAYSDOC / consultancy" text and includes the "How It Works" link (routes to `/how-it-works` — page not yet built; returns 404 until a future issue implements it).
3. The Footer displays the full business details at the bottom of every page.
4. Dark mode switches automatically based on `prefers-color-scheme`; the magenta/burgundy palette is applied in both modes.

## Configuration

No environment variables or configuration changes required. Font files are served statically from `public/fonts/` by Next.js.

If the exact brand hex values from the printed huisstijl manual differ from what is implemented, update the CSS variables in `src/app/globals.css` under `:root` (light mode) and `@media (prefers-color-scheme: dark)` (dark mode).

## Testing

Run the E2E test plan at `e2e-tests/test_brand_rebrand.md` to validate visually:

- Homepage shows the Paysdoc logo icon and brand text in the Navbar
- "How It Works" link is present; Dashboard/Admin links are absent when unauthenticated
- Footer contains LinkedIn, KVK 50250574, and "Voorburg"
- Accent colors are magenta, not blue

Run build validation:

```bash
npm run lint
npx tsc --noEmit
npm run build
grep -r "#2563eb\|#1d4ed8\|#3b82f6\|#60a5fa\|blue-600\|blue-700" src/  # should return empty
```

## Notes

- **Headshot photo**: Not found in `~/Downloads/huisstijl/`. This acceptance criterion is deferred — ask the user for the file location when needed.
- **"How It Works" page**: The nav link targets `/how-it-works` which returns 404 until a future issue builds the page. This is intentional per the spec.
- **LinkedIn URL**: Implemented as `https://www.linkedin.com/in/martinkoster` (personal). Confirm with user if the company page (`/company/paysdoc`) is preferred.
- **Monospace font**: `var(--font-geist-mono)` was removed. Monospace falls back to the system stack (`ui-monospace, SFMono-Regular, Menlo, ...`) defined in `--font-mono` in the `@theme inline` block. No code block UI exists on the site so this has no visible effect.
