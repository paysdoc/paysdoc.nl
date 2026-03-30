@adw-id4hh3-auth-bootstrap-socia
Feature: Navbar authentication state
  As a user
  I want the Navbar to reflect my authentication state
  So that I can access my account or log in

  @regression
  Scenario: Navbar shows Login button when unauthenticated
    Given I am an unauthenticated user
    When I navigate to the homepage
    Then the Navbar should show a "Login" button
    And the Navbar should not show a user avatar

  @regression
  Scenario: Navbar shows user avatar and name when authenticated
    Given I am an authenticated user with name "Jane Doe" and avatar "https://example.com/avatar.jpg"
    When I navigate to the homepage
    Then the Navbar should show my avatar
    And the Navbar should show my name "Jane Doe"
    And the Navbar should not show a "Login" button

  Scenario: Navbar dropdown contains dashboard link and logout
    Given I am an authenticated user
    When I click the user avatar in the Navbar
    Then I should see a dropdown menu
    And the dropdown should contain a "Dashboard" link
    And the dropdown should contain a "Logout" option
