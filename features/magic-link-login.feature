@adw-gt6dc8-magic-link-login-ema
Feature: Magic link (passwordless email) login
  As a visitor
  I want to log in using a magic link sent to my email
  So that I can access protected areas without needing a social account

  Scenario: Login page has an email input field for magic link login
    Given I am an unauthenticated user
    When I navigate to the login page
    Then I should see an email input field for magic link login
    And I should see a "Send magic link" button

  Scenario: Submitting an email triggers Auth.js email provider flow
    Given I am an unauthenticated user
    And I am on the login page
    When I enter "user@example.com" in the magic link email field
    And I click the "Send magic link" button
    Then I should see a confirmation message that a magic link has been sent
    And the Auth.js email provider should generate a verification token

  Scenario: Submitting an invalid email shows a validation error
    Given I am an unauthenticated user
    And I am on the login page
    When I enter "not-an-email" in the magic link email field
    And I click the "Send magic link" button
    Then I should see a validation error for the email field

  Scenario: Submitting an empty email shows a validation error
    Given I am an unauthenticated user
    And I am on the login page
    When I leave the magic link email field empty
    And I click the "Send magic link" button
    Then I should see a validation error for the email field

  Scenario: Clicking the magic link authenticates the user and redirects to dashboard
    Given a magic link has been sent to "user@example.com"
    And the magic link contains a valid verification token
    When I click the magic link
    Then I should be authenticated as "user@example.com"
    And I should be redirected to "/dashboard"

  Scenario: Clicking an expired magic link shows an error
    Given a magic link has been sent to "user@example.com"
    And the magic link verification token has expired
    When I click the magic link
    Then I should see an error indicating the link has expired
    And I should not be authenticated

  Scenario: Clicking a previously used magic link shows an error
    Given a magic link has been sent to "user@example.com"
    And the magic link has already been used to authenticate
    When I click the magic link again
    Then I should see an error indicating the link is no longer valid
    And I should not be authenticated

  Scenario: Magic link login coexists with social login options
    Given I am an unauthenticated user
    When I navigate to the login page
    Then I should see a "Sign in with Google" button
    And I should see a "Sign in with GitHub" button
    And I should see an email input field for magic link login
