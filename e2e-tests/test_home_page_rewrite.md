# E2E Test Plan: Home Page Rewrite (Issue #18)

## URL
http://localhost:3000

## Test Steps

### 1. Hero — Headline
- Navigate to http://localhost:3000
- Verify the page contains the text "AI-Powered Software Engineering"
- Take a screenshot

### 2. Hero — Business-language subtitle
- On the home page, locate the subtitle text beneath the h1
- Verify it does NOT contain any of: "PR", "CI/CD", "webhook", "pipeline", "pull request", "issue to"
- Verify it uses plain business language (e.g., references "idea", "production-ready software", "experience")

### 3. Hero — Professional headshot
- On the home page, verify an image with alt text containing "Martin" is visible in the hero section
- Verify the image src references "headshot"

### 4. Hero — InterestForm CTA
- On the home page, verify an email input field is present in the hero section
- Verify a submit button with text "Register interest" is present in the hero section

### 5. Removed CTAs
- On the home page, verify there is NO link or button with text "Book a Discovery Call"
- On the home page, verify there is NO link or button with text "View Services"

### 6. Capability cards — Business language titles
- On the home page, verify the following card titles are present:
  - "Faster Time to Market"
  - "Built-In Quality Assurance"
  - "Transparent Progress"
  - "Scalable from Day One"
  - "Full-Stack Capability"
  - "Nearly 30 Years of Experience"
- Verify section heading reads "Why Paysdoc"

### 7. No emoji icons on capability cards
- On the home page, inspect the capability cards section
- Verify no emoji characters are visible in card elements (no 🤖, 🔄, 🛠️, 🌐, 🧪, 📋 or similar)
- Verify brand-styled accent indicators (colored bars/dots) are present instead

### 8. Mobile responsiveness — desktop screenshot
- Set viewport to 1280×800
- Navigate to http://localhost:3000
- Take a full-page screenshot named "home-desktop.png"
- Verify hero layout shows two columns (text left, headshot right)

### 9. Mobile responsiveness — mobile screenshot
- Set viewport to 390×844 (iPhone 14)
- Navigate to http://localhost:3000
- Take a full-page screenshot named "home-mobile.png"
- Verify hero stacks vertically (headshot and text in single column)
- Verify capability cards reflow to single column

### 10. InterestForm submission (smoke test)
- On the home page at desktop viewport, locate the email input in the hero
- Enter a test email address (e.g., test@example.com)
- Click "Register interest"
- Verify a success message appears (e.g., "Thanks! We'll be in touch.")
