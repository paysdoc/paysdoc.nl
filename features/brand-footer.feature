@adw-37wzob-brand-rebrand-stylin
Feature: Paysdoc branded footer with business details
  As a visitor
  I want to see Paysdoc business details in the footer
  So that I can find contact and legal information about the company

  @regression
  Scenario: Footer displays LinkedIn link
    Given I am a visitor
    When I navigate to the homepage
    Then the Footer should contain a link to LinkedIn

  @regression
  Scenario: Footer displays KVK number
    Given I am a visitor
    When I navigate to the homepage
    Then the Footer should display the KVK number "50250574"

  @regression
  Scenario: Footer displays Voorburg address
    Given I am a visitor
    When I navigate to the homepage
    Then the Footer should display an address containing "Voorburg"

  Scenario: Footer renders correctly in light mode
    Given I am a visitor using light mode
    When I navigate to the homepage
    Then the Footer should be visible with appropriate contrast
    And the Footer links should be styled with the brand accent color

  Scenario: Footer renders correctly in dark mode
    Given I am a visitor using dark mode
    When I navigate to the homepage
    Then the Footer should be visible with appropriate contrast
    And the Footer links should be styled with the brand accent color
