@adw-camc0h-home-page-rewrite
Feature: Home page rewrite for non-technical founders
  As a non-technical founder
  I want to see a professional homepage with a clear value proposition
  So that I can understand what Paysdoc offers and register my interest

  # Hero section

  @regression
  Scenario: Hero displays AI-powered headline in business language
    Given the visitor navigates to the "/" page
    Then the hero section should display the headline "AI-Powered Software Engineering"
    And the hero subtitle should describe business outcomes in plain language
    And the hero subtitle should not contain technical jargon like "PR", "CI/CD", "webhook", or "pull request"

  @regression
  Scenario: Hero displays professional headshot
    Given the visitor navigates to the "/" page
    Then the hero section should display a professional headshot image
    And the headshot image should have appropriate alt text

  @regression
  Scenario: Hero contains InterestForm as the primary CTA
    Given the visitor navigates to the "/" page
    Then the hero section should contain the InterestForm component
    And an email input field should be visible within the hero
    And a submit button should be visible within the hero

  @adw-camc0h-home-page-rewrite
  Scenario: Old CTA buttons are removed from the hero
    Given the visitor navigates to the "/" page
    Then there should be no "Book a Discovery Call" button on the page
    And there should be no "View Services" button on the page

  # Capability cards

  @regression
  Scenario: Capability cards use business language without engineering jargon
    Given the visitor navigates to the "/" page
    Then the capability cards section should be visible
    And no capability card should contain the term "PR"
    And no capability card should contain the term "CI/CD"
    And no capability card should contain the term "webhook"
    And no capability card should contain the term "pull request"
    And no capability card should contain the term "SDLC"

  @adw-camc0h-home-page-rewrite
  Scenario: Capability cards do not use emoji icons
    Given the visitor navigates to the "/" page
    Then no capability card should display an emoji icon
    And capability cards should use brand-consistent styling for visual accents

  @adw-camc0h-home-page-rewrite
  Scenario: Capability cards highlight both AI vision and consulting experience
    Given the visitor navigates to the "/" page
    Then at least one capability card should reference AI-powered development
    And at least one capability card should reference consulting or professional experience

  # Responsiveness

  @adw-camc0h-home-page-rewrite
  Scenario: Home page is responsive on mobile viewports
    Given the visitor navigates to the "/" page on a mobile device with viewport width 375px
    Then the hero section should be fully visible without horizontal scrolling
    And the headshot image should be appropriately sized for mobile
    And the capability cards should stack vertically

  @adw-camc0h-home-page-rewrite
  Scenario: Home page is responsive on tablet viewports
    Given the visitor navigates to the "/" page on a tablet device with viewport width 768px
    Then the hero section should be fully visible without horizontal scrolling
    And the capability cards should display in a grid layout

  # InterestForm integration

  @adw-camc0h-home-page-rewrite
  Scenario: Visitor can submit interest from the home page hero
    Given the visitor navigates to the "/" page
    When the visitor enters "homepage-visitor@example.com" in the hero email field
    And the visitor clicks the submit button in the hero
    Then a success confirmation message should be displayed in the hero
    And a POST request should be sent to "/api/interest" with the email "homepage-visitor@example.com"

  @adw-camc0h-home-page-rewrite
  Scenario: InterestForm on home page validates email before submission
    Given the visitor navigates to the "/" page
    When the visitor enters "invalid-email" in the hero email field
    And the visitor clicks the submit button in the hero
    Then a validation error message should be displayed
    And no request should be sent to the server
