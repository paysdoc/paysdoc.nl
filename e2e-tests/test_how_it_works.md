# E2E Test: How It Works Page

## User Story
A visitor to paysdoc.nl clicks "How It Works" in the navbar and lands on a page that explains the three-phase AI-assisted development process in business-friendly language. The page makes clear the service is coming soon and invites the visitor to register interest via the InterestForm.

## Test Steps

1. **Navigate to homepage** — Go to `http://localhost:3000`
2. **Verify navbar link** — Assert a "How It Works" link is visible in the navbar
3. **Click "How It Works" nav link** — Click the navbar link and assert navigation to `/how-it-works`
4. **Verify page loads without errors** — Assert the page renders with HTTP 200 and no console errors
5. **Take screenshot** of the full page at desktop viewport (1280×800)
6. **Verify page title** — Assert the browser tab / document title contains "How It Works"
7. **Verify hero headline** — Assert a prominent heading about AI-powered or AI-assisted development is visible
8. **Verify coming-soon framing** — Assert text communicating "coming soon" or that the service is upcoming is visible (e.g., "Coming Soon", "pilot", "upcoming")
9. **Verify three phases are present** — Assert all three of the following phase headings (or equivalent wording) are visible:
   - Phase 1: something about onboarding or getting started together
   - Phase 2: something about AI building / developing the application
   - Phase 3: something about quality assurance or review by an expert
10. **Verify business language** — Assert none of the following engineering terms appear on the page: "CI/CD", "webhook", "pipeline", "SDLC", "pull request" (case-insensitive)
11. **Verify InterestForm is present** — Assert an email `<input>` and a submit button are visible on the page
12. **Test empty email submission** — Click the submit button without entering an email; assert no navigation occurs and the browser shows HTML5 required-field validation
13. **Test valid email submission** — Enter `test@example.com` and click submit; assert a success confirmation message appears (e.g., contains "Thanks")
14. **Take screenshot** of the success state
15. **Check mobile responsiveness** — Switch to mobile viewport (375×812); reload the page and assert all three phase sections are still visible and readable
16. **Take screenshot** at mobile viewport

## Success Criteria

- Page loads at `/how-it-works` without errors
- Page title contains "How It Works"
- Hero headline about AI-assisted development is visible
- "Coming soon" or teaser framing is clearly present
- All three phases are displayed with headings and descriptions
- No engineering jargon (CI/CD, webhook, pipeline, SDLC, pull request) is present in the copy
- InterestForm email input and submit button are present and functional
- Page is responsive at 375px mobile viewport

## Output Format

```json
{
  "test_name": "How It Works Page",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
