# paysdoc.nl

Marketing website for [Paysdoc](https://paysdoc.nl) — AI-powered development workflows. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    about/page.tsx
    contact/page.tsx
    services/page.tsx
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/           # Shared UI components
    CalEmbed.tsx
    Footer.tsx
    Hero.tsx
    Navbar.tsx
    ServiceCard.tsx
    SkillCard.tsx
public/                 # Static assets (SVGs)
```

## Domain Language

See [UBIQUITOUS_LANGUAGE.md](./UBIQUITOUS_LANGUAGE.md) for the canonical terminology used across this project and the ADW product.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
