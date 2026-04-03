@adw-id4hh3-auth-bootstrap-socia
Feature: Authentication via social login
  As a visitor
  I want to log in using my Google or GitHub account
  So that I can access protected areas of the site

  @adw-6otp7j-magic-link-login-ema
  Scenario: Login page is accessible
    Given I am an unauthenticated user
    When I navigate to the login page
    Then I should see a "Sign in with Google" button
    And I should see a "Sign in with GitHub" button

  Scenario: Google OAuth login flow works end-to-end
    Given I am an unauthenticated user
    When I navigate to the login page
    And I click the "Sign in with Google" button
    Then I should be redirected to Google's OAuth consent screen
    When I complete the Google OAuth flow
    Then I should be redirected back to the application
    And I should be authenticated

  Scenario: GitHub OAuth login flow works end-to-end
    Given I am an unauthenticated user
    When I navigate to the login page
    And I click the "Sign in with GitHub" button
    Then I should be redirected to GitHub's OAuth consent screen
    When I complete the GitHub OAuth flow
    Then I should be redirected back to the application
    And I should be authenticated

  Scenario: Logout works and returns user to the homepage
    Given I am an authenticated user
    When I click the user avatar in the Navbar
    And I click "Logout" in the dropdown
    Then I should be redirected to the homepage
    And I should be unauthenticated

  Scenario: Session persists across page reloads
    Given I am an authenticated user
    When I reload the page
    Then I should still be authenticated
    And the Navbar should show my avatar and name
