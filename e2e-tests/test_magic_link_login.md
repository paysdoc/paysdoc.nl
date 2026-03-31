# E2E Test: Magic Link Login

## User Story
A visitor to paysdoc.nl can see an email input field and "Send magic link" button on the login page, alongside the existing Google and GitHub OAuth buttons. Submitting an email shows a confirmation message. Invalid or empty email shows a validation error.

## Test Steps

1. **Navigate to login page** — Go to `http://localhost:3000/login`
2. **Verify OAuth buttons still present** — Assert "Sign in with Google" and "Sign in with GitHub" buttons are visible
3. **Verify email input** — Assert an `<input type="email">` field is visible on the page
4. **Verify Send magic link button** — Assert a button with text "Send magic link" is visible
5. **Verify divider** — Assert a visual divider (text "or") is present between the OAuth section and the magic link section
6. **Test empty email submission** — Clear the email field and click "Send magic link"; verify the browser shows an HTML5 validation error (field is required) and does NOT navigate away
7. **Test invalid email submission** — Type `notanemail` into the email field and click "Send magic link"; verify the browser shows an HTML5 validation error and does NOT navigate away
8. **Test valid email submission** — Type `test@example.com` into the email field and click "Send magic link"; verify the page navigates to `/auth/verify-request` and shows a "Check your email" confirmation message
9. **Take screenshots** at each verification point

## Success Criteria

- Login page renders with an email input field and "Send magic link" button
- Google and GitHub OAuth buttons coexist with the magic link section
- A visual divider separates OAuth buttons from the magic link section
- Empty email submission triggers HTML5 `required` validation — no navigation occurs
- Invalid email format triggers HTML5 `type="email"` validation — no navigation occurs
- Valid email submission navigates to `/auth/verify-request`
- The verify-request page shows a "Check your email" confirmation message

## Note

Full magic link flow (receiving the email and clicking the link) cannot be tested in E2E without a live email service and DNS configuration. This test covers the UI and submission flow only.

## Output Format

```json
{
  "test_name": "Magic Link Login — UI and submission flow",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
