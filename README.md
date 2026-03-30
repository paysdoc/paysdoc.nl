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

## Deployment

The site is deployed to [Cloudflare Pages](https://pages.cloudflare.com/) via GitHub Actions. On every push to `main`, the workflow:

1. Installs dependencies with Bun
2. Builds the static site (`bun run build` → `out/`)
3. Deploys the `out/` directory to Cloudflare Pages using Wrangler

The following GitHub Actions secrets must be configured in the repository:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages deployment permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
