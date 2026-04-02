@adw-2jhq2i-services-page-rewrit
Feature: Services Page
  As a non-technical founder visiting the Paysdoc website
  I want to see two clear service offerings with their availability
  So that I can understand what Paysdoc offers and choose the right service for my needs

  Background:
    Given the visitor navigates to the "/services" page

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: Page displays two distinct service tiers
    Then the page should display exactly 2 service cards
    And one card should be titled "AI-Powered Development"
    And one card should be titled "Full-Stack Consulting"

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: AI-Powered Development card has coming-soon framing
    Then the "AI-Powered Development" card should be visible
    And the card should indicate it is a pilot or coming soon
    And the card should explain the concept in business language
    And the card should mention that AI builds the application
    And the card should mention experienced engineer oversight for quality

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: AI-Powered Development card nudges visitor to register interest
    Then the "AI-Powered Development" card should contain a call to action to register interest
    And the call to action should link to the interest registration

  @adw-2jhq2i-services-page-rewrit
  Scenario: AI-Powered Development card uses no engineering jargon
    Then the "AI-Powered Development" card should not contain the text "issue-to-PR"
    And the card should not contain the text "webhook"
    And the card should not contain the text "CI/CD"
    And the card should not contain the text "pipeline"
    And the card should not contain the text "monorepo"

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: Full-Stack Consulting card shows available-now status
    Then the "Full-Stack Consulting" card should be visible
    And the card should indicate the service is available now
    And the card should mention nearly 30 years of experience

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: Industries served are listed for credibility
    Then the page should list the following industries:
      | industry   |
      | banking    |
      | retail     |
      | energy     |
      | government |
      | airline    |

  @adw-2jhq2i-services-page-rewrit
  Scenario: Full-Stack Consulting card uses no engineering jargon
    Then the "Full-Stack Consulting" card should not contain the text "monorepo"
    And the card should not contain the text "type-safe API"
    And the card should not contain the text "CI/CD"

  @regression @adw-2jhq2i-services-page-rewrit
  Scenario: Book a Discovery Call CTA is removed
    Then the page should not contain a "Book a Discovery Call" button or link

  @adw-2jhq2i-services-page-rewrit
  Scenario: Page is responsive on mobile viewport
    Given the visitor is using a mobile device with a viewport width of 375 pixels
    When the visitor navigates to the "/services" page
    Then the service cards should be stacked vertically
    And all content should be visible without horizontal scrolling

  @adw-2jhq2i-services-page-rewrit
  Scenario: Page is responsive on tablet viewport
    Given the visitor is using a tablet device with a viewport width of 768 pixels
    When the visitor navigates to the "/services" page
    Then all service cards should be fully visible
    And no content should overflow the viewport

  @adw-2jhq2i-services-page-rewrit
  Scenario: Visitor understands both offerings and their availability
    Then the "AI-Powered Development" card should clearly convey it is not yet available
    And the "Full-Stack Consulting" card should clearly convey it is ready to engage
    And the visitor can distinguish between the two offerings without ambiguity
