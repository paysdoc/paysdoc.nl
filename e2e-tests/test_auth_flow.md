# E2E Test: Auth Flow

## User Story
A visitor to paysdoc.nl can see a "Login" button in the Navbar, click it to reach the login page, see OAuth provider buttons for Google and GitHub, and when unauthenticated is redirected from `/dashboard` and `/admin` to `/login`.

## Test Steps

1. **Navigate to homepage** — Go to `http://localhost:3000`
2. **Verify Login link in Navbar** — Assert a link/button with text "Login" is visible in the Navbar
3. **Click Login** — Click the "Login" link and verify navigation to `/login`
4. **Verify OAuth buttons on login page** — Assert "Sign in with Google" and "Sign in with GitHub" buttons are present
5. **Navigate to /dashboard unauthenticated** — Navigate directly to `http://localhost:3000/dashboard` and verify the final URL is `/login` (redirect occurred)
6. **Navigate to /admin unauthenticated** — Navigate directly to `http://localhost:3000/admin` and verify the final URL is `/login` (redirect occurred)
7. **Take screenshots** at each verification point

## Success Criteria

- Login link/button is visible in the Navbar on the homepage
- Clicking Login navigates to `/login`
- Login page renders with "Sign in with Google" and "Sign in with GitHub" buttons
- Navigating to `/dashboard` while unauthenticated redirects to `/login`
- Navigating to `/admin` while unauthenticated redirects to `/login`

## Note

Full OAuth login flow cannot be tested in E2E without live OAuth credentials. This test covers all unauthenticated paths only.

## Output Format

```json
{
  "test_name": "Auth Flow — unauthenticated paths",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
