@adw-8z0la0-how-it-works-page-ne
Feature: How It Works page
  As a visitor interested in the AI pilot
  I want to understand at a high level how AI-assisted development works
  So that I can decide if it is relevant to my project

  @regression
  Scenario: How It Works page loads at the correct URL with metadata
    Given the visitor navigates to the "/how-it-works" page
    Then the page should load successfully
    And the page should have appropriate metadata including a title and description
    And the page title should reference AI-assisted development

  @regression
  Scenario: Three-phase concept is presented in business language
    Given the visitor navigates to the "/how-it-works" page
    Then the page should display three distinct phases
    And the first phase should describe collaborative onboarding
    And the second phase should describe AI-driven development
    And the third phase should describe expert quality assurance
    And the page should not contain engineering jargon such as "CI/CD", "webhook", "PR", or "pipeline"

  @regression
  Scenario: Page has clear coming soon framing
    Given the visitor navigates to the "/how-it-works" page
    Then the page should display "coming soon" or equivalent teaser language
    And the page should not promise features as currently available

  @regression
  Scenario: InterestForm is integrated as a call-to-action
    Given the visitor navigates to the "/how-it-works" page
    Then the InterestForm component should be displayed
    And the visitor should be able to enter an email address
    And the visitor should be able to submit the form

  Scenario: Visitor submits interest from the How It Works page
    Given the visitor navigates to the "/how-it-works" page
    When the visitor enters "pilot-interest@example.com" in the email field
    And the visitor clicks the submit button
    Then a success confirmation message should be displayed

  Scenario: Page is responsive on mobile viewports
    Given the visitor navigates to the "/how-it-works" page on a mobile viewport
    Then all three phases should be visible without horizontal scrolling
    And the InterestForm should be accessible and usable
    And text should be readable without zooming

  Scenario: Navbar How It Works link navigates to the page
    Given the visitor is on the homepage
    When the visitor clicks the "How It Works" link in the navbar
    Then the visitor should be navigated to the "/how-it-works" page
    And the How It Works page content should be displayed
