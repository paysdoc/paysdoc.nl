@adw-1l6tsn-role-resolution-admi
Feature: Admin route guard based on user role
  As the application
  I want to restrict /admin routes to admin users only
  So that client users cannot access admin functionality

  Scenario: Client user accessing /admin is redirected to /dashboard
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to "/admin"
    Then I should be redirected to "/dashboard"

  Scenario: Admin user can access /admin without redirect
    Given I am an authenticated user with email "paysdoc@gmail.com"
    And my role is "admin"
    When I navigate to "/admin"
    Then I should see the admin page

  Scenario: Client user accessing /admin subpath is redirected to /dashboard
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to "/admin/users"
    Then I should be redirected to "/dashboard"

  Scenario: Admin user can access /admin subpath without redirect
    Given I am an authenticated user with email "martin@paysdoc.nl"
    And my role is "admin"
    When I navigate to "/admin/users"
    Then I should see the admin page
