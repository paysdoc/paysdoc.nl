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
    admin/page.tsx
    contact/page.tsx
    dashboard/page.tsx
    login/page.tsx
    services/page.tsx
    api/auth/[...nextauth]/route.ts
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  components/           # Shared UI components
    CalEmbed.tsx
    Footer.tsx
    Hero.tsx
    Navbar.tsx
    Providers.tsx
    ServiceCard.tsx
    SkillCard.tsx
  lib/                  # Business logic
    __tests__/roles.test.ts
    roles.ts            # Role resolution (admin/client)
  types/
    next-auth.d.ts      # Auth.js session type extensions
  auth.ts               # Auth.js v5 configuration
  middleware.ts         # Route protection middleware
migrations/             # Cloudflare D1 SQL migrations
public/                 # Static assets (SVGs)
```

## Domain Language

See [UBIQUITOUS_LANGUAGE.md](./UBIQUITOUS_LANGUAGE.md) for the canonical terminology used across this project and the ADW product.

## Authentication

Authentication is handled by [Auth.js v5](https://authjs.dev/) with Google and GitHub OAuth providers, backed by a [Cloudflare D1](https://developers.cloudflare.com/d1/) SQLite database.

### Required environment variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random secret used to sign/encrypt session tokens (generate with `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |

For local development, create a `.dev.vars` file (Cloudflare convention, git-ignored):

```
AUTH_SECRET=your-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

### D1 database setup

1. Create the D1 database (one-time):

   ```bash
   npx wrangler d1 create paysdoc-auth-db
   ```

2. Update the `database_id` field in `wrangler.jsonc` with the ID returned above.

3. Run migrations locally:

   ```bash
   npx wrangler d1 migrations apply paysdoc-auth-db --local
   ```

4. Run migrations in production:

   ```bash
   npx wrangler d1 migrations apply paysdoc-auth-db --remote
   ```

## Deployment

The site is deployed to [Cloudflare Pages](https://pages.cloudflare.com/) via GitHub Actions using the [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter for server-side rendering. On every push to `main`, the workflow:

1. Installs dependencies with Bun
2. Builds the app with OpenNext (`bun run build` → `.open-next/`)
3. Applies D1 migrations (`--remote`)
4. Deploys `.open-next/assets` to Cloudflare Pages using Wrangler

The following GitHub Actions secrets must be configured in the repository:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages deployment permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `AUTH_SECRET` | Auth.js session secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (OpenNext for Cloudflare) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
