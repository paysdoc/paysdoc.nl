# E2E Test: Interest Capture Flow

## User Story
A visitor to paysdoc.nl can navigate to the Contact page, see an InterestForm with an email input and submit button, enter their email address, and receive a confirmation message. The page also displays direct contact details (email, LinkedIn, GitHub). No Cal.com iframe is present.

## Test Steps

1. **Navigate to Contact page** — Go to `http://localhost:3000/contact`
2. **Verify InterestForm is present** — Assert an email `<input>` and a submit button are visible on the page
3. **Verify CalEmbed is NOT present** — Assert no `<iframe>` element exists on the page
4. **Verify direct contact details** — Assert the following are visible:
   - Email link `info@paysdoc.nl` (or `mailto:info@paysdoc.nl` href)
   - LinkedIn link pointing to `linkedin.com/company/paysdoc`
   - GitHub link pointing to `github.com/paysdoc`
5. **Take screenshot** of the initial page state
6. **Test empty email submission** — Click the submit button without entering an email; assert no navigation occurs and the browser shows HTML5 required-field validation (form does not submit)
7. **Test invalid email format** — Enter `notanemail` in the email field and click submit; assert no navigation occurs and the browser shows HTML5 email validation error (form does not submit)
8. **Test valid email submission** — Enter `test@example.com` in the email field and click submit; assert a success confirmation message appears (e.g., contains "Thanks")
9. **Take screenshot** of the success state

## Success Criteria

- Contact page renders without errors
- Email input and submit button are present
- No `<iframe>` (Cal.com embed) is present on the page
- Direct contact details are displayed: info@paysdoc.nl, LinkedIn, GitHub
- Empty submission triggers HTML5 validation and does not navigate
- Invalid email triggers HTML5 validation and does not navigate
- Valid email submission results in a visible success confirmation message

## Output Format

```json
{
  "test_name": "Interest Capture Flow",
  "status": "passed|failed",
  "screenshots": [],
  "error": null
}
```
