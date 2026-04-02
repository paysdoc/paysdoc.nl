## Problem Statement

The paysdoc.nl marketing website is misaligned with the business in two critical ways:

1. **Styling**: The site uses a generic blue color scheme and default Geist fonts. The established Paysdoc brand identity — burgundy/maroon + magenta/pink colors, Euphemia UCAS font, and the Paysdoc logo — is completely absent from the website.

2. **Content and positioning**: The site presents Paysdoc exclusively as an AI/ADW automation product company, using deeply technical language ("issue-to-PR pipelines", "webhook-driven automation"). The owner is a full-stack developer with nearly 30 years of experience who needs the site to:
   - Lead with an AI-powered development vision (even though the ADW tool is still in development and running locally only)
   - Tease a pilot program for AI-assisted development with experienced engineering oversight
   - Showcase traditional full-stack consulting as an available-now secondary offering
   - Speak to non-technical founders as the primary audience, not engineers
   - Build credibility through a professional profile and project history

Additionally, the Cal.com booking embed on the Contact page is non-functional and needs to be replaced.

## Solution

Rebrand and reposition the website through:

1. **Visual rebrand**: Apply the Paysdoc huisstijl — burgundy/magenta color palette, self-hosted Euphemia UCAS font, logo icon in the navbar, updated favicon. Support both light and dark modes with the burgundy palette.

2. **Content rewrite**: Rewrite all public pages to target non-technical founders. Lead with the AI vision, tease the pilot, and present full-stack consulting as the immediately available offering. Add a professional profile with nearly 30 years of experience across banking, retail, energy, government, and airline industries.

3. **New "How It Works" page**: A teaser page for the upcoming ADW-as-a-service offering — high-level concept without overpromising features that are not yet client-facing.

4. **Interest capture**: Replace the broken Cal.com embed with a simple email interest registration form backed by Cloudflare Workers KV. This is the primary call-to-action across the site.

5. **Professional headshot**: Add the owner's professional photo to build trust with prospective clients.

## User Stories

1. As a non-technical founder visiting the site, I want to understand what Paysdoc offers in plain language, so that I can decide if this service can help me build my product.
2. As a non-technical founder, I want to register my interest in the AI-powered development pilot, so that I can be contacted when the service is available.
3. As a visitor, I want the site's visual identity to feel professional and consistent, so that I trust the business behind it.
4. As a visitor, I want to see the face of the person behind Paysdoc, so that I feel I'm dealing with a real professional, not an anonymous service.
5. As a visitor, I want to see the consultant's track record (industries, projects, years of experience), so that I can assess credibility.
6. As a visitor, I want to understand the difference between the AI-powered development offering and traditional consulting, so that I can choose the right service for my needs.
7. As a visitor interested in the AI pilot, I want to understand at a high level how AI-assisted development works, so that I can decide if it is relevant to my project.
8. As a visitor, I want to contact Paysdoc via email or LinkedIn, so that I can discuss my project needs.
9. As a visitor on a mobile device, I want the site to be responsive and readable, so that I can browse on any device.
10. As a visitor who prefers dark mode, I want the site to respect my system preference while maintaining the Paysdoc brand, so that the experience is comfortable.
11. As the site owner, I want to access the admin/dashboard via the Login link, so that I can manage the application backend.
12. As the site owner, I want the Login and Dashboard links hidden from unauthenticated visitors, so that the public-facing navigation is clean and focused.
13. As the site owner, I want registered interest emails stored in Cloudflare Workers KV, so that I can retrieve them without additional infrastructure.
14. As the site owner, I want the footer to display my KVK number and address, so that the site meets Dutch business transparency requirements.
15. As a visitor, I want to see the Paysdoc logo (icon + styled text) in the navbar, so that I recognise the brand.
16. As a visitor, I want to navigate between Home, About, Services, How It Works, and Contact, so that I can find the information I need.
17. As a returning visitor, I want the site to load the custom Euphemia UCAS font without layout shift, so that the experience is polished.
18. As the site owner, I want the interest form to validate email format before submission, so that I only collect usable contact information.

## Implementation Decisions

### Module 1: Brand Rebrand (styling, assets, navbar, footer)

A single unit of work covering all visual identity changes:

- **Color palette**: Replace all blue CSS variables with burgundy/magenta equivalents. The primary color is a deep burgundy/maroon (derived from the logo's dark element). The accent is magenta/pink (from the logo's bright element). Both light and dark mode variables in `globals.css` must be updated.
- **Typography**: Self-host Euphemia UCAS font files (Regular, Bold, Italic TTFs from the huisstijl folder) in `public/fonts/`. Define `@font-face` rules in `globals.css`. Update `layout.tsx` to apply the font.
- **Logo**: Copy `logo-simpel.png` to `public/`. Update `Navbar` to render the icon image alongside styled text "PAYSDOC consultancy" using Euphemia UCAS via CSS — this allows text color to adapt to light/dark mode.
- **Favicon**: Replace the current favicon with the one from the huisstijl folder.
- **Headshot**: Copy the professional photo to `public/`. It will be referenced by the Home page hero.
- **Navbar**: Add "How It Works" to the navigation links. Keep Login link but ensure Dashboard/Admin links only appear after authentication (already partially implemented via session check).
- **Footer**: Add LinkedIn link, KVK number (50250574), and location (Voorburg) alongside existing GitHub and Contact links.

