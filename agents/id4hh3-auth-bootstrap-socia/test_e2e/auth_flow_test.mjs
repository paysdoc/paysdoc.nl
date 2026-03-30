import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const SCREENSHOT_DIR = '/Users/martin/projects/paysdoc/paysdoc.nl/.worktrees/feature-issue-4-auth-bootstrap-social-login/agents/id4hh3-auth-bootstrap-socia/test_e2e/img/auth_flow';
const BASE_URL = 'http://localhost:3001';

const results = {
  test_name: 'Auth Flow — unauthenticated paths',
  status: 'passed',
  screenshots: [],
  error: null,
};

const ss = (name) => {
  const p = `${SCREENSHOT_DIR}/${name}`;
  results.screenshots.push(p);
  return p;
};

const fail = (msg) => {
  results.status = 'failed';
  results.error = msg;
  console.error('FAIL:', msg);
};

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Step 1: Navigate to homepage
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: ss('01_homepage.png') });

  // Step 2: Verify Login link in Navbar
  const loginLink = page.locator('nav >> text=Login');
  const loginVisible = await loginLink.isVisible();
  if (!loginVisible) {
    fail('(Step 2) "Login" link/button not visible in the Navbar on the homepage');
  } else {
    console.log('✓ Step 2: Login link visible in Navbar');
  }
  await page.screenshot({ path: ss('02_navbar_login_visible.png') });

  if (results.status !== 'failed') {
    // Step 3: Click Login and verify navigation to /login
    await loginLink.click();
    await page.waitForURL(`${BASE_URL}/login`);
    const loginUrl = page.url();
    if (!loginUrl.includes('/login')) {
      fail(`(Step 3) Expected navigation to /login but got: ${loginUrl}`);
    } else {
      console.log('✓ Step 3: Navigated to /login');
    }
    await page.screenshot({ path: ss('03_login_page.png') });

    // Step 4: Verify OAuth buttons on login page
    const googleBtn = page.locator('button:has-text("Sign in with Google"), a:has-text("Sign in with Google")');
    const githubBtn = page.locator('button:has-text("Sign in with GitHub"), a:has-text("Sign in with GitHub")');
    const googleVisible = await googleBtn.isVisible();
    const githubVisible = await githubBtn.isVisible();
    if (!googleVisible) {
      fail('(Step 4) "Sign in with Google" button not found on login page');
    } else if (!githubVisible) {
      fail('(Step 4) "Sign in with GitHub" button not found on login page');
    } else {
      console.log('✓ Step 4: Google and GitHub sign-in buttons are present');
    }
    await page.screenshot({ path: ss('04_login_oauth_buttons.png') });
  }

  // Open a fresh context for protected route tests to avoid state from login page
  const page2 = await browser.newPage();

  // Step 5: Navigate to /dashboard unauthenticated, expect redirect to /login
  await page2.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  const dashboardFinalUrl = page2.url();
  if (!dashboardFinalUrl.includes('/login')) {
    fail(`(Step 5) Expected redirect to /login from /dashboard but final URL was: ${dashboardFinalUrl}`);
  } else {
    console.log('✓ Step 5: /dashboard redirected to /login');
  }
  await page2.screenshot({ path: ss('05_dashboard_redirect.png') });

  // Step 6: Navigate to /admin unauthenticated, expect redirect to /login
  await page2.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
  const adminFinalUrl = page2.url();
  if (!adminFinalUrl.includes('/login')) {
    fail(`(Step 6) Expected redirect to /login from /admin but final URL was: ${adminFinalUrl}`);
  } else {
    console.log('✓ Step 6: /admin redirected to /login');
  }
  await page2.screenshot({ path: ss('06_admin_redirect.png') });

} catch (e) {
  fail(`Unexpected error: ${e.message}`);
  console.error(e);
} finally {
  if (browser) await browser.close();
}

console.log(JSON.stringify(results, null, 2));
writeFileSync('/tmp/e2e_auth_flow_result.json', JSON.stringify(results, null, 2));
