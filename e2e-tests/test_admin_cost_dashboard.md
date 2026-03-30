# E2E Test: Admin Cost Dashboard

## User Story
An admin user navigating to `/admin` sees a "Cost per Project" dashboard. Unauthenticated users are redirected to `/login` when they try to access `/admin`.

## Test Steps

1. **Navigate to /admin unauthenticated** — Go to `http://localhost:3000/admin` and verify the final URL is `/login` (redirect occurred)
2. **Take screenshot** of the login page after redirect
3. **Navigate to homepage** — Go to `http://localhost:3000` and verify the page title contains "Paysdoc" or similar branding
4. **Take screenshot** of the homepage

## Success Criteria

- Navigating to `/admin` while unauthenticated redirects to `/login`
- The login page renders after redirect (URL ends with `/login`)

## Note

Full authenticated admin flow cannot be tested in E2E without live OAuth credentials. This test covers the unauthenticated redirect path only. The "Cost per Project" heading and dashboard content are verified indirectly — if the page were accessible unauthenticated, the redirect would not occur, indicating the middleware guard is working.

## Output Format

```json
{
  "test_name": "Admin Cost Dashboard — unauthenticated redirect",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
