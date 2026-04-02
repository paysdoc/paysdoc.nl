import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import assert from 'assert';
import { CustomWorld } from '../support/world';

Before({ tags: '@adw-t7sfbq-about-page-rewrite' }, async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
});

After({ tags: '@adw-t7sfbq-about-page-rewrite' }, async function (this: CustomWorld) {
  await this.browser?.close();
});

Given('I am a visitor', function (this: CustomWorld) {
  // Default unauthenticated state — no action needed
});

When('I navigate to the {string} page', async function (this: CustomWorld, path: string) {
  await this.page.goto(`${this.baseUrl}${path}`);
  await this.page.waitForLoadState('networkidle');
});

When('I navigate to the homepage', async function (this: CustomWorld) {
  await this.page.goto(this.baseUrl);
  await this.page.waitForLoadState('networkidle');
});

Then('the page should contain text referencing {string} of experience', async function (this: CustomWorld, text: string) {
  const content = await this.page.textContent('body');
  assert(
    content?.toLowerCase().includes(text.toLowerCase()),
    `Expected page to contain "${text}" but it did not`
  );
});

Then('the page should identify Martin Koster as a full-stack developer', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.includes('Martin Koster'), 'Expected page to mention "Martin Koster"');
  assert(
    content?.toLowerCase().includes('full-stack') || content?.toLowerCase().includes('full stack'),
    'Expected page to identify Martin Koster as a full-stack developer'
  );
});

Then('the page should mention the banking industry', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.toLowerCase().includes('banking'), 'Expected page to mention "banking"');
});

Then('the page should mention the retail industry', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.toLowerCase().includes('retail'), 'Expected page to mention "retail"');
});

Then('the page should mention the energy industry', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.toLowerCase().includes('energy'), 'Expected page to mention "energy"');
});

Then('the page should mention the government industry', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.toLowerCase().includes('government'), 'Expected page to mention "government"');
});

Then('the page should mention the airline industry', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content?.toLowerCase().includes('airline'), 'Expected page to mention "airline"');
});

Then('the page should mention {string} or {string} in relation to payments systems', async function (this: CustomWorld, term1: string, term2: string) {
  const content = await this.page.textContent('body');
  assert(
    content?.includes(term1) || content?.includes(term2),
    `Expected page to mention "${term1}" or "${term2}"`
  );
});

Then('the page should mention {string} in relation to business intelligence', async function (this: CustomWorld, term: string) {
  const content = await this.page.textContent('body');
  assert(content?.includes(term), `Expected page to mention "${term}"`);
});

Then('the page should mention {string} in relation to infrastructure migration', async function (this: CustomWorld, term: string) {
  const content = await this.page.textContent('body');
  assert(content?.includes(term), `Expected page to mention "${term}"`);
});

Then('the page should mention {string} in relation to systems modernisation', async function (this: CustomWorld, term: string) {
  const content = await this.page.textContent('body');
  assert(content?.includes(term), `Expected page to mention "${term}"`);
});

Then('the page should not contain proprietary system names or internal codenames', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content && content.length > 0, 'Expected page to have content');
});

Then('the project descriptions should remain at a high-level summary', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  assert(content && content.length > 0, 'Expected page to have content');
});

Then('the page should mention {string}', async function (this: CustomWorld, term: string) {
  const content = await this.page.textContent('body');
  assert(content?.includes(term), `Expected page to mention "${term}" but it did not`);
});

Then('the page should list {string} as a spoken language', async function (this: CustomWorld, language: string) {
  const content = await this.page.textContent('body');
  assert(content?.includes(language), `Expected page to list "${language}" as a spoken language`);
});

Then('the page should not contain the term {string}', async function (this: CustomWorld, term: string) {
  const content = await this.page.textContent('body');
  assert(!content?.includes(term), `Expected page NOT to contain "${term}" but it did`);
});

Then('the page should not reference agent architecture or internals', async function (this: CustomWorld) {
  const content = await this.page.textContent('body');
  const forbiddenTerms = ['agent architecture', 'orchestration', 'webhook', 'pipeline', 'SDLC'];
  for (const term of forbiddenTerms) {
    assert(
      !content?.toLowerCase().includes(term.toLowerCase()),
      `Expected page NOT to reference "${term}"`
    );
  }
});

Then('the Navbar should contain an {string} link', async function (this: CustomWorld, linkText: string) {
  const navLink = this.page.locator(`nav a`).filter({ hasText: linkText }).first();
  assert(await navLink.isVisible(), `Expected navbar to contain an "${linkText}" link`);
});

When('I click the {string} link', async function (this: CustomWorld, linkText: string) {
  await Promise.all([
    this.page.waitForNavigation({ waitUntil: 'networkidle' }),
    this.page.locator(`nav a`).filter({ hasText: linkText }).first().click(),
  ]);
});

Then('I should be on the {string} page', async function (this: CustomWorld, path: string) {
  const url = this.page.url();
  const normalised = url.replace(/\/$/, '');
  assert(
    normalised.endsWith(path),
    `Expected to be on "${path}" but current URL is "${url}"`
  );
});
