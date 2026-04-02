@adw-37wzob-brand-rebrand-stylin
Feature: Paysdoc branded navbar with logo and navigation
  As a visitor
  I want to see the Paysdoc logo and brand name in the navbar
  So that I immediately recognise the Paysdoc brand identity

  @regression
  Scenario: Navbar displays Paysdoc logo icon alongside styled brand text
    Given I am a visitor
    When I navigate to the homepage
    Then the Navbar should display the "logo-simpel.png" image
    And the Navbar should display the text "PAYSDOC consultancy"

  @regression @adw-dtuuzc-how-it-works-page-ne
  Scenario: Navbar includes a "How It Works" navigation link
    Given I am a visitor
    When I navigate to the homepage
    Then the Navbar should contain a "How It Works" link

  @regression
  Scenario: Dashboard and Admin links are hidden from unauthenticated visitors
    Given I am an unauthenticated user
    When I navigate to the homepage
    Then the Navbar should not show a "Dashboard" link
    And the Navbar should not show an "Admin" link

  Scenario: Dashboard link is visible to authenticated client users
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to the homepage
    Then the Navbar should show a "Dashboard" link
    And the Navbar should not show an "Admin" link

  Scenario: Dashboard and Admin links are visible to authenticated admin users
    Given I am an authenticated user with email "paysdoc@gmail.com"
    And my role is "admin"
    When I navigate to the homepage
    Then the Navbar should show a "Dashboard" link
    And the Navbar should show an "Admin" link
