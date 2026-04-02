# E2E Test: Brand Rebrand — Styling, Assets, Navbar, Footer

## Issue
GitHub Issue #16 — Brand rebrand: styling, assets, navbar, footer

## Setup
- Start the dev server: `npm run dev`
- Open browser to `http://localhost:3000`

## Test Steps

### 1. Navbar — Logo and Brand Text
- [ ] The Paysdoc logo icon (`logo-simpel.png`) is visible in the top-left of the navbar
- [ ] "PAYSDOC" text in uppercase with wide letter-spacing is visible next to the logo
- [ ] "consultancy" text in smaller size is visible below "PAYSDOC"
- [ ] Screenshot: save as `screenshots/navbar-logo.png`

### 2. Navbar — Navigation Links
- [ ] "Home" link is present in the navbar
- [ ] "About" link is present in the navbar
- [ ] "Services" link is present in the navbar
- [ ] "How It Works" link is present in the navbar
- [ ] "Contact" link is present in the navbar
- [ ] No "Dashboard" link is visible (unauthenticated)
- [ ] No "Admin" link is visible (unauthenticated)
- [ ] A "Login" link is present for unauthenticated users

### 3. Color Palette — Light Mode
- [ ] Background is white (not blue)
- [ ] Primary accent color is burgundy/magenta (not blue #2563eb)
- [ ] CTA button on homepage uses magenta background
- [ ] Active nav link uses magenta color
- [ ] Screenshot: save as `screenshots/homepage-light.png`

### 4. Footer — Business Details
- [ ] Footer shows "PAYSDOC consultancy" heading
- [ ] Footer shows address: "v/d Wervestraat 31, 2274 VE Voorburg"
- [ ] Footer shows "KVK 50250574"
- [ ] Footer contains a "LinkedIn" link
- [ ] Footer contains a "GitHub" link
- [ ] Footer contains a "Contact" link
- [ ] Screenshot: save as `screenshots/footer.png`

### 5. Typography
- [ ] Page text renders in Euphemia UCAS font (not Geist or system sans-serif)
- [ ] Font loads without invisible text flash (font-display: swap is set)

### 6. Dark Mode
- [ ] Toggle system dark mode preference
- [ ] Background switches to near-black (#0a0a0a)
- [ ] Accent color switches to brighter magenta (#e91e80)
- [ ] Text remains readable on dark background
- [ ] Screenshot: save as `screenshots/homepage-dark.png`

### 7. Favicon
- [ ] Browser tab shows the Paysdoc favicon (not the default Next.js favicon)

## Expected Result
All checkboxes pass. No blue (#2563eb) color visible anywhere on the page.

## Validation Commands
```bash
# No remaining blue color references in source
grep -r "#2563eb\|#1d4ed8\|#3b82f6\|#60a5fa\|blue-600\|blue-700\|blue-500\|blue-400" src/
# Should return empty output

npm run lint
npx tsc --noEmit
npm run build
```
