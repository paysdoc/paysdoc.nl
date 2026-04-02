# Patch: Extract Euphemia UCAS fonts from system TTC to replace 0-byte files

## Metadata
adwId: `37wzob-brand-rebrand-stylin`
reviewChangeRequest: `specs/issue-16-adw-37wzob-brand-rebrand-stylin-sdlc_planner-brand-rebrand-styling.md`

## Issue Summary
**Original Spec:** specs/issue-16-adw-37wzob-brand-rebrand-stylin-sdlc_planner-brand-rebrand-styling.md
**Issue:** All 6 Euphemia UCAS font files in `public/fonts/` are 0 bytes. The `@font-face` declarations in `globals.css` reference these files, but they fail to load, causing fallback to Arial/Helvetica. The source files in `~/Downloads/huisstijl/Euphemia-UCAS/` are also 0 bytes (corrupted download), so re-copying from that source is not viable.
**Solution:** Extract the 3 Euphemia UCAS font variants (Regular, Bold, Italic) from the macOS system font `/System/Library/Fonts/Supplemental/EuphemiaCAS.ttc` (490KB, confirmed to contain all 3 variants) using Python `fonttools`. Remove the duplicate original-name files. The `@font-face` declarations in `globals.css` are already correct and need no changes.

## Files to Modify

- `public/fonts/EuphemiaUCAS-Regular.ttf` — Replace 0-byte file with extracted Regular (400) font
- `public/fonts/EuphemiaUCAS-Bold.ttf` — Replace 0-byte file with extracted Bold (700) font
- `public/fonts/EuphemiaUCAS-Italic.ttf` — Replace 0-byte file with extracted Italic font
- `public/fonts/Euphemia UCAS Regular 2.6.6.ttf` — Remove (duplicate, also 0 bytes)
- `public/fonts/Euphemia UCAS Bold 2.6.6.ttf` — Remove (duplicate, also 0 bytes)
- `public/fonts/Euphemia UCAS Italic 2.6.6.ttf` — Remove (duplicate, also 0 bytes)

## Implementation Steps
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Extract fonts from system TTC file
- Use `fonttools` (install in a temporary venv if needed) to split `/System/Library/Fonts/Supplemental/EuphemiaCAS.ttc` into individual TTF files
- Save directly to `public/fonts/`:
  - Index 0 (Regular) → `public/fonts/EuphemiaUCAS-Regular.ttf`
  - Index 1 (Bold) → `public/fonts/EuphemiaUCAS-Bold.ttf`
  - Index 2 (Italic) → `public/fonts/EuphemiaUCAS-Italic.ttf`
- Command:
  ```bash
  /tmp/fonttools-env/bin/python3 -c "
  from fontTools.ttLib import TTCollection
  tc = TTCollection('/System/Library/Fonts/Supplemental/EuphemiaCAS.ttc')
  mapping = {0: 'EuphemiaUCAS-Regular.ttf', 1: 'EuphemiaUCAS-Bold.ttf', 2: 'EuphemiaUCAS-Italic.ttf'}
  for idx, filename in mapping.items():
      tt = tc[idx]
      tt.save('public/fonts/' + filename)
      print(f'Saved {filename}')
  "
  ```

### Step 2: Remove duplicate original-name font files
- Delete the 3 original-name duplicates that are also 0 bytes and not referenced by `@font-face`:
  ```bash
  rm 'public/fonts/Euphemia UCAS Regular 2.6.6.ttf'
  rm 'public/fonts/Euphemia UCAS Bold 2.6.6.ttf'
  rm 'public/fonts/Euphemia UCAS Italic 2.6.6.ttf'
  ```

### Step 3: Verify extracted font files
- Confirm each extracted TTF has a non-zero size (expect ~100-200KB each)
- Confirm only 3 files remain in `public/fonts/`
- Command: `ls -la public/fonts/`

## Validation
Execute every command to validate the patch is complete with zero regressions.

1. `ls -la public/fonts/` — Verify 3 font files exist with non-zero sizes (>50KB each)
2. `npm run lint` — Run linter to check for code quality issues
3. `npx tsc --noEmit` — Run TypeScript type checker to verify no type errors
4. `npm run build` — Build the application to verify no build errors
5. `grep -r "#2563eb\|#1d4ed8\|#3b82f6\|#60a5fa\|blue-600\|blue-700\|blue-500\|blue-400" src/` — Verify no remaining old blue color references (should return empty)

## Patch Scope
**Lines of code to change:** 0 (no source code changes — only binary font file replacement and cleanup)
**Risk level:** low
**Testing required:** Verify font files are non-zero, build succeeds, and fonts render in the browser via `@font-face`
