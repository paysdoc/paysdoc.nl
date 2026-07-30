## Project Overview
paysdoc.nl is a Next.js 16 marketing/corporate website built with React 19, TypeScript, and Tailwind CSS 4. It serves as the public-facing website for Paysdoc, featuring pages for home, about, contact, and services.

## Relevant Files
- `src/app/` — Next.js App Router pages (page.tsx, layout.tsx, globals.css)
- `src/app/about/page.tsx` — About page
- `src/app/contact/page.tsx` — Contact page
- `src/app/services/page.tsx` — Services page
- `src/components/` — Shared UI components (Navbar, Footer, Hero, ServiceCard, SkillCard, CalEmbed)
- `public/` — Static assets (SVG files)
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript configuration
- `eslint.config.mjs` — ESLint configuration
- `postcss.config.mjs` — PostCSS/Tailwind configuration
- `package.json` — Project manifest and scripts

## Framework Notes
- Uses Next.js App Router (`src/app/` directory structure)
- React Server Components by default; add `"use client"` directive for client components
- Tailwind CSS v4 via PostCSS — utility-first styling
- TypeScript strict mode; run `npx tsc --noEmit` to type-check without building
- No test infrastructure currently configured

## Library Install Command
npm install {library}

## Script Execution
npm run {script}

## Agent Guardrails
ADW copied a starter deny-only guardrail file (`.claude/settings.json`) into the repo during this initialization, since none existed. It denies recursive-force `rm`, force-push, and `.env` secret reads. This file is the repo owner's to edit or delete freely. Its `Read(!**/.env.sample)` / `Read(!**/.env.example)` negation carve-outs rely on UNDOCUMENTED Claude Code CLI precedence behavior; the framework verifies this with `scripts/guardrails-probe.ts` (issue #762) — re-run the probe after each Claude Code CLI upgrade to confirm the carve-outs still hold.
