# E2E Test: Client Dashboard

## User Story
An authenticated client can see the dashboard with a repo list, add a repo by URL, see it appear in the list, and remove it.

## Test Steps

1. **Navigate to /dashboard unauthenticated** — Navigate directly to `http://localhost:3000/dashboard` and verify the final URL is `/login` (redirect occurred, confirming middleware protection from #4/#5)
2. **Navigate to homepage** — Go to `http://localhost:3000` and verify a "Login" link is visible in the Navbar
3. **Take screenshots** at each verification point

## Note

Full CRUD testing (add repo, list repos, remove repo) requires a live authenticated session which cannot be automated without real OAuth credentials. The BDD scenarios in `features/client-dashboard.feature`, `features/client-repo-management.feature`, `features/client-repo-url-parsing.feature`, and `features/client-repo-auto-match.feature` serve as living documentation for these authenticated flows.

## Success Criteria

- Navigating to `/dashboard` while unauthenticated redirects to `/login`
- "Login" link is visible in the Navbar on the homepage

## Output Format

```json
{
  "test_name": "Client Dashboard — unauthenticated paths",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