### Module 2: Interest Capture API

A backend endpoint that stores email addresses in Cloudflare Workers KV:

- Endpoint: `POST /api/interest` accepting `{ email: string }`, returning 201 on success.
- Storage: Cloudflare Workers KV namespace bound to the application. Key is the email address, value is a JSON object with timestamp.
- Validation: Server-side email format validation. Reject invalid emails with 400.
- Idempotent: Submitting the same email twice overwrites the timestamp silently (no error, no duplicates).
- KV namespace must be added to `wrangler.jsonc` bindings and `cloudflare-env.d.ts`.

### Module 3: InterestForm Component

A reusable client-side form component:

- Single email input field + submit button.
- Client-side email format validation before submission.
- Success state: brief confirmation message replacing the form.
- Error state: display error message inline.
- Used on the Home page hero and How It Works page.

### Module 4: Home Page Rewrite

- Hero section: headline "AI-Powered Software Engineering", subtitle targeting non-technical founders (business outcomes, not engineering jargon), professional headshot, "Register Interest" CTA using InterestForm.
- Below hero: capability cards rewritten for a non-technical audience. Highlight both the AI vision and the consulting experience. Remove emoji icons in favor of brand-consistent styling.

### Module 5: About Page Rewrite

- Professional profile of Martin Koster, full-stack developer with nearly 30 years of experience.
- Industries served: banking (BMG/ING, ABSA), retail (Nike EMEA), energy (Alliander), government (Ministry of Infrastructure), airline.
- Key project highlights written at a high level (no IP-sensitive details): payments systems, business intelligence dashboards, infrastructure migration, government systems modernisation.
- Technology expertise summary: TypeScript, JavaScript, Java, React, Node.js, Spring Boot, and more.
- Languages spoken: English, German, Dutch, Afrikaans.

### Module 6: Services Page Rewrite

Two service tiers:

1. **AI-Powered Development (Pilot)**: Teaser card. AI builds your application while an experienced engineer oversees quality and minimises technical debt. Positioned as "coming soon" — register interest for reduced-rate pilot.
2. **Full-Stack Consulting (Available Now)**: Traditional consulting offering. Nearly 30 years across banking, retail, energy, government. TypeScript, Java, React, full-stack architecture.

Industries served listed for credibility.

### Module 7: How It Works Page (new)

A new page at `/how-it-works`:

- High-level explanation of AI-assisted development with human oversight, written for non-technical readers.
- Three-phase concept (without committing to specifics that may change): (1) collaborative onboarding, (2) AI-driven development, (3) expert quality assurance.
- Clear "coming soon" framing — this is a teaser, not a product page.
- Register interest CTA using InterestForm.

### Module 8: Contact Page Rewrite

- Remove the CalEmbed component entirely.
- Primary: InterestForm for pilot registration.
- Secondary: direct contact details — email (info@paysdoc.nl), LinkedIn, GitHub.
- No Cal.com, no booking widget.

## Testing Decisions

Testing decisions are deferred to the ADW (AI Developer Workflow) which will determine appropriate test coverage during implementation. The ADW will decide:

- Which modules warrant unit tests
- Which integration tests are needed (e.g., interest capture API against KV)
- Whether component tests are needed for the InterestForm

Prior art for testing in this codebase:
- Unit tests use Vitest (configured in `vitest.config.ts`)
- Existing unit tests in `src/lib/__tests__/`
- BDD features in `features/` using Cucumber

## Out of Scope

- **CV update**: Updating the external CV document (BMG end date, result) is handled separately.
- **ADW client-facing deployment**: The ADW tool itself is not being deployed or made available to clients as part of this work. The site only teases its existence.
- **Pricing or billing**: No pricing information, payment integration, or billing functionality.
- **Blog or content marketing**: No blog, articles, or content management system.
- **SEO optimisation**: Beyond basic metadata already in place.
- **Analytics**: No tracking or analytics integration.
- **Mobile hamburger menu**: The current navbar has no mobile-responsive menu. This may be addressed separately if needed.
- **Admin interface for interest list**: The owner can query KV directly via Wrangler CLI. No admin UI for viewing registered emails.
- **Internationalisation**: Site remains English-only.

## Further Notes

- The site is deployed to Cloudflare Pages via GitHub Actions. All infrastructure changes (KV namespace, bindings) must be reflected in `wrangler.jsonc` and the deployment workflow.
- The Euphemia UCAS font is not freely licensable — it is being self-hosted from the owner's licensed copy. It should not be committed to a public repository if the repo is public.
- The owner is actively seeking new engagements starting mid-April 2026. The site should be ready before then.
- The "Paysdoc" name derives from the Pays d'Oc wine region in France. The burgundy color palette is intentionally tied to this origin.
- Non-technical founders are the primary audience. All copy should use business language, not engineering jargon. Avoid terms like "PR", "CI/CD", "webhook", "issue-to-PR pipeline" on public-facing pages.
