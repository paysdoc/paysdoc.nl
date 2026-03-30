@adw-id4hh3-auth-bootstrap-socia
Feature: Route protection for authenticated pages
  As the application
  I want to protect certain routes from unauthenticated access
  So that only logged-in users can see protected content

  @regression
  Scenario: Unauthenticated user is redirected from /dashboard to login
    Given I am an unauthenticated user
    When I navigate to "/dashboard"
    Then I should be redirected to the login page

  @regression
  Scenario: Unauthenticated user is redirected from /admin to login
    Given I am an unauthenticated user
    When I navigate to "/admin"
    Then I should be redirected to the login page

  Scenario: Authenticated user can access /dashboard
    Given I am an authenticated user with email "jane@example.com"
    When I navigate to "/dashboard"
    Then I should see the dashboard page
    And I should see "you are logged in as jane@example.com"

  Scenario: Authenticated user can access /admin
    Given I am an authenticated user with email "jane@example.com"
    When I navigate to "/admin"
    Then I should see the admin page
    And I should see "you are logged in as jane@example.com"

  Scenario: Unauthenticated user is redirected from /dashboard subpath to login
    Given I am an unauthenticated user
    When I navigate to "/dashboard/settings"
    Then I should be redirected to the login page

  Scenario: Unauthenticated user is redirected from /admin subpath to login
    Given I am an unauthenticated user
    When I navigate to "/admin/users"
    Then I should be redirected to the login page
